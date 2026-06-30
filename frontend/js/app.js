// Main App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Auth is initialized in auth.js
  // This file can be used for additional app-wide initialization
  
  initPortalNavigation();
  initPasswordToggles();
  initThemeToggle();
  initUpcomingEvents();
  initMobileMenu();
  initContactForm();
});

// Portal Selection Navigation
function initPortalNavigation() {
  const btnPortalHubLogin = document.getElementById('btn-portal-hub-login');
  
  if (btnPortalHubLogin) {
    btnPortalHubLogin.addEventListener('click', () => {
      if (window.showPage) {
        window.showPage('portal-login-page');
        const loginTab = document.querySelector('.tab-btn[data-tab="login"]');
        if (loginTab) loginTab.click();
      }
    });
  }

  // Handle Hash Routing
  function handleHashRouting() {
    if (window.location.hash === '#register') {
      if (window.showPage) {
        window.showPage('portal-login-page');
        const registerTab = document.querySelector('.tab-btn[data-tab="register"]');
        if (registerTab) registerTab.click();
      }
    } else if (window.location.hash === '#login') {
      if (window.showPage) {
        window.showPage('portal-login-page');
        const loginTab = document.querySelector('.tab-btn[data-tab="login"]');
        if (loginTab) loginTab.click();
      }
    }
  }

  // Handle on load
  handleHashRouting();

  // Handle on hash change
  window.addEventListener('hashchange', handleHashRouting);
}

// Upcoming Events Logic
async function initUpcomingEvents() {
  const container = document.getElementById('upcoming-events-container');
  const list = document.getElementById('events-list');
  const regModal = document.getElementById('event-registration-modal');
  const regForm = document.getElementById('event-registration-form');
  const closeBtn = document.getElementById('close-event-reg-modal');

  if (!container || !list) return;

  try {
    const events = await window.EventAPI.getUpcomingEvents();
    if (events && events.length > 0) {
      container.style.display = 'block';
      list.innerHTML = events.map(event => `
        <div class="event-card">
          <h4>${event.name}</h4>
          <div class="event-meta">
            <span>📅 ${new Date(event.date).toLocaleDateString()}</span>
            <span>🕒 ${event.time}</span>
          </div>
          <p class="event-desc">${event.description}</p>
          <button class="btn btn-primary btn-small register-event-btn" data-id="${event._id}" data-name="${event.name}">Register Now</button>
        </div>
      `).join('');

      // Add click listeners to register buttons
      document.querySelectorAll('.register-event-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idEl = document.getElementById('event-reg-id');
          const titleEl = document.getElementById('event-reg-title');
          if (!regModal || !idEl || !titleEl) {
            alert('Event registration is not available right now.');
            return;
          }
          idEl.value = btn.dataset.id;
          titleEl.textContent = `Register for ${btn.dataset.name}`;
          // Ensure modal is visible (some modals use inline display:none in HTML)
          try { regModal.style.display = 'flex'; } catch (e) {}
          regModal.classList.add('active');
        });
      });
    }
  } catch (error) {
    console.error('Error loading upcoming events:', error);
  }

  // Modal logic
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (regModal) {
        regModal.classList.remove('active');
        try { regModal.style.display = 'none'; } catch (e) {}
      }
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === regModal) {
      regModal.classList.remove('active');
      try { regModal.style.display = 'none'; } catch (e) {}
    }
  });

  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = regForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registering...';

      try {
        const data = {
          eventId: document.getElementById('event-reg-id').value,
          fullName: document.getElementById('event-reg-fullname').value,
          email: document.getElementById('event-reg-email').value,
          contactNumber: document.getElementById('event-reg-contact').value,
        };

        await window.EventAPI.register(data);
        alert('Registration successful! We will email you the MS Teams link shortly.');
        regForm.reset();
        if (regModal) { regModal.classList.remove('active'); try { regModal.style.display = 'none'; } catch (e) {} }
      } catch (error) {
        alert(error.message || 'Registration failed');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

// Theme Toggle Logic (Dark Mode)
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.btn-theme-toggle, #landing-theme-toggle, #webdev-theme-toggle, #home-theme-toggle');
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('zazele_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateToggleIcons(true);
  } else {
    updateToggleIcons(false);
  }

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('dark-mode');
      
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('zazele_theme', isDark ? 'dark' : 'light');
      
      updateToggleIcons(isDark);
    });
  });

  function updateToggleIcons(isDark) {
    const icon = isDark ? '☀️' : '🌙';
    const text = isDark ? 'Light Mode' : 'Dark Mode';
    
    themeToggles.forEach(t => {
      // Update icon span if exists
      const iconSpan = t.querySelector('.theme-icon');
      if (iconSpan) {
        iconSpan.textContent = icon;
        // Update text node if it's a profile menu button
        if (t.classList.contains('btn-theme-toggle')) {
           const textNode = Array.from(t.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
           if (textNode) textNode.textContent = ` ${text}`;
        }
      } else {
        // Fallback for simple toggles
        t.textContent = icon;
      }
    });
  }
}

// Password Visibility Toggle Logic
function initPasswordToggles() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-password')) {
      const icon = e.target;
      const targetId = icon.getAttribute('data-target');
      const input = document.getElementById(targetId);
      
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.textContent = '🙈'; // Switch to closed eye
        } else {
          input.type = 'password';
          icon.textContent = '👁️'; // Switch back to open eye
        }
      }
    }
  });
}

// Mobile Hamburger Menu Navigation Drawer
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (!toggleBtn || !mainNav) return;

  // Create overlay background dynamically if it doesn't exist
  let overlay = document.querySelector('.mobile-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
  }

  function toggleMenu() {
    const isActive = mainNav.classList.toggle('active');
    toggleBtn.classList.toggle('active', isActive);
    overlay.classList.toggle('active', isActive);
    document.body.classList.toggle('no-scroll', isActive);
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    mainNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when clicking navigation links (including sub-items or anchor clicks)
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu if user clicks outside of drawer
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !toggleBtn.contains(e.target) && mainNav.classList.contains('active')) {
      closeMenu();
    }
  });
}

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Auto-select subject from query parameters if present
  const urlParams = new URLSearchParams(window.location.search);
  const subjectParam = urlParams.get('subject');
  if (subjectParam) {
    const selectEl = document.getElementById('contact-subject');
    if (selectEl) {
      selectEl.value = subjectParam;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // Simulate sending with a timeout
    setTimeout(() => {
      alert('Thank you for contacting us! Bafana Binda and the Zazele Team will get back to you shortly.');
      form.reset();
      btn.disabled = false;
      btn.textContent = originalText;
    }, 1200);
  });
}
