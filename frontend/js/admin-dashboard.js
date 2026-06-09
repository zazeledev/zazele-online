// Admin Dashboard
let allUsers = [];
let archivedUsers = [];
let allModules = [];
let selectedUserId = null;
let isAdminInitialized = false;
let currentEventId = null;
let currentRegistrations = [];

// Use auth.js `getToken()` / `getUser()` and shared storage keys there.

// Load admin dashboard
async function loadAdminDashboard() {
  // Initialize navigation and forms IMMEDIATELY before loading data
  // This ensures tabs work even if data loading is slow or fails
  if (!isAdminInitialized) {
    try {
      initAdminNavigation();
      initModuleManagement();
      initAdminUserEditing();
      initEventManagement();
      initScheduleManagement();
      isAdminInitialized = true;
      console.log('Admin Dashboard initialized');
    } catch (initError) {
      console.error('Error during admin initialization:', initError);
    }
  }

  try {
    const user = getUser();
    const token = getToken();
    
    if (!token) {
      console.error('No authentication token found');
      const sections = ['users-list', 'archived-users-list', 'profile-requests-list', 'admin-support-requests-list', 'modules-management', 'admin-events-list'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<p class="error">Authentication error: No token found. Please log in again.</p>';
      });
      return;
    }
    
    if (!user) {
      console.error('No user data found');
      return;
    }
    
    const userNameEl = document.getElementById('admin-user-name');
    if (userNameEl) userNameEl.textContent = user.fullName;

    // Load data in parallel for efficiency
    await Promise.allSettled([
      loadAdminUsers(),
      loadArchivedUsers(),
      loadProfileUpdateRequests(),
      loadAdminModules(),
      loadAdminSupportSessions(),
      loadAdminEvents()
    ]);
  } catch (error) {
    console.error('Error loading admin dashboard data:', error);
  }
}

// Admin Navigation
function initAdminNavigation() {
  const navButtons = document.querySelectorAll('.admin-nav-item');

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const sectionName = btn.getAttribute('data-section');

      // Update active button
      navButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active section
      document.querySelectorAll('.admin-section').forEach((section) => {
        section.classList.remove('active');
      });

      const section = document.getElementById(`${sectionName}-section`);
      if (section) {
        section.classList.add('active');
      }

      // Reset view states (Detail vs List) when switching tabs
      resetAdminViewStates(sectionName);
    });
  });
}

function resetAdminViewStates(activeSection = null) {
  const uDetail = document.getElementById('user-detail');
  const uList = document.getElementById('users-list');
  const aList = document.getElementById('archived-users-list');
  const eDetail = document.getElementById('event-detail');
  const eList = document.getElementById('admin-events-list');

  // Hide all details
  if (uDetail) uDetail.style.display = 'none';
  if (eDetail) eDetail.style.display = 'none';

  // Restore lists based on active section
  if (activeSection === 'users' || !activeSection) {
    if (uList) uList.style.display = 'block';
  }
  if (activeSection === 'archive') {
    if (aList) aList.style.display = 'block';
  }
  if (activeSection === 'webinars') {
    if (eList) eList.style.display = 'block';
  }
}

// Load all users
async function loadAdminUsers() {
  try {
    const token = getToken();
    const container = document.getElementById('users-list');
    if (!token) {
      if (container) container.innerHTML = '<p class="error">Authentication required: please log in as an administrator.</p>';
      return;
    }
    allUsers = await AdminAPI.getUsers(token);
    renderUsersList();
  } catch (error) {
    console.error('Error loading users:', error);
    const el = document.getElementById('users-list');
    if (el) el.innerHTML = '<p class="error">Failed to load users: ' + error.message + '</p>';
  }
}

// Render users table
function renderUsersList() {
  const container = document.getElementById('users-list');
  if (!container) return;

  if (allUsers.length === 0) {
    container.innerHTML = '<p class="loading">No users found.</p>';
    return;
  }

  const html = `
    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>ID</th>
            <th>Payment</th>
            <th>Progress</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${allUsers
            .map(
              (u) => `
            <tr onclick="viewUserDetail('${u._id}')">
              <td>${u.fullName}</td>
              <td>${u.email}</td>
              <td><span class="status ${u.approved ? 'approved' : 'pending'}">${
                u.approved ? 'Approved' : 'Pending'
              }</span></td>
              <td><span class="status ${u.idVerified ? 'approved' : 'pending'}">${
                u.idVerified ? 'Verified' : 'Pending'
              }</span></td>
              <td><span class="status ${u.paymentVerified ? 'approved' : 'pending'}">${
                u.paymentVerified ? 'Verified' : 'Pending'
              }</span></td>
              <td style="text-align: center; font-size: 0.85rem;">
                ${u.progressSummary ? `
                  <span style="font-weight:600;">${u.progressSummary.modulesCompleted}</span>
                  <span style="color:var(--text-muted);">/ ${u.progressSummary.modulesStarted} Done</span>
                ` : '0/0'}
              </td>
              <td>
                <div style="display: flex; gap: 4px;">
                  <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); viewUserDetail('${u._id}')">View</button>
                  ${u.status === 'active' && u.approved ? `<button class="btn btn-success btn-small" onclick="event.stopPropagation(); markStudentCompleted('${u._id}')">Complete</button>` : ''}
                </div>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

// Load archived users
async function loadArchivedUsers() {
  try {
    const token = getToken();
    if (!token) return;
    archivedUsers = await AdminAPI.getArchivedUsers(token);
    renderArchivedUsersList();
  } catch (error) {
    console.error('Error loading archived users:', error);
    const el = document.getElementById('archived-users-list');
    if (el) el.innerHTML = '<p class="error">Failed to load archived users.</p>';
  }
}

