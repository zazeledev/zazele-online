// Dashboard Reports Exporting Module
const ReportsModule = {
  downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  },

  exportJson(report) {
    if (!report) return alert('No report loaded to export');
    const content = JSON.stringify(report, null, 2);
    this.downloadFile(content, 'zazele-qa-report.json', 'application/json');
  },

  exportMarkdown(report) {
    if (!report) return alert('No report loaded to export');
    let md = `# Zazele Online QA Verification Report\n\n`;
    md += `- **Date**: ${new Date(report.timestamp).toLocaleString()}\n`;
    md += `- **Environment**: ${report.environment}\n`;
    md += `- **Vitals Status**: Passed: ${report.passed} | Failed: ${report.failed} | Warnings: ${report.warnings || 0}\n\n`;

    md += `## Detailed Validation Results\n\n`;
    for (const [suiteName, tests] of Object.entries(report.suites)) {
      md += `### Suite: ${suiteName.toUpperCase()}\n\n`;
      md += `| Test Name | Status | Error Message |\n`;
      md += `| :--- | :--- | :--- |\n`;
      for (const t of tests) {
        md += `| ${t.name} | **${t.status}** | ${t.message || 'None'} |\n`;
      }
      md += `\n`;
    }
    this.downloadFile(md, 'zazele-qa-report.md', 'text/markdown');
  },

  exportCsv(report) {
    if (!report) return alert('No report loaded to export');
    let csv = `Suite,Test Name,Status,Message\n`;
    for (const [suiteName, tests] of Object.entries(report.suites)) {
      for (const t of tests) {
        // Escape quotes
        const name = `"${t.name.replace(/"/g, '""')}"`;
        const msg = `"${(t.message || '').replace(/"/g, '""')}"`;
        csv += `${suiteName},${name},${t.status},${msg}\n`;
      }
    }
    this.downloadFile(csv, 'zazele-qa-report.csv', 'text/csv');
  },

  exportHtml(report) {
    if (!report) return alert('No report loaded to export');
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Zazele QA Report Summary</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
    h1 { border-bottom: 2px solid #eaecef; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #dfe2e5; padding: 12px; text-align: left; }
    th { background-color: #f6f8fa; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; font-weight: bold; }
    .badge-pass { background-color: #d4edda; color: #155724; }
    .badge-warning { background-color: #fff3cd; color: #856404; }
    .badge-fail { background-color: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <h1>Zazele Online QA Verification Report</h1>
  <p><strong>Timestamp:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
  <p><strong>Environment:</strong> ${report.environment}</p>
  <p><strong>Summary:</strong> ${report.passed} passed, ${report.failed} failed, ${report.warnings || 0} warnings</p>

  <h2>Test Details</h2>
  <table>
    <thead>
      <tr>
        <th>Suite</th>
        <th>Test Name</th>
        <th>Status</th>
        <th>Message</th>
      </tr>
    </thead>
    <tbody>`;

    for (const [suiteName, tests] of Object.entries(report.suites)) {
      for (const t of tests) {
        let badgeClass = 'badge-pass';
        if (t.status === 'FAIL') badgeClass = 'badge-fail';
        else if (t.status === 'WARNING') badgeClass = 'badge-warning';

        html += `
      <tr>
        <td><strong>${suiteName.toUpperCase()}</strong></td>
        <td>${t.name}</td>
        <td><span class="badge ${badgeClass}">${t.status}</span></td>
        <td>${t.message || '-'}</td>
      </tr>`;
      }
    }

    html += `
    </tbody>
  </table>
</body>
</html>`;
    this.downloadFile(html, 'zazele-qa-report.html', 'text/html');
  }
};
