const mongoose = require('mongoose');
const { createModel } = require('../db/pgModel');

const isTest = process.env.NODE_ENV === 'test' || process.env.MOCK_DB === 'true';
const usePostgres = !isTest && !!(process.env.PGDATABASE || process.env.DB_NAME || process.env.DATABASE_URL);

if (usePostgres) {
  module.exports = createModel('SupportRequest');
} else {
  const supportRequestSchema = new mongoose.Schema({
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
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.models.SupportRequest || mongoose.model('SupportRequest', supportRequestSchema);
}
