const mongoose = require('mongoose');

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
  lessonReference: String, // e.g., "Lesson 1", "Lesson 2"
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AssignmentQuestion', assignmentQuestionSchema);
