const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignment');
const notificationRoutes = require('./routes/notification');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL, 
      'https://zazele.online', 
      'https://www.zazele.online',
      'http://zazele.online',
      'http://www.zazele.online'
    ];
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    const isAllowedDomain = allowedOrigins.some(domain => domain && origin.startsWith(domain));
    
    if (isLocalhost || isAllowedDomain) {
      callback(null, true);
    } else {
      console.warn(`[Security] Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  // Only log non-static requests in production to reduce noise
  if (!req.url.startsWith('/uploads')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.get('Origin') || 'None'}`);
  }
  next();
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend static files (if hosted on same server)
app.use(express.static(path.join(__dirname, '../../frontend')));

// Connect to MongoDB
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  heartbeatFrequencyMS: 10000, // Check connection every 10 seconds
};

function connectWithRetry() {
  console.log('Attempting MongoDB connection...');
  mongoose
    .connect(process.env.MONGODB_URI, mongooseOptions)
    .then(() => {
      console.log('✅ MongoDB connected successfully');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('🔥 MongoDB connection error:', err);
});

connectWithRetry();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Serve frontend for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Zazele Online backend running on http://localhost:${PORT}`);
});

module.exports = app;
