// Local development environment configuration fallback.
// In production, these properties are served dynamically by the backend from server environment variables.
window.env = {
  VITE_API_URL: 'http://localhost:5000/api',
  VITE_UPLOAD_URL: 'http://localhost:5000/uploads'
};
