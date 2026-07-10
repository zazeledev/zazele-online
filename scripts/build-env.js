const fs = require('fs');
const path = require('path');

const envJsPath = path.join(__dirname, '../frontend/js/env.js');

const viteApiUrl = process.env.VITE_API_URL || '';
const viteUploadUrl = process.env.VITE_UPLOAD_URL || '';

console.log('[Build Env] Checking build-time environment variables...');
console.log(`[Build Env] VITE_API_URL: ${viteApiUrl ? 'Found' : 'Not set'}`);
console.log(`[Build Env] VITE_UPLOAD_URL: ${viteUploadUrl ? 'Found' : 'Not set'}`);

let content = '';

if (viteApiUrl || viteUploadUrl) {
  console.log('[Build Env] Generating env.js with build-time environment variables.');
  content = `// Generated at build time by scripts/build-env.js
window.env = {
  VITE_API_URL: ${viteApiUrl ? `'${viteApiUrl}'` : 'undefined'},
  VITE_UPLOAD_URL: ${viteUploadUrl ? `'${viteUploadUrl}'` : 'undefined'}
};
`;
} else {
  console.log('[Build Env] No build-time variables found. Using dynamic auto-detection fallback.');
  content = `// Local/Production environment auto-detection.
// In production, the static file is served by Vercel and detects the environment dynamically.
(function() {
  const isLocal = typeof window !== 'undefined' && (
    ['localhost', '127.0.0.1', '[::1]', '0.0.0.0'].includes(window.location.hostname) ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(window.location.hostname) ||
    window.location.hostname.endsWith('.local') ||
    window.location.protocol === 'file:'
  );

  window.env = {
    VITE_API_URL: isLocal ? 'http://localhost:5000/api' : 'https://api.zazele.online/api',
    VITE_UPLOAD_URL: isLocal ? 'http://localhost:5000/uploads' : 'https://api.zazele.online/uploads'
  };
})();
`;
}

fs.writeFileSync(envJsPath, content);
console.log('[Build Env] env.js successfully updated.');
