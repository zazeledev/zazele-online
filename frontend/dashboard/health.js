// Dashboard Health Metrics Module
const HealthModule = {
  // Update system metrics & database information panels
  updateHealthStats(data) {
    if (!data) return;

    // Database Connection State
    const db = data.databaseDetails || {};
    const dbIndicator = document.getElementById('indicator-db');
    const dbText = document.getElementById('text-db');
    
    if (db.status === 'connected') {
      if (dbIndicator) dbIndicator.className = 'indicator indicator-success';
      if (dbText) dbText.innerText = 'Connected';
      Utils.clearAlert('card-database');
    } else {
      if (dbIndicator) dbIndicator.className = 'indicator indicator-danger';
      if (dbText) dbText.innerText = 'Disconnected';
      Utils.highlightAlert('card-database', 'Mongoose readyState is not connected', 'Ensure MongoDB daemon is running and Atlas IP whitelist allows connections.');
    }

    // Database expanded information
    const dbNameEl = document.getElementById('db-name');
    const dbPingEl = document.getElementById('db-ping');
    const dbCollectionsEl = document.getElementById('db-collections');
    const dbReconnectionsEl = document.getElementById('db-reconnections');
    const dbLastConnectedEl = document.getElementById('db-last-connected');

    if (dbNameEl) dbNameEl.innerText = db.name || 'N/A';
    if (dbPingEl) dbPingEl.innerText = db.pingTimeMs >= 0 ? `${db.pingTimeMs} ms` : 'N/A';
    if (dbReconnectionsEl) dbReconnectionsEl.innerText = db.reconnectAttempts !== undefined ? db.reconnectAttempts : '0';
    if (dbLastConnectedEl) dbLastConnectedEl.innerText = db.lastConnection || 'N/A';
    if (dbCollectionsEl && db.collections) {
      dbCollectionsEl.innerText = db.collections.join(', ') || 'None';
    }

    // Uploads Health Check
    const uploads = data.uploads || {};
    const uploadsIndicator = document.getElementById('indicator-uploads');
    const uploadsText = document.getElementById('text-uploads');
    if (uploads.status === 'healthy') {
      if (uploadsIndicator) uploadsIndicator.className = 'indicator indicator-success';
      if (uploadsText) uploadsText.innerText = 'Writable';
      Utils.clearAlert('card-uploads');
    } else {
      if (uploadsIndicator) uploadsIndicator.className = 'indicator indicator-danger';
      if (uploadsText) uploadsText.innerText = 'Read Only / Unhealthy';
      Utils.highlightAlert('card-uploads', 'Uploads directory is not writable', 'Verify file write permissions on the uploads folder on the server hosting path.');
    }

    // CPU & Memory usage updates
    const cpuEl = document.getElementById('vital-cpu');
    const ramEl = document.getElementById('vital-ram');
    const processUptimeEl = document.getElementById('vital-uptime');
    
    if (cpuEl) cpuEl.innerText = data.cpuUsage || 'N/A';
    if (ramEl && data.memoryUsage) {
      ramEl.innerText = `${data.memoryUsage.heapUsed} (Heap) / ${data.memoryUsage.rss} (RSS)`;
    }
    if (processUptimeEl) {
      processUptimeEl.innerText = Utils.formatUptime(data.uptime);
    }

    // Disk space updates
    const diskEl = document.getElementById('vital-disk');
    if (diskEl && data.diskUsage) {
      diskEl.innerText = `${data.diskUsage.free} free / ${data.diskUsage.total} total (${data.diskUsage.usedPercent} used)`;
    }

    // Uptime visual progression bars (simulated for server metrics stability)
    const progressBar = document.getElementById('health-bar-fill');
    if (progressBar) {
      const healthySuites = (db.status === 'connected' && uploads.status === 'healthy') ? 100 : 50;
      progressBar.style.width = `${healthySuites}%`;
    }
  }
};
