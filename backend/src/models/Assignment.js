const mongoose = require('mongoose');
const { createModel } = require('../db/pgModel');

const isTest = process.env.NODE_ENV === 'test' || process.env.MOCK_DB === 'true';
const usePostgres = !isTest && !!(process.env.PGDATABASE || process.env.DB_NAME || process.env.DATABASE_URL);

if (usePostgres) {
  module.exports = createModel('Assignment');
} else {
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
      default: null,
    },
    totalQuestions: {
      type: Number,
      default: 70,
    },
    passMark: {
      type: Number,
      default: 80,
    },
    timeLimit: {
      type: Number,
      default: 3600,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'AssignmentQuestion',
        },
        selectedAnswer: String,
        isCorrect: Boolean,
      },
    ],
    timeStarted: Date,
    timeSubmitted: Date,
    timeSpent: Number,
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

  module.exports = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
}
