// Get stored token
function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

// Get stored user
function getUser() {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
}

// Save authentication
function saveAuth(token, user) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

// Logout
function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// Initialize Login Form
function initLoginForm() {
  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('login-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.remove('show');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await AuthAPI.login(email, password);
      saveAuth(response.token, response.user);
      navigateToPage(response.user);
    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.classList.add('show');
    }
  });
}

// Initialize Register Form
function initRegisterForm() {
  const form = document.getElementById('register-form');
  const errorDiv = document.getElementById('register-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.remove('show');

    const data = {
      fullName: document.getElementById('register-fullname').value,
      email: document.getElementById('register-email').value,
      country: document.getElementById('register-country').value,
      province: document.getElementById('register-province').value,
      password: document.getElementById('register-password').value,
      contactNumber: document.getElementById('register-contact').value,
      idDocument: document.getElementById('register-id-doc').files[0],
      paymentProof: document.getElementById('register-payment-proof').files[0],
    };

    try {
      await AuthAPI.register(data);
      // Show pending page after registration
      showPage('pending-page');
    } catch (error) {
      errorDiv.textContent = error.message;
      errorDiv.classList.add('show');
    }
  });
}

// Form Tab Switching
function initFormTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const forms = document.querySelectorAll('.form');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');

      // Update active button
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active form
      forms.forEach((form) => {
        if ((tabName === 'login' && form.id === 'login-form') ||
            (tabName === 'register' && form.id === 'register-form')) {
          form.classList.add('active');
        } else {
          form.classList.remove('active');
        }
      });
    });
  });
}

// Show appropriate page based on user status
function navigateToPage(user) {
  const userNav = document.getElementById('header-user-nav');
  const portalBtn = document.querySelector('.nav-link-portal');
  
  if (userNav) {
    userNav.style.display = 'flex';
    
    // Hide standard portal button in main menu
    if (portalBtn) portalBtn.style.display = 'none';
    
    // Reset all header items to hidden
    document.getElementById('student-notification-wrapper').style.display = 'none';
    document.getElementById('admin-notification-wrapper').style.display = 'none';
    document.getElementById('profile-badge').style.display = 'none';
    document.getElementById('admin-info-text').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('admin-logout-btn').style.display = 'none';

    if (user.role === 'admin') {
      document.getElementById('admin-notification-wrapper').style.display = 'block';
      document.getElementById('admin-info-text').style.display = 'flex';
      document.getElementById('admin-logout-btn').style.display = 'block';
    } else if (user.approved) {
      document.getElementById('student-notification-wrapper').style.display = 'block';
      document.getElementById('profile-badge').style.display = 'block';
      document.getElementById('logout-btn').style.display = 'block';
    } else {
      // Pending student
      document.getElementById('logout-btn').style.display = 'block';
    }
  }

  if (user.role === 'admin') {
    showPage('admin-page');
    loadAdminDashboard();
    if (window.initNotifications) window.initNotifications('admin');
  } else if (user.approved) {
    showPage('dashboard-page');
    loadStudentDashboard();
    if (window.initNotifications) window.initNotifications('student');
  } else {
    showPage('pending-page');
  }
}

// Show page
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => page.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
}

// Global Export
window.showPage = showPage;

// Initialize logout buttons
function initLogoutButtons() {
  const logoutBtn = document.getElementById('logout-btn');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');
  const logoutPendingBtn = document.getElementById('logout-pending-btn');
  const profileLogoutBtn = document.getElementById('profile-logout-btn');

  const performLogout = () => {
    logoutUser();
    resetForms();
    window.location.href = 'portal.html';
  };

  if (logoutBtn) logoutBtn.addEventListener('click', performLogout);
  if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', performLogout);
  if (logoutPendingBtn) logoutPendingBtn.addEventListener('click', performLogout);
  if (profileLogoutBtn) profileLogoutBtn.addEventListener('click', performLogout);
}

// Reset all forms
function resetForms() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.reset();
  if (registerForm) registerForm.reset();
}

// Initialize auth module
function initAuth() {
  const token = getToken();
  const user = getUser();

  console.log('Auth initialized:', { hasToken: !!token, hasUser: !!user, userRole: user?.role });

  if (token && user) {
    // Only run navigation redirection if we are on portal.html
    if (window.location.pathname.endsWith('portal.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
      navigateToPage(user);
    }
  } else {
    // Default starting view on portal.html
    showPage('portal-contact-page');
  }

  initLoginForm();
  initRegisterForm();
  initFormTabs();
  initLogoutButtons();
  initForgotPassword();
  initRegistrationLocationLogic();
}


// Registration Location Logic
function initRegistrationLocationLogic() {
  const countrySelect = document.getElementById('register-country');
  const provinceContainer = document.getElementById('province-container');

  if (!countrySelect || !provinceContainer) return;

  const saProvinces = [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 
    'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
  ];

  countrySelect.addEventListener('change', () => {
    const selectedCountry = countrySelect.value;

    if (selectedCountry === 'South Africa') {
      provinceContainer.innerHTML = `
        <select id="register-province" required>
          <option value="">-- Select Province --</option>
          ${saProvinces.map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
      `;
    } else {
      provinceContainer.innerHTML = `
        <input type="text" id="register-province" required placeholder="Enter your province">
      `;
    }
  });
}

// Forgot Password Logic
function initForgotPassword() {
  const modal = document.getElementById('forgot-password-modal');
  const link = document.getElementById('forgot-password-link');
  const closeBtn = document.getElementById('close-fp-modal');
  const fpForm = document.getElementById('forgot-password-form');
  const rpForm = document.getElementById('reset-password-form');
  const successMsg = document.getElementById('fp-success-msg');
  const doneBtn = document.getElementById('fp-done-btn');
  
  const fpError = document.getElementById('fp-error');
  const rpError = document.getElementById('rp-error');

  if (!modal || !link) return;

  // Open modal
  link.addEventListener('click', (e) => {
    e.preventDefault();
    fpForm.style.display = 'block';
    rpForm.style.display = 'none';
    successMsg.style.display = 'none';
    modal.style.display = 'flex';
    document.getElementById('fp-email').value = document.getElementById('login-email').value;
  });

  // Close modal
  const closeModal = () => {
    modal.style.display = 'none';
  };

  closeBtn.addEventListener('click', closeModal);
  doneBtn.addEventListener('click', closeModal);

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Step 1: Request Token
  fpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('fp-email').value;
    const submitBtn = document.getElementById('fp-submit-btn');
    
    fpError.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
      const response = await AuthAPI.forgotPassword(email);
      
      fpForm.style.display = 'none';
      rpForm.style.display = 'block';
      // Store email for reset step
      rpForm.dataset.email = email;
    } catch (error) {
      fpError.textContent = error.message;
      fpError.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Get Reset Code';
    }
  });

  // Step 2: Reset Password
  rpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = rpForm.dataset.email;
    const token = document.getElementById('rp-token').value;
    const newPassword = document.getElementById('rp-new-password').value;
    const submitBtn = document.getElementById('rp-submit-btn');

    rpError.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Resetting...';

    try {
      await AuthAPI.resetPassword(email, token, newPassword);
      rpForm.style.display = 'none';
      successMsg.style.display = 'block';
      document.getElementById('fp-modal-title').textContent = 'Success';
    } catch (error) {
      rpError.textContent = error.message;
      rpError.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Reset Password';
    }
  });
}

// Start auth init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});
