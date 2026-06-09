const jwt = require('jsonwebtoken');

const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    // Check if user is still active in database
    try {
      const user = await User.findById(decodedUser.userId);
      if (!user) {
        return res.status(403).json({ message: 'User account not found' });
      }
      
      req.user = decodedUser;
      next();
    } catch (e) {
      return res.status(500).json({ message: 'Server authentication error' });
    }
  });
};

const isApproved = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Admins bypass approval check
  if (req.user.role === 'admin') {
    return next();
  }
  
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.approved) {
      return res.status(403).json({ message: 'Your account is pending approval. You will have access once verified by an admin.' });
    }
    
    // Optional: Add verification for ID/Payment if required for course access
    if (!user.idVerified) {
       // We allow access for now but could restrict certain features here if needed
       console.log(`[Security] User ${user.email} accessing course without ID verification`);
    }
    
    next();
  } catch (e) {
    return res.status(500).json({ message: 'Server approval check error' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = { authenticateToken, authorizeRole, isApproved };
