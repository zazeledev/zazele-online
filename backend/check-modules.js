require('dotenv').config();
const Module = require('./src/models/Module');

async function checkModules() {
  try {
    const modules = await Module.find().sort({ order: 1 });
    console.log('Existing Modules in PostgreSQL:');
    modules.forEach(m => console.log(`- "${m.title}" (_id: ${m._id}, order: ${m.order})`));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkModules();