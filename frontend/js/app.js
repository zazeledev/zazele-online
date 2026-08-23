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
  initWhatsAppButton();
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
      const calendarSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:4px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
      const clockSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
      
      list.innerHTML = events.map(event => `
        <div class="event-card">
          <h4>${event.name}</h4>
          <div class="event-meta">
            <span>${calendarSvg}${new Date(event.date).toLocaleDateString()}</span>
            <span>${clockSvg}${event.time}</span>
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
          regModal.classList.add('active');
          regModal.style.display = 'flex';
          regModal.setAttribute('aria-hidden', 'false');
        });
      });
    }
  } catch (error) {
    console.error('Failed to load events:', error);
  }
}

// Global Modal Handlers
function initModals() {
  const regModal = document.getElementById('event-registration-modal');
  const closeBtn = document.getElementById('close-event-reg-modal');
  const regForm = document.getElementById('event-registration-form');

  if (closeBtn && regModal) {
    closeBtn.addEventListener('click', () => {
      regModal.classList.remove('active');
      regModal.style.display = 'none';
      regModal.setAttribute('aria-hidden', 'true');
    });
  }

  // Handle Event Form Submission
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const eventId = document.getElementById('event-reg-id').value;
      const name = document.getElementById('event-reg-name').value;
      const email = document.getElementById('event-reg-email').value;
      const phone = document.getElementById('event-reg-phone').value;

      try {
        await window.EventAPI.register({ eventId, fullName: name, email, contactNumber: phone });
        alert('Registration successful! Check your email for confirmation.');
        regModal.classList.remove('active');
        regModal.style.display = 'none';
        regModal.setAttribute('aria-hidden', 'true');
        regForm.reset();
      } catch (err) {
        alert(`Registration failed: ${err.message}`);
      }
    });
  }
}

// Theme Toggle Logic (Dark Mode)
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.btn-theme-toggle, #landing-theme-toggle, #webdev-theme-toggle, #home-theme-toggle, .theme-toggle');
  
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
    const text = isDark ? 'Light Mode' : 'Dark Mode';
    
    themeToggles.forEach(t => {
      const iconSpan = t.querySelector('.theme-icon');
      if (iconSpan) {
        iconSpan.innerHTML = isDark 
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="2" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        
        if (t.classList.contains('btn-theme-toggle')) {
           const textNode = Array.from(t.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
           if (textNode) textNode.textContent = ` ${text}`;
        }
      }
    });
  }
}

// Password Visibility Toggle Logic
function initPasswordToggles() {
  const eyeOpenSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeClosedSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.toggle-password');
    if (toggle) {
      const targetId = toggle.getAttribute('data-target');
      const input = document.getElementById(targetId);
      
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          toggle.innerHTML = eyeClosedSvg;
        } else {
          input.type = 'password';
          toggle.innerHTML = eyeOpenSvg;
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

// Floating WhatsApp Business Button
function initWhatsAppButton() {
  // 1. Determine support hour status (SAST: UTC+2)
  const now = new Date();
  const sastHour = (now.getUTCHours() + 2) % 24;
  const isOnline = sastHour >= 8 && sastHour < 17;
  
  // 2. Determine page-specific pre-filled message
  const pathname = window.location.pathname.toLowerCase();
  let rawMessage = "Hi! I'm interested in your services. Could you please provide more information?";
  
  if (pathname.includes('courses.html') || pathname.includes('course')) {
    rawMessage = "Hi! I'm interested in your online computer training courses. Could you please send me more information and the course schedule?";
  } else if (pathname.includes('services.html') || pathname.includes('service')) {
    rawMessage = "Hi! I'd like a quote for a website. Could you please tell me more about your website development services?";
  } else if (pathname.includes('contact.html') || pathname.includes('contact')) {
    rawMessage = "Hi! I'd like to enquire about your services.";
  }
  
  const encodedMessage = encodeURIComponent(rawMessage);
  const waUrl = `https://wa.me/27798420873?text=${encodedMessage}`;
  
  // 3. Create the floating button element
  const waBtn = document.createElement('a');
  waBtn.href = waUrl;
  waBtn.className = 'whatsapp-floating-btn';
  waBtn.target = '_blank';
  waBtn.rel = 'noopener noreferrer';
  waBtn.setAttribute('aria-label', isOnline ? 'Chat with us on WhatsApp (Online)' : 'Leave a message on WhatsApp (Offline)');
  waBtn.setAttribute('title', isOnline ? 'Chat with us on WhatsApp (Online)' : 'Leave a message on WhatsApp (Offline)');
  
  const tooltipText = isOnline ? 'Chat with us on WhatsApp' : 'Offline - Leave a message';
  const statusClass = isOnline ? 'online' : 'offline';
  
  // Icon, Tooltip, and Status Dot markup
  waBtn.innerHTML = `
    <span class="whatsapp-tooltip">${tooltipText}</span>
    <span class="whatsapp-status-dot ${statusClass}"></span>
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.59 2.016 14.12 1.01 11.5 1.012c-5.437 0-9.862 4.371-9.866 9.8.001 1.955.513 3.866 1.482 5.568l-1.009 3.687 3.774-.989zm11.758-6.974c-.31-.155-1.826-.9-2.106-1.002-.275-.101-.477-.153-.677.147-.2.3-.777.98-.952 1.18-.175.2-.351.224-.661.07-.31-.155-1.307-.48-2.486-1.531-.918-.819-1.537-1.83-1.717-2.139-.18-.3-.02-.463.135-.617.14-.139.31-.362.466-.543.155-.181.206-.31.31-.517.103-.207.052-.388-.026-.543-.078-.155-.677-1.633-.928-2.239-.244-.589-.493-.51-.677-.52l-.578-.01c-.2 0-.527.075-.803.376-.276.3-1.054 1.03-1.054 2.51 0 1.48 1.08 2.913 1.23 3.116.15.203 2.126 3.242 5.15 4.547.719.31 1.28.495 1.718.633.723.23 1.381.198 1.9.12.578-.087 1.826-.747 2.083-1.469.258-.722.258-1.342.181-1.469-.077-.127-.278-.201-.588-.356z"/>
    </svg>
  `;
  
  // 4. Trigger wobble animation after 5 seconds
  setTimeout(() => {
    waBtn.classList.add('wobble');
    setTimeout(() => {
      waBtn.classList.remove('wobble');
    }, 1200);
  }, 5000);
  
  // 5. Append to body
  document.body.appendChild(waBtn);
}
