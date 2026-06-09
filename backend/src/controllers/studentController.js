const StudentProgress = require('../models/StudentProgress');
const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const ProfileUpdateRequest = require('../models/ProfileUpdateRequest');
const SupportRequest = require('../models/SupportRequest');
const { notifyAdmins } = require('./notificationController');
const mailer = require('../utils/mailer');

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const user = await User.findById(studentId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for pending update request
    const pendingRequest = await ProfileUpdateRequest.findOne({ 
      studentId, 
      status: 'pending' 
    });

    res.json({
      user,
      pendingRequest
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Request profile update
exports.requestProfileUpdate = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { fullName, email, country, province, contactNumber } = req.body;

    // Check if there is already a pending request
    const existingRequest = await ProfileUpdateRequest.findOne({ 
      studentId, 
      status: 'pending' 
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: 'You already have a pending update request. Please wait for the admin to review it.' 
      });
    }

    const newRequest = new ProfileUpdateRequest({
      studentId,
      requestedChanges: {
        fullName,
        email,
        country,
        province,
        contactNumber
      }
    });

    await newRequest.save();

    // Notify admins
    await notifyAdmins(
      studentId,
      `New profile update request from student`,
      'general',
      '#admin-profile-updates'
    );

    res.status(201).json({ 
      message: 'Profile update request submitted successfully. An admin will review it soon.',
      request: newRequest
    });
  } catch (error) {
    console.error('Error requesting profile update:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get module lessons with lock status for a student
exports.getModuleLessonsWithStatus = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.user.userId;

    // Get current module
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Check if previous module assignment is submitted
    let previousModuleSubmitted = true;
    if (module.order > 1) {
      const prevModule = await Module.findOne({ order: module.order - 1 });
      if (prevModule) {
        const prevAssignment = await Assignment.findOne({
          studentId,
          moduleId: prevModule._id,
          status: 'submitted'
        });
        previousModuleSubmitted = !!prevAssignment;
      }
    }

    const lessons = await Lesson.find({ moduleId }).sort({ order: 1 });
    
    // Get student progress or create it
    const user = await User.findById(studentId).select('createdAt');
    let progress = await StudentProgress.findOne({ studentId, moduleId });
    
    if (!progress && lessons.length > 0) {
      // Create initial progress record using registration date as enrollment date
      progress = await StudentProgress.create({
        studentId,
        moduleId,
        enrollmentDate: user.createdAt || new Date(),
        currentLessonOrder: 1,
      });
    }

    // Determine which lessons are unlocked
    const enrollmentDate = progress ? progress.enrollmentDate : (user.createdAt || new Date());
    
    const lessonsWithStatus = lessons.map((lesson, index) => {
      const isCompleted = progress?.completedLessons.some(
        (cl) => cl.lessonId.toString() === lesson._id.toString()
      );
      
      let isUnlocked = false;
      let nextUnlockDate = null;

      if (!previousModuleSubmitted) {
        isUnlocked = false;
      } else if (isCompleted) {
        isUnlocked = true;
      } else if (lesson.order === 1) {
        isUnlocked = true;
      } else {
        // Check if previous lesson in this module is completed
        const prevLessonId = lessons[index - 1]?._id;
        const prevCompleted = progress?.completedLessons.some(
          (cl) => cl.lessonId.toString() === prevLessonId.toString()
        );

        if (prevCompleted) {
          isUnlocked = true;
        } else {
          // Timer-based fallback (1 lesson per day)
          const daysSinceEnrollment = Math.floor(
            (new Date() - new Date(enrollmentDate)) / (1000 * 60 * 60 * 24)
          );
          const daysNeededToUnlock = lesson.order - 1;
          
          if (daysSinceEnrollment >= daysNeededToUnlock) {
            isUnlocked = true;
          } else {
            nextUnlockDate = new Date(enrollmentDate);
            nextUnlockDate.setDate(nextUnlockDate.getDate() + daysNeededToUnlock);
          }
        }
      }

      return {
        _id: lesson._id,
        order: lesson.order,
        title: lesson.title,
        description: lesson.description,
        youtubeURL: lesson.youtubeURL, // Always return URL for thumbnail
        isUnlocked,
        isCompleted,
        nextUnlockDate,
      };
    });

    // Calculate progress stats
    const totalLessons = lessons.length;
    const completedCount = progress?.completedLessons.length || 0;
    const currentLessonDisplay = Math.min(progress?.currentLessonOrder || 1, totalLessons || 1);
    const progressPercentage = totalLessons > 0 ? Math.round((currentLessonDisplay / totalLessons) * 100) : 0;

    // Calculate estimated completion date
    let estimatedCompletionDate = null;
    if (progressPercentage < 100) {
      // Use the same logic as the dashboard for consistency
      const user = await User.findById(studentId).select('createdAt');
      const studentProgress = await StudentProgress.find({ studentId }).lean();
      
      const earliestEnrollment = studentProgress.length > 0
        ? new Date(Math.min(...studentProgress.map(p => new Date(p.enrollmentDate).getTime())))
        : (user?.createdAt || new Date());

      const totalCompletedEver = studentProgress.reduce((sum, p) => sum + (p.completedLessons?.length || 0), 0);
      const daysSinceEnrollment = Math.max(1, Math.ceil((new Date() - earliestEnrollment) / (1000 * 60 * 60 * 24)));
      const velocity = (totalCompletedEver / daysSinceEnrollment) || 10; // Default 10 lessons/day

      const lessonsRemaining = totalLessons - completedCount;
      const daysToFinish = lessonsRemaining / velocity;
      estimatedCompletionDate = new Date(Date.now() + (daysToFinish * 24 * 60 * 60 * 1000));
    }

    res.json({
      module: {
        _id: module._id,
        title: module.title,
        description: module.description,
      },
      lessons: lessonsWithStatus,
      progress: {
        completedLessons: completedCount,
        totalLessons,
        progressPercentage,
        currentLesson: progress?.currentLessonOrder || 1,
        estimatedCompletionDate,
        enrollmentDate: progress?.enrollmentDate,
      },
    });
  } catch (error) {
    console.error('Error getting lessons with status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark lesson as completed
exports.completeLesson = async (req, res) => {
  try {
    const { moduleId, lessonId } = req.params;
    const { timeSpent } = req.body; // timeSpent in minutes
    const studentId = req.user.userId;

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Get or create progress
    let progress = await StudentProgress.findOne({ studentId, moduleId });
    if (!progress) {
      progress = await StudentProgress.create({
        studentId,
        moduleId,
      });
    }

    // Set start date if first lesson
    if (!progress.startedFirstLessonDate) {
      progress.startedFirstLessonDate = new Date();
    }

    // Check if already completed
    const alreadyCompleted = progress.completedLessons.some(
      (cl) => cl.lessonId.toString() === lessonId
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push({
        lessonId,
        order: lesson.order,
        completedAt: new Date(),
        timeSpent: timeSpent || 0,
      });

      // Update current lesson
      progress.currentLessonOrder = lesson.order + 1;
    }

    await progress.save();

    res.json({ 
      message: 'Lesson marked as completed',
      progress: {
        completedLessons: progress.completedLessons.length,
        currentLessonOrder: progress.currentLessonOrder,
      }
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Skip ahead to next available lesson after completing current one
exports.skipToNextLesson = async (req, res) => {
  try {
    const { moduleId, lessonId } = req.params;
    const studentId = req.user.userId;

    // Get lessons
    const currentLesson = await Lesson.findById(lessonId);
    if (!currentLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Get progress
    const progress = await StudentProgress.findOne({ studentId, moduleId });
    if (!progress) {
      return res.status(404).json({ message: 'No progress found' });
    }

    // Check if current lesson is completed
    const isCompleted = progress.completedLessons.some(
      (cl) => cl.lessonId.toString() === lessonId
    );

    if (!isCompleted) {
      return res.status(400).json({ message: 'Must complete current lesson first' });
    }

    // Get next lesson
    const nextLesson = await Lesson.findOne({
      moduleId,
      order: currentLesson.order + 1,
    });

    if (!nextLesson) {
      return res.status(404).json({ message: 'No next lesson available' });
    }

    // Mark next lesson as started (unlock it early)
    if (!progress.completedLessons.some(cl => cl.lessonId.toString() === nextLesson._id.toString())) {
      progress.currentLessonOrder = nextLesson.order;
    }

    await progress.save();

    res.json({
      message: 'Moved to next lesson',
      nextLesson: {
        _id: nextLesson._id,
        order: nextLesson.order,
        title: nextLesson.title,
      },
    });
  } catch (error) {
    console.error('Error skipping to next lesson:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student progress for all modules
exports.getProgressDashboard = async (req, res) => {
  try {
    const studentId = req.user.userId;

    // 1. Fetch data
    const modules = await Module.find().sort({ order: 1 });
    const studentProgress = await StudentProgress.find({ studentId }).lean();
    const assignments = await Assignment.find({ studentId, status: 'submitted' }).lean();
    const user = await User.findById(studentId).select('createdAt');

    const registrationDate = user?.createdAt || new Date();

    // 2. Fetch lesson counts
    const allLessons = await Lesson.find({ moduleId: { $in: modules.map(m => m._id) } }).select('moduleId');
    const lessonCounts = allLessons.reduce((acc, l) => {
      const mid = l.moduleId.toString();
      acc[mid] = (acc[mid] || 0) + 1;
      return acc;
    }, {});

    // 3. Setup estimation logic (1 lesson per day)
    const pacePerDay = 1; 
    const totalTargetModules = 7;
    const defaultLessonsPerModule = 10;
    
    let runningDate = new Date(); // Start projections from today
    const progressData = [];

    // Process existing modules
    let previousModuleSubmitted = true; // Seed with true so Module 1 (first in loop) is unlocked
    for (const module of modules) {
      const midStr = module._id.toString();
      const progress = studentProgress.find(p => p.moduleId.toString() === midStr);
      const assignment = assignments.find(a => a.moduleId.toString() === midStr);
      
      const totalLessons = lessonCounts[midStr] || defaultLessonsPerModule;
      const completedCount = progress ? (progress.completedLessons?.length || 0) : 0;
      const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      
      // A module is completed if the assignment is passed
      const isCompleted = assignment && (assignment.passed || (assignment.score / assignment.totalQuestions * 100 >= assignment.passMark));
      const isSubmitted = !!assignment;
      const isUnlocked = previousModuleSubmitted;

      let estimatedCompletionDate = null;

      if (isCompleted) {
        // If completed, use actual completion date or today if unknown
        estimatedCompletionDate = assignment.timeSubmitted || (progress?.updatedAt || new Date());
      } else {
        // If not completed, calculate based on lessons remaining
        const lessonsRemaining = totalLessons - completedCount;
        const daysToFinish = lessonsRemaining / pacePerDay;
        
        estimatedCompletionDate = new Date(runningDate.getTime() + (daysToFinish * 24 * 60 * 60 * 1000));
        
        // Next module starts after this one finishes
        runningDate = new Date(estimatedCompletionDate);
      }

      progressData.push({
        moduleId: module._id,
        moduleName: module.title,
        completedLessons: completedCount,
        currentLesson: progress ? progress.currentLessonOrder : 1,
        totalLessons,
        progressPercentage,
        enrollmentDate: registrationDate,
        estimatedCompletionDate,
        isCompleted,
        isSubmitted,
        isUnlocked
      });

      // Update for next iteration: Next is unlocked if this one is submitted
      previousModuleSubmitted = isSubmitted;
    }

    // 4. Handle future modules (up to 7)
    const existingModuleCount = modules.length;
    if (existingModuleCount < totalTargetModules) {
      for (let i = existingModuleCount + 1; i <= totalTargetModules; i++) {
        const daysToFinish = defaultLessonsPerModule / pacePerDay;
        const estimatedCompletionDate = new Date(runningDate.getTime() + (daysToFinish * 24 * 60 * 60 * 1000));
        
        progressData.push({
          moduleId: `future-${i}`,
          moduleName: `Module ${i} (Coming Soon)`,
          completedLessons: 0,
          currentLesson: 1,
          totalLessons: defaultLessonsPerModule,
          progressPercentage: 0,
          enrollmentDate: registrationDate,
          estimatedCompletionDate,
          isCompleted: false,
          isFuture: true
        });
        
        runningDate = new Date(estimatedCompletionDate);
      }
    }

    res.json(progressData);
  } catch (error) {
    console.error('Error getting progress dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a support request
exports.createSupportRequest = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { moduleId, lessonId, details } = req.body;

    if (!moduleId || !lessonId || !details) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRequest = new SupportRequest({
      studentId,
      moduleId,
      lessonId,
      details
    });

    await newRequest.save();

    // Notify admins via email (optional but helpful)
    try {
      const populatedReq = await SupportRequest.findById(newRequest._id)
        .populate('studentId', 'fullName')
        .populate('moduleId', 'title')
        .populate('lessonId', 'title');

      if (process.env.ADMIN_EMAIL) {
        await mailer.sendAdminSupportRequestEmail(process.env.ADMIN_EMAIL, {
          studentName: populatedReq.studentId?.fullName || 'A student',
          moduleName: populatedReq.moduleId?.title || 'Unknown Module',
          lessonName: populatedReq.lessonId?.title || 'Unknown Lesson',
          details: details
        });
      }
    } catch (err) {
      console.error('Error sending admin support email:', err);
    }

    // Notify admins
    await notifyAdmins(
      studentId,
      `New support request from student`,
      'support_request',
      '#admin-support-sessions'
    );

    res.status(201).json({
      message: 'Support request submitted successfully. An instructor will contact you soon.',
      request: newRequest
    });
  } catch (error) {
    console.error('Error creating support request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's support requests
exports.getSupportRequests = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const requests = await SupportRequest.find({ studentId })
      .populate('moduleId', 'title')
      .populate('lessonId', 'title')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching support requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

