// Dashboard Shared Utilities
const Utils = {
  isProductionDomain() {
    return window.location.hostname === 'www.zazele.online' || window.location.hostname === 'zazele.online';
  },

  getApiBase() {
    if (this.isProductionDomain()) {
      return 'https://api.zazele.online/api';
    }
    if (typeof window !== 'undefined' && window.env && window.env.VITE_API_URL) {
      return window.env.VITE_API_URL;
    }
    return 'https://api.zazele.online/api';
  },

  getUploadBase() {
    if (this.isProductionDomain()) {
      return 'https://api.zazele.online/uploads';
    }
    if (typeof window !== 'undefined' && window.env && window.env.VITE_UPLOAD_URL) {
      return window.env.VITE_UPLOAD_URL;
    }
    return 'https://api.zazele.online/uploads';
  },

  checkProductionSanity() {
    if (this.isProductionDomain()) {
      const url = (window.env?.VITE_API_URL || '').toLowerCase();
      const uploadUrl = (window.env?.VITE_UPLOAD_URL || '').toLowerCase();
      if (url.includes('localhost') || url.includes('127.0.0.1') || uploadUrl.includes('localhost') || uploadUrl.includes('127.0.0.1')) {
        return {
          valid: false,
          error: 'Localhost endpoint detected on production environment configuration'
        };
      }
    }
    return { valid: true };
  },

  // Perform a test request tracking latency and errors
  async testEndpoint(method, url, body = null, headers = {}) {
    const start = Date.now();
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : null
      });
      const latency = Date.now() - start;
      let errorMsg = '';
      if (!response.ok) {
        errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      }
      return {
        ok: response.ok,
        status: response.status,
        latency,
        error: errorMsg
      };
    } catch (err) {
      return {
        ok: false,
        status: 0,
        latency: Date.now() - start,
        error: err.message || 'Connection Error'
      };
    }
  },

  // Format Node.js Process Uptime
  formatUptime(seconds) {
    if (seconds === undefined || seconds === null || isNaN(seconds)) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  },

  // Format Bytes (e.g. RSS memory)
  formatBytes(bytes) {
    if (bytes === 0 || !bytes) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  // Apply visual error classes and recommendation text to standard elements
  highlightAlert(cardId, errorText, recommendationText = '') {
    const el = document.getElementById(cardId);
    if (!el) return;
    
    // Add visual failure classes
    el.classList.add('alert-failure');
    el.classList.remove('alert-warning', 'alert-success');
    
    // Set status info if fields exist
    const desc = el.querySelector('.alert-desc') || el.querySelector('p');
    if (desc) {
      desc.innerHTML = `<span style="color: var(--danger); font-weight: 600;">Error: ${errorText}</span>${recommendationText ? `<br><small style="margin-top: 4px; display:block; color: var(--text-soft);">${recommendationText}</small>` : ''}`;
    }
  },

  // Clear alert styling on card
  clearAlert(cardId) {
    const el = document.getElementById(cardId);
    if (!el) return;
    el.classList.remove('alert-failure', 'alert-warning');
  }
};
