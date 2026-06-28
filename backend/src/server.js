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
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Status: ${res.statusCode} - ${duration}ms - Origin: ${req.get('Origin') || 'None'}`);
    });
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
  serverSelectionTimeoutMS: 5000, // Reduced from 15s to fail faster and retry
  socketTimeoutMS: 45000,
  heartbeatFrequencyMS: 10000,
};

let isConnected = false;

function connectWithRetry() {
  console.log(`[${new Date().toISOString()}] Attempting MongoDB connection...`);
  mongoose
    .connect(process.env.MONGODB_URI, mongooseOptions)
    .then(() => {
      console.log(`[${new Date().toISOString()}] ✅ MongoDB connected successfully`);
      isConnected = true;
    })
    .catch((err) => {
      console.error(`[${new Date().toISOString()}] ❌ MongoDB connection error:`, err.message);
      isConnected = false;
      console.log('Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn(`[${new Date().toISOString()}] ⚠️ MongoDB disconnected! Attempting to reconnect...`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[${new Date().toISOString()}] 🔥 MongoDB connection error:`, err);
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
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Serve frontend for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Internal Error:`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({ 
    message: 'Server error', 
    error: process.env.NODE_ENV === 'production' ? 'An internal error occurred' : err.message,
    timestamp
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection at:`, promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, err);
  // Give some time for logging before exiting
  setTimeout(() => process.exit(1), 1000);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Zazele Online backend running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Http server closed.');
    mongoose.connection.close(false, () => {
      console.log('Mongo connection closed.');
      process.exit(0);
    });
  });
});

module.exports = app;
