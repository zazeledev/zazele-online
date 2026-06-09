const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Public routes (no auth required for course browsing)
router.get('/modules', courseController.getAllModules);
router.get('/modules/:moduleId', courseController.getModuleWithLessons);
router.get('/lessons/:lessonId', courseController.getLessonById);

module.exports = router;
