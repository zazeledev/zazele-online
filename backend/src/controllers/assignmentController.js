const Assignment = require('../models/Assignment');
const AssignmentQuestion = require('../models/AssignmentQuestion');
const Module = require('../models/Module');

// Get assignment - either start new or resume existing
exports.getAssignment = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.user.userId;

    // Verify module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Check if student already has an assignment for this module
    let assignment = await Assignment.findOne({ studentId, moduleId });
    
    if (assignment) {
      // Resume existing assignment
      if (assignment.status === 'submitted') {
        return res.json({
          assignment,
          questions: [], // Don't send questions if already submitted
          message: 'Assignment already submitted',
        });
      }

      // Return existing in-progress assignment with questions populated
      const answersList = Array.isArray(assignment.answers) ? assignment.answers : [];
      const questionIds = answersList.map(a => 
        (typeof a.questionId === 'object' && a.questionId ? a.questionId._id : a.questionId)?.toString()
      ).filter(Boolean);

      let loadedQuestions = questionIds.length > 0 
        ? await AssignmentQuestion.find({ _id: { $in: questionIds } })
        : [];

      // Self-healing fallback: If question IDs in existing answers were not found in database,
      // load valid questions for this module and heal the assignment record
      if (loadedQuestions.length === 0 || loadedQuestions.length < answersList.length) {
        const moduleQuestions = await AssignmentQuestion.find({ moduleId }).sort({ questionNumber: 1 });
        if (moduleQuestions.length > 0) {
          // If no questions matched at all and module has questions, heal and re-populate assignment
          if (loadedQuestions.length === 0) {
            const countToTake = Math.min(moduleQuestions.length, 70);
            const shuffled = moduleQuestions.sort(() => Math.random() - 0.5).slice(0, countToTake);
            assignment.answers = shuffled.map(q => ({
              questionId: q._id,
              selectedAnswer: null,
              isCorrect: null,
            }));
            assignment.totalQuestions = countToTake;
            await assignment.save();
            return res.json({
              assignment: {
                _id: assignment._id,
                moduleId: assignment.moduleId,
                status: assignment.status,
                timeStarted: assignment.timeStarted,
                totalQuestions: assignment.totalQuestions,
              },
              questions: shuffled.map(q => ({
                _id: q._id,
                question: q.question || '',
                options: (q.options && typeof q.options === 'object') ? q.options : {},
                section: q.section || '',
                lessonReference: q.lessonReference || '',
                studentAnswer: null,
              }))
            });
          }
          loadedQuestions = moduleQuestions;
        }
      }

      const questionsMap = new Map(loadedQuestions.map(q => [q._id.toString(), q]));

      const questions = answersList.map((a, idx) => {
        const qId = (typeof a.questionId === 'object' && a.questionId ? a.questionId._id : a.questionId)?.toString();
        // Fallback to index-based module question if specific qId not found
        const qDoc = questionsMap.get(qId) || (loadedQuestions[idx] || (typeof a.questionId === 'object' && a.questionId ? a.questionId : {}));
        return {
          _id: qDoc._id || qId,
          question: qDoc.question || '',
          options: (qDoc.options && typeof qDoc.options === 'object') ? qDoc.options : {},
          section: qDoc.section || '',
          lessonReference: qDoc.lessonReference || '',
          studentAnswer: a.selectedAnswer || null,
        };
      });

      return res.json({
        assignment: {
          _id: assignment._id,
          moduleId: assignment.moduleId,
          status: assignment.status,
          timeStarted: assignment.timeStarted,
          totalQuestions: assignment.totalQuestions,
        },
        questions,
      });
    }

    // Create new assignment - randomly select 70 questions
    const allQuestions = await AssignmentQuestion.find({ moduleId }).sort({ questionNumber: 1 });
    
    if (allQuestions.length < 70) {
      return res.status(400).json({
        message: `Not enough questions available. Found ${allQuestions.length}, need 70.`,
      });
    }

    // Shuffle and select 70 questions
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffledQuestions.slice(0, 70);

    // Create assignment record
    assignment = await Assignment.create({
      studentId,
      moduleId,
      status: 'in-progress',
      timeStarted: new Date(),
      answers: selectedQuestions.map((q) => ({
        questionId: q._id,
        selectedAnswer: null,
        isCorrect: null,
      })),
    });

    const questions = selectedQuestions.map((q) => ({
      _id: q._id,
      question: q.question || '',
      options: (q.options && typeof q.options === 'object') ? q.options : {},
      section: q.section || '',
      lessonReference: q.lessonReference || '',
    }));

    res.json({
      assignment: {
        _id: assignment._id,
        moduleId: assignment.moduleId,
        status: assignment.status,
        timeStarted: assignment.timeStarted,
        totalQuestions: assignment.totalQuestions,
      },
      questions,
    });
  } catch (error) {
    console.error('Error getting assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save answer (auto-save while taking test)
exports.saveAnswer = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { questionId, selectedAnswer } = req.body;
    const studentId = req.user.userId;

    // Verify assignment belongs to student
    const assignment = await Assignment.findOne({ _id: assignmentId, studentId });
    if (!assignment) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (assignment.status === 'submitted') {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    // Update answer
    const answersList = Array.isArray(assignment.answers) ? assignment.answers : [];
    const answerIndex = answersList.findIndex((a) => {
      const qId = (typeof a.questionId === 'object' && a.questionId ? a.questionId._id : a.questionId)?.toString();
      return String(qId) === String(questionId);
    });
    if (answerIndex !== -1) {
      assignment.answers[answerIndex].selectedAnswer = selectedAnswer;
    }

    await assignment.save();

    res.json({ message: 'Answer saved', answerIndex });
  } catch (error) {
    console.error('Error saving answer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit assignment for grading
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user.userId;

    // Get assignment with questions
    const assignment = await Assignment.findOne({ _id: assignmentId, studentId });

    if (!assignment) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (assignment.status === 'submitted') {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    const answersList = Array.isArray(assignment.answers) ? assignment.answers : [];
    const questionIds = answersList.map(a => 
      (typeof a.questionId === 'object' && a.questionId ? a.questionId._id : a.questionId)?.toString()
    ).filter(Boolean);

    const loadedQuestions = questionIds.length > 0
      ? await AssignmentQuestion.find({ _id: { $in: questionIds } })
      : [];
    const questionsMap = new Map(loadedQuestions.map(q => [q._id.toString(), q]));

    // Calculate score
    let correctCount = 0;
    answersList.forEach((answer) => {
      const qId = (typeof answer.questionId === 'object' && answer.questionId ? answer.questionId._id : answer.questionId)?.toString();
      const qDoc = questionsMap.get(qId) || (typeof answer.questionId === 'object' && answer.questionId ? answer.questionId : null);
      if (qDoc && qDoc.correctAnswer) {
        const isCorrect = String(answer.selectedAnswer || '').toLowerCase().trim() === String(qDoc.correctAnswer).toLowerCase().trim();
        answer.isCorrect = isCorrect;
        if (isCorrect) correctCount++;
      } else {
        answer.isCorrect = false;
      }
    });

    // Calculate percentage
    const totalQuestions = assignment.totalQuestions || 70;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= assignment.passMark;

    assignment.score = correctCount;
    assignment.passed = passed;
    assignment.status = 'submitted';
    assignment.timeSubmitted = new Date();
    assignment.timeSpent = Math.round(
      (new Date() - new Date(assignment.timeStarted)) / 1000
    );

    await assignment.save();

    res.json({
      assignment: {
        _id: assignment._id,
        score: assignment.score,
        totalQuestions: assignment.totalQuestions,
        percentage,
        passMark: assignment.passMark,
        passed,
        timeSpent: assignment.timeSpent,
        timeSubmitted: assignment.timeSubmitted,
        moduleId: assignment.moduleId,
        retakeCount: assignment.retakeCount || 0,
      },
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Retake assignment - increment retakeCount and reshuffle questions
exports.retakeAssignment = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.user.userId;

    // Find existing assignment
    let assignment = await Assignment.findOne({ studentId, moduleId });
    
    if (!assignment) {
      return exports.getAssignment(req, res); // If none, just create one
    }

    const retakeCount = (assignment.retakeCount || 0) + 1;

    // Get new set of 70 random questions
    const allQuestions = await AssignmentQuestion.find({ moduleId });
    if (allQuestions.length < 70) {
      return res.status(400).json({ message: 'Not enough questions available' });
    }
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffledQuestions.slice(0, 70);

    // Reset assignment fields for retake
    assignment.status = 'in-progress';
    assignment.score = null;
    assignment.passed = false;
    assignment.timeStarted = new Date();
    assignment.timeSubmitted = null;
    assignment.timeSpent = null;
    assignment.retakeCount = retakeCount;
    assignment.totalQuestions = selectedQuestions.length;
    assignment.answers = selectedQuestions.map((q) => ({
      questionId: q._id,
      selectedAnswer: null,
      isCorrect: null,
    }));

    await assignment.save();

    const questions = selectedQuestions.map((q) => ({
      _id: q._id,
      question: q.question || '',
      options: (q.options && typeof q.options === 'object') ? q.options : {},
      section: q.section || '',
      lessonReference: q.lessonReference || '',
    }));

    res.json({
      assignment: {
        _id: assignment._id,
        moduleId: assignment.moduleId,
        status: assignment.status,
        timeStarted: assignment.timeStarted,
        totalQuestions: assignment.totalQuestions,
        retakeCount: assignment.retakeCount,
      },
      questions,
    });
  } catch (error) {
    console.error('Error retaking assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get assignment results (after submission)
exports.getAssignmentResults = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user.userId;

    const assignment = await Assignment.findOne({ _id: assignmentId, studentId });

    if (!assignment) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (assignment.status !== 'submitted') {
      return res.status(400).json({ message: 'Assignment not yet submitted' });
    }

    const answersList = Array.isArray(assignment.answers) ? assignment.answers : [];
    const questionIds = answersList.map(a => 
      (typeof a.questionId === 'object' && a.questionId ? a.questionId._id : a.questionId)?.toString()
    ).filter(Boolean);

    const loadedQuestions = questionIds.length > 0
      ? await AssignmentQuestion.find({ _id: { $in: questionIds } })
      : [];
    const questionsMap = new Map(loadedQuestions.map(q => [q._id.toString(), q]));

    const questions = answersList.map((answer) => {
      const qId = (typeof answer.questionId === 'object' && answer.questionId ? answer.questionId._id : answer.questionId)?.toString();
      const qDoc = questionsMap.get(qId) || (typeof answer.questionId === 'object' && answer.questionId ? answer.questionId : {});
      return {
        _id: qDoc._id || qId,
        questionNumber: qDoc.questionNumber,
        question: qDoc.question || '',
        options: (qDoc.options && typeof qDoc.options === 'object') ? qDoc.options : { a: '', b: '', c: '', d: '' },
        studentAnswer: answer.selectedAnswer,
        correctAnswer: qDoc.correctAnswer,
        isCorrect: answer.isCorrect,
        section: qDoc.section || '',
      };
    });

    res.json({
      assignment: {
        _id: assignment._id,
        moduleId: assignment.moduleId,
        score: assignment.score,
        totalQuestions: assignment.totalQuestions,
        percentage: Math.round((assignment.score / assignment.totalQuestions) * 100),
        passMark: assignment.passMark,
        passed: assignment.passed,
        timeSpent: assignment.timeSpent,
        timeSubmitted: assignment.timeSubmitted,
      },
      questions,
    });
  } catch (error) {
    console.error('Error getting assignment results:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if student has completed assignment for a module
exports.checkAssignmentStatus = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.user.userId;

    const assignment = await Assignment.findOne({ studentId, moduleId });

    res.json({
      hasAssignment: !!assignment,
      status: assignment?.status || null,
      passed: assignment?.passed || false,
      score: assignment?.score || null,
      percentage: assignment ? Math.round((assignment.score / assignment.totalQuestions) * 100) : 0,
    });
  } catch (error) {
    console.error('Error checking assignment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
