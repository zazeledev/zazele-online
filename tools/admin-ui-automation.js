const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
  const outDir = path.resolve(__dirname, 'admin-ui-logs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const logPath = path.join(outDir, `run-${Date.now()}.log`);
  const screenshots = [];
  function log(...args) {
    const s = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
    fs.appendFileSync(logPath, s + '\n');
    console.log(s);
  }

  log('Starting admin UI automation');

  // Try to find a local Chrome/Chromium executable
  const possiblePaths = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
  ];
  let exePath = possiblePaths.find(p => fs.existsSync(p));
  const launchOpts = { headless: true, args: ['--no-sandbox'] };
  if (exePath) launchOpts.executablePath = exePath;
  else log('No local Chrome found; puppeteer-core requires a browser.');

  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);

  // capture console messages
  page.on('console', msg => log('PAGE_CONSOLE', msg.type(), msg.text()));
  page.on('pageerror', err => log('PAGE_ERROR', err.message));
  page.on('response', res => {
    if (res.status() >= 400) {
      log(`HTTP ${res.status()} => ${res.url()}`);
    }
  });

  try {
    const base = 'http://localhost:3000';
    log('Opening', base);
    await page.goto(base, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(outDir, 'landing.png') });
    screenshots.push('landing.png');

    // Fill login
    const emailSel = '#login-email';
    await page.waitForSelector(emailSel);
    await page.type(emailSel, 'admin@zazele.com', { delay: 30 });
    await page.type('#login-password', 'admin123', { delay: 30 });
    await page.click('#login-form button[type=submit]');
    // SPA may not navigate; wait for admin UI element to appear
    await page.waitForSelector('#admin-user-name', { timeout: 15000 }).catch(() => null);

    log('Logged in, on page', page.url());
    const userName = await page.$eval('#admin-user-name', el => el.textContent).catch(() => null);
    log('admin-user-name:', userName);
    const adminScreenshot = path.join(outDir, 'admin-after-login.png');
    await page.screenshot({ path: adminScreenshot });
    screenshots.push('admin-after-login.png');

    // Click through admin nav items
    const navSections = await page.$$eval('.admin-nav-item', els => els.map(e => e.getAttribute('data-section'))).catch(() => []);
    log('Found nav items:', navSections.length);
    for (let i = 0; i < navSections.length; i++) {
      const name = navSections[i] || `nav-${i}`;
      try {
        await page.click(`.admin-nav-item[data-section="${name}"]`).catch(() => null);
        // small delay
        await new Promise(r => setTimeout(r, 800));
        log('Clicked nav item', name);
        const shot = path.join(outDir, `nav-${i}-${name || 'x'}.png`);
        await page.screenshot({ path: shot }).catch(() => null);
        screenshots.push(path.basename(shot));
      } catch (e) {
        log('Nav click error', e.message);
      }
    }

    // Open first user detail if exists
    const openedUser = await page.$$eval('#users-list table tbody tr', (rows) => {
      if (!rows || rows.length === 0) return false;
      try { rows[0].click(); return true; } catch (e) { return false; }
    }).catch(() => false);
    if (openedUser) {
      await new Promise(r => setTimeout(r, 600));
      log('Opened first user detail');
      const shot = path.join(outDir, 'user-detail.png');
      await page.screenshot({ path: shot }).catch(() => null);
      screenshots.push('user-detail.png');
      // We will not perform approve/verify clicks to avoid changing DB state
    } else {
      log('No user rows found to open');
    }

    // Open modules section and click "Manage Questions" for first module
    await page.click('.admin-nav-item[data-section="modules"]').catch(() => null);
    await new Promise(r => setTimeout(r, 800));
    // Find and click any button whose text contains "Manage Questions"
    const clickedManage = await page.$$eval('button', (buttons) => {
      const b = buttons.find(btn => btn.textContent && btn.textContent.includes('Manage Questions'));
      if (b) { b.click(); return true; }
      return false;
    }).catch(() => false);
    if (clickedManage) {
      await new Promise(r => setTimeout(r, 600));
      await page.waitForSelector('#assignment-modal', { visible: true, timeout: 3000 }).catch(() => null);
      await page.screenshot({ path: path.join(outDir, 'assignment-modal.png') });
      screenshots.push('assignment-modal.png');
      log('Opened assignment modal');
    } else {
      log('No Manage Questions button found');
    }

    // Open webinars section and click Add Event then close
    await page.click('.admin-nav-item[data-section="webinars"]').catch(() => null);
    await new Promise(r => setTimeout(r, 600));
    const addEventBtnSel = '#add-event-btn';
    const addEventExists = await page.$(addEventBtnSel).then(Boolean).catch(() => false);
    if (addEventExists) {
      await page.click(addEventBtnSel).catch(() => null);
      await page.waitForSelector('#event-modal', { visible: true, timeout: 3000 }).catch(() => null);
      await page.screenshot({ path: path.join(outDir, 'event-modal.png') });
      screenshots.push('event-modal.png');
      // close
      const closeEventSel = '#close-event-modal';
      if (await page.$(closeEventSel).then(Boolean).catch(() => false)) await page.click(closeEventSel).catch(() => null);
      log('Toggled event modal');
    } else {
      log('No add event button found');
    }

    log('Automation complete. Screenshots:', screenshots.join(', '));
  } catch (err) {
    log('Automation error:', err.stack || err.message);
  } finally {
    await browser.close();
    log('Browser closed. Log at', logPath);
  }
})();