// Render archived users table
function renderArchivedUsersList() {
  const container = document.getElementById('archived-users-list');
  if (!container) return;

  if (archivedUsers.length === 0) {
    container.innerHTML = '<p class="info">No archived/graduated students found.</p>';
    return;
  }

  const html = `
    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Graduation Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${archivedUsers
            .map(
              (u) => `
            <tr onclick="viewUserDetail('${u._id}')">
              <td>${u.fullName}</td>
              <td>${u.email}</td>
              <td><span class="status ${u.status === 'completed' ? 'approved' : 'pending'}">${u.status.toUpperCase()}</span></td>
              <td>${new Date(u.updatedAt).toLocaleDateString()}</td>
              <td>
                <div style="display: flex; gap: 4px;">
                  <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); viewUserDetail('${u._id}')">View</button>
                  ${u.status === 'active' && u.approved ? `<button class="btn btn-success btn-small" onclick="event.stopPropagation(); markStudentCompleted('${u._id}')">Complete</button>` : ''}
                </div>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

// Mark student as completed
async function markStudentCompleted(userId) {
  if (!confirm('Are you sure you want to mark this student as COMPLETED? This will move them to the Archive folder.')) {
    return;
  }

  try {
    const token = getToken();
    await AdminAPI.updateUserStatus(token, userId, 'completed');
    alert('Student marked as completed and moved to archive.');
    
    // Refresh lists and go back
    await loadAdminUsers();
    await loadArchivedUsers();
    const backBtn = document.getElementById('back-to-users');
    if (backBtn) backBtn.click();
  } catch (error) {
    alert('Error marking student as completed: ' + error.message);
  }
}

// Reactivate student
async function reactivateStudent(userId) {
  if (!confirm('Reactivate this student account? This will move them back to Active Learners.')) {
    return;
  }

  try {
    const token = getToken();
    await AdminAPI.updateUserStatus(token, userId, 'active');
    alert('Student reactivated.');
    
    // Refresh lists and go back
    await loadAdminUsers();
    await loadArchivedUsers();
    const backBtn = document.getElementById('back-to-users');
    if (backBtn) backBtn.click();
  } catch (error) {
    alert('Error reactivating student: ' + error.message);
  }
}

// View user details
async function viewUserDetail(userId) {
  selectedUserId = userId;
  // Search in both active and archived lists
  const user = allUsers.find((u) => u._id === userId) || archivedUsers.find((u) => u._id === userId);

  if (!user) return;

  // IMPORTANT: The detail view is INSIDE users-section. 
  // We must ensure the users-section is ACTIVE so the detail view can be seen.
  const usersTab = document.querySelector('.admin-nav-item[data-section="users"]');
  if (usersTab && !usersTab.classList.contains('active')) {
    usersTab.click();
  }

  // Hide lists, show detail
  const uList = document.getElementById('users-list');
  const aList = document.getElementById('archived-users-list');
  const uDetail = document.getElementById('user-detail');

  if (uList) uList.style.display = 'none';
  if (aList) aList.style.display = 'none';
  if (uDetail) uDetail.style.display = 'block';

  // Populate user info
  const fields = {
    'user-detail-name': user.fullName,
    'user-detail-email': user.email,
    'user-detail-country': user.country,
    'user-detail-province': user.province,
    'user-detail-contact': user.contactNumber,
    'user-detail-status': user.approved ? 'Approved' : 'Pending'
  };

  for (const [id, val] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '-';
  }

  const statusEl = document.getElementById('user-detail-status');
  if (statusEl) {
    statusEl.className = 'status ' + (user.approved ? 'approved' : 'pending');
  }

  // Update ID and Payment status indicators
  const idStatusEl = document.getElementById('id-status');
  if (idStatusEl) {
    idStatusEl.textContent = user.idVerified ? 'Verified' : 'Pending';
    idStatusEl.className = 'status-pill ' + (user.idVerified ? 'approved' : 'pending');
  }

  const paymentStatusEl = document.getElementById('payment-status');
  if (paymentStatusEl) {
    paymentStatusEl.textContent = user.paymentVerified ? 'Verified' : 'Pending';
    paymentStatusEl.className = 'status-pill ' + (user.paymentVerified ? 'approved' : 'pending');
  }

  // Populate documents
  const idDocLink = document.querySelector('#user-id-doc a');
  const paymentDocLink = document.querySelector('#user-payment-doc a');

  if (idDocLink) {
    if (user.idDocumentPath) {
      idDocLink.href = `${UPLOAD_BASE_URL}/${user.idDocumentPath}`;
      idDocLink.textContent = 'View ID Document';
    } else {
      idDocLink.textContent = 'No document uploaded';
      idDocLink.href = '#';
    }
  }

  if (paymentDocLink) {
    if (user.paymentProofPath) {
      paymentDocLink.href = `${UPLOAD_BASE_URL}/${user.paymentProofPath}`;
      paymentDocLink.textContent = 'View Payment Proof';
    } else {
      paymentDocLink.textContent = 'No document uploaded';
      paymentDocLink.href = '#';
    }
  }

  // Update action buttons
  updateUserActions(user);

  // Load student progress
  await loadStudentProgressDetail(userId);
}

