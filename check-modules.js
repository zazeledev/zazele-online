const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './backend/.env') });

const Module = require('./backend/src/models/Module');

async function checkModules() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const modules = await Module.find();
    console.log('Existing Modules:');
    modules.forEach(m => console.log(`- "${m.title}" (_id: ${m._id})`));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkModules();