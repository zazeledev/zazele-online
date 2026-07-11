# Zazele Online - Quality Assurance (QA) and Deployment Validation System

This manual explains the design, operation, extensions, and usage of the automated QA and testing framework built for Zazele Online.

---

## 1. System Architecture

The testing framework is structured to enable thorough pre-deployment and post-deployment validation across the entire application stack:

```
tests/
  smoke/          # Phase 1: High-level availability checks, SSL, asset resolving
  api/            # Phase 3: Route, status code, validation & schema checks
  e2e/            # Phase 2: Puppeteer browser automation (runs locally/offline)
  security/       # Phase 5: Middleware security audit, ignored config verification
  reports/        # Phase 7: Compiled JSON, HTML, and Markdown test results
  utils/          # Phase 9: Test server controls and dynamic env.js stubs
  runner.js       # Phase 8: Unified test orchestrator
```

### Mock Database Layer (`/backend/src/utils/mock-db.js`)
To run browser E2E and API tests autonomously (without needing an active database connection or configuring Atlas IP whitelists in restricted environments like CI), the framework stubs `mongoose` models when running in a `test` environment. It provides pre-seeded in-memory models (`User`, `Module`, `Lesson`, `Event`, etc.) and handles full mock schema validation and bcrypt password hashing.

---

## 2. CLI Command Reference

Execute tests from the project root using standard `npm` scripts:

| Command | Description |
| :--- | :--- |
| `npm run smoke` | Executes Phase 1 smoke tests (loads pages, validates SSL, pings health API). |
| `npm run test:api` | Executes Phase 3 API tests (validates request payloads, schemas, protection). |
| `npm run test:e2e` | Executes Phase 2 E2E browser automation (Student/Admin logins, logouts, sections). |
| `npm run test:security` | Executes Phase 5 security audit (Helmet, CORS checks, gitignore compliance). |
| `npm run test:all` | Sequentially runs smoke, api, security, and E2E suites. |
| `npm run qa` | Runs all suites and automatically opens the visual HTML report dashboard. |

*Options:*
- To run a specific suite: `node tests/runner.js --suite=<smoke|api|e2e|security>`
- To open the browser report automatically: Add the `--open` flag (e.g., `node tests/runner.js --suite=smoke --open`)

---

## 3. Extending the Framework (Adding Tests)

### Adding a Smoke Test
Add a new check inside the `run` function in `tests/smoke/smoke.test.js`:
```javascript
addTest('My Custom Smoke Check', async () => {
  const res = await httpGet(`${localBase}/my-page.html`);
  if (res.statusCode !== 200) throw new Error('Failed to load page');
});
```

### Adding an API Test
Add an endpoint test inside `tests/api/api.test.js`:
```javascript
await runTest('My Route: Payload check', async () => {
  const res = await httpReq('POST', `${localBase}/api/my-route`, { data: 'test' });
  if (res.statusCode !== 201) throw new Error(`Unexpected status ${res.statusCode}`);
});
```

### Adding an E2E Browser Test
Add a Puppeteer E2E block inside `tests/e2e/e2e.test.js`:
```javascript
await runE2ETest('E2E: Check Custom Action', async (page) => {
  await page.goto(`${localBase}/my-feature.html`);
  await page.click('#action-button');
  await page.waitForSelector('#success-message');
});
```

---

## 4. Reports & Visual QA Dashboard

- **Markdown Report (`tests/reports/report.md`)**: A fast, text-based check summary perfect for CI log reviews.
- **HTML Report (`tests/reports/report.html`)**: A premium dark-mode styled file with animated metrics cards.
- **Visual QA Dashboard (`frontend/qa.html`)**: Available when running the backend locally at `http://localhost:5000/qa.html` (or `http://localhost:5001/qa.html` during test execution). It queries the live status of the backend API, the database, and loads the results of the latest test run via the backend endpoint `/api/qa/status`.

---

## 5. Pre-Deployment Validation Checklist

Always complete this checklist before deploying to Vercel/cPanel:

1. [ ] **Run all tests locally**: Verify they pass with `npm run test:all` or `npm run qa`.
2. [ ] **Verify Production Fallbacks**: Confirm there are no hardcoded `localhost` references left in files under `/frontend/js`.
3. [ ] **Check Env Variables**: Ensure any new variables are listed in `/backend/.env.example` and configured inside the Vercel Dashboard / cPanel Setup Node.js app environment settings.
4. [ ] **Ignore Secrets**: Double-check that `.env` or temporary SSL certificate files are not committed to Git (`git status`).

---

## 6. Recovery Procedures

### What to do if the Backend health check reports `UNAVAILABLE` or `UNHEALTHY`

1. **Verify Node App Status in cPanel**:
   - Navigate to **cPanel** -> **Setup Node.js App**.
   - Verify the application status is **Running**. Click **Restart** if needed.
2. **Review cPanel logs**:
   - Access cPanel File Manager and look for the `stderr.log` inside your node application root directory.
   - Look for common errors like database connection timeouts, syntax errors, or unhandled exceptions.
3. **Database Network Connection Issue**:
   - If the log indicates connection failure to MongoDB Atlas:
     - Go to MongoDB Atlas Console.
     - Go to **Network Access**.
     - Verify that the IP address of the cPanel hosting server is whitelisted. If the cPanel server IP has changed or is blocked, add it back to the whitelist.
4. **CORS Restrictions**:
   - If frontend fetch operations are blocked with CORS errors, verify that `FRONTEND_URL` is set to `https://www.zazele.online` in the cPanel environment variables list.