// Load and display student progress detail in admin view
async function loadStudentProgressDetail(userId) {
  const container = document.getElementById('user-progress-detail');
  if (!container) return;

  console.log(`[Admin] Loading progress for user: ${userId}`);
  container.innerHTML = '<p class="loading">Loading student progress...</p>';

  try {
    const token = getToken();
    const progress = await AdminAPI.getUserProgress(token, userId);

    if (!progress || progress.length === 0) {
      container.innerHTML = '<p class="text-muted">No progress recorded yet.</p>';
      return;
    }

    let html = `
      <div class="admin-progress-container" style="margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 40px;">
        <h3 style="margin-bottom: 24px;">Academic Progress</h3>
        <div class="admin-progress-grid" style="display: flex; flex-direction: column; gap: 24px;">
    `;

    progress.forEach(module => {
      const hasAssignment = module.assignment;
      const statusClass = module.isCompleted ? 'success' : (module.status === 'in-progress' ? 'pending' : 'text-muted');
      
      html += `
        <div class="admin-module-progress-card" style="background: #f8f9fa; border-radius: 12px; padding: 24px; border-left: 6px solid ${module.isCompleted ? 'var(--success)' : (module.status === 'in-progress' ? 'var(--primary)' : '#ccc')};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h4 style="margin: 0;">${module.moduleName}</h4>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="status-pill ${statusClass}">${module.isCompleted ? 'Completed' : (module.status === 'in-progress' ? 'In Progress' : 'Not Started')}</span>
              <button class="btn btn-danger btn-tiny" onclick="resetProgress('${userId}', '${module.moduleId}', '${module.moduleName}')">Reset Progress</button>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div>
              <p style="margin-bottom: 8px; color: var(--text-muted); font-size: 0.85rem;">LESSON PROGRESS</p>
              <p style="font-weight: 600; font-size: 1.1rem;">${module.completedLessons} / ${module.totalLessons} Lessons</p>
              <p style="font-size: 0.9rem; color: var(--text-muted);">Currently on: Lesson ${module.currentLesson}</p>
            </div>
            
            <div>
              <p style="margin-bottom: 8px; color: var(--text-muted); font-size: 0.85rem;">ASSIGNMENT STATUS</p>
              ${hasAssignment ? `
                <p style="font-weight: 600; font-size: 1.1rem; color: ${module.assignment.passed ? 'var(--success)' : 'var(--danger)'};">
                  ${module.assignment.passed ? 'PASSED' : 'FAILED'} (${module.assignment.percentage}%)
                </p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Score: ${module.assignment.score} / ${module.assignment.totalQuestions}</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Retakes: ${module.assignment.retakeCount || 0}</p>
              ` : `
                <p style="font-weight: 600; font-size: 1.1rem; color: var(--text-muted);">NOT TAKEN</p>
              `}
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading user progress:', error);
    container.innerHTML = `<p class="error">Failed to load progress: ${error.message}</p>`;
  }
}

// Update available actions for user
function updateUserActions(user) {
  const reattach = (id, fn) => {
    const oldBtn = document.getElementById(id);
    if (oldBtn) {
      const newBtn = oldBtn.cloneNode(true);
      oldBtn.parentNode.replaceChild(newBtn, oldBtn);
      newBtn.addEventListener('click', fn);
    }
  };

  reattach('approve-btn', () => approveUserAccount(user._id));
  reattach('verify-id-btn', () => verifyUserID(user._id));
  reattach('verify-payment-btn', () => verifyUserPayment(user._id));
  reattach('admin-edit-user-btn', () => openAdminEditUserModal(user));

  // Hide/Show action boxes based on status
  const idAction = document.getElementById('id-verification-action');
  const paymentAction = document.getElementById('payment-verification-action');
  const approveAction = document.getElementById('approve-action');
  const verifiedMsg = document.getElementById('verified-message');

  if (idAction) idAction.style.display = user.idVerified ? 'none' : 'block';
  if (paymentAction) paymentAction.style.display = user.paymentVerified ? 'none' : 'block';
  
  // Only show approve button if both ID and Payment are verified, but account is NOT yet approved
  if (approveAction) {
    if (user.approved) {
      approveAction.style.display = 'none';
    } else {
      approveAction.style.display = 'block';
      const approveBtn = document.getElementById('approve-btn');
      if (approveBtn) {
        // Disable approve button if documents are not verified
        approveBtn.disabled = !(user.idVerified && user.paymentVerified);
        approveBtn.style.opacity = (user.idVerified && user.paymentVerified) ? '1' : '0.5';
        approveBtn.title = (user.idVerified && user.paymentVerified) ? 'Click to approve account' : 'You must verify ID and Payment before approving the account';
      }
    }
  }

  if (verifiedMsg) {
    verifiedMsg.style.display = user.approved ? 'block' : 'none';
  }

  // Handle "Mark as Completed" action box
  const markCompleteBtn = document.getElementById('admin-mark-complete-btn');
  if (markCompleteBtn) {
    const newBtn = markCompleteBtn.cloneNode(true);
    markCompleteBtn.parentNode.replaceChild(newBtn, markCompleteBtn);
    if (user.status === 'active' && user.approved) {
      newBtn.addEventListener('click', () => markStudentCompleted(user._id));
    }
  }

  // Add "Promote to Admin" button if user is a student
  const actionGroup = document.querySelector('.action-buttons-group');
  if (actionGroup) {
    const existing = document.getElementById('promote-admin-action');
    if (existing) existing.remove();

    if (user.role === 'student') {
      const promoteBox = document.createElement('div');
      promoteBox.id = 'promote-admin-action';
      promoteBox.className = 'action-box';
      promoteBox.style.marginTop = '20px';
      promoteBox.innerHTML = `
        <p class="action-hint">Grant full administrative privileges</p>
        <button id="promote-admin-btn" class="btn btn-secondary" style="width: 100%; border: 1px solid var(--danger); color: var(--danger);">Promote to Admin</button>
      `;
      actionGroup.appendChild(promoteBox);
      const promoteBtn = document.getElementById('promote-admin-btn');
      if (promoteBtn) promoteBtn.addEventListener('click', () => promoteToAdmin(user._id));
    }
  }
}

// Admin manual user edit
function openAdminEditUserModal(user) {
  const modal = document.getElementById('admin-edit-user-modal');
  if (!modal) return;

  const fields = {
    'admin-edit-fullname': user.fullName,
    'admin-edit-email': user.email,
    'admin-edit-contact': user.contactNumber,
    'admin-edit-country': user.country,
    'admin-edit-province': user.province
  };

  for (const [id, val] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }
  
  modal.classList.add('active');
}

function initAdminUserEditing() {
  const modal = document.getElementById('admin-edit-user-modal');
  const closeBtn = document.getElementById('close-admin-edit-modal');
  const form = document.getElementById('admin-edit-user-form');
  
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        fullName: document.getElementById('admin-edit-fullname').value,
        email: document.getElementById('admin-edit-email').value,
        contactNumber: document.getElementById('admin-edit-contact').value,
        country: document.getElementById('admin-edit-country').value,
        province: document.getElementById('admin-edit-province').value,
      };
      try {
        const token = getToken();
        await AdminAPI.updateUser(token, selectedUserId, data);
        alert('User updated successfully');
        modal.classList.remove('active');
        await loadAdminUsers();
        viewUserDetail(selectedUserId);
      } catch (error) {
        alert('Error updating user: ' + error.message);
      }
    });
  }
}

// Approve user account
async function approveUserAccount(userId) {
  try {
    const token = getToken();
    await AdminAPI.approveUser(token, userId);
    await loadAdminUsers();
    viewUserDetail(userId);
    alert('User account approved successfully');
  } catch (error) {
    alert('Error approving user: ' + error.message);
  }
}

// Verify user ID
async function verifyUserID(userId) {
  try {
    const token = getToken();
    await AdminAPI.verifyID(token, userId);
    await loadAdminUsers();
    viewUserDetail(userId);
    alert('ID verified successfully');
  } catch (error) {
    alert('Error verifying ID: ' + error.message);
  }
}

// Verify user payment
async function verifyUserPayment(userId) {
  try {
    const token = getToken();
    await AdminAPI.verifyPayment(token, userId);
    await loadAdminUsers();
    viewUserDetail(userId);
    alert('Payment verified successfully');
  } catch (error) {
    alert('Error verifying payment: ' + error.message);
  }
}

// Back to users list
function initBackToUsers() {
  const backBtn = document.getElementById('back-to-users');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      const uDetail = document.getElementById('user-detail');
      if (uDetail) uDetail.style.display = 'none';
      
      const activeNav = document.querySelector('.admin-nav-item.active');
      const sectionName = activeNav?.getAttribute('data-section');
      
      const uList = document.getElementById('users-list');
      const aList = document.getElementById('archived-users-list');

      if (sectionName === 'archive') {
        if (aList) aList.style.display = 'block';
        if (uList) uList.style.display = 'none';
      } else {
        if (uList) uList.style.display = 'block';
        if (aList) aList.style.display = 'none';
      }
    });
  }
}

// Module Management
function initModuleManagement() {
  const addBtn = document.getElementById('add-module-btn');
  const modal = document.getElementById('module-modal');
  const closeBtn = document.getElementById('close-module-modal');
  const form = document.getElementById('module-form');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const titleEl = document.getElementById('module-modal-title');
      if (titleEl) titleEl.textContent = 'Add Module';
      if (form) {
        form.reset();
        form.setAttribute('data-mode', 'create');
        form.removeAttribute('data-module-id');
      }
      if (modal) modal.classList.add('active');
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('module-title').value;
      const description = document.getElementById('module-description').value;
      const order = parseInt(document.getElementById('module-order').value);
      const mode = form.getAttribute('data-mode');
      try {
        const token = getToken();
        if (mode === 'create') {
          await AdminAPI.createModule(token, { title, description, order });
          alert('Module created successfully');
        } else {
          const moduleId = form.getAttribute('data-module-id');
          await AdminAPI.updateModule(token, moduleId, { title, description, order });
          alert('Module updated successfully');
        }
        modal.classList.remove('active');
        await loadAdminModules();
      } catch (error) {
        alert('Error saving module: ' + error.message);
      }
    });
  }
  initLessonManagement();
  initAssignmentManagement();
  initBackToUsers();
}

// Load admin modules
async function loadAdminModules() {
  try {
    const token = getToken();
    if (!token) return;
    const modulesResponse = await AdminAPI.getModules(token);
    allModules = await Promise.all(
      modulesResponse.map(async (m) => {
        try {
          return await AdminAPI.getModuleWithLessons(token, m._id);
        } catch (error) {
          return { ...m, lessons: [] };
        }
      })
    );
    renderModulesList();
  } catch (error) {
    const el = document.getElementById('modules-management');
    if (el) el.innerHTML = '<p class="error">Failed to load modules: ' + error.message + '</p>';
  }
}

// Render modules management
function renderModulesList() {
  const container = document.getElementById('modules-management');
  if (!container) return;

  if (allModules.length === 0) {
    container.innerHTML = '<p class="loading">No modules found.</p>';
    return;
  }

  container.innerHTML = allModules.map(module => `
    <div class="module-item collapsed" id="module-container-${module._id}">
      <div class="module-item-header" onclick="toggleModule('${module._id}')">
        <div class="module-info">
          <h3><span class="toggle-icon"></span> ${module.title}</h3>
          <p>${module.description}</p>
        </div>
        <div class="module-item-actions" onclick="event.stopPropagation()">
          <button class="btn btn-secondary btn-small" onclick="editModule('${module._id}')">Edit Module</button>
          <button class="btn btn-danger btn-small" onclick="deleteModule('${module._id}')">Delete Module</button>
        </div>
      </div>
      <div class="module-sections">
        <div class="lessons-section">
          <h4>Lessons (${module.lessons ? module.lessons.length : 0})</h4>
          ${module.lessons && module.lessons.length > 0 ? `
            <div class="lessons-list">
              ${module.lessons.map(lesson => `
                <div class="lesson-item-admin">
                  <div class="lesson-info">
                    <p><strong>Lesson ${lesson.order}:</strong> ${lesson.title}</p>
                    ${lesson.youtubeURL ? `<p class="video-indicator">Video: ${lesson.youtubeURL}</p>` : ''}
                    ${lesson.notesPath ? `<p class="notes-indicator">Notes: ${lesson.notesPath}</p>` : ''}
                  </div>
                  <div class="lesson-actions">
                    <button class="btn btn-secondary btn-tiny" onclick="editLesson('${lesson._id}', '${module._id}')">Edit</button>
                    <button class="btn btn-danger btn-tiny" onclick="deleteLesson('${lesson._id}')">Delete</button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<p class="text-muted">No lessons yet</p>'}
          <button class="btn btn-secondary btn-small" onclick="addLesson('${module._id}')">Add Lesson</button>
        </div>
        <div class="assignment-section-admin">
          <h4>Assignment Questions</h4>
          <button class="btn btn-secondary btn-small" onclick="viewAssignmentQuestions('${module._id}')">Manage Questions</button>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleModule(moduleId) {
  const el = document.getElementById(`module-container-${moduleId}`);
  if (el) el.classList.toggle('collapsed');
}

function editModule(moduleId) {
  const module = allModules.find(m => m._id === moduleId);
  if (!module) return;
  const modal = document.getElementById('module-modal');
  const form = document.getElementById('module-form');
  const titleEl = document.getElementById('module-modal-title');

  if (titleEl) titleEl.textContent = 'Edit Module';
  const fields = {
    'module-title': module.title,
    'module-description': module.description,
    'module-order': module.order
  };
  for (const [id, val] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }
  
  if (form) {
    form.setAttribute('data-mode', 'edit');
    form.setAttribute('data-module-id', moduleId);
  }
  if (modal) modal.classList.add('active');
}

async function deleteModule(moduleId) {
  if (!confirm('Are you sure you want to delete this module?')) return;
  try {
    const token = getToken();
    await AdminAPI.deleteModule(token, moduleId);
    await loadAdminModules();
  } catch (error) {
    alert(error.message);
  }
}

function addLesson(moduleId) {
  const modal = document.getElementById('lesson-modal');
  const form = document.getElementById('lesson-form');
  const titleEl = document.getElementById('lesson-modal-title');
  const midEl = document.getElementById('lesson-module-id');

  if (titleEl) titleEl.textContent = 'Add Lesson';
  if (midEl) midEl.value = moduleId;
  if (form) {
    form.reset();
    form.setAttribute('data-mode', 'create');
  }
  if (modal) modal.classList.add('active');
}

function editLesson(lessonId, moduleId) {
  const module = allModules.find(m => m._id === moduleId);
  if (!module) return;
  const lesson = module.lessons.find(l => l._id === lessonId);
  if (!lesson) return;

  const modal = document.getElementById('lesson-modal');
  const form = document.getElementById('lesson-form');
  const titleEl = document.getElementById('lesson-modal-title');
  const midEl = document.getElementById('lesson-module-id');

  if (titleEl) titleEl.textContent = 'Edit Lesson';
  if (midEl) midEl.value = moduleId;
  
  const fields = {
    'lesson-title': lesson.title,
    'lesson-youtube-url': lesson.youtubeURL,
    'lesson-description': lesson.description,
    'lesson-order': lesson.order
  };
  for (const [id, val] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  if (form) {
    form.setAttribute('data-mode', 'edit');
    form.setAttribute('data-lesson-id', lessonId);
  }
  if (modal) modal.classList.add('active');
}

async function deleteLesson(lessonId) {
  if (!confirm('Delete lesson?')) return;
  try {
    const token = getToken();
    await AdminAPI.deleteLesson(token, lessonId);
    await loadAdminModules();
  } catch (error) {
    alert(error.message);
  }
}

function initLessonManagement() {
  const modal = document.getElementById('lesson-modal');
  const form = document.getElementById('lesson-form');
  const closeBtn = document.getElementById('close-lesson-modal');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const moduleId = document.getElementById('lesson-module-id').value;
      const data = {
        moduleId,
        title: document.getElementById('lesson-title').value,
        youtubeURL: document.getElementById('lesson-youtube-url').value,
        description: document.getElementById('lesson-description').value,
        order: parseInt(document.getElementById('lesson-order').value),
      };
      const notesEl = document.getElementById('lesson-notes');
      const notesFile = notesEl ? notesEl.files[0] : null;
      const mode = form.getAttribute('data-mode');
      try {
        const token = getToken();
        if (mode === 'create') {
          notesFile ? await AdminAPI.createLessonWithFile(token, data, notesFile) : await AdminAPI.createLesson(token, data);
        } else {
          const lessonId = form.getAttribute('data-lesson-id');
          notesFile ? await AdminAPI.updateLessonWithFile(token, lessonId, data, notesFile) : await AdminAPI.updateLesson(token, lessonId, data);
        }
        modal.classList.remove('active');
        await loadAdminModules();
      } catch (error) {
        alert(error.message);
      }
    });
  }
  // Allow adding question rows via the modal 'Add Question' button
  const addQBtn = document.getElementById('add-question-btn');
  if (addQBtn) {
    addQBtn.addEventListener('click', () => {
      const questionsList = document.getElementById('questions-list');
      const nextNum = (questionsList?.querySelectorAll('.question-input-group').length || 0) + 1;
      addQuestionRow(nextNum);
    });
  }
}

function initAssignmentManagement() {
  const modal = document.getElementById('assignment-modal');
  const closeBtn = document.getElementById('close-assignment-modal');
  const form = document.getElementById('assignment-form');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const questionsList = document.querySelectorAll('.question-input-group');
      const moduleId = document.getElementById('assignment-module-id').value;
      const questions = Array.from(questionsList).map((qDiv, i) => ({
        moduleId,
        questionNumber: i + 1,
        question: qDiv.querySelector('.question-text').value,
        options: {
          a: qDiv.querySelector('[data-option="a"]').value,
          b: qDiv.querySelector('[data-option="b"]').value,
          c: qDiv.querySelector('[data-option="c"]').value,
          d: qDiv.querySelector('[data-option="d"]').value,
        },
        correctAnswer: qDiv.querySelector('.question-answer').value,
        section: qDiv.querySelector('.question-section').value || 'General',
      }));
      try {
        const token = getToken();
        await AdminAPI.createAssignmentQuestions(token, questions);
        modal.classList.remove('active');
        alert('Assignment questions saved!');
      } catch (error) {
        alert(error.message);
      }
    });
  }
}

