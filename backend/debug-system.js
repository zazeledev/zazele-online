require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Module = require('./src/models/Module');
const Lesson = require('./src/models/Lesson');
const AssignmentQuestion = require('./src/models/AssignmentQuestion');

async function debugSystem() {
  try {
    console.log('--- System Debug Audit ---');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // 1. Check Users
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`- Users: ${userCount} total (${adminCount} admins)`);

    // 2. Check Course Content
    const moduleCount = await Module.countDocuments();
    const lessonCount = await Lesson.countDocuments();
    console.log(`- Course Content: ${moduleCount} modules, ${lessonCount} lessons`);

    // 3. Check Seeded Questions
    const questionCount = await AssignmentQuestion.countDocuments();
    console.log(`- Seeded Questions: ${questionCount} total`);

    // 4. Verify Environment Variables
    const requiredVars = ['JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS', 'PORT'];
    const missing = requiredVars.filter(v => !process.env[v]);
    if (missing.length > 0) {
      console.log(`❌ Missing Env Vars: ${missing.join(', ')}`);
    } else {
      console.log('✅ Core Env Vars present');
    }

    // 5. Test Mail Transporter
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    
    try {
      await transporter.verify();
      console.log('✅ Email Transporter verified');
    } catch (e) {
      console.log('❌ Email Transporter failed: ' + e.message);
    }

    await mongoose.disconnect();
    console.log('--- Audit Complete ---');
  } catch (error) {
    console.error('❌ Debug failed:', error);
    process.exit(1);
  }
}

debugSystem();
