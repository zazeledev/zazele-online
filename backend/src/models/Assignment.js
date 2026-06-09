const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    default: null, // null until submitted
  },
  totalQuestions: {
    type: Number,
    default: 70,
  },
  passMark: {
    type: Number,
    default: 80, // 80% pass mark
  },
  timeLimit: {
    type: Number,
    default: 3600, // 60 minutes in seconds
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssignmentQuestion',
      },
      selectedAnswer: String, // a, b, c, or d
      isCorrect: Boolean,
    },
  ],
  timeStarted: Date,
  timeSubmitted: Date,
  timeSpent: Number, // in seconds
  retakeCount: {
    type: Number,
    default: 0,
  },
  passed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'submitted'],
    default: 'not-started',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