async function viewAssignmentQuestions(moduleId) {
  const modal = document.getElementById('assignment-modal');
  const midEl = document.getElementById('assignment-module-id');
  if (midEl) midEl.value = moduleId;
  const questionsList = document.getElementById('questions-list');
  if (questionsList) questionsList.innerHTML = '<p class="loading">Loading...</p>';
  if (modal) modal.classList.add('active');
  try {
    const token = getToken();
    const questions = await AdminAPI.getAssignmentQuestions(token, moduleId);
    if (questionsList) {
      questionsList.innerHTML = '';
      questions.forEach((q, i) => addQuestionRow(i + 1, q));
    }
  } catch (error) {
    if (questionsList) questionsList.innerHTML = error.message;
  }
}

function addQuestionRow(num, data = null) {
  const questionsList = document.getElementById('questions-list');
  if (!questionsList) return;
  const div = document.createElement('div');
  div.className = 'question-input-group';
  div.setAttribute('data-question-number', num);
  const opts = data?.options || { a: '', b: '', c: '', d: '' };
  
  div.innerHTML = `
    <div class="question-header">
      <h4>Question ${num}</h4>
      <button type="button" class="btn btn-danger btn-small remove-question">Remove</button>
    </div>
    <div class="form-group">
      <label>Question Text *</label>
      <textarea class="question-text" required rows="2">${data?.question || ''}</textarea>
    </div>
    <div class="form-group">
      <label>Section</label>
      <input type="text" class="question-section" value="${data?.section || ''}">
    </div>
    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <div class="form-group"><label>Option A</label><input type="text" class="question-option" data-option="a" value="${opts.a}" required></div>
      <div class="form-group"><label>Option B</label><input type="text" class="question-option" data-option="b" value="${opts.b}" required></div>
    </div>
    <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <div class="form-group"><label>Option C</label><input type="text" class="question-option" data-option="c" value="${opts.c}" required></div>
      <div class="form-group"><label>Option D</label><input type="text" class="question-option" data-option="d" value="${opts.d}" required></div>
    </div>
    <div class="form-group">
      <label>Correct Answer</label>
      <select class="question-answer" required>
        <option value="a" ${data?.correctAnswer === 'a' ? 'selected' : ''}>A</option>
        <option value="b" ${data?.correctAnswer === 'b' ? 'selected' : ''}>B</option>
        <option value="c" ${data?.correctAnswer === 'c' ? 'selected' : ''}>C</option>
        <option value="d" ${data?.correctAnswer === 'd' ? 'selected' : ''}>D</option>
      </select>
    </div>
  `;
  
  questionsList.appendChild(div);
  div.querySelector('.remove-question').addEventListener('click', () => {
    div.remove();
    // Re-index remaining questions
    const groups = questionsList.querySelectorAll('.question-input-group');
    groups.forEach((group, index) => {
      const h4 = group.querySelector('h4');
      if (h4) h4.textContent = `Question ${index + 1}`;
    });
  });
}

