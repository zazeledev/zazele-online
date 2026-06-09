require('dotenv').config();
const mongoose = require('mongoose');
const Lesson = require('../src/models/Lesson');
const Module = require('../src/models/Module');

const videoUpdates = [
  { lessonOrder: 1, videoId: 'zO-7lJTYUcg' },
  { lessonOrder: 2, videoId: 'kVudR7sxdYY' },
  { lessonOrder: 3, videoId: 'kAQJ_xaHAHk' },
  { lessonOrder: 4, videoId: '2lOtuFzqBJg' },
  { lessonOrder: 5, videoId: 'dTWZN2wbXx0' },
  { lessonOrder: 6, videoId: 'dTWZN2wbXx0' },
  { lessonOrder: 7, videoId: 'fVK97_cNsF0' },
  { lessonOrder: 8, videoId: 'ksyfodbL9gU' },
  { lessonOrder: 9, videoId: 'E3X0JsuhSeY' },
  { lessonOrder: 10, videoId: 'bu-vlh2gg-I' },
];

async function updateVideos() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find module 1
    const module = await Module.findOne({ title: 'Introduction to Computers' });
    if (!module) {
      console.log('Module not found');
      process.exit(1);
    }

    // Update each lesson with video
    for (const update of videoUpdates) {
      const videoUrl = `https://www.youtube.com/embed/${update.videoId}`;
      const lesson = await Lesson.findOneAndUpdate(
        { moduleId: module._id, order: update.lessonOrder },
        { youtubeURL: videoUrl },
        { new: true }
      );
      
      if (lesson) {
        console.log(`✅ Updated Lesson ${update.lessonOrder}: ${lesson.title}`);
      } else {
        console.log(`❌ Lesson ${update.lessonOrder} not found`);
      }
    }

    console.log('\n✅ All video URLs updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating videos:', error);
    process.exit(1);
  }
}

updateVideos();
