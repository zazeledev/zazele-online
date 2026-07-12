// Dashboard Operations Core Controller (Monitor Engine)
const MonitorModule = {
  currentReport: null,

  async init() {
    // 1. Check production configurations safety check first
    const sanity = Utils.checkProductionSanity();
    if (!sanity.valid) {
      this.renderCriticalError(sanity.error);
      return;
    }

    // 2. Start browser diagnostics logger
    BrowserDiagnosticsModule.init();

    // 3. Render any pre-loaded deployment history
    this.renderDeploymentHistory();

    // 4. Perform initial loading sequence
    await this.refreshVitals();
    await this.loadLatestReport();
    await ApiTestsModule.runAllApiTests();

    // 5. Add event listeners for diagnoses and exports
    this.setupEventListeners();

    // 6. Automatically run diagnosis on first page load
    setTimeout(() => {
      document.getElementById('btn-diagnose')?.click();
    }, 1000);
  },

  renderCriticalError(error) {
    document.body.innerHTML = `
      <div style="max-width: 600px; margin: 100px auto; background-color: #7f1d1d; border: 2px solid #ef4444; border-radius: 12px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; font-family: 'Inter', sans-serif; color: #fff;">
        <div style="font-size: 4rem; margin-bottom: 20px;">❌</div>
        <h1 style="font-family: 'Outfit', sans-serif; font-size: 2.1rem; font-weight: 700; margin-bottom: 15px; letter-spacing: -0.5px;">CRITICAL CONFIGURATION ERROR</h1>
        <p style="font-size: 1.1rem; color: #fca5a5; line-height: 1.6; margin-bottom: 25px;">${error}</p>
        <div style="background-color: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; text-align: left; border-left: 4px solid #ef4444; line-height: 1.5;">
          <strong>Action Required:</strong> You are accessing the dashboard from a live production hostname, but your runtime environment configuration references a localhost address.<br><br>
          Verify your Vercel/cPanel environment setup variables (like VITE_API_URL or VITE_UPLOAD_URL) and replace localhost endpoints with secure public URLs (e.g. https://api.zazele.online/api).
        </div>
      </div>
    `;
  },

  // Periodic vitals checking (invoked every 30s)
  async refreshVitals() {
    const apiBase = Utils.getApiBase();
    const start = Date.now();
    try {
      const res = await fetch(`${apiBase}/health`);
      const latency = Date.now() - start;
      
      const latencyEl = document.getElementById('vital-latency');
      if (latencyEl) latencyEl.innerText = `${latency} ms`;

      if (res.ok) {
        const data = await res.json();
        
        // Populate modules
        HealthModule.updateHealthStats(data);
        DeploymentModule.updateDeploymentSync(data);
        DeploymentModule.validateEnvironment(data);

        // Update active API status tag
        const serverStatusIndicator = document.getElementById('indicator-server');
        const serverStatusText = document.getElementById('text-server');
        if (serverStatusIndicator) serverStatusIndicator.className = 'indicator indicator-success';
        if (serverStatusText) serverStatusText.innerText = 'Online';
        Utils.clearAlert('card-server');

        this.calculateSystemScore(data);
      } else {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
    } catch (e) {
      console.error('System health check failed:', e.message);
      // Mark server offline
      const serverStatusIndicator = document.getElementById('indicator-server');
      const serverStatusText = document.getElementById('text-server');
      if (serverStatusIndicator) serverStatusIndicator.className = 'indicator indicator-danger';
      if (serverStatusText) serverStatusText.innerText = 'Offline';
      
      Utils.highlightAlert('card-server', 'Backend server unreachable', 'Verify backend hosting instance is running and CORS parameters allow requests.');
      this.calculateSystemScore(null);
    }
  },

  // Load and populate test report results
  async loadLatestReport() {
    const apiBase = Utils.getApiBase();
    try {
      const res = await fetch(`${apiBase}/qa/latest`);
      if (!res.ok) throw new Error('Failed to fetch latest report');
      
      const report = await res.json();
      this.currentReport = report;
      this.renderReport(report);
      this.calculateSystemScore();
    } catch (e) {
      console.warn('Could not retrieve latest report:', e.message);
    }
  },

  renderReport(report) {
    if (!report) return;

    // Set meta tags
    const metaTimestamp = document.getElementById('meta-timestamp');
    const metaEnv = document.getElementById('meta-env');
    const metaPassed = document.getElementById('meta-passed');
    const metaFailed = document.getElementById('meta-failed');
    const metaWarnings = document.getElementById('meta-warnings');

    if (metaTimestamp) metaTimestamp.innerText = new Date(report.timestamp).toLocaleString();
    if (metaEnv) metaEnv.innerText = (report.environment || 'production').toUpperCase();
    if (metaPassed) metaPassed.innerText = report.passed || 0;
    if (metaFailed) metaFailed.innerText = report.failed || 0;
    if (metaWarnings) metaWarnings.innerText = report.warnings || 0;

    // Render timeline steps
    this.updateTimeline(report);

    // Populate Results Table
    const tbody = document.getElementById('test-report-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let hasTests = false;
    for (const [suiteName, tests] of Object.entries(report.suites)) {
      if (!tests || tests.length === 0) continue;
      hasTests = true;
      for (const test of tests) {
        const tr = document.createElement('tr');
        let statusBadgeClass = 'badge-pass';
        if (test.status === 'FAIL') statusBadgeClass = 'badge-fail';
        else if (test.status === 'WARNING') statusBadgeClass = 'badge-warning';

        tr.innerHTML = `
          <td>
            <span style="font-weight: 500;">${test.name}</span>
            ${test.message ? `<span class="error-msg" style="display:block; font-size: 0.8rem; color: var(--danger); margin-top: 4px;">${test.message}</span>` : ''}
          </td>
          <td><span style="color: var(--text-soft); font-size: 0.85rem;">${suiteName.toUpperCase()}</span></td>
          <td><span class="badge ${statusBadgeClass}">${test.status}</span></td>
        `;
        tbody.appendChild(tr);
      }
    }

    if (!hasTests) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align: center; color: var(--text-soft); padding: 30px; font-style: italic;">
            ${report.message || 'No tests run yet. Press the Full Diagnosis button to initiate checks.'}
          </td>
        </tr>
      `;
    }

    // Populate Failure Assistant
    const failureAssistantContainer = document.getElementById('failure-assistant-container');
    if (failureAssistantContainer) {
      failureAssistantContainer.innerHTML = '';
      let failureCount = 0;
      
      for (const [suiteName, tests] of Object.entries(report.suites)) {
        for (const test of tests) {
          if (test.status === 'FAIL' || test.status === 'WARNING') {
            failureCount++;
            const advice = FailureAssistant.getAssistance(test.name, test.message);
            const alertCard = document.createElement('div');
            alertCard.className = `vital-card ${test.status === 'FAIL' ? 'alert-failure' : 'alert-warning'}`;
            alertCard.style.marginBottom = '15px';
            alertCard.style.borderLeft = `4px solid ${test.status === 'FAIL' ? 'var(--danger)' : 'var(--warning)'}`;
            alertCard.innerHTML = `
              <div style="font-weight: 700; color: ${test.status === 'FAIL' ? 'var(--danger)' : 'var(--warning)'}; margin-bottom: 8px;">
                ${test.status === 'FAIL' ? '❌' : '⚠️'} ${test.name}
              </div>
              <div style="font-size: 0.85rem; margin-bottom: 6px;">
                <strong>Reason:</strong> ${advice.reason}
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px; line-height: 1.4;">
                <strong>Likely Cause:</strong> ${advice.cause}
              </div>
              <div style="font-size: 0.85rem; background-color: rgba(0,0,0,0.25); padding: 10px; border-radius: 6px; border-left: 3px solid var(--primary); margin-top: 10px; line-height: 1.4;">
                <strong>Recommended Fix:</strong> ${advice.fix}
              </div>
            `;
            failureAssistantContainer.appendChild(alertCard);
          }
        }
      }

      if (failureCount === 0) {
        failureAssistantContainer.innerHTML = `
          <div style="color: var(--success); font-style: italic; text-align: center; padding: 20px; font-weight: 500;">
            🟢 All checks operating within safe production parameters.
          </div>
        `;
      }
    }
  },

  updateTimeline(report) {
    const steps = [
      { id: 'step-deploy-started', name: 'Deployment Active' },
      { id: 'step-backend-started', name: 'Backend Online' },
      { id: 'step-db-connected', name: 'Database Connected' },
      { id: 'step-smoke-passed', name: 'Smoke Tests Passed' },
      { id: 'step-diagnostics-complete', name: 'Latest Validation Complete' }
    ];

    const isBackendOnline = document.getElementById('text-server')?.innerText === 'Online';
    const isDbConnected = document.getElementById('text-db')?.innerText === 'Connected';
    const hasReport = report && report.passed > 0;
    const hasFailures = report && report.failed > 0;

    steps.forEach((step, idx) => {
      const el = document.getElementById(step.id);
      if (!el) return;
      
      let completed = false;
      if (idx === 0) completed = true; // Deployment is active by layout loads
      if (idx === 1) completed = isBackendOnline;
      if (idx === 2) completed = isDbConnected;
      if (idx === 3) completed = hasReport && !hasFailures;
      if (idx === 4) completed = hasReport;

      if (completed) {
        el.className = 'timeline-step step-complete';
      } else {
        el.className = 'timeline-step step-pending';
      }
    });
  },

  calculateSystemScore(healthData) {
    let score = 100;
    let statusText = 'Healthy';
    let statusClass = 'status-active';

    // 1. Evaluate Backend online
    const isBackendOnline = document.getElementById('text-server')?.innerText === 'Online';
    const isDbConnected = document.getElementById('text-db')?.innerText === 'Connected';
    const isUploadsHealthy = document.getElementById('text-uploads')?.innerText === 'Writable';

    if (!isBackendOnline) score -= 40;
    if (!isDbConnected) score -= 30;
    if (!isUploadsHealthy) score -= 15;

    // 2. Evaluate Report failures
    if (this.currentReport) {
      const failedCount = this.currentReport.failed || 0;
      const warningCount = this.currentReport.warnings || 0;
      score -= (failedCount * 10);
      score -= (warningCount * 3);
    }

    // Cap score constraints
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    // Determine status text based on score
    if (score === 100) {
      statusText = 'Excellent';
      statusClass = 'status-active';
    } else if (score >= 80) {
      statusText = 'Healthy';
      statusClass = 'status-active';
    } else if (score >= 50) {
      statusText = 'Warning';
      statusClass = 'status-warning';
    } else {
      statusText = 'Critical';
      statusClass = 'status-danger';
    }

    // Populate score indicators
    const scoreVal = document.getElementById('score-value');
    const scoreTag = document.getElementById('score-status-tag');
    if (scoreVal) scoreVal.innerText = `${score}%`;
    if (scoreTag) {
      scoreTag.innerText = statusText;
      scoreTag.className = `status-tag ${statusClass}`;
    }

    // Render final deployment gate verdict
    const verdictTitle = document.getElementById('gate-verdict-title');
    const verdictSubtitle = document.getElementById('gate-verdict-subtitle');
    const verdictCard = document.getElementById('gate-verdict-card');

    if (verdictTitle && verdictCard) {
      if (score >= 80 && isBackendOnline && isDbConnected) {
        verdictCard.style.backgroundColor = 'rgba(16, 185, 129, 0.08)';
        verdictCard.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        verdictTitle.innerHTML = `<span style="color: var(--success); font-weight: bold;">🟢 PRODUCTION READY</span>`;
        verdictSubtitle.innerText = 'All core metrics check out cleanly. Secure deployment gate checks passed.';
      } else {
        verdictCard.style.backgroundColor = 'rgba(244, 63, 94, 0.08)';
        verdictCard.style.borderColor = 'rgba(244, 63, 94, 0.3)';
        verdictTitle.innerHTML = `<span style="color: var(--danger); font-weight: bold;">🔴 DO NOT DEPLOY</span>`;
        verdictSubtitle.innerText = 'One or more critical validation checkpoints failed. Resolve conflicts before releasing.';
      }
    }
  },

  saveDeploymentHistory(report, score) {
    if (!report) return;
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('zazele_deployment_history')) || [];
    } catch (e) {}

    // Avoid duplicate records for the exact same timestamp
    const exists = history.some(item => item.timestamp === report.timestamp);
    if (!exists) {
      history.unshift({
        timestamp: report.timestamp,
        gitCommit: report.gitCommit || 'N/A',
        version: report.version || '1.1.0',
        score: score,
        status: (report.failed > 0 || score < 80) ? 'FAIL' : 'PASS'
      });
      
      // Cap at 10 records
      if (history.length > 10) history.pop();
      localStorage.setItem('zazele_deployment_history', JSON.stringify(history));
    }
    this.renderDeploymentHistory();
  },

  renderDeploymentHistory() {
    const tbody = document.getElementById('deployment-history-tbody');
    if (!tbody) return;

    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('zazele_deployment_history')) || [];
    } catch (e) {}

    if (history.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-soft); padding: 20px; font-style: italic;">
            No diagnostic validation logs recorded yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = history.map(item => {
      const badge = item.status === 'PASS' 
        ? '<span class="badge badge-pass">PASS</span>' 
        : '<span class="badge badge-fail">FAIL</span>';
      
      return `
        <tr>
          <td>${new Date(item.timestamp).toLocaleTimeString()}</td>
          <td style="font-family: monospace;">${item.gitCommit.substring(0, 7)}</td>
          <td>v${item.version}</td>
          <td style="font-weight: 600; color: ${item.score >= 80 ? 'var(--success)' : (item.score >= 50 ? 'var(--warning)' : 'var(--danger)')}">${item.score}%</td>
          <td>${badge}</td>
        </tr>
      `;
    }).join('');
  },

  setupEventListeners() {
    // 1. Run Full System Diagnosis Trigger
    const diagBtn = document.getElementById('btn-diagnose');
    if (diagBtn) {
      diagBtn.addEventListener('click', async () => {
        diagBtn.disabled = true;
        diagBtn.innerText = 'Diagnosing System...';
        diagBtn.style.opacity = '0.7';

        const apiBase = Utils.getApiBase();
        try {
          const res = await fetch(`${apiBase}/qa/diagnose`, { method: 'POST' });
          if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
          
          const report = await res.json();
          this.currentReport = report;
          this.renderReport(report);
          
          // Refresh health metrics alongside report
          await this.refreshVitals();
          await ApiTestsModule.runAllApiTests();
          
          // Save and render history record
          let finalScore = 100;
          if (report.failed > 0) finalScore -= (report.failed * 10);
          if (report.warnings > 0) finalScore -= (report.warnings * 3);
          if (finalScore < 0) finalScore = 0;
          this.saveDeploymentHistory(report, finalScore);

        } catch (e) {
          console.error(e);
        } finally {
          diagBtn.disabled = false;
          diagBtn.innerText = 'Run Full Production Diagnosis';
          diagBtn.style.opacity = '1';
        }
      });
    }

    // 2. Export Actions Dropdown listener
    const exportSel = document.getElementById('export-report-select');
    if (exportSel) {
      exportSel.addEventListener('change', (e) => {
        const fmt = e.target.value;
        if (!fmt) return;

        if (fmt === 'json') ReportsModule.exportJson(this.currentReport);
        else if (fmt === 'markdown') ReportsModule.exportMarkdown(this.currentReport);
        else if (fmt === 'html') ReportsModule.exportHtml(this.currentReport);
        else if (fmt === 'csv') ReportsModule.exportCsv(this.currentReport);
        
        // Reset dropdown
        e.target.value = '';
      });
    }
  }
};

// Initialize Dashboard Core monitor once DOM loads
window.addEventListener('DOMContentLoaded', () => {
  MonitorModule.init();
  
  // Auto-refresh stats every 30 seconds
  setInterval(() => {
    MonitorModule.refreshVitals();
  }, 30000);
});
