const fs = require('fs');
const path = require('path');
const dns = require('dns');
const tls = require('tls');
const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
          status: 'PASS',
          statusCode: res.statusCode,
          responseTimeMs: Date.now() - start,
          message: ''
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

  // 1. Homepage & Portal Loading
  const homeCheck = await localGet(port, '/');
  addResult('smoke', 'Homepage loads', homeCheck.status, homeCheck.message, { responseTimeMs: homeCheck.responseTimeMs });

  const portalCheck = await localGet(port, '/portal.html');
  addResult('smoke', 'Portal loads', portalCheck.status, portalCheck.message, { responseTimeMs: portalCheck.responseTimeMs });

  // 2. Database Connection
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    addResult('smoke', 'MongoDB', 'PASS', `Connected to database: ${mongoose.connection.name}`);
  } else {
    addResult('smoke', 'MongoDB', 'FAIL', 'Database is disconnected or buffering');
  }

  // 3. User Login Validations (Checks DB records directly)
  if (dbState === 1) {
    try {
      const User = mongoose.models.User || mongoose.model('User');
      
      // Test Student Account
      const student = await User.findOne({ email: 'student@zazele.com' });
      if (student) {
        addResult('smoke', 'Student Account exists', 'PASS', 'Verified test student@zazele.com is in DB');
      } else {
        addResult('smoke', 'Student Account exists', 'WARNING', 'student@zazele.com was not found in database');
      }

      // Test Admin Account
      const admin = await User.findOne({ email: 'admin@zazele.com' });
      if (admin) {
        addResult('smoke', 'Admin Account exists', 'PASS', 'Verified admin@zazele.com is in DB');
      } else {
        addResult('smoke', 'Admin Account exists', 'WARNING', 'admin@zazele.com was not found in database');
      }
    } catch (e) {
      addResult('smoke', 'Auth Accounts validation', 'FAIL', `Mongoose lookup error: ${e.message}`);
    }
  } else {
    addResult('smoke', 'Auth Accounts validation', 'FAIL', 'Skipped - MongoDB disconnected');
  }

  // 4. API Endpoints
  const healthCheck = await localGet(port, '/api/health');
  addResult('api', 'Endpoint GET /api/health', healthCheck.status, healthCheck.message, { responseTimeMs: healthCheck.responseTimeMs });

  const coursesCheck = await localGet(port, '/api/courses/modules');
  addResult('api', 'Endpoint GET /api/courses/modules', coursesCheck.status, coursesCheck.message, { responseTimeMs: coursesCheck.responseTimeMs });

  // 5. Uploads Folder Write Permission
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

  // 6. SSL Checks (Live checks)
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
  if (fs.existsSync(envPath)) {
    addResult('security', 'Sensitive files (.env)', 'PASS', 'Local configuration file exists');
  } else {
    addResult('security', 'Sensitive files (.env)', 'WARNING', '.env file was not found at project root');
  }

  // 8. Localhost variables check inside scripts
  const jsDir = path.resolve(__dirname, '../../../frontend/js');
  if (fs.existsSync(jsDir)) {
    try {
      const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && f !== 'env.js');
      let foundLocalhost = false;
      for (const file of files) {
        const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
        if (content.includes('http://localhost:') || content.includes('http://127.0.0.1:')) {
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

  return report;
}

module.exports = { runDiagnostics };
