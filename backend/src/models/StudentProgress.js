const mongoose = require('mongoose');

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
      timeSpent: Number, // in minutes
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

module.exports = mongoose.model('StudentProgress', studentProgressSchema);
