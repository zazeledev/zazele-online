const fs = require('fs');
const path = require('path');
const http = require('http');
const tls = require('tls');
const dns = require('dns');

// Helper to perform HTTP GET requests
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data
      }));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Helper to perform HTTP POST requests with JSON payload
function httpPost(url, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data
      }));
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

// Helper to verify SSL Certificate Validity
function checkSsl(hostname) {
  return new Promise((resolve) => {
    // Resolve DNS first to check connection availability
    dns.lookup(hostname, (dnsErr) => {
      if (dnsErr) {
        resolve({ valid: false, error: `DNS lookup failed: ${dnsErr.message}` });
        return;
      }

      const socket = tls.connect({
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false // Allow connecting to inspect properties even if expired
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
            issuer: cert.issuer.O || cert.issuer.CN,
            validTo: cert.valid_to
          });
        }
      });

      socket.on('error', (err) => {
        resolve({ valid: false, error: err.message });
      });
      socket.setTimeout(15000, () => {
        socket.destroy();
        resolve({ valid: false, error: 'Connection Timeout' });
      });
    });
  });
}

async function run(testPort = 5001) {
  const tests = [];
  const addTest = (name, testFn) => {
    tests.push({ name, fn: testFn });
  };

  const localBase = `http://localhost:${testPort}`;

  // 1. Homepage loads
  addTest('Homepage loads', async () => {
    const res = await httpGet(`${localBase}/index.html`);
    if (res.statusCode !== 200) throw new Error(`HTTP Status ${res.statusCode}`);
    if (!res.body.includes('<!DOCTYPE html>')) throw new Error('Not valid HTML');
  });

  // 2. Portal page loads
  addTest('Portal page loads', async () => {
    const res = await httpGet(`${localBase}/portal.html`);
    if (res.statusCode !== 200) throw new Error(`HTTP Status ${res.statusCode}`);
    if (!res.body.includes('portal-form-box')) throw new Error('Portal forms container not found');
  });

  // 3. API health endpoint responds
  addTest('API health endpoint responds', async () => {
    const res = await httpGet(`${localBase}/api/health`);
    if (res.statusCode !== 200) throw new Error(`HTTP Status ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (json.status !== 'ok') throw new Error(`Expected ok, got ${json.status}`);
  });

  // 4. MongoDB connection available
  addTest('MongoDB connection available', async () => {
    const res = await httpGet(`${localBase}/api/health`);
    const json = JSON.parse(res.body);
    if (json.database !== 'connected') throw new Error(`Database state is ${json.database}`);
  });

  // 5. Authentication endpoints exist
  addTest('Authentication endpoints exist', async () => {
    const loginRes = await httpPost(`${localBase}/api/auth/login`, {});
    const registerRes = await httpPost(`${localBase}/api/auth/register`, {});
    // Should return validation/missing credentials error (400), not 404 (Not Found) or 500 (Server Error)
    if (loginRes.statusCode === 404) throw new Error('Login route returned 404');
    if (registerRes.statusCode === 404) throw new Error('Register route returned 404');
  });

  // 6. Student login works
  addTest('Student login works', async () => {
    const res = await httpPost(`${localBase}/api/auth/login`, {
      email: 'student@zazele.com',
      password: 'student123'
    });
    if (res.statusCode !== 200) throw new Error(`Login failed with status ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    if (!json.token) throw new Error('No JWT token returned');
  });

  // 7. Admin login works
  addTest('Admin login works', async () => {
    const res = await httpPost(`${localBase}/api/auth/login`, {
      email: 'admin@zazele.com',
      password: 'CHANGE_ME_IMMEDIATELY_IN_PROD'
    });
    if (res.statusCode !== 200) throw new Error(`Login failed with status ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    if (!json.token) throw new Error('No JWT token returned');
  });

  // 8. Dashboards load (check front-end js file assets)
  addTest('Dashboard JavaScript assets load', async () => {
    const studentDash = await httpGet(`${localBase}/js/student-dashboard.js`);
    const adminDash = await httpGet(`${localBase}/js/admin-dashboard.js`);
    if (studentDash.statusCode !== 200) throw new Error(`Student Dashboard JS missing: ${studentDash.statusCode}`);
    if (adminDash.statusCode !== 200) throw new Error(`Admin Dashboard JS missing: ${adminDash.statusCode}`);
  });

  // 9. Protected routes return 401 when unauthorized
  const endpoints = ['student/profile', 'student/progress', 'notifications'];
  endpoints.forEach(ep => {
    addTest(`Endpoint ${ep} requires authentication`, async () => {
      const res = await httpGet(`${localBase}/api/${ep}`);
      if (res.statusCode !== 401) throw new Error(`Expected 401, got ${res.statusCode}`);
    });
  });

  // 10. JWT Authentication works (Student Dashboard)
  addTest('JWT Authentication works', async () => {
    // Login to get token
    const loginRes = await httpPost(`${localBase}/api/auth/login`, {
      email: 'student@zazele.com',
      password: 'student123'
    });
    const { token } = JSON.parse(loginRes.body);

    // Call protected route with authorization header
    const parsedUrl = new URL(`${localBase}/api/student/profile`);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const res = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      });
      req.on('error', reject);
      req.end();
    });

    if (res.statusCode !== 200) throw new Error(`Protected route returned status ${res.statusCode}: ${res.body}`);
  });

  // 11. No localhost URLs are exposed on production static scripts (excluding env.js which is dynamic)
  addTest('No localhost references in static JS', async () => {
    const jsDir = path.resolve(__dirname, '../../frontend/js');
    const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && f !== 'env.js');
    for (const file of files) {
      const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
      if (content.includes('http://localhost:') || content.includes('http://127.0.0.1:')) {
        throw new Error(`Localhost reference found inside static javascript file: js/${file}`);
      }
    }
  });

  // 12. SSL Certificate valid (Live checks against production domains)
  addTest('SSL certificate valid for main site', async () => {
    const res = await checkSsl('www.zazele.online');
    if (!res.valid) throw new Error(`SSL check failed: ${res.error || 'Invalid Certificate'}`);
  });

  addTest('SSL certificate valid for backend api', async () => {
    const res = await checkSsl('api.zazele.online');
    if (!res.valid) throw new Error(`SSL check failed: ${res.error || 'Invalid Certificate'}`);
  });

  // Executing Smoke Tests
  const results = [];
  for (const test of tests) {
    try {
      await test.fn();
      results.push({ name: test.name, status: 'PASS', message: '' });
    } catch (e) {
      results.push({ name: test.name, status: 'FAIL', message: e.message });
    }
  }

  return results;
}

module.exports = { run };
