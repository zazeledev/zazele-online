const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

// Find a local Chrome or Edge browser executable
function findBrowserPath() {
  const possiblePaths = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
  ];
  return possiblePaths.find(p => fs.existsSync(p));
}

async function run(testPort = 5001) {
  const results = [];
  const addResult = (name, status, message = '') => {
    results.push({ name, status, message });
  };

  const exePath = findBrowserPath();
  if (!exePath) {
    console.warn('[E2E Test] No local Chrome or Edge browser executable found. Skipping E2E tests.');
    addResult('Playwright/Puppeteer E2E Tests', 'FAIL', 'No local Chrome/Edge browser found to run E2E browser tests.');
    return results;
  }

  const runE2ETest = async (name, testFn) => {
    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath: exePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      page.setDefaultTimeout(30000);
      
      // Capture browser console errors
      const consoleErrors = [];
      page.on('pageerror', err => consoleErrors.push(err.message));
      
      await testFn(page);
      
      if (consoleErrors.length > 0) {
        throw new Error(`Javascript console errors detected: ${consoleErrors.join(', ')}`);
      }
      
      addResult(name, 'PASS');
    } catch (e) {
      addResult(name, 'FAIL', e.message);
    } finally {
      if (browser) await browser.close();
    }
  };

  const localBase = `http://localhost:${testPort}`;

  // 1. Student Login & Dashboard Flow
  await runE2ETest('E2E: Student Login and Dashboard Loading', async (page) => {
    await page.goto(`${localBase}/portal.html`, { waitUntil: 'load' });
    
    // Fill out login form
    await page.waitForSelector('#login-email');
    await page.type('#login-email', 'student@zazele.com');
    await page.type('#login-password', 'student123');
    await page.$eval('#login-form button[type="submit"]', btn => btn.click());
    
    // Wait for student dashboard to load
    await page.waitForSelector('#modules-container, .overall-progress-card', { timeout: 8000 });
  });

  // 2. Forgot Password Modal Flow
  await runE2ETest('E2E: Forgot Password Modal Toggle', async (page) => {
    await page.goto(`${localBase}/portal.html`, { waitUntil: 'load' });
    
    await page.waitForSelector('#forgot-password-link');
    await page.$eval('#forgot-password-link', link => link.click());
    
    // Wait for modal to trigger visibility
    const visible = await page.$eval('#forgot-password-modal', el => {
      return window.getComputedStyle(el).display !== 'none';
    });
    if (!visible) throw new Error('Forgot password modal display style remains hidden after click');
  });

  // 3. Admin Login & Nav Sections Checks
  await runE2ETest('E2E: Admin Login and Section Navigation', async (page) => {
    await page.goto(`${localBase}/portal.html`, { waitUntil: 'load' });
    
    await page.waitForSelector('#login-email');
    await page.type('#login-email', 'admin@zazele.com');
    await page.type('#login-password', 'CHANGE_ME_IMMEDIATELY_IN_PROD');
    await page.$eval('#login-form button[type="submit"]', btn => btn.click());
    
    // Wait for admin header
    await page.waitForSelector('#admin-user-name', { timeout: 8000 });
    
    // Try navigating to webinars section
    await page.waitForSelector('.admin-nav-item[data-section="webinars"]');
    await page.$eval('.admin-nav-item[data-section="webinars"]', btn => btn.click());
    
    // Check for webinars title or button
    await page.waitForSelector('#add-event-btn', { timeout: 5000 });
  });

  // 4. Logout Flow
  await runE2ETest('E2E: Authentication Logout', async (page) => {
    await page.goto(`${localBase}/portal.html`, { waitUntil: 'load' });
    
    await page.waitForSelector('#login-email');
    await page.type('#login-email', 'student@zazele.com');
    await page.type('#login-password', 'student123');
    await page.$eval('#login-form button[type="submit"]', btn => btn.click());
    
    // Wait for logout button to appear or check dashboard navigation
    await page.waitForSelector('#logout-btn, .logout-btn', { timeout: 8000 });
    
    // Click logout
    await page.$eval('#logout-btn, .logout-btn', btn => btn.click());
    
    // Verify login portal page is active again
    await page.waitForSelector('#login-email', { timeout: 5000 });
  });

  return results;
}

module.exports = { run };
