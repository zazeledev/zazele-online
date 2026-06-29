// Main App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Auth is initialized in auth.js
  // This file can be used for additional app-wide initialization
  
  initPortalNavigation();
  initPasswordToggles();
  initThemeToggle();
  initUpcomingEvents();
});

// Portal Selection Navigation
function initPortalNavigation() {
  const btnCourses = document.getElementById('btn-home-courses');
  const btnWebDev = document.getElementById('btn-home-webdev');
  const btnSrvCourses = document.getElementById('btn-srv-courses');
  const btnSrvWebdev = document.getElementById('btn-srv-webdev');
  const btnPortalLogin = document.getElementById('btn-home-portal-login');
  const btnPortalHubLogin = document.getElementById('btn-portal-hub-login');
  const backBtns = document.querySelectorAll('.btn-back-to-portal');

  if (btnCourses) {
    btnCourses.addEventListener('click', () => {
      if (window.showPage) window.showPage('landing-page');
    });
  }

  if (btnWebDev) {
    btnWebDev.addEventListener('click', () => {
      if (window.showPage) window.showPage('webdev-page');
    });
  }

  if (btnSrvCourses) {
    btnSrvCourses.addEventListener('click', () => {
      if (window.showPage) window.showPage('courses-list-page');
    });
  }

  if (btnSrvWebdev) {
    btnSrvWebdev.addEventListener('click', () => {
      if (window.showPage) window.showPage('webdev-packages-page');
    });
  }

  if (btnPortalLogin) {
    btnPortalLogin.addEventListener('click', () => {
      if (window.showPage) {
        window.showPage('portal-login-page');
        const loginTab = document.querySelector('.tab-btn[data-tab="login"]');
        if (loginTab) loginTab.click();
      }
    });
  }

  if (btnPortalHubLogin) {
    btnPortalHubLogin.addEventListener('click', () => {
      if (window.showPage) {
        window.showPage('portal-login-page');
        const loginTab = document.querySelector('.tab-btn[data-tab="login"]');
        if (loginTab) loginTab.click();
      }
    });
  }

  const linkFooterLogin = document.getElementById('link-footer-login');
  const linkFooterRegister = document.getElementById('link-footer-register');

  if (linkFooterLogin) {
    linkFooterLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) {
        window.showPage('portal-login-page');
        const loginTab = document.querySelector('.tab-btn[data-tab="login"]');
        if (loginTab) loginTab.click();
      }
    });
  }

  if (linkFooterRegister) {
    linkFooterRegister.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) {
        window.showPage('portal-login-page');
        const registerTab = document.querySelector('.tab-btn[data-tab="register"]');
        if (registerTab) registerTab.click();
      }
    });
  }

  // Bind homepage navbar link overrides
  document.querySelectorAll('.nav-link-home-hero').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('selection-portal');
    });
  });

  document.querySelectorAll('.nav-link-home-mission').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('mission-page');
    });
  });

  document.querySelectorAll('.nav-link-home-services').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('services-page');
    });
  });

  document.querySelectorAll('.nav-link-home-why').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('why-us-page');
    });
  });

  document.querySelectorAll('.nav-link-home-contact').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('portal-contact-page');
    });
  });

  // Bind course portal navbar link overrides
  document.querySelectorAll('.nav-link-courses-home').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('landing-page');
    });
  });

  document.querySelectorAll('.nav-link-courses-list').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('courses-list-page');
    });
  });

  document.querySelectorAll('.nav-link-courses-about').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('about-zazele-page');
    });
  });

  document.querySelectorAll('.nav-link-courses-portal').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) {
        window.showPage('portal-login-page');
        const triggerTab = link.dataset.tabTrigger || 'login';
        const tabEl = document.querySelector(`.tab-btn[data-tab="${triggerTab}"]`);
        if (tabEl) tabEl.click();
      }
    });
  });

  // Bind web dev portal navbar link overrides
  document.querySelectorAll('.nav-link-webdev-home').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('webdev-page');
    });
  });

  document.querySelectorAll('.nav-link-webdev-packages').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('webdev-packages-page');
    });
  });

  document.querySelectorAll('.nav-link-webdev-about').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('webdev-about-page');
    });
  });

  backBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.showPage) window.showPage('selection-portal');
    });
  });
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
