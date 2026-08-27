const mongoose = require('mongoose');
const { createModel } = require('../db/pgModel');

const isTest = process.env.NODE_ENV === 'test' || process.env.MOCK_DB === 'true';
const usePostgres = !isTest && !!(process.env.PGDATABASE || process.env.DB_NAME || process.env.DATABASE_URL);

if (usePostgres) {
  module.exports = createModel('ProfileUpdateRequest');
} else {
  const profileUpdateRequestSchema = new mongoose.Schema({
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedChanges: {
      fullName: String,
      email: String,
      country: String,
      province: String,
      contactNumber: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminComment: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.models.ProfileUpdateRequest || mongoose.model('ProfileUpdateRequest', profileUpdateRequestSchema);
}
