const fs = require('fs');
const path = require('path');

function generateReports(results) {
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // 1. JSON Report
  const jsonPath = path.join(reportsDir, 'report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf8');

  // 2. Markdown Report
  const mdPath = path.join(reportsDir, 'report.md');
  const mdContent = compileMarkdown(results);
  fs.writeFileSync(mdPath, mdContent, 'utf8');

  // 3. HTML Report
  const htmlPath = path.join(reportsDir, 'report.html');
  const htmlContent = compileHtml(results);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  // 4. Console output summary
  printConsoleSummary(results);
}

function compileMarkdown(results) {
  const timestamp = new Date(results.timestamp).toLocaleString();
  let md = `# Zazele Online - QA Deployment Validation Report\n\n`;
  md += `**Timestamp:** ${timestamp}  \n`;
  md += `**Environment:** \`${results.environment}\`  \n`;
  md += `**Overall Status:** ${results.failed === 0 ? '🟢 PASS' : '🔴 FAIL'} (${results.passed} passed, ${results.failed} failed)\n\n`;
  
  md += `## Metrics Summary\n\n`;
  md += `| Test Suite | Passed | Failed | Status |\n`;
  md += `| :--- | :---: | :---: | :---: |\n`;
  
  for (const [suiteName, tests] of Object.entries(results.suites)) {
    const passed = tests.filter(t => t.status === 'PASS').length;
    const failed = tests.filter(t => t.status === 'FAIL').length;
    const status = failed === 0 ? '🟢 PASS' : '🔴 FAIL';
    md += `| ${suiteName.toUpperCase()} | ${passed} | ${failed} | ${status} |\n`;
  }
  md += `\n`;

  md += `## Detailed Results\n\n`;
  for (const [suiteName, tests] of Object.entries(results.suites)) {
    md += `### Suite: ${suiteName.toUpperCase()}\n\n`;
    for (const test of tests) {
      const icon = test.status === 'PASS' ? '✓' : '✗';
      const indicator = test.status === 'PASS' ? '🟢' : '🔴';
      md += `- **${indicator} [${test.status}]** ${test.name}\n`;
      if (test.message) {
        md += `  > \`${test.message}\`\n`;
      }
    }
    md += `\n`;
  }

  return md;
}

