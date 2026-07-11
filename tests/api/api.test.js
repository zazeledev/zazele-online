const http = require('http');

function httpReq(method, url, payload = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
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
    
    if (payload) {
      req.write(JSON.stringify(payload));
    }
    req.end();
  });
}

async function run(testPort = 5001) {
  const localBase = `http://localhost:${testPort}`;
  const results = [];
  const addResult = (name, status, message = '') => {
    results.push({ name, status, message });
  };

  // Helper to run a test block
  const runTest = async (name, testFn) => {
    try {
      await testFn();
      addResult(name, 'PASS');
    } catch (e) {
      addResult(name, 'FAIL', e.message);
    }
  };

  // 1. Auth Tests
  await runTest('Auth: Register - Valid payload', async () => {
    const res = await httpReq('POST', `${localBase}/api/auth/register`, {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      country: 'South Africa',
      province: 'Gauteng',
      contactNumber: '0729999999'
    });
    if (res.statusCode !== 201) throw new Error(`Expected 201, got ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    if (!json.message || !json.message.includes('successful')) throw new Error('Response missing success message');
  });

  await runTest('Auth: Register - Missing fields', async () => {
    const res = await httpReq('POST', `${localBase}/api/auth/register`, {
      email: 'bad@example.com'
    });
    if (res.statusCode !== 400) throw new Error(`Expected 400, got ${res.statusCode}`);
  });

  await runTest('Auth: Login - Valid credentials', async () => {
    const res = await httpReq('POST', `${localBase}/api/auth/login`, {
      email: 'student@zazele.com',
      password: 'student123'
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.token) throw new Error('Missing token in response');
    if (json.user.email !== 'student@zazele.com') throw new Error(`Incorrect user returned: ${json.user.email}`);
  });

  await runTest('Auth: Login - Missing credentials', async () => {
    const res = await httpReq('POST', `${localBase}/api/auth/login`, {
      email: 'student@zazele.com'
    });
    if (res.statusCode !== 400) throw new Error(`Expected 400, got ${res.statusCode}`);
  });

  await runTest('Auth: Login - Invalid password', async () => {
    const res = await httpReq('POST', `${localBase}/api/auth/login`, {
      email: 'student@zazele.com',
      password: 'wrongpassword'
    });
    if (res.statusCode !== 401) throw new Error(`Expected 401, got ${res.statusCode}`);
  });

  // Get valid student token for protected routes checks
  let studentToken = '';
  try {
    const loginRes = await httpReq('POST', `${localBase}/api/auth/login`, {
      email: 'student@zazele.com',
      password: 'student123'
    });
    studentToken = JSON.parse(loginRes.body).token;
  } catch (e) {}

  // 2. Routing Protection (Missing / Invalid tokens)
  await runTest('API Protection: Missing token', async () => {
    const res = await httpReq('GET', `${localBase}/api/student/profile`);
    if (res.statusCode !== 401) throw new Error(`Expected 401, got ${res.statusCode}`);
  });

  await runTest('API Protection: Invalid token format', async () => {
    const res = await httpReq('GET', `${localBase}/api/student/profile`, null, {
      'Authorization': 'Bearer bad_token_here'
    });
    if (res.statusCode !== 403) throw new Error(`Expected 403, got ${res.statusCode}`);
  });

  // 3. Routing schema checks (Profile endpoint)
  await runTest('Student Profile: Valid token schema check', async () => {
    const res = await httpReq('GET', `${localBase}/api/student/profile`, null, {
      'Authorization': `Bearer ${studentToken}`
    });
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    const json = JSON.parse(res.body);
    if (!json.user || !json.user.email) throw new Error('Expected profile object with user.email property');
  });

  // 4. Simulated Database Failure handling
  await runTest('Error Handling: DB failure triggers 500 server error', async () => {
    const res = await httpReq('GET', `${localBase}/api/student/profile`, null, {
      'Authorization': `Bearer ${studentToken}`,
      'x-test-trigger-db-fail': 'true'
    });
    if (res.statusCode !== 500) throw new Error(`Expected 500, got ${res.statusCode}: ${res.body}`);
    const json = JSON.parse(res.body);
    if (!json.message) throw new Error('Unexpected error schema structure: missing message');
  });

  return results;
}

module.exports = { run };
