const fs = require('fs');
const path = require('path');
const dns = require('dns');
const tls = require('tls');
const http = require('http');
const https = require('https');
const mongoose = require('mongoose');

// Helper to perform HTTP GET requests locally
function localGet(port, urlPath) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.get({
      host: '127.0.0.1',
      port: port,
      path: urlPath,
      timeout: 3000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode === 200 ? 'PASS' : 'FAIL',
          statusCode: res.statusCode,
          responseTimeMs: Date.now() - start,
          message: res.statusCode === 200 ? '' : `HTTP Error ${res.statusCode}`
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 'FAIL',
        statusCode: 0,
        responseTimeMs: Date.now() - start,
        message: err.message
      });
    });
    req.end();
  });
}

// Helper to perform public HTTPS GET calls
function checkUrl(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 4000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode === 200 ? 'PASS' : 'FAIL',
          statusCode: res.statusCode,
          responseTimeMs: Date.now() - start,
          message: res.statusCode === 200 ? '' : `HTTP ${res.statusCode}`,
          content: data
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 'FAIL',
        statusCode: 0,
        responseTimeMs: Date.now() - start,
        message: err.message,
        content: ''
      });
    });
    req.end();
  });
}

// SSL Certificate inspector
function checkSsl(hostname) {
  return new Promise((resolve) => {
    dns.lookup(hostname, (dnsErr) => {
      if (dnsErr) {
        return resolve({ valid: false, error: `DNS lookup failed: ${dnsErr.message}` });
      }

      const socket = tls.connect({
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false
      }, () => {
        const authorized = socket.authorized;
        const cert = socket.getPeerCertificate();
        socket.end();

        if (!cert || Object.keys(cert).length === 0) {
          resolve({ valid: false, error: 'No certificate payload received' });
        } else {
          const validTo = new Date(cert.valid_to);
          const daysRemaining = Math.round((validTo - new Date()) / (1000 * 60 * 60 * 24));
          resolve({
            valid: authorized && daysRemaining > 0,
            daysRemaining,
            validTo: cert.valid_to
          });
        }
      });

      socket.on('error', (err) => {
        resolve({ valid: false, error: err.message });
      });
      socket.setTimeout(5000, () => {
        socket.destroy();
        resolve({ valid: false, error: 'Connection Timeout' });
      });
    });
  });
}

