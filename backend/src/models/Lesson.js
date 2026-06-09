const mongoose = require('mongoose');

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

module.exports = mongoose.model('Lesson', lessonSchema);
