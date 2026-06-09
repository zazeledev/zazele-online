// Student Dashboard
let currentModules = [];
let moduleProgressMap = {}; // Track progress for each module
let lessonTimers = {}; // Track time spent on each lesson
let activeModuleId = null;
let currentLessons = [];
let congratsShown = {}; // Track if congratulations was shown for a module in this session
let fullyDoneShown = {}; // Track if fully completed message was shown

// Load modules and render dashboard
async function loadStudentDashboard() {
  try {
    const user = getUser();
    const token = getToken();
    document.getElementById('user-display-name').textContent = user.fullName;

    // Load progress first
    await loadProgressOverview(token);

    // Load and display modules
    await loadAndDisplayModules(token);

    // Initialize profile menu
    initProfileMenu();
    initProfileUpdates();
    initSupportFeature();
    initTabNavigation();
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Load and display progress overview
async function loadProgressOverview(token) {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }
    const progressList = await StudentAPI.getProgressDashboard(token);
    const progressContainer = document.getElementById('progress-overview');
    
    if (progressList.length === 0) {
      progressContainer.innerHTML = '<p class="info">No courses enrolled yet.</p>';
      return;
    }

    // Calculate overall progress
    let totalLessons = 0;
    let totalCompleted = 0;
    
    progressList.forEach(prog => {
      totalLessons += prog.totalLessons || 0;
      totalCompleted += prog.completedLessons || 0;
    });

    const overallPercentage = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

    const progressHTML = `
      <div class="overall-progress-card app-card" style="padding: 32px; background: white; border: 1px solid var(--border-color); border-radius: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px;">
          <div>
            <h3 style="margin: 0; font-size: 1.1rem; color: var(--secondary);">Overall Course Completion</h3>
            <p style="margin: 4px 0 0 0; font-size: 0.9rem; color: var(--text-soft);">
              <strong>${totalCompleted}</strong> of <strong>${totalLessons}</strong> Total Lessons Completed
            </p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 2.2rem; font-weight: 800; color: var(--primary); line-height: 1;">${overallPercentage}%</span>
          </div>
        </div>
        
        <div class="progress-bar-container" style="height: 12px; background: #E5E5E7; border-radius: 6px; overflow: hidden; margin-bottom: 8px;">
          <div class="progress-fill" style="width: ${overallPercentage}%; height: 100%; background: var(--success); transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);"></div>
        </div>
        
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          <span>Start</span>
          <span>${overallPercentage === 100 ? 'Course Completed!' : 'Platinum Certificate Progress'}</span>
          <span>Goal</span>
        </div>
      </div>
    `;

    progressContainer.innerHTML = progressHTML;
  } catch (error) {
    console.error('Error loading progress:', error);
    document.getElementById('progress-overview').innerHTML = `<p class="error">Failed to load progress: ${error.message}</p>`;
  }
}

// Load modules as a selector grid
async function loadAndDisplayModules(token) {
  try {
    const progressList = await StudentAPI.getProgressDashboard(token);
    const container = document.getElementById('modules-container');

    if (progressList.length === 0) {
      container.innerHTML = '<p class="loading">No modules available yet.</p>';
      return;
    }

    container.innerHTML = progressList
      .map((module) => {
        const isLocked = !module.isUnlocked && !module.isFuture;
        const isFuture = module.isFuture;
        
        return `
          <div class="module-select-card ${isLocked || isFuture ? 'locked' : ''}" 
               ${isLocked || isFuture ? '' : `onclick="openModuleViewer('${module.moduleId}')"`}>
            <div>
              <h3>${module.moduleName}</h3>
              <p>${isFuture ? 'Coming soon to the platform.' : (isLocked ? 'Complete the previous module to unlock this one.' : 'Access all lessons and resources.')}</p>
            </div>
            <button class="btn btn-primary btn-small" ${isLocked || isFuture ? 'disabled' : ''}>
              ${isLocked ? '🔒 Locked' : (isFuture ? 'Coming Soon' : 'View Lessons')}
            </button>
          </div>
        `;
      })
      .join('');
  } catch (error) {
    console.error('Error loading modules:', error);
    document.getElementById('modules-container').innerHTML =
      `<p class="error">Failed to load modules: ${error.message}</p>`;
  }
}

