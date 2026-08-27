const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { createModel } = require('../db/pgModel');

const isTest = process.env.NODE_ENV === 'test' || process.env.MOCK_DB === 'true';
const usePostgres = !isTest && !!(process.env.PGDATABASE || process.env.DB_NAME || process.env.DATABASE_URL);

if (usePostgres) {
  module.exports = createModel('User');
} else {
  const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    idDocumentPath: {
      type: String,
      default: null,
    },
    paymentProofPath: {
      type: String,
      default: null,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    idVerified: {
      type: Boolean,
      default: false,
    },
    paymentVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    enrolledCourses: {
      type: [String],
      default: [],
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

  userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.passwordHash);
  };

  module.exports = mongoose.models.User || mongoose.model('User', userSchema);
}
