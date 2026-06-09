const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const mailer = require('../utils/mailer');

// Admin - Create an event
exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, time, teamsLink } = req.body;
    const newEvent = new Event({
      name,
      description,
      date,
      time,
      teamsLink,
    });
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// Public - Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    // Current date set to start of today for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({
      date: { $gte: today },
      archived: false,
    }).sort({ date: 1, time: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming events', error: error.message });
  }
};

// Admin - Get all events (including past ones)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// Public - Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, fullName, email, contactNumber } = req.body;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registration = new EventRegistration({
      eventId,
      fullName,
      email,
      contactNumber,
    });

    await registration.save();
    res.status(201).json({ message: 'Registered successfully', registration });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for event', error: error.message });
  }
};

// Admin - Get registrations for an event
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = await EventRegistration.find({ eventId }).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error: error.message });
  }
};

// Admin - Send link to selected registrants
exports.sendLinkToRegistrants = async (req, res) => {
  try {
    const { registrationIds, eventId } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const teamsLink = event.teamsLink;
    if (!teamsLink) {
      return res.status(400).json({ message: 'No MS Teams link set for this event' });
    }

    const registrations = await EventRegistration.find({
      _id: { $in: registrationIds },
      eventId,
    });

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const reg of registrations) {
      try {
        await mailer.sendTeamsLink(reg.email, event.name, teamsLink);
        reg.linkSent = true;
        await reg.save();
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ email: reg.email, error: error.message });
      }
    }

    res.json({
      message: `Emails sent: ${results.success} successful, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending emails', error: error.message });
  }
};

// Admin - Archive an event (manual or automatic logic could be here)
exports.archiveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndUpdate(eventId, { archived: true }, { new: true });
    res.json({ message: 'Event archived successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error archiving event', error: error.message });
  }
};
