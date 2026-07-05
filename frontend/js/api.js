// Local storage keys
const STORAGE_KEYS = {
  TOKEN: 'zazele_token',
  USER: 'zazele_user',
};

const getApiBaseUrl = () => {
  if (window.location.protocol === 'file:') {
    return 'http://localhost:5000/api';
  }
  const isDevPort = ['8000', '8080', '5500', '3000'].includes(window.location.port);
  const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname) ||
                      window.location.hostname.startsWith('192.168.') ||
                      window.location.hostname.startsWith('10.') ||
                      window.location.hostname.startsWith('172.') ||
                      window.location.hostname.endsWith('.local');
  if (isDevPort && isLocalHost) {
    return `http://${window.location.hostname}:5000/api`;
  }
  return `${window.location.origin}/api`;
};

const getUploadBaseUrl = () => {
  if (window.location.protocol === 'file:') {
    return 'http://localhost:5000/uploads';
  }
  const isDevPort = ['8000', '8080', '5500', '3000'].includes(window.location.port);
  const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname) ||
                      window.location.hostname.startsWith('192.168.') ||
                      window.location.hostname.startsWith('10.') ||
                      window.location.hostname.startsWith('172.') ||
                      window.location.hostname.endsWith('.local');
  if (isDevPort && isLocalHost) {
    return `http://${window.location.hostname}:5000/uploads`;
  }
  return `${window.location.origin}/uploads`;
};

const API_BASE_URL = getApiBaseUrl();
const UPLOAD_BASE_URL = getUploadBaseUrl();

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
