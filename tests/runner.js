const path = require('path');
const { exec } = require('child_process');
const testHelper = require('./utils/test-helper');
const reporter = require('./utils/reporter');

// Parse command line arguments
const args = process.argv.slice(2);
const suiteArg = args.find(a => a.startsWith('--suite=')) || '--suite=all';
const selectedSuite = suiteArg.split('=')[1];
const openArg = args.includes('--open');

// Available suites
const suites = {
  smoke: require('./smoke/smoke.test'),
  api: require('./api/api.test'),
  e2e: require('./e2e/e2e.test'),
  security: require('./security/security.test')
};

async function main() {
  console.log('\n>>> Starting Zazele Online QA Runner <<<\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: 'Test/Local-Mock',
    passed: 0,
    failed: 0,
    suites: {}
  };

  const activeSuites = [];
  if (selectedSuite === 'all') {
    activeSuites.push('smoke', 'api', 'security', 'e2e');
  } else if (suites[selectedSuite]) {
    activeSuites.push(selectedSuite);
  } else {
    console.error(`Unknown suite: ${selectedSuite}. Available: smoke, api, e2e, security, all`);
    process.exit(1);
  }

  // 1. Start backend test server (running in test/mock mode)
  const testPort = 5001;
  let serverStarted = false;
  try {
    await testHelper.startTestServer(testPort);
    serverStarted = true;
    console.log('[QA Runner] Backend server is listening on port 5001.\n');
  } catch (e) {
    console.error('[QA Runner] Failed to start test backend server. Running offline-only checks.', e.message);
  }

  // 2. Execute suites
  for (const suiteName of activeSuites) {
    console.log(`Running suite: [${suiteName.toUpperCase()}]`);
    try {
      const suiteModule = suites[suiteName];
      const suiteResults = await suiteModule.run(testPort);
      results.suites[suiteName] = suiteResults;
      
      const passed = suiteResults.filter(r => r.status === 'PASS').length;
      const failed = suiteResults.filter(r => r.status === 'FAIL').length;
      
      results.passed += passed;
      results.failed += failed;
    } catch (err) {
      console.error(`[Error] Failed to execute suite ${suiteName}:`, err.stack || err.message);
      results.suites[suiteName] = [{ name: 'Suite Execution', status: 'FAIL', message: err.message }];
      results.failed += 1;
    }
  }

  // 3. Stop backend test server
  if (serverStarted) {
    await testHelper.stopTestServer();
  }

  // 4. Generate Reports (JSON, HTML, Markdown)
  reporter.generateReports(results);

  // 5. Open report if requested
  if (openArg) {
    const reportHtml = path.resolve(__dirname, 'reports/report.html');
    console.log(`[QA Runner] Opening report in browser: ${reportHtml}`);
    // Platform-specific open command
    const cmd = process.platform === 'win32' ? `start ""` : (process.platform === 'darwin' ? 'open' : 'xdg-open');
    exec(`${cmd} "${reportHtml}"`);
  }

  // Exit with correct status code
  if (results.failed > 0) {
    console.log(`\n\x1b[31m[QA Runner] QA Run failed with ${results.failed} errors.\x1b[0m\n`);
    process.exit(1);
  } else {
    console.log('\n\x1b[32m[QA Runner] QA Run successful! All tests passed.\x1b[0m\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('[QA Runner] Fatal Execution Error:', err);
  process.exit(1);
});
