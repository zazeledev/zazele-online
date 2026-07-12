// Dashboard API Endpoints Validation Module
const ApiTestsModule = {
  // Test and render status for every critical endpoint
  async runAllApiTests() {
    const apiBase = Utils.getApiBase();
    const token = localStorage.getItem('zazele_token') || '';

    // List of critical endpoints to validate
    const endpoints = [
      { id: 'api-health', name: 'GET /api/health', method: 'GET', url: `${apiBase}/health` },
      { id: 'api-login', name: 'POST /api/auth/login', method: 'POST', url: `${apiBase}/auth/login`, body: {} },
      { id: 'api-register', name: 'POST /api/auth/register', method: 'POST', url: `${apiBase}/auth/register`, body: {} },
      { id: 'api-courses', name: 'GET /api/courses/modules', method: 'GET', url: `${apiBase}/courses/modules` },
      { id: 'api-events', name: 'GET /api/events/upcoming', method: 'GET', url: `${apiBase}/events/upcoming` },
      { id: 'api-notifications', name: 'GET /api/notifications', method: 'GET', url: `${apiBase}/notifications`, headers: { 'Authorization': `Bearer ${token}` } },
      { id: 'api-profile', name: 'GET /api/student/profile', method: 'GET', url: `${apiBase}/student/profile`, headers: { 'Authorization': `Bearer ${token}` } },
      { id: 'api-admin', name: 'GET /api/admin/profile-update-requests', method: 'GET', url: `${apiBase}/admin/profile-update-requests`, headers: { 'Authorization': `Bearer ${token}` } },
      { id: 'api-uploads', name: 'GET /uploads check', method: 'GET', url: window.location.origin + '/assets/logo.png' }
    ];

    const tbody = document.getElementById('api-validation-tbody');
    if (!tbody) return;
    tbody.innerHTML = ''; // Clear existing records

    // Perform validation checks sequentially
    for (const ep of endpoints) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 500;">${ep.name}</td>
        <td id="${ep.id}-status"><span class="badge" style="background-color: var(--text-soft); color: #fff;">Testing...</span></td>
        <td id="${ep.id}-http">-</td>
        <td id="${ep.id}-latency">-</td>
        <td id="${ep.id}-error" style="color: var(--danger); font-size: 0.85rem;">-</td>
      `;
      tbody.appendChild(tr);

      // Execute endpoint test
      const res = await Utils.testEndpoint(ep.method, ep.url, ep.body, ep.headers);
      
      const statusCell = document.getElementById(`${ep.id}-status`);
      const httpCell = document.getElementById(`${ep.id}-http`);
      const latencyCell = document.getElementById(`${ep.id}-latency`);
      const errorCell = document.getElementById(`${ep.id}-error`);

      // Fill values
      if (res.ok || res.status === 400 || res.status === 401 || res.status === 403) {
        // Status code is resolved (even if client fails with unauthorized auth codes, the route is active!)
        let isPass = true;
        let badgeClass = 'badge-pass';
        let statusText = 'PASS';
        
        // If it's a critical GET route and returned non-ok, or returned 0, mark FAIL
        if (res.status === 0 || (ep.method === 'GET' && !res.ok && res.status !== 401 && res.status !== 403)) {
          isPass = false;
          badgeClass = 'badge-fail';
          statusText = 'FAIL';
        }

        statusCell.innerHTML = `<span class="badge ${badgeClass}">${statusText}</span>`;
        httpCell.innerText = res.status;
        latencyCell.innerText = `${res.latency} ms`;
        
        if (isPass) {
          errorCell.innerText = 'None';
          errorCell.style.color = 'var(--success)';
        } else {
          errorCell.innerText = res.error || `HTTP ${res.status}`;
          errorCell.style.color = 'var(--danger)';
        }
      } else {
        // Direct route timeout or crashed
        statusCell.innerHTML = `<span class="badge badge-fail">FAIL</span>`;
        httpCell.innerText = res.status || 'N/A';
        latencyCell.innerText = `${res.latency} ms`;
        errorCell.innerText = res.error || 'Server Response Failed';
        errorCell.style.color = 'var(--danger)';
      }
    }
  }
};