// Profile Requests Management
async function loadProfileUpdateRequests() {
  try {
    const token = getToken();
    if (!token) return;
    const requests = await AdminAPI.getProfileUpdateRequests(token);
    renderProfileUpdateRequests(requests);
  } catch (error) {
    console.error(error);
  }
}

function renderProfileUpdateRequests(requests) {
  const container = document.getElementById('profile-requests-list');
  if (!container) return;
  if (!requests || requests.length === 0) {
    container.innerHTML = '<p class="info">No requests found.</p>';
    return;
  }
  const pending = requests.filter(r => r.status === 'pending');
  if (pending.length === 0) {
    container.innerHTML = '<p class="info">No pending requests.</p>';
    return;
  }
  container.innerHTML = pending.map(req => `
    <div class="app-card" style="margin-bottom:12px; padding:16px;">
      <h4>${req.studentId?.fullName || 'Unknown Student'}</h4>
      <p style="font-size:0.85rem; color:var(--text-muted);">Requesting changes to profile.</p>
      <div style="display:flex; gap:8px; margin-top:12px;">
        <button class="btn btn-primary btn-small" onclick="processProfileRequest('${req._id}', 'approved')">Approve</button>
        <button class="btn btn-secondary btn-small" onclick="processProfileRequest('${req._id}', 'rejected')">Reject</button>
      </div>
    </div>
  `).join('');
}

