// Local/Production environment auto-detection.
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