// Open the standalone module viewer
async function openModuleViewer(moduleId) {
  const token = getToken();
  activeModuleId = moduleId;
  
  // Show viewer, hide selector
  document.getElementById('module-viewer').style.display = 'block';
  document.getElementById('modules-container').parentElement.style.display = 'none';
  
  // Reset scroll and set loading state
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('viewer-module-title').textContent = 'Loading...';
  document.getElementById('panel-content').innerHTML = '<div class="loading">Loading lessons...</div>';
  
  // Reset tabs to content
  document.getElementById('tab-btn-content').click();

  try {
    const moduleData = await StudentAPI.getModuleLessonsWithStatus(moduleId, token);
    currentLessons = moduleData.lessons;
    moduleProgressMap[moduleId] = moduleData.progress;
    
    // Check if module is already fully completed (assignment passed)
    const progressList = await StudentAPI.getProgressDashboard(token);
    const moduleProgress = progressList.find(m => m.moduleId === moduleId);
    
    // Update header
    document.getElementById('viewer-module-title').textContent = moduleData.module.title;
    document.getElementById('viewer-module-desc').textContent = moduleData.module.description;
    
    // Render panels
    renderModulePanels(moduleData, moduleId, token, moduleProgress);
    
    // Load support requests for this module
    loadMySupportRequests();
    
  } catch (error) {
    console.error('Error opening module:', error);
    document.getElementById('panel-content').innerHTML = `<p class="error">Failed to load: ${error.message}</p>`;
  }
}

// Close viewer and return to selector
function closeModuleViewer() {
  document.getElementById('module-viewer').style.display = 'none';
  document.getElementById('modules-container').parentElement.style.display = 'block';
  activeModuleId = null;
  // Refresh module grid to reflect progress
  loadAndDisplayModules(getToken());
}

