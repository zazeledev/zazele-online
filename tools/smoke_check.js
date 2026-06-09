const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

function findForms(html) {
  const formRegex = /<form[^>]*id=["']([^"']+)["'][^>]*class=["']([^"']*)["'][^>]*>/gi;
  const results = [];
  let m;
  while ((m = formRegex.exec(html)) !== null) {
    results.push({ id: m[1], class: m[2] });
  }
  // Also catch forms without class attribute
  const formNoClassRegex = /<form[^>]*id=["']([^"']+)["'][^>]*>/gi;
  while ((m = formNoClassRegex.exec(html)) !== null) {
    if (!results.find(r => r.id === m[1])) results.push({ id: m[1], class: '' });
  }
  return results;
}

function findModals(html) {
  const modalRegex = /<[^>]*class=["']([^"']*\bmodal\b[^"']*)["'][^>]*>/gi;
  const results = [];
  let m;
  while ((m = modalRegex.exec(html)) !== null) {
    const classes = m[1];
    // try to get id if present in the same tag
    const tag = html.slice(m.index, html.indexOf('>', m.index) + 1);
    const idMatch = tag.match(/id=["']([^"']+)["']/);
    results.push({ id: idMatch ? idMatch[1] : null, class: classes });
  }
  return results;
}

const forms = findForms(html);
const modals = findModals(html);

const activeForms = forms.filter(f => /\bactive\b/.test(f.class));

console.log('Found forms:', forms.map(f => f.id));
console.log('Active forms:', activeForms.map(f => ({ id: f.id, class: f.class })));

if (activeForms.length === 1 && activeForms[0].id === 'login-form') {
  console.log('OK: Only `login-form` is active on landing.');
} else {
  console.log('WARN: Unexpected active forms detected.');
}

console.log('Found modals:', modals.map(m => ({ id: m.id, class: m.class })));
const activeModals = modals.filter(m => /\bactive\b/.test(m.class));
if (activeModals.length === 0) {
  console.log('OK: No modal elements are active (all hidden).');
} else {
  console.log('WARN: Some modals are active:', activeModals);
}

// Additional checks: ensure register form exists and is not active
const register = forms.find(f => f.id === 'register-form');
if (!register) console.log('ERROR: register-form not found');
else if (/\bactive\b/.test(register.class)) console.log('ERROR: register-form is active (should be hidden)');
else console.log('OK: register-form exists and is hidden.');

// Check that dashboard-page exists but is not active on landing
const dashboardActive = /<div[^>]*id=["']dashboard-page["'][^>]*class=["']([^"']*)["'][^>]*>/i.exec(html);
if (dashboardActive) {
  const cls = dashboardActive[1];
  if (/\bactive\b/.test(cls)) console.log('WARN: dashboard-page is marked active in HTML');
  else console.log('OK: dashboard-page present and not active.');
} else {
  console.log('NOTE: dashboard-page element not present in HTML (it may be injected dynamically).');
}

// Exit with code 0
process.exit(0);
