const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.get('/upcoming', eventController.getUpcomingEvents);
router.post('/register', eventController.registerForEvent);

// Admin routes
router.use(authenticateToken);
router.use(authorizeRole(['admin']));

router.post('/create', eventController.createEvent);
router.get('/all', eventController.getAllEvents);
router.get('/:eventId/registrations', eventController.getEventRegistrations);
router.post('/send-link', eventController.sendLinkToRegistrants);
router.patch('/:eventId/archive', eventController.archiveEvent);

module.exports = router;
