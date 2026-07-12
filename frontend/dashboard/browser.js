// Dashboard Browser Diagnostics Log Module
const BrowserDiagnosticsModule = {
  logs: [],

  init() {
    this.logs = [];
    this.setupListeners();
    this.interceptConsole();
    this.interceptFetch();
    this.renderLogs();
  },

  addLog(type, message, details = '') {
    const logItem = {
      timestamp: new Date().toLocaleTimeString(),
      type, // 'error' | 'warning' | 'network' | 'info'
      message,
      details
    };
    
    // Add to start of log array
    this.logs.unshift(logItem);
    
    // Cap log list size to 50 entries
    if (this.logs.length > 50) {
      this.logs.pop();
    }
    
    this.renderLogs();
  },

  setupListeners() {
    // 1. Uncaught script exceptions
    window.addEventListener('error', (event) => {
      const msg = event.message || 'Script Error';
      const source = event.filename ? `at ${event.filename}:${event.lineno}` : '';
      this.addLog('error', msg, source);
    });

    // 2. Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const msg = event.reason ? (event.reason.message || String(event.reason)) : 'Unhandled Promise Rejection';
      this.addLog('error', msg, 'Promise Rejection');
    });
  },

  interceptConsole() {
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      // Filter out standard HMR warnings or noise if any
      if (!msg.includes('[HMR]')) {
        this.addLog('warning', msg, 'Console Warning');
      }
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      this.addLog('error', msg, 'Console Error');
    };
  },

  interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'object' ? args[0].url : args[0];
      try {
        const response = await originalFetch.apply(window, args);
        if (!response.ok) {
          const method = args[1]?.method || 'GET';
          this.addLog('network', `Failed request ${method} ${url}`, `HTTP Status: ${response.status}`);
        }
        return response;
      } catch (err) {
        this.addLog('network', `Network error fetching ${url}`, err.message);
        throw err;
      }
    };
  },

  renderLogs() {
    const consoleLogsContainer = document.getElementById('browser-logs-container');
    if (!consoleLogsContainer) return;

    if (this.logs.length === 0) {
      consoleLogsContainer.innerHTML = `<div style="color: var(--text-soft); font-style: italic; text-align: center; padding: 20px;">No browser diagnostic events recorded. Monitoring active...</div>`;
      return;
    }

    consoleLogsContainer.innerHTML = this.logs.map(log => {
      let icon = 'ℹ️';
      let colorClass = '';
      if (log.type === 'error') {
        icon = '🔴';
        colorClass = 'color: var(--danger);';
      } else if (log.type === 'warning') {
        icon = '⚠️';
        colorClass = 'color: var(--warning);';
      } else if (log.type === 'network') {
        icon = '🌐';
        colorClass = 'color: #38bdf8;';
      }

      return `
        <div style="padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); font-family: monospace; font-size: 0.85rem; display: flex; flex-direction: column; gap: 2px;">
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-size: 0.75rem; color: var(--text-soft);">${log.timestamp}</span>
            <span>${icon}</span>
            <span style="font-weight: 600; ${colorClass}">${log.message}</span>
          </div>
          ${log.details ? `<div style="color: var(--text-soft); padding-left: 55px; font-size: 0.8rem;">${log.details}</div>` : ''}
        </div>
      `;
    }).join('');
  }
};
