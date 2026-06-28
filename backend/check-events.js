require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./src/models/Event');

async function checkEvents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const count = await Event.countDocuments();
    console.log(`Event count: ${count}`);
    
    const events = await Event.find();
    console.log('Events:', JSON.stringify(events, null, 2));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkEvents();
