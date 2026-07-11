const fs = require('fs');
const path = require('path');
const http = require('http');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      resolve({ statusCode: res.statusCode, headers: res.headers });
    }).on('error', reject);
  });
}

async function run(testPort = 5001) {
  const localBase = `http://localhost:${testPort}`;
  const results = [];
  const addResult = (name, status, message = '') => {
    results.push({ name, status, message });
  };

  const runTest = async (name, testFn) => {
    try {
      await testFn();
      addResult(name, 'PASS');
    } catch (e) {
      addResult(name, 'FAIL', e.message);
    }
  };

  // 1. Helmet checks (verify security headers)
  await runTest('Helmet middleware active', async () => {
    const res = await httpGet(`${localBase}/index.html`);
    // Helmet headers
    const helmetHeaders = [
      'x-dns-prefetch-control',
      'x-frame-options',
      'x-content-type-options',
      'x-download-options',
      'x-permitted-cross-domain-policies'
    ];
    const present = helmetHeaders.filter(h => res.headers[h]);
    if (present.length === 0) {
      throw new Error('No Helmet security headers detected on responses');
    }
  });

  // 2. CORS configuration check (no open wildcards with credentials)
  await runTest('CORS security headers configured correctly', async () => {
    const res = await httpGet(`${localBase}/api/health`);
    const allowOrigin = res.headers['access-control-allow-origin'];
    const allowCredentials = res.headers['access-control-allow-credentials'];
    
    if (allowOrigin === '*' && allowCredentials === 'true') {
      throw new Error('Insecure CORS: Access-Control-Allow-Origin is "*" while Access-Control-Allow-Credentials is true');
    }
  });

  // 3. JWT Secret existence & strength
  await runTest('JWT Secret strong & loaded', async () => {
    // Read backend dotenv config directly for verification
    const envPath = path.resolve(__dirname, '../../backend/.env');
    if (!fs.existsSync(envPath)) throw new Error('Backend .env file not found');
    
    const content = fs.readFileSync(envPath, 'utf8');
    const secretMatch = content.match(/^JWT_SECRET=(.+)$/m);
    if (!secretMatch || !secretMatch[1]) throw new Error('JWT_SECRET is missing from .env');
    
    const secret = secretMatch[1].trim();
    if (secret.length < 32) throw new Error('JWT_SECRET is weak (must be at least 32 characters long)');
  });

  // 4. Mongo URI configuration check
  await runTest('MongoDB URI configured', async () => {
    const envPath = path.resolve(__dirname, '../../backend/.env');
    const content = fs.readFileSync(envPath, 'utf8');
    const uriMatch = content.match(/^MONGODB_URI=(.+)$/m);
    if (!uriMatch || !uriMatch[1].trim()) throw new Error('MONGODB_URI is not set in backend .env');
  });

  // 5. Environment variables fully loaded (backend check)
  await runTest('Core backend env variables present', async () => {
    const envPath = path.resolve(__dirname, '../../backend/.env');
    const content = fs.readFileSync(envPath, 'utf8');
    
    const requiredVars = ['PORT', 'JWT_SECRET', 'MONGODB_URI', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_HOST', 'EMAIL_PORT'];
    const missing = [];
    requiredVars.forEach(v => {
      const regex = new RegExp(`^${v}=(.+)$`, 'm');
      if (!regex.test(content)) {
        missing.push(v);
      }
    });

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables in backend .env: ${missing.join(', ')}`);
    }
  });

  // 6. Sensitive files not exposed publicly (checking static file routes)
  await runTest('Sensitive files not exposed', async () => {
    const dotenvCheck = await httpGet(`${localBase}/.env`);
    const packageCheck = await httpGet(`${localBase}/package.json`);
    
    if (dotenvCheck.statusCode === 200) throw new Error('Security flaw: backend .env file exposed publicly');
    if (packageCheck.statusCode === 200) throw new Error('Security flaw: backend package.json exposed publicly');
  });

  // 7. Check if .env is ignored in git
  await runTest('.env listed in gitignore', async () => {
    const gitignorePath = path.resolve(__dirname, '../../.gitignore');
    if (!fs.existsSync(gitignorePath)) throw new Error('.gitignore file not found');
    
    const content = fs.readFileSync(gitignorePath, 'utf8');
    if (!content.includes('.env')) {
      throw new Error('Security risk: .env is not ignored in .gitignore');
    }
  });

  return results;
}

module.exports = { run };
