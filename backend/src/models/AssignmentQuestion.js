const mongoose = require('mongoose');
const { createModel } = require('../db/pgModel');

const isTest = process.env.NODE_ENV === 'test' || process.env.MOCK_DB === 'true';
const usePostgres = !isTest && !!(process.env.PGDATABASE || process.env.DB_NAME || process.env.DATABASE_URL);

if (usePostgres) {
  module.exports = createModel('AssignmentQuestion');
} else {
  const assignmentQuestionSchema = new mongoose.Schema({
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      a: String,
      b: String,
      c: String,
      d: String,
    },
    correctAnswer: {
      type: String,
      enum: ['a', 'b', 'c', 'd'],
      required: true,
    },
    section: String,
    lessonReference: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.models.AssignmentQuestion || mongoose.model('AssignmentQuestion', assignmentQuestionSchema);
}