// Render content for all tabs in the viewer
function renderModulePanels(moduleData, moduleId, token, moduleProgress) {
  const lessons = moduleData.lessons;
  const allLessonsCompleted = lessons.every(l => l.isCompleted);
  const assignmentPassed = moduleProgress && moduleProgress.isCompleted;
  const assignmentSubmitted = moduleProgress && moduleProgress.isSubmitted;

  // 1. Content Panel
  let contentHTML = lessons
    .map((lesson) => {
      const isLocked = !lesson.isUnlocked;
      const isCompleted = lesson.isCompleted;
      const youtubeId = lesson.youtubeURL ? extractYoutubeId(lesson.youtubeURL) : null;
      const unlockDate = lesson.nextUnlockDate ? new Date(lesson.nextUnlockDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : null;

      return `
        <div class="lesson-item ${isLocked ? 'lesson-locked' : ''} ${isCompleted ? 'lesson-completed' : ''}">
          <div class="lesson-header">
            <div class="lesson-number">Lesson ${lesson.order}</div>
            <div class="lesson-title">${lesson.title}</div>
            ${isCompleted ? '<span class="status-pill success" style="margin-left:auto;">Completed</span>' : ''}
          </div>
          
          <div class="lesson-video-container ${isLocked ? 'locked' : ''}">
            ${youtubeId ? `
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${youtubeId}?rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>
            ` : '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-muted);">No video available</div>'}
            
            ${isLocked ? `
              <div class="video-overlay">
                <div class="overlay-content">
                  <div class="lock-icon">🔒</div>
                  <p style="font-weight:700; font-size:1.1rem; margin:0;">Locked Lesson</p>
                  <p style="font-size:0.85rem; opacity:0.8; margin:0;">Complete previous lessons to unlock</p>
                  ${unlockDate ? `<div class="unlock-date">Estimated Unlock: ${unlockDate}</div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
          
          <p class="lesson-description">${lesson.description || ''}</p>
          
          ${!isLocked ? `
            <div style="margin-top: 16px;">
              ${!isCompleted ? `
                <button class="btn btn-primary" onclick="handleLessonCompletion('${moduleId}', '${lesson._id}')">Mark Lesson Complete</button>
              ` : `
                <div style="display:flex; align-items:center; gap:12px;">
                   <span class="status-pill success">✓ Completed</span>
                   <button class="btn btn-secondary btn-small" onclick="handleSkipToNext('${moduleId}', '${lesson._id}')">Next Lesson →</button>
                </div>
              `}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

  // Show "Lessons Finished" congratulations ONCE (before assignment)
  if (allLessonsCompleted && !assignmentSubmitted && !congratsShown[moduleId]) {
    congratsShown[moduleId] = true;
    showModuleCompletion(moduleId, token, 'lessons-done', contentHTML); 
  } 
  // Show "Module Finished" (Assignment Submitted) congratulations ONCE
  else if (assignmentSubmitted && !fullyDoneShown[moduleId]) {
    fullyDoneShown[moduleId] = true;
    showModuleCompletion(moduleId, token, assignmentPassed ? 'passed' : 'failed', contentHTML);
  }
  // Otherwise show lessons with a button at the bottom if submitted
  else {
    let finalHTML = contentHTML;
    if (assignmentSubmitted) {
       finalHTML += `
         <div style="margin-top:40px; text-align:center; padding:32px; background:var(--bg-secondary); border-radius:12px;">
           <h3 style="color:var(--success);">✓ Module Assignment ${assignmentPassed ? 'Passed' : 'Submitted'}</h3>
           <p style="margin-bottom:20px;">You've finished this module. You can move to the next one or review any lesson.</p>
           <button class="btn btn-success" onclick="handleNextModuleNavigation('${moduleId}')">Go to Next Module →</button>
         </div>
       `;
    }
    document.getElementById('panel-content').innerHTML = finalHTML;
  }

// ... rest of renderModulePanels remains same

  // ... (resources panel remains same)

  // 3. Assessment Panel
  document.getElementById('panel-assessment').innerHTML = `
    <div class="assignment-section" style="max-width: 600px; margin: 0 auto; text-align: center;">
      <h3 style="margin-bottom: 24px;">Module Assessment</h3>
      
      ${assignmentSubmitted ? `
         <div class="assessment-ready-card" style="background: ${assignmentPassed ? '#E3FCEF' : '#FFF4E5'}; border-color: ${assignmentPassed ? 'var(--success)' : '#FF991F'};">
          <div style="font-size: 3rem; margin-bottom: 15px;">${assignmentPassed ? '🏆' : '📝'}</div>
          <h3>Assignment ${assignmentPassed ? 'Passed!' : 'Submitted'}</h3>
          <p style="color: ${assignmentPassed ? '#006644' : '#854603'}; margin-bottom: 20px;">
            ${assignmentPassed 
              ? "Congratulations! You've passed the final assessment for this module." 
              : "You've submitted the assessment. You can proceed to the next module, or retake this one to improve your score."}
          </p>
          <div style="display:flex; gap:12px; justify-content:center;">
            <button class="btn btn-primary" onclick="handleTakeAssignment('${moduleId}')">View Results / Retake</button>
            <button class="btn btn-success" onclick="handleNextModuleNavigation('${moduleId}')">Proceed to Next Module →</button>
          </div>
        </div>
      ` : (allLessonsCompleted ? `
        <div class="assessment-ready-card">
          <div style="font-size: 3rem; margin-bottom: 15px;">🎓</div>
          <h3>Ready for Assessment</h3>
          <p style="color: #006644; margin-bottom: 20px;">You've completed all lessons! You can now take the final assignment to unlock the next module.</p>
          <button class="btn btn-primary btn-large" style="width: 100%;" onclick="handleTakeAssignment('${moduleId}')">
            Start Final Assignment
          </button>
        </div>
      ` : `
        <div class="app-card" style="padding: 32px; background: #f8f9fa; margin-bottom: 32px; text-align: left;">
          <p style="margin-bottom: 12px;"><strong>Required to Pass:</strong> 80% score</p>
          <p style="margin-bottom: 12px;"><strong>Module Status:</strong> <span class="status-pill pending">Complete Lessons First</span></p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">You must finish all lessons in this module before you can take the final assessment.</p>
        </div>
        <button class="btn btn-primary btn-large" style="width: 100%; opacity: 0.5; cursor: not-allowed;" disabled>
          Complete All Lessons to Unlock
        </button>
      `)}
    </div>
  `;
}

// Show module completion UI
async function showModuleCompletion(moduleId, token, isFullyCompleted, lessonsHTML) {
  try {
    const progressList = await StudentAPI.getProgressDashboard(token);
    const currentModuleIndex = progressList.findIndex(m => m.moduleId === moduleId);
    const currentModule = progressList[currentModuleIndex];
    const nextModule = progressList[currentModuleIndex + 1];

    let completionHTML = '';
    
    if (!isFullyCompleted) {
      completionHTML = `
        <div class="module-completion-card">
          <span class="completion-icon">🎉</span>
          <h2>Lessons Completed!</h2>
          <p>You have finished all lessons for <strong>${currentModule.moduleName}</strong>.</p>
          <p style="margin-top: 10px; font-size: 1.1rem; opacity: 0.9;">To unlock the next module, you must now pass the <strong>Module Assessment</strong>.</p>
          
          <div style="display: flex; gap: 16px; justify-content: center; margin-top: 32px;">
            <button class="btn btn-primary btn-large" onclick="document.getElementById('tab-btn-assessment').click()">
              Start Assessment Now →
            </button>
            <button class="btn btn-secondary btn-large" onclick="openModuleViewer('${moduleId}')">
              Review Lessons
            </button>
          </div>
        </div>
      `;
    } else {
      completionHTML = `
        <div class="module-completion-card" style="background: linear-gradient(135deg, #1A2B49 0%, #007AFF 100%);">
          <span class="completion-icon">🏆</span>
          <h2>Module Mastered!</h2>
          <p>Congratulations! You have successfully completed <strong>${currentModule.moduleName}</strong> and passed the assessment.</p>
          
          <div class="remaining-summary">
            <h4>Course Progress</h4>
            <div class="mini-module-list">
              ${progressList.map(m => `
                <div class="mini-module-item ${m.isCompleted ? 'completed' : ''}">
                  <span class="dot"></span>
                  <span>${m.moduleName} ${m.isCompleted ? '✓' : ''}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div style="display: flex; gap: 16px; justify-content: center; margin-top: 32px;">
            ${nextModule && !nextModule.isFuture ? `
              <button class="btn btn-success btn-large" onclick="handleNextModuleNavigation('${moduleId}')">
                Proceed to Next Module: ${nextModule.moduleName} →
              </button>
            ` : `
              <button class="btn btn-primary btn-large" onclick="closeModuleViewer()">
                Return to Dashboard
              </button>
            `}
          </div>
        </div>
      `;
    }
    
    document.getElementById('panel-content').innerHTML = `
      <div style="margin-bottom: 40px; padding-bottom: 40px; border-bottom: 2px dashed var(--border-color);">
        <h4 style="color:var(--text-muted); margin-bottom:20px; text-align:center;">--- Lesson Review ---</h4>
        <div>${lessonsHTML}</div>
      </div>
      ${completionHTML}
    `;
    
    // Scroll to the bottom to see the message
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    
  } catch (error) {
    console.error('Error showing completion:', error);
  }
}

// Helper to navigate to next module
async function handleNextModuleNavigation(currentModuleId) {
  const token = getToken();
  try {
    const progressList = await StudentAPI.getProgressDashboard(token);
    const currentIndex = progressList.findIndex(m => m.moduleId === currentModuleId);
    if (currentIndex !== -1 && currentIndex < progressList.length - 1) {
      const nextModule = progressList[currentIndex + 1];
      if (!nextModule.isFuture) {
        openModuleViewer(nextModule.moduleId);
      } else {
        closeModuleViewer();
      }
    } else {
      closeModuleViewer();
    }
  } catch (e) {
    closeModuleViewer();
  }
}

// Expose navigation helper
window.handleNextModuleNavigation = handleNextModuleNavigation;

// Tab Navigation Logic for Standalone Viewer
function initTabNavigation() {
  const tabs = ['content', 'resources', 'assessment', 'support'];
  tabs.forEach(tab => {
    document.getElementById(`tab-btn-${tab}`).addEventListener('click', () => {
      // Deactivate all
      tabs.forEach(t => {
        document.getElementById(`tab-btn-${t}`).classList.remove('active');
        document.getElementById(`panel-${t}`).classList.remove('active');
      });
      // Activate clicked
      document.getElementById(`tab-btn-${tab}`).classList.add('active');
      document.getElementById(`panel-${tab}`).classList.add('active');
    });
  });
}

// Support Feature Logic
function initSupportFeature() {
  const modal = document.getElementById('support-modal');
  const closeBtn = document.getElementById('close-support-modal');
  const form = document.getElementById('support-request-form');

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getToken();
    const lessonId = document.getElementById('support-lesson-select').value;
    const details = document.getElementById('support-details').value;

    try {
      await StudentAPI.createSupportRequest(token, {
        moduleId: activeModuleId,
        lessonId,
        details
      });
      alert('Your support request has been sent! We will arrange a session on MS Teams soon.');
      modal.classList.remove('active');
      form.reset();
      loadMySupportRequests();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

function openSupportModal() {
  const select = document.getElementById('support-lesson-select');
  select.innerHTML = '<option value="">-- Choose a lesson --</option>' + 
    currentLessons
      .filter(l => l.isUnlocked)
      .map(l => `<option value="${l._id}">Lesson ${l.order}: ${l.title}</option>`)
      .join('');
  
  document.getElementById('support-modal').classList.add('active');
}

async function loadMySupportRequests() {
  const token = getToken();
  const list = document.getElementById('support-requests-list');
  try {
    const requests = await StudentAPI.getSupportRequests(token);
    const myRequests = requests.filter(r => r.moduleId._id === activeModuleId);
    
    if (myRequests.length === 0) {
      list.innerHTML = '<p class="text-muted">No requests for this module.</p>';
      return;
    }

    list.innerHTML = myRequests.map(r => `
      <div class="support-req-item ${r.status === 'scheduled' ? 'scheduled' : ''}">
        <h5>Lesson ${r.lessonId?.title || 'Unknown'}: ${r.status.toUpperCase()}</h5>
        <div class="meta">Requested on: ${new Date(r.createdAt).toLocaleDateString()}</div>
        ${r.scheduledAt ? `<div class="meta" style="color:var(--success); font-weight:700;">Scheduled for: ${new Date(r.scheduledAt).toLocaleString()}</div>` : ''}
        ${r.meetingLink ? `
          <div class="link-box">
            <a href="${r.meetingLink}" target="_blank" class="btn btn-primary btn-tiny">Join MS Teams Meeting</a>
          </div>
        ` : ''}
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading support requests:', error);
  }
}

// Lesson Actions
async function handleLessonCompletion(moduleId, lessonId) {
  const token = getToken();
  try {
    await StudentAPI.completeLesson(moduleId, lessonId, 0, token);
    await openModuleViewer(moduleId); // Refresh
    await loadProgressOverview(token); // Update top bar
  } catch (error) {
    alert(error.message);
  }
}

async function handleSkipToNext(moduleId, lessonId) {
  const token = getToken();
  try {
    await StudentAPI.skipToNextLesson(moduleId, lessonId, token);
    await openModuleViewer(moduleId); // Refresh
  } catch (error) {
    alert(error.message);
  }
}

async function handleTakeAssignment(moduleId) {
  const token = getToken();
  try {
    // Switch pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('assignment-page').classList.add('active');
    
    // Load and display assignment
    await loadAssignment(moduleId, token);
  } catch (error) {
    alert('Error loading assignment: ' + error.message);
  }
}

// Helper: Extract YouTube ID
function extractYoutubeId(url) {
  if (!url) return '';
  let match = url.match(/\/embed\/([^?&\n]+)/);
  if (match) return match[1];
  match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : '';
}

// Profile UI (Keeping existing logic)
function initProfileMenu() {
  const badge = document.getElementById('profile-badge');
  const menu = document.getElementById('profile-menu');
  badge.addEventListener('click', (e) => { e.stopPropagation(); menu.classList.toggle('active'); updateProfileDisplay(); });
  document.addEventListener('click', (e) => { if (!badge.contains(e.target)) menu.classList.remove('active'); });
}

async function updateProfileDisplay() {
  try {
    const { user, pendingRequest } = await AuthAPI.getProfile(getToken());
    if (user) {
      document.getElementById('profile-fullname').textContent = user.fullName;
      document.getElementById('profile-email').textContent = user.email;
      document.getElementById('profile-contact').textContent = user.contactNumber || '-';
      document.getElementById('user-display-name').textContent = user.fullName;
      const editBtn = document.getElementById('edit-profile-btn');
      editBtn.textContent = pendingRequest ? 'Update Pending Review' : 'Update Profile';
    }
  } catch (e) {}
}

function initProfileUpdates() {
  const modal = document.getElementById('edit-profile-modal');
  const closeBtn = document.getElementById('close-edit-modal');
  const form = document.getElementById('edit-profile-form');
  document.getElementById('edit-profile-btn')?.addEventListener('click', () => modal.classList.add('active'));
  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = { fullName: document.getElementById('edit-fullname').value, contactNumber: document.getElementById('edit-contact').value, email: document.getElementById('edit-email').value };
    try {
      await AuthAPI.requestProfileUpdate(getToken(), data);
      alert('Request submitted');
      modal.classList.remove('active');
      updateProfileDisplay();
    } catch (error) { alert(error.message); }
  });
}

// Expose functions for global use (notifications, etc)
window.loadStudentDashboard = loadStudentDashboard;
window.openModuleViewer = openModuleViewer;
window.closeModuleViewer = closeModuleViewer;
window.openSupportModal = openSupportModal;
