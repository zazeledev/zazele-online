// Dashboard Deployment Sync & Environment Verification Module
const DeploymentModule = {
  FRONTEND_VERSION: '1.1.0',

  updateDeploymentSync(data) {
    if (!data) return;

    // Display basic versions
    const feVerEl = document.getElementById('fe-version');
    const beVerEl = document.getElementById('be-version');
    const syncStatusEl = document.getElementById('sync-status');
    const buildTimeEl = document.getElementById('build-timestamp');
    const gitCommitEl = document.getElementById('deploy-git-commit');
    const gitBranchEl = document.getElementById('deploy-git-branch');
    const deployEnvEl = document.getElementById('deploy-env');

    if (feVerEl) feVerEl.innerText = this.FRONTEND_VERSION;
    if (beVerEl) beVerEl.innerText = data.version || 'N/A';
    if (buildTimeEl) buildTimeEl.innerText = data.serverTime ? new Date(data.serverTime).toLocaleString() : 'N/A';
    if (gitCommitEl) gitCommitEl.innerText = data.gitCommit || 'N/A';
    if (gitBranchEl) gitBranchEl.innerText = data.branch || 'N/A';
    if (deployEnvEl) deployEnvEl.innerText = (data.environment || 'N/A').toUpperCase();

    // Check version synchronization
    if (syncStatusEl) {
      if (data.version && this.FRONTEND_VERSION === data.version) {
        syncStatusEl.innerHTML = '<span class="badge badge-pass">SYNCED</span>';
        syncStatusEl.style.color = 'var(--success)';
        Utils.clearAlert('card-sync');
      } else {
        syncStatusEl.innerHTML = '<span class="badge badge-fail">OUT OF SYNC</span>';
        syncStatusEl.style.color = 'var(--danger)';
        Utils.highlightAlert(
          'card-sync',
          'Frontend and Backend versions mismatch',
          `Frontend: v${this.FRONTEND_VERSION} vs Backend: v${data.version || 'unknown'}. Deploy matching builds.`
        );
      }
    }
  },

  // Perform environment verification checks (localhost leaks, base URLs)
  validateEnvironment(data) {
    if (!data) return;

    const apiBase = Utils.getApiBase();
    const uploadBase = Utils.getUploadBase();
    
    const isLocalApi = apiBase.includes('localhost') || apiBase.includes('127.0.0.1');
    const isPrivateApi = apiBase.includes('192.168.') || apiBase.includes('10.') || /^http:\/\/(172\.(1[6-9]|2[0-9]|3[0-1]))\./.test(apiBase);
    const isHttps = apiBase.startsWith('https://');
    
    // Mixed content validation
    const hasMixedContent = window.location.protocol === 'https:' && !isHttps;

    const envChecks = [
      {
        name: 'No Localhost URL Leak',
        status: !isLocalApi ? 'PASS' : 'FAIL',
        desc: !isLocalApi ? 'Production API configured' : 'API URL resolves to local address!'
      },
      {
        name: 'No Private IP Address Leak',
        status: !isPrivateApi ? 'PASS' : 'FAIL',
        desc: !isPrivateApi ? 'Endpoint is correctly public' : 'API URL is resolving to a private local subnet!'
      },
      {
        name: 'Secure HTTPS Connection',
        status: isHttps ? 'PASS' : 'WARNING',
        desc: isHttps ? 'Encrypted endpoint active' : 'API URL uses unencrypted HTTP protocol!'
      },
      {
        name: 'No Mixed Content Threats',
        status: !hasMixedContent ? 'PASS' : 'FAIL',
        desc: !hasMixedContent ? 'Assets protocol synced' : 'Mixed Content detected! Browser will block API calls!'
      },
      {
        name: 'Safe Environment Mode',
        status: (data.environment === 'production' || data.environment === 'prod') ? 'PASS' : 'WARNING',
        desc: `Active Node env is: ${data.environment || 'N/A'}`
      },
      {
        name: 'JWT Configured Safely',
        status: (data.jwt && data.jwt.status === 'configured') ? 'PASS' : 'FAIL',
        desc: (data.jwt && data.jwt.status === 'configured') ? 'Secret key loaded in backend process' : 'JWT_SECRET key is missing!'
      },
      {
        name: 'CORS Configuration Check',
        status: (data.cors && data.cors.origins && data.cors.origins.length > 0) ? 'PASS' : 'WARNING',
        desc: 'CORS origins restricted and validated'
      }
    ];

    const container = document.getElementById('env-validation-container');
    if (!container) return;
    container.innerHTML = ''; // Clear container

    for (const check of envChecks) {
      const card = document.createElement('div');
      card.className = `env-check-item ${check.status === 'FAIL' ? 'border-fail' : (check.status === 'WARNING' ? 'border-warning' : '')}`;
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.style.padding = '12px 16px';
      card.style.border = '1px solid var(--border-color)';
      card.style.borderRadius = '8px';
      card.style.backgroundColor = 'rgba(255,255,255,0.02)';
      card.style.marginBottom = '10px';

      let statusBadgeClass = 'badge-pass';
      if (check.status === 'FAIL') statusBadgeClass = 'badge-fail';
      else if (check.status === 'WARNING') statusBadgeClass = 'badge-warning';

      card.innerHTML = `
        <div>
          <span style="font-weight: 600; font-size: 0.95rem; display: block;">${check.name}</span>
          <span style="font-size: 0.8rem; color: var(--text-soft);">${check.desc}</span>
        </div>
        <span class="badge ${statusBadgeClass}">${check.status}</span>
      `;
      container.appendChild(card);
    }
  }
};
