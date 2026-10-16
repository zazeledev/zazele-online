const fs = require('fs');
const path = require('path');

module.exports = async function verifyPortalDesign(page, localBase) {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const activate = async selector => {
    await page.$eval(selector, button => button.click());
  };
  const capture = async name => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(document.getAnimations()
      .filter(animation => animation.effect.getComputedTiming().iterations !== Infinity)
      .map(animation => animation.finished.catch(() => {}))));
    const issues = await page.evaluate(() => {
      const problems = [];
      const activePage = document.querySelector('.page.active');
      if (activePage && Number(getComputedStyle(activePage).opacity) < .99) problems.push('active workspace is transparent');
      if (document.documentElement.scrollWidth > innerWidth + 1) problems.push('page overflows horizontally');
      for (const el of document.querySelectorAll('.page.active h1, .page.active input:not([type=checkbox]), .page.active select, .app-header button')) {
        const rect = el.getBoundingClientRect();
        if (rect.width && rect.height && (rect.left < -1 || rect.right > innerWidth + 1)) problems.push(el.id || el.tagName);
      }
      return problems;
    });
    if (issues.length) throw new Error(`${name}: ${issues.join(', ')}`);
    if (process.env.PORTAL_DESIGN_SCREENSHOTS === '1') {
      const dir = path.resolve(__dirname, '../../.tmp-redesign/portal');
      fs.mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, name + '.png'), fullPage: true });
    }
  };
  const login = async role => {
    console.log(`[Portal QA] Signing in to ${role} workspace`);
    await page.goto(`${localBase}/portal`);
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });
    const apiUrl = await page.evaluate(() => window.env.VITE_API_URL);
    if (apiUrl !== `${localBase}/api`) throw new Error('QA portal must use the local mock API');
    // Form submission is covered by the sign-in E2E cases. Authenticate each
    // repeated layout fixture directly against the same isolated mock API.
    await page.evaluate(async ({ role, localBase }) => {
      const response = await fetch(`${localBase}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: role === 'admin' ? 'admin@zazele.com' : 'student@zazele.com', password: role === 'admin' ? 'CHANGE_ME_IMMEDIATELY_IN_PROD' : 'student123' })
      });
      if (!response.ok) throw new Error(`${role} mock login returned HTTP ${response.status}`);
      const { token, user } = await response.json();
      saveAuth(token, user);
    }, { role, localBase });
    await page.reload({ waitUntil: 'networkidle2' });
    await page.waitForSelector(role === 'admin' ? '#admin-page.active' : '#dashboard-page.active', { visible: true, timeout: 10000 });
  };
  for (const width of [1440, 768, 375, 320]) {
    console.log(`[Portal QA] Checking ${width}px viewport`);
    await page.setViewport({ width, height: 1000 });
    await page.goto(`${localBase}/portal`);
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });
    await capture(`login-${width}`);
    await activate('.portal-tab[data-tab=register]');
    await page.waitForSelector('#register-form.active', { visible: true });
    await capture(`register-${width}`);
    await login('student');
    await page.waitForSelector('.module-select-card', { visible: true });
    await capture(`student-${width}`);
    await activate('.btn-theme-toggle');
    await capture(`student-dark-${width}`);
    await activate('.btn-theme-toggle');
    await page.focus('.module-select-card:not(.locked) .btn');
    await page.keyboard.press('Enter');
    await page.waitForSelector('#module-viewer', { visible: true });
    await page.waitForFunction(() => document.getElementById('viewer-module-title').textContent !== 'Loading...');
    for (const tab of ['content', 'resources', 'assessment', 'support']) {
      await activate(`#tab-btn-${tab}`);
      await page.waitForSelector(`#panel-${tab}.active`, { visible: true, timeout: 5000 });
      await capture(`student-${tab}-${width}`);
    }
    if (width === 1440) {
      const resourcesCorrect = await page.evaluate(() => {
        renderModulePanels({ lessons: [
          { _id: 'qa-open', title: 'Guide <b>', order: 1, isUnlocked: true, isCompleted: false, notesPath: 'guide & notes.pdf' },
          { _id: 'qa-locked', title: 'Locked guide', order: 2, isUnlocked: false, isCompleted: false, notesPath: 'locked.pdf' }
        ] }, 'qa-module', '', {});
        const links = document.querySelectorAll('#panel-resources a');
        const valid = links.length === 1 && links[0].href.endsWith('/guide%20%26%20notes.pdf')
          && document.querySelector('#panel-resources strong').textContent === 'Guide <b>';
        renderModulePanels({ lessons: [] }, 'qa-empty', '', {});
        return valid && document.querySelector('#panel-content').textContent.includes('No lessons are available')
          && !document.querySelector('#panel-content').textContent.includes('All Lessons Completed');
      });
      if (!resourcesCorrect) throw new Error('Resources must respect lesson locks and empty modules must not appear complete');
    }
    await login('admin');
    await page.waitForFunction(() => document.getElementById('summary-learners').textContent !== '—');
    await capture(`admin-${width}`);
    await activate('.btn-theme-toggle');
    await capture(`admin-dark-${width}`);
    await activate('.btn-theme-toggle');
    for (const section of ['archive', 'profile-requests', 'support-sessions', 'modules', 'webinars']) {
      await activate(`.admin-nav-item[data-section="${section}"]`);
      await page.waitForSelector(`#${section}-section.active`, { visible: true });
      await capture(`admin-${section}-${width}`);
    }
    await activate('#add-event-btn');
    await page.waitForSelector('#event-modal', { visible: true });
    await capture(`admin-event-modal-${width}`);
  }
};
