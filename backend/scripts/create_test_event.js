const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Event = require('../src/models/Event');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const ev = new Event({
      name: 'Test Intro Webinar',
      description: 'This is a test event inserted by automation.',
      date: tomorrow,
      time: '10:00',
      teamsLink: 'https://teams.microsoft.com/l/meetup-join/sample-link',
      archived: false,
    });

    const saved = await ev.save();
    console.log('Created event:', saved._id.toString());
  } catch (err) {
    console.error('Error creating event:', err.message);
  } finally {
    mongoose.disconnect();
  }
})();
