const mongoose = require('mongoose');
const { createModel } = require('../db/pgModel');

const isTest = process.env.NODE_ENV === 'test' || process.env.MOCK_DB === 'true';
const usePostgres = !isTest && !!(process.env.PGDATABASE || process.env.DB_NAME || process.env.DATABASE_URL);

if (usePostgres) {
  module.exports = createModel('Lesson');
} else {
  const lessonSchema = new mongoose.Schema({
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    youtubeURL: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    notesPath: {
      type: String,
      default: null,
    },
    quiz: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
}