async function runDiagnostics(port = 5000) {
  const start = Date.now();
  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    passed: 0,
    failed: 0,
    warnings: 0,
    suites: {
      smoke: [],
      api: [],
      security: []
    }
  };

  const addResult = (suite, name, status, message = '', extra = {}) => {
    const item = { name, status, message, ...extra };
    report.suites[suite].push(item);
    if (status === 'PASS') {
      report.passed++;
    } else if (status === 'WARNING') {
      report.warnings++;
    } else {
      report.failed++;
    }
  };

  // Determine if running on live production server (cPanel/MongoDB Atlas)
  const isProduction = process.env.NODE_ENV === 'production' || 
                       (mongoose.connection.host && mongoose.connection.host.includes('mongodb.net')) ||
                       !process.env.PORT || isNaN(process.env.PORT);

  // 1. Homepage & Portal Loading Checks
  if (isProduction) {
    const homeCheck = await checkUrl('https://www.zazele.online/');
    addResult('smoke', 'Homepage loads', homeCheck.status, homeCheck.message, { responseTimeMs: homeCheck.responseTimeMs });

    const portalCheck = await checkUrl('https://www.zazele.online/portal.html');
    addResult('smoke', 'Portal loads', portalCheck.status, portalCheck.message, { responseTimeMs: portalCheck.responseTimeMs });
  } else {
    const homeCheck = await localGet(port, '/');
    addResult('smoke', 'Homepage loads', homeCheck.status, homeCheck.message, { responseTimeMs: homeCheck.responseTimeMs });

    const portalCheck = await localGet(port, '/portal.html');
    addResult('smoke', 'Portal loads', portalCheck.status, portalCheck.message, { responseTimeMs: portalCheck.responseTimeMs });
  }

  // 2. Database Connection Check
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    addResult('smoke', 'MongoDB', 'PASS', `Connected to database: ${mongoose.connection.name}`);
  } else {
    addResult('smoke', 'MongoDB', 'FAIL', 'Database is disconnected or buffering');
  }

  // 3. Dynamic User Account Validations (Safe Mongoose lookups)
  if (dbState === 1) {
    try {
      const User = mongoose.models.User || mongoose.model('User');
      
      // Production-safe check: check if any student account exists
      const student = await User.findOne({ role: 'student' });
      if (student) {
        addResult('smoke', 'Student Account exists', 'PASS', 'Verified student accounts exist in database');
      } else {
        addResult('smoke', 'Student Account exists', 'WARNING', 'No users with student role found in database');
      }

      // Production-safe check: check if any admin account exists
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        addResult('smoke', 'Admin Account exists', 'PASS', 'Verified admin accounts exist in database');
      } else {
        addResult('smoke', 'Admin Account exists', 'WARNING', 'No users with admin role found in database');
      }
    } catch (e) {
      addResult('smoke', 'Auth Accounts validation', 'FAIL', `Mongoose lookup error: ${e.message}`);
    }
  } else {
    addResult('smoke', 'Auth Accounts validation', 'FAIL', 'Skipped - MongoDB disconnected');
  }

  // 4. API Endpoints Check
  if (isProduction) {
    const healthCheck = await checkUrl('https://api.zazele.online/api/health');
    addResult('api', 'Endpoint GET /api/health', healthCheck.status, healthCheck.message, { responseTimeMs: healthCheck.responseTimeMs });

    const coursesCheck = await checkUrl('https://api.zazele.online/api/courses/modules');
    addResult('api', 'Endpoint GET /api/courses/modules', coursesCheck.status, coursesCheck.message, { responseTimeMs: coursesCheck.responseTimeMs });
  } else {
    const healthCheck = await localGet(port, '/api/health');
    addResult('api', 'Endpoint GET /api/health', healthCheck.status, healthCheck.message, { responseTimeMs: healthCheck.responseTimeMs });

    const coursesCheck = await localGet(port, '/api/courses/modules');
    addResult('api', 'Endpoint GET /api/courses/modules', coursesCheck.status, coursesCheck.message, { responseTimeMs: coursesCheck.responseTimeMs });
  }

  // 5. Uploads Folder Write Permission Check
  const uploadsPath = path.resolve(__dirname, '../uploads');
  try {
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    const tempFile = path.join(uploadsPath, '.diagcheck');
    fs.writeFileSync(tempFile, 'ok');
    fs.unlinkSync(tempFile);
    addResult('smoke', 'Uploads directory writable', 'PASS');
  } catch (e) {
    addResult('smoke', 'Uploads directory writable', 'FAIL', e.message);
  }

  // 6. SSL Check validations
  const mainSsl = await checkSsl('www.zazele.online');
  if (mainSsl.valid) {
    addResult('smoke', 'SSL certificate valid for main site', 'PASS', `${mainSsl.daysRemaining} days remaining`);
  } else {
    addResult('smoke', 'SSL certificate valid for main site', 'WARNING', mainSsl.error || 'Invalid Certificate');
  }

  const apiSsl = await checkSsl('api.zazele.online');
  if (apiSsl.valid) {
    addResult('smoke', 'SSL certificate valid for backend api', 'PASS', `${apiSsl.daysRemaining} days remaining`);
  } else {
    addResult('smoke', 'SSL certificate valid for backend api', 'WARNING', apiSsl.error || 'Invalid Certificate');
  }

  // 7. Security Ignored Configuration Check
  const envPath = path.resolve(__dirname, '../../../.env');
  const hasEnvFile = fs.existsSync(envPath);
  const hasEnvVars = !!(process.env.MONGODB_URI && process.env.JWT_SECRET);
  
  if (hasEnvVars) {
    addResult('security', 'Sensitive files (.env)', 'PASS', hasEnvFile ? 'Local .env file configuration loaded' : 'Process environment variables securely configured');
  } else {
    addResult('security', 'Sensitive files (.env)', 'FAIL', 'Missing MONGODB_URI or JWT_SECRET configuration parameters');
  }

  // 8. Localhost references in static scripts check
  if (isProduction) {
    // On production server (cPanel), check the live deployed frontend JS file from Vercel instead of local filesystem
    const apiJsCheck = await checkUrl('https://www.zazele.online/js/api.js');
    if (apiJsCheck.status === 'PASS') {
      const content = apiJsCheck.content || '';
      // Refined check matches absolute connections e.g. http://localhost:5000, not guard check conditions
      if (/http:\/\/localhost:\d+/i.test(content) || /http:\/\/127\.0\.0\.1:\d+/i.test(content)) {
        addResult('security', 'No localhost references in static JS', 'FAIL', 'Found hardcoded local address connection port inside api.js');
      } else {
        addResult('security', 'No localhost references in static JS', 'PASS', 'Verified no local address connection ports are deployed');
      }
    } else {
      addResult('security', 'No localhost references in static JS', 'WARNING', 'Failed to retrieve api.js from main site to scan');
    }
  } else {
    const jsDir = path.resolve(__dirname, '../../../frontend/js');
    if (fs.existsSync(jsDir)) {
      try {
        const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && f !== 'env.js');
        let foundLocalhost = false;
        for (const file of files) {
          const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
          if (/http:\/\/localhost:\d+/i.test(content) || /http:\/\/127\.0\.0\.1:\d+/i.test(content)) {
            foundLocalhost = true;
            addResult('security', `No localhost references in static JS (js/${file})`, 'FAIL', 'Found hardcoded local address connection port');
          }
        }
        if (!foundLocalhost) {
          addResult('security', 'No localhost references in static JS', 'PASS');
        }
      } catch (e) {
        addResult('security', 'No localhost references in static JS', 'WARNING', e.message);
      }
    } else {
      addResult('security', 'No localhost references in static JS', 'WARNING', 'Static JS directory not resolved');
    }
  }

  return report;
}

module.exports = { runDiagnostics };
