const User = require('../models/User');
const AssignmentQuestion = require('../models/AssignmentQuestion');
const StudentProgress = require('../models/StudentProgress');
const Assignment = require('../models/Assignment');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const ProfileUpdateRequest = require('../models/ProfileUpdateRequest');
const SupportRequest = require('../models/SupportRequest');
const { createNotification } = require('./notificationController');
const mailer = require('../utils/mailer');

// Get all profile update requests (admin only)
exports.getProfileUpdateRequests = async (req, res) => {
  try {
    const requests = await ProfileUpdateRequest.find()
      .populate('studentId', 'fullName email contactNumber country province')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching profile update requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle profile update request (approve/reject)
exports.handleProfileUpdateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, adminComment } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await ProfileUpdateRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    request.status = status;
    request.adminComment = adminComment || '';
    request.updatedAt = new Date();

    if (status === 'approved') {
      // Apply changes to user model
      const updateData = {};
      const { requestedChanges } = request;
      
      if (requestedChanges.fullName) updateData.fullName = requestedChanges.fullName;
      if (requestedChanges.email) updateData.email = requestedChanges.email;
      if (requestedChanges.country) updateData.country = requestedChanges.country;
      if (requestedChanges.province) updateData.province = requestedChanges.province;
      if (requestedChanges.contactNumber) updateData.contactNumber = requestedChanges.contactNumber;

      await User.findByIdAndUpdate(request.studentId, {
        ...updateData,
        updatedAt: new Date()
      });
    }

    await request.save();

    // Notify student
    await createNotification(
      request.studentId,
      req.user.userId,
      `Your profile update request has been ${status}.${adminComment ? ' Comment: ' + adminComment : ''}`,
      'general',
      '#profile-page'
    );

    res.json({
      message: `Profile update request ${status}`,
      request
    });
  } catch (error) {
    console.error('Error handling profile update request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (admin only) - only active students by default
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student', status: 'active' }).select('-passwordHash');
    
    // Enrich with some basic progress info
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const progress = await StudentProgress.find({ studentId: user._id });
      const completedModules = await Assignment.countDocuments({ 
        studentId: user._id, 
        status: 'submitted',
        passed: true 
      });
      
      return {
        ...user.toObject(),
        progressSummary: {
          modulesStarted: progress.length,
          modulesCompleted: completedModules
        }
      };
    }));

    res.json(enrichedUsers);
  } catch (error) {
    console.error('[Admin] Error fetching users:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Get archived/completed users (admin only)
exports.getArchivedUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      role: 'student', 
      status: { $in: ['completed', 'archived'] } 
    }).select('-passwordHash');
    
    res.json(users);
  } catch (error) {
    console.error('[Admin] Error fetching archived users:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Update user status (admin only) - e.g., to 'completed'
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'completed', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status, updatedAt: new Date() },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Notify student if they completed
    if (status === 'completed') {
      await createNotification(
        userId,
        req.user.userId,
        `Congratulations! You have been marked as COMPLETED for your course. Check your profile for details.`,
        'general'
      );
    }

    res.json({
      message: `User marked as ${status}`,
      user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset student progress for a module (admin only)
exports.resetUserProgress = async (req, res) => {
  try {
    const { studentId, moduleId } = req.params;

    // Delete student progress for this module
    await StudentProgress.findOneAndDelete({ studentId, moduleId });

    // Delete assignments for this module
    await Assignment.findOneAndDelete({ studentId, moduleId });

    res.json({
      message: 'Student progress reset successfully. They can now start the course from the beginning.',
    });
  } catch (error) {
    console.error('Error resetting student progress:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Get detailed student progress (admin only)
exports.getUserProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Get all modules to show progress against each
    const modules = await Module.find().sort({ order: 1 });
    const progressList = await StudentProgress.find({ studentId }).lean();
    const assignments = await Assignment.find({ studentId }).lean();

    const detailedProgress = await Promise.all(modules.map(async (module) => {
      const midStr = module._id.toString();
      const progress = (progressList || []).find(p => p.moduleId && p.moduleId.toString() === midStr);
      const assignment = (assignments || []).find(a => a.moduleId && a.moduleId.toString() === midStr);
      
      const totalLessons = await Lesson.countDocuments({ moduleId: module._id });
      const completedCount = progress ? (progress.completedLessons || []).length : 0;
      const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      const isCompleted = assignment ? assignment.passed : (progressPercentage === 100 && totalLessons > 0);
      
      return {
        moduleId: module._id,
        moduleName: module.title,
        totalLessons,
        completedLessons: completedCount,
        currentLesson: progress ? (progress.currentLessonOrder || 1) : 1,
        status: assignment ? assignment.status : (progress ? 'in-progress' : 'not-started'),
        isCompleted,
        assignment: assignment ? {
          score: assignment.score || 0,
          totalQuestions: assignment.totalQuestions || 0,
          percentage: (assignment.totalQuestions && assignment.totalQuestions > 0) ? Math.round((assignment.score / assignment.totalQuestions) * 100) : 0,
          passed: !!assignment.passed,
          retakeCount: assignment.retakeCount || 0,
          timeSubmitted: assignment.timeSubmitted
        } : null
      };
    }));

    res.json(detailedProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user details manually (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User details updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve user account (admin only)
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        approved: true,
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send approval email
    try {
      await mailer.sendApprovalEmail(user.email, user.fullName);
    } catch (err) {
      console.error('Failed to send approval email:', err);
    }

    // Notify student via in-app notification
    await createNotification(
      user._id,
      req.user.userId,
      `Your account has been approved! You can now access all course materials.`,
      'general',
      '#dashboard-page'
    );

    res.json({
      message: 'User account approved',
      user,
    });
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify ID document (admin only)
exports.verifyID = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        idVerified: true,
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'ID verified',
      user,
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify payment proof (admin only)
exports.verifyPayment = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        paymentVerified: true,
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Payment verified',
      user,
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user stats (admin only)
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const approvedUsers = await User.countDocuments({ approved: true });
    const pendingUsers = await User.countDocuments({ approved: false });
    const admins = await User.countDocuments({ role: 'admin' });

    res.json({
      totalUsers,
      approvedUsers,
      pendingUsers,
      admins,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get assignment questions for a module (admin only)
exports.getAssignmentQuestions = async (req, res) => {
  try {
    const { moduleId } = req.params;
    console.log(`[Admin] Fetching questions for module: ${moduleId}`);
    
    // Optional: check if module exists
    const Module = require('../models/Module');
    const module = await Module.findById(moduleId);
    if (!module) {
      console.log(`[Admin] Module ${moduleId} not found`);
      return res.status(404).json({ message: 'Module not found' });
    }

    const questions = await AssignmentQuestion.find({ moduleId }).sort({ questionNumber: 1 });
    console.log(`[Admin] Found ${questions.length} questions for module ${module.title}`);
    res.json(questions);
  } catch (error) {
    console.error('[Admin] Error fetching assignment questions:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Create assignment questions (admin only)
exports.createAssignmentQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions array is required' });
    }

    // Delete existing questions for this module
    const moduleId = questions[0].moduleId;
    await AssignmentQuestion.deleteMany({ moduleId });

    // Create new questions
    const createdQuestions = await AssignmentQuestion.insertMany(questions);

    res.status(201).json({
      message: `${createdQuestions.length} assignment questions created successfully`,
      count: createdQuestions.length,
    });
  } catch (error) {
    console.error('Error creating assignment questions:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Get all support requests (admin only)
exports.getSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find()
      .populate('studentId', 'fullName email contactNumber')
      .populate('moduleId', 'title')
      .populate('lessonId', 'title')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching support requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update support request status (admin only)
exports.updateSupportRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, meetingLink, scheduledAt } = req.body;

    const request = await SupportRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Support request not found' });
    }

    if (status) request.status = status;
    if (meetingLink) request.meetingLink = meetingLink;
    if (scheduledAt) request.scheduledAt = scheduledAt;

    await request.save();

    // Populate for email and notification
    const populatedRequest = await SupportRequest.findById(requestId)
      .populate('studentId', 'fullName email')
      .populate('moduleId', 'title')
      .populate('lessonId', 'title');

    // If scheduled, send email to student
    if (status === 'scheduled' && meetingLink && scheduledAt) {
      if (populatedRequest && populatedRequest.studentId) {
        // We await this to ensure it's sent or logged before finishing the request
        await mailer.sendSupportScheduleEmail(populatedRequest.studentId.email, {
          studentName: populatedRequest.studentId.fullName,
          moduleName: populatedRequest.moduleId?.title || 'Course Module',
          lessonName: populatedRequest.lessonId?.title || 'Lesson',
          meetingLink: meetingLink,
          scheduledAt: scheduledAt
        });
      }
    }

    // Notify student via in-app notification
    await createNotification(
      request.studentId,
      req.user.userId,
      `Your support request for ${populatedRequest?.moduleId?.title || 'a module'} has been updated to ${status}.`,
      'support_confirmed',
      `#support-session?moduleId=${request.moduleId}`
    );

    res.json({
      message: 'Support request updated successfully',
      request
    });
  } catch (error) {
    console.error('Error updating support request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

