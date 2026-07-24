const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

if (process.env.NODE_ENV === 'test' || process.env.MOCK_DB === 'true') {
  require('./utils/mock-db');
}

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
    const rawOrigins = [
      process.env.FRONTEND_URL, 
      'https://zazele.online', 
      'https://www.zazele.online',
      'http://zazele.online',
      'http://www.zazele.online',
      'https://zazele-online.vercel.app',
      'https://www.zazele-online.vercel.app'
    ];
    
    // Normalize allowed origins by stripping trailing slashes
    const allowedOrigins = rawOrigins.filter(Boolean).map(d => d.replace(/\/$/, ''));
    
    // Allow requests with no origin (like mobile apps, curl, or test runners)
    if (!origin || origin === 'null' || origin === 'undefined') return callback(null, true);
    
    const cleanOrigin = origin.replace(/\/$/, '');
    
    const isLocalhost = cleanOrigin.includes('localhost') || 
                        cleanOrigin.includes('127.0.0.1') || 
                        cleanOrigin.includes('[::1]') ||
                        cleanOrigin.includes('192.168.') || 
                        cleanOrigin.includes('10.') || 
                        /172\.(1[6-9]|2[0-9]|3[0-1])\./.test(cleanOrigin);
                        
    const isAllowedDomain = allowedOrigins.some(domain => cleanOrigin === domain || cleanOrigin.startsWith(domain)) || 
                            cleanOrigin.endsWith('.zazele.online') ||
                            cleanOrigin.endsWith('zazele.online') ||
                            cleanOrigin.endsWith('.vercel.app');
    
    if (isLocalhost || isAllowedDomain) {
      callback(null, true);
    } else {
      console.warn(`[Security] Blocked CORS request from origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'x-test-trigger-db-fail'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security check: Block public access to sensitive files (dotfiles, configs)
app.use((req, res, next) => {
  const filename = path.basename(req.path).toLowerCase();
  if (filename === '.env' || filename === 'package.json' || filename === 'package-lock.json' || filename.startsWith('.')) {
    return res.status(404).send('Not Found');
  }
  next();
});

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

// Middleware to simulate database failure during QA test runs
app.use((req, res, next) => {
  if (req.headers['x-test-trigger-db-fail'] === 'true') {
    global.mockDbFail = true;
  } else {
    global.mockDbFail = false;
  }
  next();
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Dynamic environment configuration for frontend
app.get('/js/env.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  
  const host = req.get('host') || '';
  const isProductionHost = host.includes('zazele.online');
  
  let apiUrl = process.env.VITE_API_URL || 'https://api.zazele.online/api';
  let uploadUrl = process.env.VITE_UPLOAD_URL || 'https://api.zazele.online/uploads';
  
  // Guard: if requested on the production domain, never return localhost endpoints
  if (isProductionHost) {
    if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
      apiUrl = 'https://api.zazele.online/api';
    }
    if (uploadUrl.includes('localhost') || uploadUrl.includes('127.0.0.1')) {
      uploadUrl = 'https://api.zazele.online/uploads';
    }
  }
  
  res.send(`window.env = { VITE_API_URL: "${apiUrl}", VITE_UPLOAD_URL: "${uploadUrl}" };`);
});

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

global.mongoReconnectAttempts = 0;
global.mongoLastConnectedTime = null;
let isConnected = false;

function connectWithRetry() {
  global.mongoReconnectAttempts++;
  console.log(`[${new Date().toISOString()}] Attempting MongoDB connection (Attempt #${global.mongoReconnectAttempts})...`);
  mongoose
    .connect(process.env.MONGODB_URI, mongooseOptions)
    .then(() => {
      console.log(`[${new Date().toISOString()}] ✅ MongoDB connected successfully`);
      isConnected = true;
      global.mongoLastConnectedTime = new Date();
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

// Helper functions for expanded health stats
const os = require('os');
const { exec } = require('child_process');

function cpuAverage() {
  const cpus = os.cpus();
  if (!cpus || cpus.length === 0) return { idle: 0, total: 0 };
  let idleMs = 0;
  let totalMs = 0;
  cpus.forEach((core) => {
    for (const type in core.times) {
      totalMs += core.times[type];
    }
    idleMs += core.times.idle;
  });
  return { idle: idleMs / cpus.length, total: totalMs / cpus.length };
}

function getCpuUsage() {
  return new Promise((resolve) => {
    const startMeasure = cpuAverage();
    setTimeout(() => {
      const endMeasure = cpuAverage();
      const idleDifference = endMeasure.idle - startMeasure.idle;
      const totalDifference = endMeasure.total - startMeasure.total;
      if (totalDifference === 0) return resolve('0%');
      const percentageCpu = 100 - Math.round(100 * idleDifference / totalDifference);
      resolve(percentageCpu + '%');
    }, 100);
  });
}

function getDiskSpace() {
  return new Promise((resolve) => {
    const cmd = process.platform === 'win32' ? 'wmic logicaldisk get size,freespace,caption' : 'df -h /';
    exec(cmd, (err, stdout) => {
      if (err || !stdout) {
        return resolve({ drive: 'Root', total: 'N/A', free: 'N/A', usedPercent: 'N/A' });
      }
      if (process.platform === 'win32') {
        const lines = stdout.trim().split('\n');
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].trim().split(/\s+/);
          if (parts.length >= 3) {
            const drive = parts[0];
            const free = Math.round(parseInt(parts[1]) / 1024 / 1024 / 1024) + ' GB';
            const total = Math.round(parseInt(parts[2]) / 1024 / 1024 / 1024) + ' GB';
            const freeBytes = parseInt(parts[1]);
            const totalBytes = parseInt(parts[2]);
            const usedPercent = totalBytes ? Math.round(((totalBytes - freeBytes) / totalBytes) * 100) + '%' : 'N/A';
            return resolve({ drive, total, free, usedPercent });
          }
        }
      } else {
        const lines = stdout.trim().split('\n');
        if (lines.length >= 2) {
          const parts = lines[1].trim().split(/\s+/);
          if (parts.length >= 5) {
            return resolve({ drive: parts[0], total: parts[1], free: parts[3], usedPercent: parts[4] });
          }
        }
      }
      resolve({ drive: 'Root', total: 'N/A', free: 'N/A', usedPercent: 'N/A' });
    });
  });
}

function getGitInfo() {
  try {
    const gitDir = path.resolve(__dirname, '../../.git');
    if (!fs.existsSync(gitDir)) {
      return { commit: process.env.VERCEL_GIT_COMMIT_SHA || 'N/A', branch: 'main' };
    }
    const headContent = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf8').trim();
    if (headContent.startsWith('ref:')) {
      const branchPath = headContent.substring(4).trim();
      const branch = path.basename(branchPath);
      const fullBranchPath = path.join(gitDir, branchPath);
      if (fs.existsSync(fullBranchPath)) {
        const commit = fs.readFileSync(fullBranchPath, 'utf8').trim();
        return { commit: commit.substring(0, 7), branch };
      }
      return { commit: 'N/A', branch };
    }
    return { commit: headContent.substring(0, 7), branch: 'N/A' };
  } catch (e) {
    return { commit: 'N/A', branch: 'N/A' };
  }
}

function checkUploadsDir() {
  const uploadsPath = path.join(__dirname, '../uploads');
  try {
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    const tempFile = path.join(uploadsPath, '.healthcheck');
    fs.writeFileSync(tempFile, 'ok');
    fs.unlinkSync(tempFile);
    return true;
  } catch (e) {
    return false;
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  const start = Date.now();
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  let dbName = 'N/A';
  let collections = [];
  let dbPingTime = -1;
  
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    try {
      dbName = mongoose.connection.name;
      const adminDb = mongoose.connection.db.admin();
      const pingStart = Date.now();
      await adminDb.ping();
      dbPingTime = Date.now() - pingStart;
      
      const cols = await mongoose.connection.db.listCollections().toArray();
      collections = cols.map(c => c.name);
    } catch (e) {
      console.error('Failed to get mongo metadata:', e.message);
    }
  }

  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const cpuUsage = await getCpuUsage();
  const disk = await getDiskSpace();
  const gitInfo = getGitInfo();
  const responseTime = Date.now() - start;

  res.json({
    status: 'ok',
    database: dbStatus, // Root level string for compatibility
    databaseDetails: { // Detailed object for ops center
      status: dbStatus,
      name: dbName,
      collections: collections,
      pingTimeMs: dbPingTime,
      reconnectAttempts: global.mongoReconnectAttempts,
      lastConnection: global.mongoLastConnectedTime ? global.mongoLastConnectedTime.toISOString() : 'N/A'
    },
    uploads: {
      status: checkUploadsDir() ? 'healthy' : 'unhealthy',
      path: path.join(__dirname, '../uploads')
    },
    jwt: {
      status: process.env.JWT_SECRET ? 'configured' : 'missing',
      strength: process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32 ? 'strong' : 'weak'
    },
    cors: {
      origins: [
        process.env.FRONTEND_URL,
        'https://zazele.online',
        'https://www.zazele.online'
      ].filter(Boolean)
    },
    environment: process.env.NODE_ENV || 'production',
    version: '1.1.0',
    gitCommit: gitInfo.commit,
    branch: gitInfo.branch,
    nodeVersion: process.version,
    uptime: uptime,
    memoryUsage: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB'
    },
    diskUsage: disk,
    cpuUsage: cpuUsage,
    responseTimeMs: responseTime,
    serverTime: new Date().toISOString(),
    timestamp: Date.now()
  });
});

// QA report loading helper
function getLatestReport() {
  const paths = [
    path.join(__dirname, '../../tests/reports/report.json'),
    path.join(__dirname, '../../frontend/report.json')
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch (e) {
        // continue
      }
    }
  }
  return null;
}

