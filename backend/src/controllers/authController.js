const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mailer = require('../utils/mailer');

// Register user
exports.register = async (req, res) => {
  try {
    const { fullName, email, country, province, password, contactNumber } = req.body;

    // Validate input
    if (!fullName || !email || !country || !province || !password || !contactNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Get file paths if uploaded
    const idDocumentPath = req.files?.['idDocument']?.[0]?.filename || null;
    const paymentProofPath = req.files?.['paymentProof']?.[0]?.filename || null;

    // Create new user
    const newUser = new User({
      fullName,
      email,
      country,
      province,
      passwordHash: password,
      contactNumber,
      idDocumentPath,
      paymentProofPath,
      approved: false,
      role: 'student',
    });

    await newUser.save();

    // Send welcome email to student
    try {
      await mailer.sendWelcomeEmail(newUser.email, newUser.fullName);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }

    // Notify admins about new registration
    try {
      const { notifyAdmins } = require('./notificationController');
      await notifyAdmins(
        newUser._id,
        `New student registered: ${newUser.fullName}. Awaiting approval.`,
        'general',
        '#admin-users'
      );
    } catch (err) {
      console.error('Failed to notify admins of registration:', err);
    }

    res.status(201).json({
      message: 'Account created successfully. Awaiting admin approval.',
      userId: newUser._id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return response
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        approved: user.approved,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, contactNumber, email } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    if (fullName) user.fullName = fullName;
    if (contactNumber) user.contactNumber = contactNumber;
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    user.updatedAt = new Date();
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        contactNumber: user.contactNumber,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't confirm if user exists
      return res.json({ message: 'If an account exists with that email, a reset code has been sent.' });
    }

    // Generate a simple 6-digit reset token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Log the token for testing/development (remove in final production if needed)
    console.log(`Reset code for ${email}: ${resetToken}`);

    try {
      // Send email
      await mailer.sendResetCode(email, resetToken);
    } catch (mailError) {
      console.error('Failed to send reset email:', mailError);
      // We still return success to the user for security/UX, 
      // but they won't get the email unless SMTP is configured correctly.
    }

    res.json({ 
      message: 'If an account exists with that email, a reset code has been sent.',
      info: 'Please check your email for the 6-digit verification code.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.passwordHash = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