async function processProfileRequest(id, status) {
  try {
    const token = getToken();
    await AdminAPI.handleProfileUpdateRequest(token, id, { status });
    alert(`Request ${status}`);
    await loadProfileUpdateRequests();
    await loadAdminUsers();
  } catch (error) {
    alert(error.message);
  }
}

// Reset student progress
async function resetProgress(studentId, moduleId, moduleName) {
  if (!confirm(`Reset progress for ${moduleName}?`)) return;
  try {
    const token = getToken();
    await AdminAPI.resetUserProgress(token, studentId, moduleId);
    alert('Progress reset');
    await loadStudentProgressDetail(studentId);
  } catch (error) {
    alert(error.message);
  }
}

// Support Session Management
async function loadAdminSupportSessions() {
  try {
    const token = getToken();
    if (!token) return;
    const requests = await AdminAPI.getSupportRequests(token);
    renderAdminSupportRequests(requests);
  } catch (error) {
    console.error(error);
  }
}

function renderAdminSupportRequests(requests) {
  const container = document.getElementById('admin-support-requests-list');
  if (!container) return;
  if (!requests || requests.length === 0) {
    container.innerHTML = '<p class="info">No requests</p>';
    return;
  }
  container.innerHTML = requests.map(req => {
    const isCompleted = req.status === 'completed';
    const isScheduled = req.status === 'scheduled';
    
    let statusClass = 'pending';
    if (isCompleted) statusClass = 'completed';
    if (isScheduled) statusClass = 'approved'; // using approved green for scheduled

    return `
      <div class="app-card" style="margin-bottom:12px; padding:16px; border-left: 4px solid ${isCompleted ? 'var(--success)' : 'var(--primary)'}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <h4 style="margin:0;">${req.studentId?.fullName || 'Unknown'}</h4>
          <span class="status ${statusClass}">${req.status.toUpperCase()}</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:8px;">
          <strong>Module:</strong> ${req.moduleId?.title || 'N/A'} | 
          <strong>Lesson:</strong> ${req.lessonId?.title || 'N/A'}
        </p>
        <p style="margin-bottom:12px;">${req.details}</p>
        ${req.meetingLink ? `<p style="font-size:0.8rem; margin-bottom:8px;"><strong>Link:</strong> <a href="${req.meetingLink}" target="_blank">${req.meetingLink}</a></p>` : ''}
        ${req.scheduledAt ? `<p style="font-size:0.8rem; margin-bottom:12px;"><strong>Scheduled:</strong> ${new Date(req.scheduledAt).toLocaleString()}</p>` : ''}
        
        ${!isCompleted ? `
          <div style="display:flex; gap:8px; margin-top:12px;">
            <button class="btn btn-primary btn-small" onclick="scheduleSupportSession('${req._id}')">${isScheduled ? 'Re-schedule' : 'Schedule'}</button>
            <button class="btn btn-secondary btn-small" onclick="updateSupportStatus('${req._id}', 'completed')">Mark Completed</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

async function scheduleSupportSession(id) {
  const modal = document.getElementById('admin-schedule-modal');
  const requestIdInput = document.getElementById('schedule-request-id');
  if (modal && requestIdInput) {
    requestIdInput.value = id;
    modal.classList.add('active');
  }
}

function initScheduleManagement() {
  const modal = document.getElementById('admin-schedule-modal');
  const closeBtn = document.getElementById('close-schedule-modal');
  const form = document.getElementById('admin-schedule-form');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('schedule-request-id').value;
      const datetime = document.getElementById('schedule-datetime').value;
      const link = document.getElementById('schedule-teams-link').value;

      try {
        const token = getToken();
        await AdminAPI.updateSupportRequest(token, id, { 
          status: 'scheduled', 
          meetingLink: link, 
          scheduledAt: new Date(datetime) 
        });
        alert('Support session scheduled successfully!');
        modal.classList.remove('active');
        form.reset();
        await loadAdminSupportSessions();
      } catch (error) {
        alert('Error scheduling session: ' + error.message);
      }
    });
  }
}

