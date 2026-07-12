// Dashboard Failure Assistant Utility
const FailureAssistant = {
  dictionary: {
    'MongoDB': {
      reason: 'Database connectivity offline',
      cause: 'MongoDB Atlas service interruption, network whitelist block, or missing environment credentials.',
      fix: 'Log into MongoDB Atlas, verify your cluster status is active, and ensure that backend server IPs (e.g. cPanel outbound gateway) are whitelisted.'
    },
    'Uploads': {
      reason: 'Uploads directory is read-only',
      cause: 'Incorrect server permissions or owner mismatch on the backend filesystem.',
      fix: 'Verify the write permissions of the "/backend/uploads" directory on cPanel (should be 755 or 775) and confirm that the Node app process owns the directory.'
    },
    'Endpoint GET /api/health': {
      reason: 'Backend API health checks crashed',
      cause: 'Node application process is offline, crashed at startup, or Helmet/CORS middleware blocked access.',
      fix: 'Log in to cPanel Node.js Selector, restart the application, and review backend stderr logs for startup crashes.'
    },
    'Endpoint GET /api/student/profile': {
      reason: 'Student profile access denied',
      cause: 'Authorization JWT token is missing, expired, or structural signature is invalid.',
      fix: 'Log in again via the student portal page to establish a fresh, verified authentication token.'
    },
    'Endpoint GET /api/admin/profile-update-requests': {
      reason: 'Admin access authorization failed',
      cause: 'The active user session does not hold "admin" privilege credentials.',
      fix: 'Log out and re-authenticate using the credentials of a registered administrator account.'
    },
    'SSL': {
      reason: 'SSL/TLS Certificate authority mismatch',
      cause: 'SSL certificate is expired, self-signed, or server hostname binding is incorrect.',
      fix: 'Renew or reconfigure TLS/SSL credentials inside cPanel under SSL/TLS Status.'
    },
    'No localhost references': {
      reason: 'Hardcoded local endpoints found in script files',
      cause: 'The codebase contains hardcoded "http://localhost:5000" or similar URL strings inside static JS assets.',
      fix: 'Search the frontend files and replace hardcoded local hosts with window.env.VITE_API_URL or getApiBaseUrl().'
    }
  },

  getAssistance(testName, errorMessage = '') {
    const key = Object.keys(this.dictionary).find(k => testName.includes(k));
    if (key) {
      return this.dictionary[key];
    }
    return {
      reason: 'Validation check failed',
      cause: errorMessage || 'Server did not respond with successful code sequence.',
      fix: 'Check server logs for detailed error stack traces and inspect active route definitions.'
    };
  }
};
