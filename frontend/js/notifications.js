class NotificationsManager {
  constructor(type) {
    this.type = type; // 'student' or 'admin'
    this.elements = {
      btn: document.getElementById(`${type}-notification-btn`),
      dropdown: document.getElementById(`${type}-notification-dropdown`),
      list: document.getElementById(`${type}-notification-list`),
      count: document.getElementById(`${type}-unread-count`),
      markAllBtn: document.getElementById(`${type}-mark-all-read`)
    };
    this.init();
  }

  init() {
    if (!this.elements.btn) return;

    this.elements.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    if (this.elements.markAllBtn) {
      this.elements.markAllBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.markAllAsRead();
      });
    }

    document.addEventListener('click', () => {
      this.closeDropdown();
    });

    this.elements.dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Initial fetch
    this.refresh();
    
    // Poll for new notifications every 60 seconds
    setInterval(() => this.refresh(), 60000);
  }

  async refresh() {
    const token = localStorage.getItem('zazele_token');
    if (!token) return;

    try {
      const [notifications, unreadData] = await Promise.all([
        NotificationAPI.getNotifications(token),
        NotificationAPI.getUnreadCount(token)
      ]);

      this.renderNotifications(notifications);
      this.updateBadge(unreadData.count);
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    }
  }

  toggleDropdown() {
    const isActive = this.elements.dropdown.classList.contains('active');
    // Close other dropdowns if any
    document.querySelectorAll('.notification-dropdown').forEach(d => d.classList.remove('active'));
    
    if (!isActive) {
      this.elements.dropdown.classList.add('active');
      this.refresh();
    }
  }

  closeDropdown() {
    if (this.elements.dropdown) {
      this.elements.dropdown.classList.remove('active');
    }
  }

  updateBadge(count) {
    if (!this.elements.count) return;
    
    if (count > 0) {
      this.elements.count.textContent = count > 9 ? '9+' : count;
      this.elements.count.style.display = 'flex';
    } else {
      this.elements.count.style.display = 'none';
    }
  }

  renderNotifications(notifications) {
    if (!this.elements.list) return;

    if (notifications.length === 0) {
      this.elements.list.innerHTML = '<div class="no-notifications">No new notifications</div>';
      return;
    }

    this.elements.list.innerHTML = notifications.map(n => `
      <div class="notification-item ${n.isRead ? '' : 'unread'}" data-id="${n._id}" data-link="${n.link || ''}">
        <div class="message">${n.message}</div>
        <div class="time">${this.formatTime(n.createdAt)}</div>
      </div>
    `).join('');

    // Add click listeners to items
    this.elements.list.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', async () => {
        const id = item.dataset.id;
        const link = item.dataset.link;
        await this.handleNotificationClick(id, link);
      });
    });
  }

  async handleNotificationClick(id, link) {
    const token = localStorage.getItem('zazele_token');
    try {
      await NotificationAPI.markAsRead(token, id);
      this.closeDropdown();
      this.refresh();

      if (link) {
        if (link.startsWith('#')) {
          const [path, queryString] = link.split('?');
          const params = new URLSearchParams(queryString || '');
          const targetSection = path.substring(1);

          if (this.type === 'admin') {
            // Map common notification links to admin sections
            let adminSection = targetSection.replace('admin-', '');
            if (adminSection === 'support-requests') adminSection = 'support-sessions';
            if (adminSection === 'profile-updates') adminSection = 'profile-requests';

            const navItem = document.querySelector(`.admin-nav-item[data-section="${adminSection}"]`);
            if (navItem) navItem.click();
          } else {
            // Student Redirection
            if (targetSection === 'support-session' || targetSection === 'support-page') {
              const moduleId = params.get('moduleId');
              if (moduleId && window.openModuleViewer) {
                // Open the specific module first
                await window.openModuleViewer(moduleId);
                // Then switch to the support tab
                setTimeout(() => {
                  const supportTab = document.getElementById('tab-btn-support');
                  if (supportTab) supportTab.click();
                  // Scroll to support requests
                  const supportList = document.getElementById('support-requests-list');
                  if (supportList) supportList.scrollIntoView({ behavior: 'smooth' });
                }, 500);
              } else {
                // Fallback to dashboard
                const dashboardNav = document.getElementById('dashboard-page');
                if (dashboardNav) {
                   document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                   dashboardNav.classList.add('active');
                }
              }
            } else if (targetSection === 'profile-page') {
               const profileBtn = document.getElementById('profile-badge');
               if (profileBtn) profileBtn.click();
            } else {
               // Default hash navigation
               window.location.hash = link;
            }
          }
        } else {
          window.location.href = link;
        }
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  }

  async markAllAsRead() {
    const token = localStorage.getItem('zazele_token');
    try {
      await NotificationAPI.markAllAsRead(token);
      this.refresh();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }

  formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }
}

// Global initialization helper
window.initNotifications = (type) => {
  return new NotificationsManager(type);
};
