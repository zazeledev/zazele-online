const mongoose = require('mongoose');
require('dotenv').config();
const Module = require('./src/models/Module');

async function checkModules() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const modules = await Module.find().sort({ order: 1 });
    console.log('Existing Modules:');
    modules.forEach(m => console.log(`- "${m.title}" (_id: ${m._id}, order: ${m.order})`));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkModules();