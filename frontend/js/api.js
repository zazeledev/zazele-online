// Local storage keys
const STORAGE_KEYS = {
  TOKEN: 'zazele_token',
  USER: 'zazele_user',
};

// Local Host validation helper
const isLocalHostAddress = (hostname) => {
  return ['localhost', '127.0.0.1', '[::1]', '0.0.0.0'].includes(hostname) || 
         hostname.startsWith('192.168.') ||
         hostname.startsWith('10.') ||
         /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
         hostname.endsWith('.local');
};

const getApiBaseUrl = () => {
  // 1. Vercel runtime/bundler environment variables (build time replacement if it exists)
  try {
    if (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) {
      return process.env.VITE_API_URL;
    }
  } catch (e) {}
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
  } catch (e) {}

  // 2. window.env (from env.js)
  if (typeof window !== 'undefined' && window.env && window.env.VITE_API_URL) {
    const hostname = window.location.hostname;
    const isProdHost = hostname && !isLocalHostAddress(hostname);
    const targetUrl = window.env.VITE_API_URL;
    
    // Safety guard: Prevent localhost URLs from ever being selected on production domain
    if (isProdHost && (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1'))) {
      console.warn('[API] Blocked local API URL on production domain. Falling back to production API.');
      return 'https://api.zazele.online/api';
    }
    return targetUrl;
  }

  // 3. Safe production fallback
  return 'https://api.zazele.online/api';
};

const getUploadBaseUrl = () => {
  // 1. Vercel runtime/bundler environment variables
  try {
    if (typeof process !== 'undefined' && process.env && process.env.VITE_UPLOAD_URL) {
      return process.env.VITE_UPLOAD_URL;
    }
  } catch (e) {}
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_UPLOAD_URL) {
      return import.meta.env.VITE_UPLOAD_URL;
    }
  } catch (e) {}

  // 2. window.env (from env.js)
  if (typeof window !== 'undefined' && window.env && window.env.VITE_UPLOAD_URL) {
    const hostname = window.location.hostname;
    const isProdHost = hostname && !isLocalHostAddress(hostname);
    const targetUrl = window.env.VITE_UPLOAD_URL;
    
    // Safety guard: Prevent localhost URLs from ever being selected on production domain
    if (isProdHost && (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1'))) {
      console.warn('[API] Blocked local upload URL on production domain. Falling back to production uploads.');
      return 'https://api.zazele.online/uploads';
    }
    return targetUrl;
  }

  // 3. Safe production fallback
  return 'https://api.zazele.online/uploads';
};

const API_BASE_URL = getApiBaseUrl();
const UPLOAD_BASE_URL = getUploadBaseUrl();

// Intercept global fetch to improve network error reporting (friendly offline message instead of raw Failed to fetch)
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  try {
    return await originalFetch.apply(this, args);
  } catch (error) {
    if (error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('fetch') || error.message.includes('NetworkError'))) {
      throw new Error('Unable to connect to the learning server. Please check your internet connection and try again.');
    }
    throw error;
  }
};

// UI Offline Banner Injection
const showBackendOfflineBanner = () => {
  if (document.getElementById('backend-offline-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'backend-offline-banner';
  
  // Custom styles for high-fidelity Google-red premium offline alert
  Object.assign(banner.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    backgroundColor: '#ea4335',
    color: '#ffffff',
    textAlign: 'center',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: '100000',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    boxSizing: 'border-box'
  });

  banner.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
    <span><strong>System Offline:</strong> We are unable to connect to the learning servers. Please check your internet connection and try again.</span>
    <button onclick="window.location.reload()" style="background: rgba(255,255,255,0.25); border: none; color: white; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600; margin-left: 10px; transition: background 0.2s;">Retry</button>
  `;

  // Push container elements down if they exist
  document.body.style.marginTop = '45px';
  document.body.insertBefore(banner, document.body.firstChild);
};

// Startup health check & Deployment check utility
const runStartupValidation = async () => {
  const hostname = window.location.hostname || 'Local File';
  const isLocal = isLocalHostAddress(hostname) || window.location.protocol === 'file:';
  const environmentLabel = isLocal ? 'Development' : 'Production';
  
  // Log startup using requested format
  if (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')) {
    console.log(`[API] Using Local API: ${API_BASE_URL}`);
  } else {
    console.log(`[API] Using Production API: ${API_BASE_URL}`);
  }

  let healthStatus = 'PENDING';
  try {
    const response = await originalFetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      healthStatus = 'OK';
    } else {
      healthStatus = `UNHEALTHY (Status: ${response.status})`;
      showBackendOfflineBanner();
    }
  } catch (error) {
    healthStatus = 'UNAVAILABLE';
    showBackendOfflineBanner();
  }

  // Print Deployment Check console report
  console.log(`
----------------------------------------
Zazele Online Deployment Check
----------------------------------------
Environment : ${environmentLabel}
Hostname    : ${hostname}
API         : ${API_BASE_URL}
Uploads     : ${UPLOAD_BASE_URL}
Health      : ${healthStatus}
----------------------------------------
  `.trim());
};

// Start validation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runStartupValidation);
} else {
  runStartupValidation();
}

// Auth API Calls
const AuthAPI = {
  register: async (data) => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('country', data.country);
    formData.append('province', data.province);
    formData.append('password', data.password);
    formData.append('contactNumber', data.contactNumber);
    if (data.idDocument) formData.append('idDocument', data.idDocument);
    if (data.paymentProof) formData.append('paymentProof', data.paymentProof);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return await response.json();
  },

  resetPassword: async (email, token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, newPassword }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Reset failed');
    }
    return await response.json();
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/student/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  },

  requestProfileUpdate: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/student/profile-update-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return await response.json();
  },
};

// Student API Calls
const StudentAPI = {
  getCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses/modules`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return await response.json();
  },

  getModuleWithLessons: async (moduleId) => {
    const response = await fetch(`${API_BASE_URL}/courses/modules/${moduleId}`);
    if (!response.ok) throw new Error('Failed to fetch module');
    return await response.json();
  },

  getLesson: async (lessonId) => {
    const response = await fetch(`${API_BASE_URL}/courses/lessons/${lessonId}`);
    if (!response.ok) throw new Error('Failed to fetch lesson');
    return await response.json();
  },

  getModuleLessonsWithStatus: async (moduleId, token) => {
    const response = await fetch(`${API_BASE_URL}/student/module/${moduleId}/lessons`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch lessons (${response.status})`);
    }
    return await response.json();
  },

  completeLesson: async (moduleId, lessonId, timeSpent, token) => {
    const response = await fetch(`${API_BASE_URL}/student/module/${moduleId}/lesson/${lessonId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ timeSpent }),
    });
    if (!response.ok) throw new Error('Failed to complete lesson');
    return await response.json();
  },

  skipToNextLesson: async (moduleId, lessonId, token) => {
    const response = await fetch(`${API_BASE_URL}/student/module/${moduleId}/lesson/${lessonId}/skip-next`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to skip to next lesson');
    return await response.json();
  },

  getProgressDashboard: async (token) => {
    const response = await fetch(`${API_BASE_URL}/student/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch progress (${response.status})`);
    }
    return await response.json();
  },

  createSupportRequest: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/student/support-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit support request');
    }
    return await response.json();
  },

  getSupportRequests: async (token) => {
    const response = await fetch(`${API_BASE_URL}/student/support-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch support requests');
    return await response.json();
  },
};

// Assignment API Calls
const AssignmentAPI = {
  getAssignment: async (moduleId, token) => {
    const response = await fetch(`${API_BASE_URL}/assignment/module/${moduleId}/assignment`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get assignment');
    }
    return await response.json();
  },

  saveAnswer: async (assignmentId, questionId, selectedAnswer, token) => {
    const response = await fetch(`${API_BASE_URL}/assignment/assignment/${assignmentId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questionId, selectedAnswer }),
    });
    if (!response.ok) throw new Error('Failed to save answer');
    return await response.json();
  },

  submitAssignment: async (assignmentId, token) => {
    const response = await fetch(`${API_BASE_URL}/assignment/assignment/${assignmentId}/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to submit assignment');
    return await response.json();
  },

  retakeAssignment: async (moduleId, token) => {
    const response = await fetch(`${API_BASE_URL}/assignment/module/${moduleId}/retake-assignment`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to retake assignment');
    return await response.json();
  },

  getResults: async (assignmentId, token) => {
    const response = await fetch(`${API_BASE_URL}/assignment/assignment/${assignmentId}/results`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to get assignment results');
    return await response.json();
  },

  checkStatus: async (moduleId, token) => {
    const response = await fetch(`${API_BASE_URL}/assignment/module/${moduleId}/assignment-status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to check assignment status');
    return await response.json();
  },
};