function compileHtml(results) {
  const timestamp = new Date(results.timestamp).toLocaleString();
  const title = `Zazele Online QA Validation Report`;
  const isPass = results.failed === 0;
  
  let suiteRows = '';
  for (const [suiteName, tests] of Object.entries(results.suites)) {
    const passed = tests.filter(t => t.status === 'PASS').length;
    const failed = tests.filter(t => t.status === 'FAIL').length;
    const isSuitePass = failed === 0;
    suiteRows += `
      <div class="suite-card ${isSuitePass ? 'suite-pass' : 'suite-fail'}">
        <div class="suite-header">
          <h3>${suiteName.toUpperCase()}</h3>
          <span class="badge ${isSuitePass ? 'bg-success' : 'bg-danger'}">${isSuitePass ? 'PASS' : 'FAIL'}</span>
        </div>
        <div class="suite-stats">${passed} Passed / ${failed} Failed</div>
        <div class="test-list">
          ${tests.map(test => `
            <div class="test-item ${test.status.toLowerCase()}">
              <div class="test-name">
                <span class="icon">${test.status === 'PASS' ? '✓' : '✗'}</span>
                <span>${test.name}</span>
              </div>
              ${test.message ? `<div class="test-error">${escapeHtml(test.message)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #151c2c;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --primary: #4f46e5;
      --success: #10b981;
      --danger: #ef4444;
      --border: #1f2937;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Outfit', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      padding: 40px 20px;
      line-height: 1.5;
    }
    .container { max-width: 1000px; margin: 0 auto; }
    header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    header h1 { font-size: 2.2rem; margin-bottom: 8px; font-weight: 700; background: linear-gradient(135deg, #a5b4fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    header .meta { color: var(--text-muted); font-size: 0.95rem; }
    .overall-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .overall-status { font-size: 1.5rem; font-weight: 600; }
    .overall-status.pass { color: var(--success); }
    .overall-status.fail { color: var(--danger); }
    .stat-box h4 { color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 6px; }
    .stat-box p { font-size: 1.8rem; font-weight: 700; }
    .suites-grid { display: grid; grid-template-columns: 1fr; gap: 30px; }
    @media (min-width: 768px) {
      .suites-grid { grid-template-columns: 1fr 1fr; }
    }
    .suite-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .suite-card.suite-pass { border-top: 4px solid var(--success); }
    .suite-card.suite-fail { border-top: 4px solid var(--danger); }
    .suite-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .suite-header h3 { font-size: 1.2rem; font-weight: 600; }
    .badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .bg-success { background-color: rgba(16, 185, 129, 0.2); color: var(--success); }
    .bg-danger { background-color: rgba(239, 68, 68, 0.2); color: var(--danger); }
    .suite-stats { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px; }
    .test-list { display: flex; flex-direction: column; gap: 12px; flex-grow: 1; }
    .test-item {
      padding: 10px 12px;
      border-radius: 8px;
      background-color: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.02);
    }
    .test-item.pass { border-left: 3px solid var(--success); }
    .test-item.fail { border-left: 3px solid var(--danger); background-color: rgba(239, 68, 68, 0.03); }
    .test-name { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }
    .test-item.pass .icon { color: var(--success); font-weight: bold; }
    .test-item.fail .icon { color: var(--danger); font-weight: bold; }
    .test-error {
      margin-top: 6px;
      padding: 8px;
      background: rgba(0,0,0,0.3);
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.8rem;
      color: #fca5a5;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Zazele Online QA Report</h1>
      <div class="meta">Ran at ${timestamp} | Environment: ${results.environment}</div>
    </header>
    
    <div class="overall-card">
      <div>
        <div class="overall-status ${isPass ? 'pass' : 'fail'}">
          ${isPass ? '✓ ALL TESTS PASSED' : '✗ TEST RUN FAILED'}
        </div>
      </div>
      <div class="stat-box">
        <h4>Passed</h4>
        <p style="color: var(--success);">${results.passed}</p>
      </div>
      <div class="stat-box">
        <h4>Failed</h4>
        <p style="color: var(--danger);">${results.failed}</p>
      </div>
    </div>
    
    <div class="suites-grid">
      ${suiteRows}
    </div>
  </div>
</body>
</html>`;
}

function printConsoleSummary(results) {
  console.log('\n==================================================');
  console.log('         Zazele Online QA Test Summary            ');
  console.log('==================================================');
  console.log(`Ran at:      ${new Date(results.timestamp).toLocaleString()}`);
  console.log(`Environment: ${results.environment}`);
  console.log(`Overall:     ${results.failed === 0 ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m'}`);
  console.log(`Statistics:  ${results.passed} passed, ${results.failed} failed\n`);

  for (const [suiteName, tests] of Object.entries(results.suites)) {
    const passed = tests.filter(t => t.status === 'PASS').length;
    const failed = tests.filter(t => t.status === 'FAIL').length;
    const statusText = failed === 0 ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
    console.log(`- Suite \x1b[1m${suiteName.toUpperCase()}\x1b[0m: ${passed} passed, ${failed} failed (${statusText})`);
    for (const test of tests) {
      if (test.status === 'PASS') {
        console.log(`  \x1b[32m✓\x1b[0m ${test.name}`);
      } else {
        console.log(`  \x1b[31m✗ ${test.name}\x1b[0m`);
        if (test.message) console.log(`    \x1b[33mError: ${test.message}\x1b[0m`);
      }
    }
    console.log('');
  }
  console.log('==================================================\n');
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = {
  generateReports
};
