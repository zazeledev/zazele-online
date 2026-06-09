const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, getUnreadCount } = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.patch('/:id/read', authenticateToken, markAsRead);
router.post('/mark-all-read', authenticateToken, markAllAsRead);

module.exports = router;
