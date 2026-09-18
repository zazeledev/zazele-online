require('dotenv').config();
const Event = require('./src/models/Event');

async function checkEvents() {
  try {
    const count = await Event.countDocuments();
    console.log(`Event count: ${count}`);
    
    const events = await Event.find();
    console.log('Events in PostgreSQL:', JSON.stringify(events, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkEvents();
