// Master Test Runner - Executes all API tests and saves results
// Usage: node __tests__/run-all-tests.js

const fs = require('fs');
const { testRegisterAPI } = require('./auth/register.test');
const { testLoginAPI } = require('./auth/login.test');

async function runAllTests() {
  console.log('='.repeat(70));
  console.log('STOREFLOW API TEST SUITE');
  console.log('='.repeat(70));
  console.log(`Started at: ${new Date().toLocaleString()}`);
  console.log('Server: http://localhost:3000');
  console.log('='.repeat(70));
  console.log('');

  const allResults = [];

  // Run registration tests
  try {
    const registerResults = await testRegisterAPI();
    allResults.push(...registerResults);
  } catch (error) {
    console.error('Registration tests failed:', error);
    allResults.push({
      test: 'Registration Tests',
      passed: false,
      error: error.message
    });
  }

  // Run login tests
  try {
    const loginResults = await testLoginAPI();
    allResults.push(...loginResults);
  } catch (error) {
    console.error('Login tests failed:', error);
    allResults.push({
      test: 'Login Tests',
      passed: false,
      error: error.message
    });
  }

  // Calculate summary
  const passed = allResults.filter(r => r.passed).length;
  const failed = allResults.filter(r => !r.passed).length;
  const total = allResults.length;
  const successRate = ((passed / total) * 100).toFixed(1);

  // Console summary
  console.log('');
  console.log('='.repeat(70));
  console.log('TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed} ${passed > 0 ? 'PASS' : ''}`);
  console.log(`Failed: ${failed} ${failed > 0 ? 'FAIL' : ''}`);
  console.log(`Success Rate: ${successRate}%`);
  console.log('='.repeat(70));

  // Generate detailed report
  const report = generateReport(allResults, passed, failed, total, successRate);

  // Save to file
  const outputPath = '__tests__/TEST_RESULTS.txt';
  fs.writeFileSync(outputPath, report);
  console.log(`\nTest results saved to: ${outputPath}\n`);

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

function generateReport(results, passed, failed, total, successRate) {
  let report = '';

  report += '='.repeat(70) + '\n';
  report += 'STOREFLOW API TEST RESULTS\n';
  report += '='.repeat(70) + '\n';
  report += `Date: ${new Date().toLocaleString()}\n`;
  report += `Server: http://localhost:3000\n`;
  report += `Database: PostgreSQL (storeflow)\n`;
  report += `Total Tests: ${total}\n`;
  report += `Passed: ${passed}\n`;
  report += `Failed: ${failed}\n`;
  report += `Success Rate: ${successRate}%\n`;
  report += '='.repeat(70) + '\n\n';

  // Group results by test type
  const registerTests = results.filter(r =>
    r.request?.endpoint === '/api/auth/register'
  );
  const loginTests = results.filter(r =>
    r.request?.endpoint === '/api/auth/callback/credentials'
  );

  if (registerTests.length > 0) {
    report += '\n' + '-'.repeat(70) + '\n';
    report += 'REGISTRATION API TESTS\n';
    report += '-'.repeat(70) + '\n';
    registerTests.forEach((r, i) => {
      report += formatTestResult(r, i + 1);
    });
  }

  if (loginTests.length > 0) {
    report += '\n' + '-'.repeat(70) + '\n';
    report += 'LOGIN API TESTS\n';
    report += '-'.repeat(70) + '\n';
    loginTests.forEach((r, i) => {
      report += formatTestResult(r, i + 1);
    });
  }

  report += '\n' + '='.repeat(70) + '\n';
  report += 'FINAL SUMMARY\n';
  report += '='.repeat(70) + '\n';
  report += `Status: ${failed === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}\n`;
  report += `Total: ${total} | Passed: ${passed} | Failed: ${failed}\n`;
  report += `Success Rate: ${successRate}%\n`;
  report += '='.repeat(70) + '\n';

  return report;
}

function formatTestResult(result, index) {
  let output = `\nTest ${index}: ${result.test}\n`;
  output += `Status: ${result.passed ? 'PASS' : 'FAIL'}\n`;
  output += '\nREQUEST:\n';
  output += `  Method: ${result.request?.method || 'N/A'}\n`;
  output += `  Endpoint: ${result.request?.endpoint || 'N/A'}\n`;
  output += `  Body: ${JSON.stringify(result.request?.body || {}, null, 2).replace(/\n/g, '\n  ')}\n`;
  output += '\nRESPONSE:\n';
  output += `  Status: ${result.response?.status || 'N/A'}\n`;
  output += `  Message: ${result.response?.message || result.response?.body?.message || 'N/A'}\n`;
  if (result.response?.body) {
    output += `  Body: ${JSON.stringify(result.response.body, null, 2).replace(/\n/g, '\n  ')}\n`;
  }
  if (result.error) {
    output += `\nERROR: ${result.error}\n`;
  }
  output += '-'.repeat(70) + '\n';
  return output;
}

// Run tests
runAllTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
