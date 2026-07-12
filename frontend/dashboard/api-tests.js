// Dashboard API Endpoints Validation Module
const ApiTestsModule = {
  // Static fallback configurations in case backend config fails to load
  fallbackConfig: [
    { name: "Health status check", method: "GET", path: "/api/health", expected: [200] },
    { name: "Login validator check", method: "POST", path: "/api/auth/login", expected: [200, 400] },
    { name: "Registration constraints check", method: "POST", path: "/api/auth/register", expected: [400] },
    { name: "Student Profile information", method: "GET", path: "/api/student/profile", expected: [200, 401] },
    { name: "Admin Profile Update Requests", method: "GET", path: "/api/admin/profile-update-requests", expected: [200, 401] },
    { name: "Notifications listings", method: "GET", path: "/api/notifications", expected: [200, 401] },
    { name: "Courses modules directory", method: "GET", path: "/api/courses/modules", expected: [200] },
    { name: "Upcoming Events listings", method: "GET", path: "/api/events/upcoming", expected: [200] },
    { name: "Uploads logo resource check", method: "GET", path: "/assets/logo.png", expected: [200] }
  ],

  // Test and render status for every critical endpoint according to config expectations
  async runAllApiTests() {
    const apiBase = Utils.getApiBase();
    const token = localStorage.getItem('zazele_token') || '';
    
    let endpoints = [];
    try {
      const res = await fetch(`${apiBase}/qa/config`);
      if (res.ok) {
        endpoints = await res.json();
      } else {
        throw new Error('Config endpoint returned non-200');
      }
    } catch (e) {
      console.warn('Using static fallback qa-endpoints list:', e.message);
      endpoints = this.fallbackConfig;
    }

    const tbody = document.getElementById('api-validation-tbody');
    if (!tbody) return;
    tbody.innerHTML = ''; // Clear validation grid

    // Perform validation checks sequentially
    for (let i = 0; i < endpoints.length; i++) {
      const ep = endpoints[i];
      const epId = `api-test-${i}`;
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 500;">${ep.name}</td>
        <td id="${epId}-status"><span class="badge" style="background-color: var(--text-soft); color: #fff;">Testing...</span></td>
        <td id="${epId}-http">-</td>
        <td id="${epId}-latency">-</td>
        <td id="${epId}-error">-</td>
      `;
      tbody.appendChild(tr);

      // Construct request configuration
      const targetUrl = ep.path.startsWith('/api') 
        ? (apiBase.replace(/\/api$/, '') + ep.path) 
        : (window.location.origin + ep.path);
        
      const body = ep.method === 'POST' ? {} : null;
      const headers = {};
      
      // Pass token if exists and endpoint is authenticated
      if (token && ep.expected.includes(401)) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Execute endpoint test
      const res = await Utils.testEndpoint(ep.method, targetUrl, body, headers);
      
      const statusCell = document.getElementById(`${epId}-status`);
      const httpCell = document.getElementById(`${epId}-http`);
      const latencyCell = document.getElementById(`${epId}-latency`);
      const errorCell = document.getElementById(`${epId}-error`);

      // Determine verification verdict
      const isExpected = ep.expected.includes(res.status);
      const isPass = isExpected && res.status !== 0;

      // Status labels & visual parameters
      let badgeClass = isPass ? 'badge-pass' : 'badge-fail';
      let statusText = isPass ? 'PASS' : 'FAIL';
      
      statusCell.innerHTML = `<span class="badge ${badgeClass}">${statusText}</span>`;
      httpCell.innerText = res.status || 'N/A';
      latencyCell.innerText = `${res.latency} ms`;

      // Friendly explanation details
      let explanation = '';
      if (isPass) {
        if (res.status === 401) {
          explanation = 'Authentication correctly enforced by server middleware.';
        } else if (res.status === 400 && ep.path.includes('login')) {
          explanation = 'Login endpoint correctly rejected invalid payload validation.';
        } else if (res.status === 400 && ep.path.includes('register')) {
          explanation = 'Registration correctly rejected incomplete request.';
        } else if (res.status === 403) {
          explanation = 'Permissions mapping authorization correctly enforced.';
        } else {
          explanation = 'Endpoint resolved successfully (OK).';
        }
        errorCell.style.color = 'var(--success)';
      } else {
        if (res.status === 500) {
          explanation = 'Internal Server Error (backend crash or Mongo exception).';
        } else if (res.status === 404) {
          explanation = 'Endpoint route does not exist.';
        } else if (res.status === 0 || res.error.includes('Failed to fetch')) {
          explanation = 'Unable to reach production backend / Network Timeout.';
        } else {
          explanation = `Expected HTTP [${ep.expected.join('/')}], got ${res.status}. ${res.error || ''}`;
        }
        errorCell.style.color = 'var(--danger)';
      }
      errorCell.innerText = explanation;
    }
  }
};
