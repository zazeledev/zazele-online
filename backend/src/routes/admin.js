const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const courseController = require('../controllers/courseController');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(authorizeRole(['admin']));

// Assignment question management (Unique paths to avoid conflict)
router.get('/module-questions/:moduleId', adminController.getAssignmentQuestions);
router.post('/assignment-questions', adminController.createAssignmentQuestions);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/archived', adminController.getArchivedUsers);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.put('/users/:userId', adminController.updateUser);
router.get('/profile-update-requests', adminController.getProfileUpdateRequests);
router.put('/profile-update-requests/:requestId', adminController.handleProfileUpdateRequest);
router.get('/progress-report/:studentId', adminController.getUserProgress);
router.delete('/reset-progress/:studentId/:moduleId', adminController.resetUserProgress);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId/approve', adminController.approveUser);
router.put('/users/:userId/verify-id', adminController.verifyID);
router.put('/users/:userId/verify-payment', adminController.verifyPayment);
router.get('/stats', adminController.getUserStats);

// Support request management
router.get('/support-requests', adminController.getSupportRequests);
router.put('/support-requests/:requestId', adminController.updateSupportRequest);

// Module management
router.get('/modules', courseController.getAllModules);
router.get('/modules/:moduleId', courseController.getModuleWithLessons);
router.post('/modules', courseController.createModule);
router.put('/modules/:moduleId', courseController.updateModule);
router.delete('/modules/:moduleId', courseController.deleteModule);

// Lesson management
router.get('/lessons/:lessonId', courseController.getLessonById);
router.post('/lessons', upload.single('notes'), courseController.createLesson);
router.put('/lessons/:lessonId', upload.single('notes'), courseController.updateLesson);
router.delete('/lessons/:lessonId', courseController.deleteLesson);

module.exports = router;
