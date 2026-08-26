# Production URL Routing & Clean URLs Documentation

## Overview
This document explains the production URL routing architecture for **Zazele Online** (`https://www.zazele.online`), how clean URLs are resolved on Vercel without `.html` extensions, why the previous 404 error occurred, and how to verify deployments.

---

## 1. Problem Root Cause Analysis
Previously:
- Requesting `https://www.zazele.online/services.html` worked directly.
- Requesting `https://www.zazele.online/services` returned a **Vercel 404 (NOT FOUND)**.

### Why This Happened:
1. **Architecture Model**: The Zazele Online frontend is a multi-page static HTML application (located in the `frontend/` directory), not a client-side Single Page Application (SPA) framework (like React Router or Next.js).
2. **Default Vercel Static Resolution**: By default, when a user requests `/services`, Vercel searches the output directory for:
   - An exact file match named `services` (without extension), or
   - A directory named `services/` containing an `index.html` (`services/index.html`).
3. Because the repository only had `frontend/services.html` and lacked a `vercel.json` routing configuration, Vercel could not resolve `/services` to `services.html` and returned a 404 status.

---

## 2. Solution: Vercel Clean URLs Configuration

Vercel provides native static URL routing through the `cleanUrls` attribute in `vercel.json`.

### Configuration File: `vercel.json` (Project Root)
```json
{
  "outputDirectory": "frontend",
  "cleanUrls": true,
  "trailingSlash": false
}
```

### Fallback Configuration: `frontend/vercel.json`
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```
*(Provided as a safeguard if the Vercel project's Root Directory setting is configured as `frontend/` instead of repository root).*

---

## 3. How Vercel Resolves Clean URLs

| Requested URL | Resolution Behavior | Status |
| :--- | :--- | :--- |
| `https://www.zazele.online/` | Serves `frontend/index.html` | `200 OK` |
| `https://www.zazele.online/services` | Automatically maps to `frontend/services.html` | `200 OK` |
| `https://www.zazele.online/services.html` | Served directly or clean-redirected to `/services` | `200 / 308 OK` |
| `https://www.zazele.online/about` | Automatically maps to `frontend/about.html` | `200 OK` |
| `https://www.zazele.online/contact` | Automatically maps to `frontend/contact.html` | `200 OK` |
| `https://www.zazele.online/courses` | Automatically maps to `frontend/courses.html` | `200 OK` |
| `https://www.zazele.online/portal` | Automatically maps to `frontend/portal.html` | `200 OK` |
| `https://www.zazele.online/portal#login` | Maps to `portal.html` and activates login tab | `200 OK` |
| `https://www.zazele.online/portal#register`| Maps to `portal.html` and activates register tab | `200 OK` |
| `https://www.zazele.online/css/styles.css` | Serves exact static stylesheet | `200 OK` |
| `https://www.zazele.online/js/api.js` | Serves exact static script | `200 OK` |
| `https://www.zazele.online/assets/logo.png` | Serves exact static image | `200 OK` |
| `https://www.zazele.online/nonexistent` | Returns 404 (No catch-all override) | `404 Not Found` |

---

## 4. Frontend Internal Link Standard

All internal navigation links and asset paths across HTML files have been standardized to root-relative clean paths:

1. **Header & Navigation Menus**:
   - Home: `/`
   - Services: `/services`
   - Courses: `/courses`
   - About: `/about`
   - Contact: `/contact`
   - Student Portal: `/portal#login`
2. **Contextual Action Links**:
   - Quote buttons: `/contact?subject=Web+Design+Package`
   - Course Registration: `/portal#register`
   - Service Packages: `/services#packages`
   - Methodology: `/services#process`
3. **Static Assets**:
   - CSS: `/css/styles.css`, `/css/mobile.css`
   - Scripts: `/js/env.js`, `/js/api.js`, `/js/auth.js`, `/js/app.js`, etc.
   - Images: `/assets/logo.png`, `/assets/bafanadev.jpg`, etc.

---

## 5. Backend Independence & Separation

The backend API is hosted independently on **Afrihost / cPanel** at:
`https://api.zazele.online`

- Vercel only serves frontend static assets.
- Frontend scripts use `window.env.VITE_API_URL` (configured via `frontend/js/env.js`) to make cross-origin API calls directly to `https://api.zazele.online/api`.
- CORS policies in `backend/src/server.js` allow requests originating from `https://www.zazele.online` and `https://zazele-online.vercel.app`.
- No backend database, auth tokens, or API routes are altered by the Vercel clean URL configuration.

---

## 6. How to Test Post-Deployment

After deploying to GitHub / Vercel:

1. **Clean Route Verification**:
   - Visit `https://www.zazele.online/services` -> Ensure Services page loads with full styling and images.
   - Visit `https://www.zazele.online/about` -> Ensure About page loads.
   - Visit `https://www.zazele.online/contact` -> Ensure Contact page loads.
   - Visit `https://www.zazele.online/courses` -> Ensure Courses page loads.
   - Visit `https://www.zazele.online/portal` -> Ensure Portal loads.
2. **Legacy URL Verification**:
   - Visit `https://www.zazele.online/services.html` -> Verify it resolves without errors.
3. **Portal Deep Links**:
   - Visit `https://www.zazele.online/portal#register` -> Verify Register tab is active.
   - Visit `https://www.zazele.online/portal#login` -> Verify Login tab is active.
4. **Static Asset Verification**:
   - Check DevTools Network tab for `styles.css`, `mobile.css`, `logo.png`, `auth.js` -> Verify all status codes are `200 OK`.
5. **Run Automated Test Suite Locally**:
   ```bash
   npm run test:all
   ```
   All 46 automated QA checks (Smoke, API, Security, E2E) should pass.
