const mongoose = require('mongoose');
const { createModel } = require('../db/pgModel');

const isTest = process.env.NODE_ENV === 'test' || process.env.MOCK_DB === 'true';
const usePostgres = !isTest && !!(process.env.PGDATABASE || process.env.DB_NAME || process.env.DATABASE_URL);

if (usePostgres) {
  module.exports = createModel('StudentProgress');
} else {
  const studentProgressSchema = new mongoose.Schema({
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    completedLessons: [
      {
        lessonId: mongoose.Schema.Types.ObjectId,
        order: Number,
        completedAt: Date,
        timeSpent: Number,
      },
    ],
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    startedFirstLessonDate: {
      type: Date,
      default: null,
    },
    currentLessonOrder: {
      type: Number,
      default: 1,
    },
  }, { timestamps: true });

  module.exports = mongoose.models.StudentProgress || mongoose.model('StudentProgress', studentProgressSchema);
}