// QA Configuration Endpoint
app.get('/api/qa/config', (req, res) => {
  try {
    const config = require('../config/qa-endpoints');
    res.json(config);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load endpoints configuration' });
  }
});

// QA Status Report endpoints
app.get('/api/qa/status', (req, res) => {
  const report = getLatestReport();
  if (report) return res.json(report);
  return res.status(404).json({ error: 'No QA report found. Please run tests first.' });
});

app.get('/api/qa/latest', (req, res) => {
  const report = getLatestReport();
  if (report) return res.json(report);
  
  // Return a friendly default report structure if none exists
  return res.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    passed: 0,
    failed: 0,
    warnings: 0,
    suites: {
      smoke: [],
      api: [],
      security: [],
      e2e: []
    },
    message: 'No previous validation report found. Please click Run Full System Diagnosis.'
  });
});

const { runDiagnostics } = require('./utils/diagnostician');

// Full System Diagnosis trigger endpoint
app.post('/api/qa/diagnose', async (req, res) => {
  try {
    const report = await runDiagnostics(PORT);
    
    // Save report in both directories to persist results
    const paths = [
      path.join(__dirname, '../../tests/reports/report.json'),
      path.join(__dirname, '../../frontend/report.json')
    ];
    for (const p of paths) {
      try {
        const dir = path.dirname(p);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(p, JSON.stringify(report, null, 2), 'utf8');
      } catch (e) {
        console.error(`Failed to write diagnostic report to ${p}:`, e.message);
      }
    }

    res.json(report);
  } catch (error) {
    console.error('Diagnostic error:', error);
    res.status(500).json({ error: 'System diagnosis execution failed', details: error.message });
  }
});

// Serve frontend for all other routes (SPA support)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
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
