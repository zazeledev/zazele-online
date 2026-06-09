const express = require('express');
const { authenticateToken, authorizeRole, isApproved } = require('../middleware/auth');
const authController = require('../controllers/authController');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Student profile routes
router.get('/profile', authenticateToken, studentController.getProfile);
router.post('/profile-update-request', authenticateToken, studentController.requestProfileUpdate);

// Lesson and progress routes - PROTECTED by isApproved
router.get('/progress', authenticateToken, isApproved, studentController.getProgressDashboard);
router.get('/module/:moduleId/lessons', authenticateToken, isApproved, studentController.getModuleLessonsWithStatus);
router.post('/module/:moduleId/lesson/:lessonId/complete', authenticateToken, isApproved, studentController.completeLesson);
router.post('/module/:moduleId/lesson/:lessonId/skip-next', authenticateToken, isApproved, studentController.skipToNextLesson);

// Support request routes
router.post('/support-request', authenticateToken, isApproved, studentController.createSupportRequest);
router.get('/support-requests', authenticateToken, isApproved, studentController.getSupportRequests);

module.exports = router;
