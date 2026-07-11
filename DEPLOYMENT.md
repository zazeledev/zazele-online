# Zazele Online - Deployment and Configuration Guide

This guide explains how to configure, build, and deploy the Zazele Online frontend and backend applications to follow production best practices.

---

## 1. Environment Architecture

The application is structured to decouple frontend assets from backend configurations while enforcing strict safety rules:

- **Local Development Default**:
  - Frontend URL: `http://localhost:3000` (or local port)
  - Backend API: `http://localhost:5000/api`
  - Upload URL: `http://localhost:5000/uploads`
- **Production Default**:
  - Frontend Domain: `https://www.zazele.online`
  - Backend API: `https://api.zazele.online/api`
  - Upload URL: `https://api.zazele.online/uploads`

### Endpoint Resolution Priority
When the frontend initializes, it determines the API and Upload base URLs in the following order of precedence:
1. **Runtime Configuration (`window.env`)**: Loaded dynamically from `/frontend/js/env.js` (which is either dynamically resolved or generated at build time via `scripts/build-env.js` using build environment variables).
2. **Safe Production Fallback**: Defaults to `https://api.zazele.online/api` to prevent local values from ever loading in production.

---

## 2. Local Development Setup

To run the application locally:

### Backend
1. Navigate to the `/backend` directory.
2. Ensure you have a `.env` file with development values:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/zazele-online
   JWT_SECRET=your_local_development_jwt_secret
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend
1. Access the frontend by running a local dev server (e.g. `npx serve frontend` on port 3000) or by opening `frontend/index.html` directly in a browser.
2. The frontend automatically detects that the hostname is `localhost` or a local IP address and points to the local backend at `http://localhost:5000/api`.

---

## 3. Frontend Deployment (Vercel)

The Zazele Online frontend is hosted on Vercel: **[https://www.zazele.online](https://www.zazele.online)**.

### Configuring Environment Variables on Vercel
1. Go to your **Vercel Dashboard**.
2. Navigate to your project settings -> **Environment Variables**.
3. Add the following variables:
   - `VITE_API_URL` = `https://api.zazele.online/api`
   - `VITE_UPLOAD_URL` = `https://api.zazele.online/uploads`

### Build Configuration on Vercel
Vercel is configured to build the environment file during the deployment process:
- **Build Command**: `npm run build` (runs `node scripts/build-env.js` which automatically generates `/frontend/js/env.js` based on Vercel Environment Variables).
- **Output Directory**: `frontend` (or default root directories).
- **Framework Preset**: Other / None.

If Vercel environment variables are set, Vercel will embed them directly into `/frontend/js/env.js`. If they are not set, the build script inserts the auto-detection template as a fallback.

---

## 4. Backend Deployment (cPanel)

The Node.js backend is hosted on cPanel: **[https://api.zazele.online](https://api.zazele.online)**.

### Deployment Procedure
1. Package the backend source code (excluding `.env`, `node_modules`, and local `uploads/` directory).
2. Upload the files to the cPanel directory designated for the Node.js application (usually via FTP or cPanel File Manager).
3. In cPanel, navigate to **Setup Node.js App**:
   - Choose the appropriate Node.js version (e.g., v18 or later).
   - Set **Application startup file** to `src/server.js`.
   - Set **Application root** to your uploaded directory.
4. Add the required environment variables in the cPanel **Environment variables** section:
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (or the port specified by cPanel / Passenger)
   - `MONGODB_URI` = `mongodb+srv://...` (Production MongoDB connection string)
   - `JWT_SECRET` = `[Generates Secure High-Entropy Key]`
   - `VITE_API_URL` = `https://api.zazele.online/api`
   - `VITE_UPLOAD_URL` = `https://api.zazele.online/uploads`
5. Click **Run NPM Install** to install backend dependencies.
6. Click **Restart application**.

---

## 5. Deployment Safety Features

To prevent common configuration mistakes, the application includes three defense-in-depth safety features:

### A. Production Domain Guard
If the hostname is not `localhost` or a local IP (e.g. `www.zazele.online`), the application rejects any `localhost` or local network API endpoints. It automatically forces a fallback to the live production endpoints (`https://api.zazele.online`).

### B. Backend Route Sanitation
The backend endpoint `/js/env.js` checks the incoming request's `Host` header. If the host contains `zazele.online`, the backend automatically overrides any misconfigured local development `.env` values, sanitizing them to production endpoints before serving the script to clients.

### C. Startup Health and Deployment Reports
When the frontend loads, it runs a quick validation check and outputs a deployment report directly in the browser developer console:

```text
----------------------------------------
Zazele Online Deployment Check
----------------------------------------
Environment : Production
Hostname    : www.zazele.online
API         : https://api.zazele.online/api
Uploads     : https://api.zazele.online/uploads
Health      : OK
----------------------------------------
```

If the health check fails, the application overlays a user-friendly system alert banner at the top of the browser viewport rather than failing silently or popping raw browser network errors.

---

## 6. Troubleshooting & Common Mistakes

### ❌ Localhost leaks in Production
- **Symptom**: Frontend console shows connections failing to `http://localhost:5000/api`.
- **Cause**: Vercel Environment Variables were not updated, or `env.js` fallback failed, or safety guards were bypassed.
- **Fix**: Check Vercel project configuration to ensure `VITE_API_URL` is set to `https://api.zazele.online/api` and trigger a rebuild. The safety guard will automatically force production fallbacks if accessed from the live domain.

### ❌ 502 Bad Gateway / Connection Refused
- **Symptom**: Deployment Check shows Health: `UNAVAILABLE` or `UNHEALTHY`.
- **Cause**: The cPanel Node.js application is stopped, crashed, or unable to reach MongoDB.
- **Fix**: Check Node.js application status in cPanel. View cPanel Passenger logs (`stderr.log`) to check for errors. Verify MongoDB Atlas IP Whitelisting allows connections from the cPanel server's IP address.

### ❌ CORS Policies Blocking Requests
- **Symptom**: Browser console blocks fetch requests with CORS errors.
- **Cause**: The backend allowed origins list doesn't include the Vercel frontend domain.
- **Fix**: Check `backend/src/server.js` CORS configurations and verify `https://www.zazele.online` (and other production origins) are whitelisted.

---

## 7. Troubleshooting Checklist

1. **Verify Vercel settings**: Make sure the build command is `npm run build` and output directory is `frontend`.
2. **Review cPanel environment variables**: Check `NODE_ENV` is set to `production`.
3. **Inspect console output**: Open browser DevTools (F12) and inspect the **Zazele Online Deployment Check** console printout.