// Admin API Calls
const AdminAPI = {
  getUsers: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  },

  getArchivedUsers: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/archived`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch archived users');
    return await response.json();
  },

  updateUserStatus: async (token, userId, status) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update user status');
    return await response.json();
  },

  updateUser: async (token, userId, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }
    return await response.json();
  },

  async getUserProgress(token, userId) {
    const url = `${API_BASE_URL}/admin/progress-report/${userId}`;
    console.log(`[API] Fetching progress from: ${url}`);
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch user progress (${response.status})`);
    }
    return await response.json();
  },

  resetUserProgress: async (token, userId, moduleId) => {
    const url = `${API_BASE_URL}/admin/reset-progress/${userId}/${moduleId}`;
    console.log(`[API] Resetting progress at: ${url}`);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Reset failed: ${response.status} - ${errorText}`);
      let message = 'Failed to reset progress';
      try {
        const errorJson = JSON.parse(errorText);
        message = errorJson.message || message;
      } catch (e) {}
      throw new Error(message);
    }
    return await response.json();
  },

  approveUser: async (token, userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to approve user');
    return await response.json();
  },

  verifyID: async (token, userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/verify-id`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to verify ID');
    return await response.json();
  },

  verifyPayment: async (token, userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/verify-payment`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to verify payment');
    return await response.json();
  },

  getStats: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  },

  // Module management
  getModules: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/modules`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch modules');
    return await response.json();
  },

  getModuleWithLessons: async (token, moduleId) => {
    const response = await fetch(`${API_BASE_URL}/admin/modules/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch module');
    return await response.json();
  },

  createModule: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create module');
    }
    return await response.json();
  },

  updateModule: async (token, moduleId, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/modules/${moduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update module');
    return await response.json();
  },

  deleteModule: async (token, moduleId) => {
    const response = await fetch(`${API_BASE_URL}/admin/modules/${moduleId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete module');
    return await response.json();
  },

  createLesson: async (token, data) => {
    const formData = new FormData();
    formData.append('moduleId', data.moduleId);
    formData.append('title', data.title);
    formData.append('youtubeURL', data.youtubeURL || '');
    formData.append('description', data.description || '');
    formData.append('order', data.order);
    if (data.notes) formData.append('notes', data.notes);

    const response = await fetch(`${API_BASE_URL}/admin/lessons`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create lesson');
    return await response.json();
  },

  createLessonWithFile: async (token, data, notesFile) => {
    const formData = new FormData();
    formData.append('moduleId', data.moduleId);
    formData.append('title', data.title);
    formData.append('youtubeURL', data.youtubeURL || '');
    formData.append('description', data.description || '');
    formData.append('order', data.order);
    if (notesFile) formData.append('notes', notesFile);

    const response = await fetch(`${API_BASE_URL}/admin/lessons`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create lesson');
    }
    return await response.json();
  },

  updateLesson: async (token, lessonId, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/lessons/${lessonId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update lesson');
    return await response.json();
  },

  updateLessonWithFile: async (token, lessonId, data, notesFile) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('youtubeURL', data.youtubeURL || '');
    formData.append('description', data.description || '');
    formData.append('order', data.order);
    if (notesFile) formData.append('notes', notesFile);

    const response = await fetch(`${API_BASE_URL}/admin/lessons/${lessonId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update lesson');
    }
    return await response.json();
  },

  deleteLesson: async (token, lessonId) => {
    const response = await fetch(`${API_BASE_URL}/admin/lessons/${lessonId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete lesson');
    return await response.json();
  },

  createAssignmentQuestions: async (token, questions) => {
    const response = await fetch(`${API_BASE_URL}/admin/assignment-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questions }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create assignment questions');
    }
    return await response.json();
  },

  getProfileUpdateRequests: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/profile-update-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch profile update requests');
    return await response.json();
  },

  handleProfileUpdateRequest: async (token, requestId, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/profile-update-requests/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to handle profile update request');
    return await response.json();
  },

  getAssignmentQuestions: async (token, moduleId) => {
    const response = await fetch(`${API_BASE_URL}/admin/module-questions/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      let errorMessage = `Failed to fetch assignment questions for module ${moduleId} (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage += `: ${errorData.message}`;
      } catch (e) {}
      throw new Error(errorMessage);
    }
    return await response.json();
  },

  getSupportRequests: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/support-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch support requests');
    return await response.json();
  },

  updateSupportRequest: async (token, requestId, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/support-requests/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update support request');
    return await response.json();
  },
};

// Notification API Calls
const NotificationAPI = {
  getNotifications: async (token) => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return await response.json();
  },

  getUnreadCount: async (token) => {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch unread count');
    return await response.json();
  },

  markAsRead: async (token, notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return await response.json();
  },

  markAllAsRead: async (token) => {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to mark all as read');
    return await response.json();
  },
};

// Event API Calls
const EventAPI = {
  getUpcomingEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/events/upcoming`);
    if (!response.ok) throw new Error('Failed to fetch upcoming events');
    return await response.json();
  },

  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/events/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return await response.json();
  },

  // Admin methods
  getAllEvents: async (token) => {
    const response = await fetch(`${API_BASE_URL}/events/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
  },

  createEvent: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/events/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return await response.json();
  },

  getRegistrations: async (token, eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch registrations');
    return await response.json();
  },

  sendLinks: async (token, eventId, registrationIds) => {
    const response = await fetch(`${API_BASE_URL}/events/send-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId, registrationIds }),
    });
    if (!response.ok) throw new Error('Failed to send links');
    return await response.json();
  },

  archiveEvent: async (token, eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/archive`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to archive event');
    return await response.json();
  },
};

// Expose to global scope for non-module scripts
window.AuthAPI = AuthAPI;
window.StudentAPI = StudentAPI;
window.AssignmentAPI = AssignmentAPI;
window.AdminAPI = AdminAPI;
window.NotificationAPI = NotificationAPI;
window.EventAPI = EventAPI;
window.UPLOAD_BASE_URL = UPLOAD_BASE_URL;
