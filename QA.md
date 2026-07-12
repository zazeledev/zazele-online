# Zazele Online - Production Operations Center & QA System Manual

This manual explains the design, modular architecture, APIs, and recovery procedures of the Zazele Online Production Operations Center and QA framework.

---

## 1. System Architecture

The testing framework and Operations Center are structured to enable pre-deployment verification and real-time live monitoring:

```
├── .agents/
│   └── AGENTS.md               # IDE rules enforcing production guard rails
├── backend/src/
│   ├── utils/
│   │   ├── mock-db.js          # In-memory mongoose database query stubs for offline testing
│   │   └── diagnostician.js    # Pure JS server-side validation checker
│   └── server.js               # Express application with health & QA status endpoints
├── frontend/
│   ├── dashboard/              # Modular Operations Center frontend logic
│   │   ├── utils.js            # Common HTTP request trackers & alert highlighters
│   │   ├── health.js           # CPU, RAM, Disk, database metadata updater
│   │   ├── api-tests.js        # Multi-endpoint AJAX validator
│   │   ├── deployment.js       # Version synchronization and environment checking
│   │   ├── browser.js          # Dynamic client console log and fetch interceptor
│   │   ├── reports.js          # Export mechanisms (JSON, Markdown, HTML, CSV)
│   │   └── monitor.js          # Dashboard polling orchestrator & diagnoses trigger
│   ├── qa.html                 # Visual Operations Center dashboard
│   └── report.json             # Static validation report deployed to Vercel
└── tests/
    ├── smoke/                  # Phase 1: High-level availability, SSL, local URLs checks
    ├── api/                    # Phase 3: Auth, validation schema & db failures checks
    ├── security/               # Phase 5: Helmet, CORS, gitignore audits
    ├── e2e/                    # Phase 2: Puppeteer E2E browser automation (Student, Admin)
    └── runner.js               # Unified runner executing all test suites
```

---

## 2. API Endpoints Reference

### 1. System Health Report
* **Endpoint**: `GET /api/health`
* **Response**: Contains status, CPU, RAM, disk space, uploads directory permissions, database metadata (ping time, collections list, reconnect counts, last connection), JWT, and git details.
* **Payload Structure**:
  ```json
  {
    "status": "ok",
    "database": "connected",
    "databaseDetails": {
      "status": "connected",
      "name": "zazele",
      "collections": ["users", "modules", "lessons", "events", "notifications"],
      "pingTimeMs": 2,
      "reconnectAttempts": 0,
      "lastConnection": "2026-07-12T11:44:17.000Z"
    },
    "uploads": { "status": "healthy", "path": "/backend/uploads" },
    "jwt": { "status": "configured", "strength": "strong" },
    "environment": "production",
    "version": "1.1.0",
    "gitCommit": "068b43b",
    "branch": "main",
    "uptime": 1245.5
  }
  ```

### 2. QA Diagnostic Report
* **Endpoint**: `GET /api/qa/latest`
* **Response**: Returns the latest compiled JSON validation report (cached from the last local run or manual diagnostic trigger).

### 3. Run Live Diagnosis
* **Endpoint**: `POST /api/qa/diagnose`
* **Response**: Triggers an on-the-fly server-side diagnostic suite (pings homepage, validates database collections, SSLs, static script localhost check) and returns the fresh validation payload.

---

## 3. Operations Center Usage

### Run Full System Diagnosis
1. Navigate to `https://www.zazele.online/qa.html`.
2. Click **Run Full System Diagnosis**.
3. The dashboard makes a POST request to `/api/qa/diagnose` which executes the diagnostician suite and refreshes the validation tables, vitals gauges, and overall readiness score immediately.

### Export Report Logs
* From the **Export Report...** dropdown at the top right, select your desired format:
  - **Export JSON**: Downloads the raw validation results configuration file.
  - **Export Markdown**: Downloads a formatted GFM document with status tables.
  - **Export HTML**: Downloads a single-page standalone styled summary.
  - **Export CSV**: Downloads a flat comma-separated list of test suites, test names, status, and messages.

### Browser Diagnostic Monitoring
The **Browser Diagnostics** terminal panel at the bottom right intercepts log events dynamically:
* Uncaught script exceptions.
* Unhandled promise rejections.
* Console warnings (`console.warn`) and errors (`console.error`).
* Intercepted network request failures (404, 500 status codes).

## 4. Production Deployment Checklist

Always complete this mandatory verification sequence prior to declaring a deployment successful:

1. **Verify Vercel Pipeline**: Ensure the frontend deployment builds with code `Success` on the Vercel Dashboard.
2. **Execute cPanel Build**: Launch Node.js app within cPanel and check that all dependencies are updated.
3. **Open Operations Center**: Load `https://www.zazele.online/qa.html` to run automatic vitals sanity scans.
4. **Enforce Zero Localhost Policy**: Confirm that the **Configuration Verification** panel reports `PASS` for localhost leaks, private IP detections, and mixed content threats.
5. **Run Production Diagnosis**: Click the **Run Full Production Diagnosis** button and verify that the gate verdict displays **🟢 PRODUCTION READY** with a score of `100%`.
6. **Verify User login**: Check that student login and admin login endpoints resolve cleanly.

---

## 5. Troubleshooting and Recovery Guide

### 1. Dashboard displays "Backend Offline"
* **Likely Cause**: The backend Node app crashed, or cPanel CORS configurations reject request headers.
* **Recovery**: Log in to cPanel Node.js Selector, restart the application, and review stderr logs for runtime errors. Confirm `FRONTEND_URL` matched origin keys.

### 2. Synchronization Warning (`OUT OF SYNC`)
* **Likely Cause**: Frontend code was pushed, but the backend source code has not yet been synced on the cPanel server.
* **Recovery**: Package the latest `/backend` folder from the main branch and deploy it to cPanel. Restart the Node application to refresh version strings.

### 3. Mongoose reconnect attempts incrementing
* **Likely Cause**: Database credentials inside `.env` are invalid, or Atlas MongoDB whitelists have blocked the server's IP address.
* **Recovery**: Copy your server's outbound IP address from cPanel and whitelist it inside MongoDB Atlas under Network Access. Double check `MONGODB_URI` connection strings.

### 4. Critical Configuration Error screen triggers
* **Likely Cause**: You loaded the dashboard on the live domain, but `window.env` contains a local host parameter (`http://localhost`).
* **Recovery**: Navigate to Vercel environment settings, remove any hardcoded localhost entries for `VITE_API_URL` or `VITE_UPLOAD_URL`, and trigger a clean redeploy.
