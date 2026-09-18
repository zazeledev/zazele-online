require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Event = require('../src/models/Event');

(async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const ev = await Event.create({
      name: 'Test Intro Webinar',
      description: 'This is a test event inserted by automation.',
      date: tomorrow.toISOString().split('T')[0],
      time: '10:00',
      teamsLink: 'https://teams.microsoft.com/l/meetup-join/sample-link',
      archived: false,
    });

    console.log('Created event in PostgreSQL:', ev._id);
    process.exit(0);
  } catch (err) {
    console.error('Error creating event:', err.message);
    process.exit(1);
  }
})();
