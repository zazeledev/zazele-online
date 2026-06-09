const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const assignmentController = require('../controllers/assignmentController');

const router = express.Router();

// Get assignment (start new or resume)
router.get('/module/:moduleId/assignment', authenticateToken, assignmentController.getAssignment);

// Save answer while taking test
router.post('/assignment/:assignmentId/answer', authenticateToken, assignmentController.saveAnswer);

// Submit assignment for grading
router.post('/assignment/:assignmentId/submit', authenticateToken, assignmentController.submitAssignment);

// Get assignment results (after submission)
router.get('/assignment/:assignmentId/results', authenticateToken, assignmentController.getAssignmentResults);

// Retake assignment (delete existing and start new)
router.post('/module/:moduleId/retake-assignment', authenticateToken, assignmentController.retakeAssignment);

// Check assignment status for a module
router.get('/module/:moduleId/assignment-status', authenticateToken, assignmentController.checkAssignmentStatus);

module.exports = router;
