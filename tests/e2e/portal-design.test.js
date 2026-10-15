const fs = require('fs');
const path = require('path');

module.exports = async function verifyPortalDesign(page, localBase) {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const capture = async name => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(document.getAnimations()
      .filter(animation => animation.effect.getComputedTiming().iterations !== Infinity)
      .map(animation => animation.finished.catch(() => {}))));
    const issues = await page.evaluate(() => {
      const problems = [];
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
    await page.goto(`${localBase}/portal`);
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });
    const apiUrl = await page.evaluate(() => window.env.VITE_API_URL);
    if (apiUrl !== `${localBase}/api`) throw new Error('QA portal must use the local mock API');
    await page.type('#login-email', role === 'admin' ? 'admin@zazele.com' : 'student@zazele.com');
    await page.type('#login-password', role === 'admin' ? 'CHANGE_ME_IMMEDIATELY_IN_PROD' : 'student123');
    await page.click('#login-form button[type=submit]');
    await page.waitForSelector(role === 'admin' ? '#admin-page.active' : '#dashboard-page.active', { visible: true });
  };
  for (const width of [1440, 768, 375, 320]) {
    console.log(`[Portal QA] Checking ${width}px viewport`);
    await page.setViewport({ width, height: 1000 });
    await page.goto(`${localBase}/portal`);
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });
    await capture(`login-${width}`);
    await page.click('.portal-tab[data-tab=register]');
    await page.waitForSelector('#register-form.active', { visible: true });
    await capture(`register-${width}`);
    await login('student');
    await page.waitForSelector('.module-select-card', { visible: true });
    await capture(`student-${width}`);
    await page.click('.btn-theme-toggle');
    await capture(`student-dark-${width}`);
    await page.click('.btn-theme-toggle');
    await page.focus('.module-select-card:not(.locked) .btn');
    await page.keyboard.press('Enter');
    await page.waitForSelector('#module-viewer', { visible: true });
    await page.waitForFunction(() => document.getElementById('viewer-module-title').textContent !== 'Loading...');
    for (const tab of ['content', 'resources', 'assessment', 'support']) {
      await page.click(`#tab-btn-${tab}`);
      await page.waitForSelector(`#panel-${tab}.active`, { visible: true });
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
    await page.click('.btn-theme-toggle');
    await capture(`admin-dark-${width}`);
    await page.click('.btn-theme-toggle');
    for (const section of ['archive', 'profile-requests', 'support-sessions', 'modules', 'webinars']) {
      await page.click(`.admin-nav-item[data-section="${section}"]`);
      await page.waitForSelector(`#${section}-section.active`, { visible: true });
      await capture(`admin-${section}-${width}`);
    }
    await page.click('#add-event-btn');
    await page.waitForSelector('#event-modal', { visible: true });
    await capture(`admin-event-modal-${width}`);
  }
};
