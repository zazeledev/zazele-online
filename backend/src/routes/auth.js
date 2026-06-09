const express = require('express');
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.post('/register', upload.fields([
  { name: 'idDocument', maxCount: 1 },
  { name: 'paymentProof', maxCount: 1 }
]), authController.register);

router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