async function updateSupportStatus(id, status) {
  if (status === 'completed') {
    if (!confirm('Mark this support request as COMPLETED?')) return;
  }
  try {
    const token = getToken();
    await AdminAPI.updateSupportRequest(token, id, { status });
    alert(`Status updated to ${status}`);
    await loadAdminSupportSessions();
  } catch (error) {
    alert(error.message);
  }
}

// Event Management
async function loadAdminEvents() {
  try {
    const token = getToken();
    if (!token) return;
    const events = await window.EventAPI.getAllEvents(token);
    renderAdminEvents(events);
  } catch (error) {
    console.error(error);
  }
}

function renderAdminEvents(events) {
  const container = document.getElementById('admin-events-list');
  if (!container) return;
  if (!events || events.length === 0) {
    container.innerHTML = '<p class="info">No events</p>';
    return;
  }
  container.innerHTML = events.map(e => `
    <div class="admin-event-card ${e.archived ? 'archived' : ''}" onclick="viewEventDetail('${e._id}')">
      <div class="admin-event-info">
        <h4>${e.name}</h4>
        <p>${new Date(e.date).toLocaleDateString()} ${e.time}</p>
      </div>
      <div class="admin-event-actions">
        <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); archiveEvent('${e._id}')">Archive</button>
      </div>
    </div>
  `).join('');
}

