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
    let assignment = await Assignment.findOne({ studentId, moduleId }).populate('answers.questionId');
    
    if (assignment) {
      // Resume existing assignment
      if (assignment.status === 'submitted') {
        return res.json({
          assignment,
          questions: [], // Don't send questions if already submitted
          message: 'Assignment already submitted',
        });
      }

      // Return existing in-progress assignment
      const questions = assignment.answers.map((a) => ({
        _id: a.questionId._id,
        question: a.questionId.question,
        options: a.questionId.options,
        studentAnswer: a.selectedAnswer,
      }));

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

    // Populate for response
    assignment = await assignment.populate('answers.questionId');

    const questions = selectedQuestions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      section: q.section,
      lessonReference: q.lessonReference,
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
    const answerIndex = assignment.answers.findIndex((a) => a.questionId.toString() === questionId);
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
    const assignment = await Assignment.findOne({ _id: assignmentId, studentId }).populate(
      'answers.questionId'
    );

    if (!assignment) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (assignment.status === 'submitted') {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    // Calculate score
    let correctCount = 0;
    assignment.answers.forEach((answer) => {
      if (answer.questionId) {
        const isCorrect = answer.selectedAnswer === answer.questionId.correctAnswer;
        answer.isCorrect = isCorrect;
        if (isCorrect) correctCount++;
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
    assignment.answers = selectedQuestions.map((q) => ({
      questionId: q._id,
      selectedAnswer: null,
      isCorrect: null,
    }));

    await assignment.save();

    // Populate for response
    assignment = await assignment.populate('answers.questionId');

    const questions = selectedQuestions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      section: q.section,
      lessonReference: q.lessonReference,
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

    const assignment = await Assignment.findOne({ _id: assignmentId, studentId }).populate(
      'answers.questionId'
    );

    if (!assignment) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (assignment.status !== 'submitted') {
      return res.status(400).json({ message: 'Assignment not yet submitted' });
    }

    // Filter out answers where questionId might be missing/deleted
    const validAnswers = assignment.answers.filter(a => a.questionId);

    const questions = validAnswers.map((answer) => ({
      _id: answer.questionId._id,
      questionNumber: answer.questionId.questionNumber,
      question: answer.questionId.question,
      options: answer.questionId.options || { a: '', b: '', c: '', d: '' },
      studentAnswer: answer.selectedAnswer,
      correctAnswer: answer.questionId.correctAnswer,
      isCorrect: answer.isCorrect,
      section: answer.questionId.section,
    }));

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
