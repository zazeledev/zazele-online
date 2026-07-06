const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
  const outDir = path.resolve(__dirname, 'event-register-logs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const logPath = path.join(outDir, `run-${Date.now()}.log`);
  function log(...args) { fs.appendFileSync(logPath, args.join(' ') + '\n'); console.log(...args); }

  const possiblePaths = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
  ];
  let exePath = possiblePaths.find(p => fs.existsSync(p));
  const launchOpts = { headless: true, args: ['--no-sandbox'] };
  if (exePath) launchOpts.executablePath = exePath;
  else log('No local browser found; script may fail.');

  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);

  page.on('console', m => log('PAGE_CONSOLE', m.type(), m.text()));
  page.on('pageerror', e => log('PAGE_ERROR', e.message));
  page.on('response', async res => {
    if (res.url().includes('/api/events/register')) {
      log('EVENT REG RESPONSE', res.status());
      try { log(await res.clone().text()); } catch (e) {}
    }
  });

  try {
    const base = 'http://localhost:3000/courses.html';
    await page.goto(base, { waitUntil: 'networkidle2' });
    // wait for events list
      // dump events list
      const eventsHtml = await page.$eval('#events-list', el => el.innerHTML).catch(() => null);
      log('events-list HTML length:', eventsHtml ? eventsHtml.length : 'null');
      log('events-list HTML preview:', eventsHtml ? eventsHtml.slice(0, 800) : 'null');
      const btnCount = await page.$$eval('.register-event-btn', els => els.length).catch(() => 0);
      log('register-event-btn count:', btnCount);
      const firstInfo = await page.$eval('.register-event-btn', el => {
        const r = el.getBoundingClientRect();
        return { offsetParent: !!el.offsetParent, width: r.width, height: r.height, top: r.top, left: r.left };
      }).catch(() => null);
      log('first button info:', JSON.stringify(firstInfo));
      await page.waitForSelector('.register-event-btn', { timeout: 10000 });
    // determine what's on top at the button center
    if (firstInfo) {
      const center = { x: Math.round(firstInfo.left + firstInfo.width / 2), y: Math.round(firstInfo.top + firstInfo.height / 2) };
      const topElInfo = await page.evaluate(({x,y}) => {
        const el = document.elementFromPoint(x, y);
        if (!el) return null;
        return { tag: el.tagName, cls: el.className, id: el.id, outer: el.outerHTML.slice(0,200) };
      }, center).catch(() => null);
      log('elementFromPoint at center:', JSON.stringify(topElInfo));
    }
    // attempt an in-page click (bypasses Puppeteer's clickablePoint)
    await page.$eval('.register-event-btn', b => b.click()).catch(e => { throw e; });
    await page.waitForSelector('#event-registration-modal.active, #event-registration-modal', { timeout: 5000 }).catch(() => null);
    // check modal visibility via style
    const visible = await page.$eval('#event-registration-modal', el => {
      return window.getComputedStyle(el).display !== 'none' && (el.classList.contains('active') || el.style.display !== 'none');
    }).catch(() => false);
    log('Modal visible:', visible);
    if (!visible) {
      // maybe modal uses class active to show; force click again
      await page.click('.register-event-btn');
    }
    // fill form
    await page.type('#event-reg-fullname', 'Automated Tester', { delay: 20 });
    await page.type('#event-reg-email', 'autotest@example.com', { delay: 20 });
    await page.type('#event-reg-contact', '+27100000001', { delay: 20 });
    // submit
      // Inspect submit button
      const submitInfo = await page.$eval('#event-registration-form button[type="submit"]', el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, cls: el.className, id: el.id, width: r.width, height: r.height, top: r.top, left: r.left };
      }).catch(() => null);
      log('submit button info:', JSON.stringify(submitInfo));
      const submitTop = await page.evaluate(({x,y}) => {
        const el = document.elementFromPoint(x,y);
        return el ? { tag: el.tagName, cls: el.className } : null;
      }, { x: Math.round(submitInfo.left + submitInfo.width/2), y: Math.round(submitInfo.top + submitInfo.height/2) }).catch(() => null);
      log('elementFromPoint at submit center:', JSON.stringify(submitTop));
      // Try in-page submit to avoid Puppeteer click issues
      await Promise.all([
        page.$eval('#event-registration-form', form => form.querySelector('button[type="submit"]').click()).catch(() => null),
        page.waitForResponse(r => r.url().includes('/api/events/register') && (r.status() === 201 || r.status() === 200), { timeout: 10000 }).catch(() => null)
      ]);
    log('Submitted registration');
    // take screenshot
    await page.screenshot({ path: path.join(outDir, 'after-register.png') });
    log('Screenshot saved');
  } catch (err) {
    log('Error:', err.stack || err.message);
  } finally {
    await browser.close();
    log('Done. Log at', logPath);
  }
})();