async function viewEventDetail(id) {
  currentEventId = id;
  const token = getToken();
  try {
    const events = await window.EventAPI.getAllEvents(token);
    const event = events.find(e => e._id === id);
    if (!event) return;

    const listEl = document.getElementById('admin-events-list');
    const detailEl = document.getElementById('event-detail');
    const nameEl = document.getElementById('admin-event-name');

    if (listEl) listEl.style.display = 'none';
    if (detailEl) detailEl.style.display = 'block';
    if (nameEl) nameEl.textContent = event.name;

    currentRegistrations = await window.EventAPI.getRegistrations(token, id);
    renderRegistrationsList();
  } catch (error) {
    alert(error.message);
  }
}

function renderRegistrationsList() {
  const container = document.getElementById('registrations-list');
  if (!container) return;
  container.innerHTML = currentRegistrations.map(r => `
    <tr>
      <td><input type="checkbox" class="reg-checkbox" value="${r._id}"></td>
      <td>${r.fullName}</td>
      <td>${r.email}</td>
      <td>${r.contactNumber}</td>
      <td><span class="status-tag ${r.linkSent ? 'sent' : 'pending'}">${r.linkSent ? 'Sent' : 'Pending'}</span></td>
    </tr>
  `).join('');
}

function initEventManagement() {
  const addBtn = document.getElementById('add-event-btn');
  const backBtn = document.getElementById('back-to-events');
  const sendBtn = document.getElementById('send-links-btn');
  const form = document.getElementById('event-form');
  const modal = document.getElementById('event-modal');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (form) form.reset();
      if (modal) modal.classList.add('active');
    });
  }
  
  const closeBtn = document.getElementById('close-event-modal');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    if (modal) modal.classList.remove('active');
  });
  
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      const detailEl = document.getElementById('event-detail');
      const listEl = document.getElementById('admin-events-list');
      if (detailEl) detailEl.style.display = 'none';
      if (listEl) listEl.style.display = 'block';
    });
  }
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('event-name').value,
        description: document.getElementById('event-description').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        teamsLink: document.getElementById('event-teams-link').value,
      };
      try {
        const token = getToken();
        await window.EventAPI.createEvent(token, data);
        if (modal) modal.classList.remove('active');
        alert('Event created');
        await loadAdminEvents();
        // Refresh public upcoming events on the landing page
        try { if (window.initUpcomingEvents) window.initUpcomingEvents(); } catch (e) { console.warn('Could not refresh upcoming events:', e.message); }
      } catch (error) {
        alert(error.message);
      }
    });
  }
  
  if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
      const ids = Array.from(document.querySelectorAll('.reg-checkbox:checked')).map(cb => cb.value);
      if (ids.length === 0) return alert('Select people first');
      try {
        const token = getToken();
        await window.EventAPI.sendLinks(token, currentEventId, ids);
        alert('Links sent!');
        await viewEventDetail(currentEventId);
      } catch (error) {
        alert(error.message);
      }
    });
  }
}

async function archiveEvent(id) {
  if (!confirm('Archive this event?')) return;
  try {
    const token = getToken();
    await window.EventAPI.archiveEvent(token, id);
    alert('Event archived');
    await loadAdminEvents();
    // Refresh public upcoming events on the landing page if available
    try { if (window.initUpcomingEvents) window.initUpcomingEvents(); } catch (e) { console.warn('Could not refresh upcoming events:', e.message); }
  } catch (error) {
    alert(error.message);
  }
}

// Global functions for assignment management
function debugAssignmentStatus(moduleId) {
  console.log('Debug status for', moduleId);
}

// Utils
function getToken() { return localStorage.getItem(STORAGE_KEYS.TOKEN); }
function getUser() { 
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
}

// Promote student to admin
async function promoteToAdmin(userId) {
  if (!confirm('WARNING: Are you sure you want to promote this student to an ADMINISTRATOR?')) {
    return;
  }

  try {
    const token = getToken();
    await AdminAPI.updateUser(token, userId, { role: 'admin' });
    alert('User promoted to administrator.');
    await loadAdminUsers();
    const backBtn = document.getElementById('back-to-users');
    if (backBtn) backBtn.click();
  } catch (error) {
    alert('Error promoting user: ' + error.message);
  }
}

// Expose globals
window.loadAdminDashboard = loadAdminDashboard;
window.viewEventDetail = viewEventDetail;
window.archiveEvent = archiveEvent;
window.editModule = editModule;
window.deleteModule = deleteModule;
window.toggleModule = toggleModule;
window.editLesson = editLesson;
window.deleteLesson = deleteLesson;
window.addLesson = addLesson;
window.viewAssignmentQuestions = viewAssignmentQuestions;
window.resetProgress = resetProgress;
window.scheduleSupportSession = scheduleSupportSession;
window.updateSupportStatus = updateSupportStatus;
window.viewUserDetail = viewUserDetail;
window.markStudentCompleted = markStudentCompleted;
window.promoteToAdmin = promoteToAdmin;
window.processProfileRequest = processProfileRequest;
window.debugAssignmentStatus = debugAssignmentStatus;
