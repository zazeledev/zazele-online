const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const frontend = path.resolve(__dirname, '../frontend');

test('public pages reference existing local assets and section links', () => {
  for (const page of ['index', 'about', 'services', 'courses', 'contact']) {
    const html = fs.readFileSync(path.join(frontend, `${page}.html`), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${page}: duplicate IDs`);
    for (const [, attribute, value] of html.matchAll(/\b(src|href)="([^"]+)"/g)) {
      if (!value.startsWith('/') && !value.startsWith('#')) continue;
      const url = new URL(value, `https://local.invalid/${page === 'index' ? '' : page}`);
      let file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      if (!path.extname(file)) file += '.html';
      const target = path.join(frontend, file);
      assert.ok(fs.existsSync(target), `${page}: missing ${attribute} ${value}`);
      if (url.hash && file !== 'portal.html') {
        const content = fs.readFileSync(target, 'utf8');
        assert.ok(content.includes(`id="${url.hash.slice(1)}"`), `${page}: missing section ${value}`);
      }
    }
  }
});

test('enquiry prepares an encoded email without claiming delivery or clearing details', () => {
  const app = fs.readFileSync(path.join(frontend, 'js/app.js'), 'utf8');
  const source = app.slice(app.indexOf('function initContactForm()'), app.indexOf('// Floating WhatsApp'));
  let submit;
  const elements = {
    'contact-form': { addEventListener: (event, fn) => { if (event === 'submit') submit = fn; } },
    'contact-name': { value: 'A & B' },
    'contact-email': { value: 'person@example.com' },
    'contact-subject': { value: '' },
    'contact-message': { value: 'A booking site? Budget: R5,000 & launch in June.' },
    'contact-status': { textContent: '' }
  };
  const window = { location: { search: '?subject=Web+Design+Package', href: '' } };
  vm.runInNewContext(source + '\ninitContactForm();', { window, document: { getElementById: id => elements[id] }, URLSearchParams });
  let prevented = false;
  submit({ preventDefault: () => { prevented = true; } });
  assert.ok(prevented);
  const email = new URL(window.location.href);
  assert.equal(email.protocol, 'mailto:');
  assert.equal(email.pathname, 'support@zazele.online');
  assert.equal(email.searchParams.get('subject'), 'Web Design Package');
  assert.ok(email.searchParams.get('body').includes('A & B'));
  assert.ok(email.searchParams.get('body').includes(elements['contact-message'].value));
  assert.match(elements['contact-status'].textContent, /Send the message there/);
  assert.ok(elements['contact-email'].value);
});

test('public palette does not read or overwrite the saved portal theme', () => {
  const app = fs.readFileSync(path.join(frontend, 'js/app.js'), 'utf8');
  const source = app.slice(app.indexOf('function initThemeToggle()'), app.indexOf('// Password Visibility'));
  vm.runInNewContext(source + '\ninitThemeToggle();', {
    document: { body: { classList: { contains: value => value === 'studio-site' } } }
  });
});
