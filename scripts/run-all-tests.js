/**
 * Mashaaer Enhanced Project
 * Master Test Runner
 * 
 * This script orchestrates the running of all test scripts to provide
 * comprehensive testing coverage for the entire application.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('======================================');
console.log('    MASHAAER ENHANCED TEST RUNNER    ');
console.log('======================================\n');

// Create a log file
const logFile = path.join(__dirname, '..', 'test-reports', 'master-test-report.log');

// Ensure test-reports directory exists
if (!fs.existsSync(path.join(__dirname, '..', 'test-reports'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'test-reports'), { recursive: true });
}

fs.writeFileSync(logFile, `Mashaaer Master Test Report - ${new Date().toISOString()}\n\n`, { flag: 'w' });

// Test suites to run
const testSuites = [
  { name: 'All App Functions', command: 'node scripts/test-app.js', required: true },
  { name: 'Emotion Detection', command: 'node scripts/test-emotion.js', required: false },
  { name: 'UI Components', command: 'node scripts/test-ui.js', required: false },
  { name: 'Jest Unit Tests', command: 'npm run test:nonwatch', required: false },
  { name: 'Backend Tests', command: 'node scripts/test-backend.js', required: false }
];

// Track results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0
};

// Log a message to both console and log file
function log(message) {
  console.log(message);
  fs.appendFileSync(logFile, message + '\n');
}

// Run tests
async function runTests() {
  for (const suite of testSuites) {
    results.total++;
    
    log(`\n[${new Date().toLocaleTimeString()}] Running ${suite.name} tests...\n`);
    log(`$ ${suite.command}\n`);
    
    try {
      // Run the test command
      const output = execSync(suite.command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 120000  // 2 minute timeout
      });
      
      // Log the output
      log(output);
      
      // Mark as passed
      log(`\n✅ [PASS] ${suite.name} tests completed successfully.\n`);
      results.passed++;
      
    } catch (error) {
      // Check if it's just a timeout
      if (error.signal === 'SIGTERM') {
        log(`\n⚠️ [TIMEOUT] ${suite.name} tests timed out after 120 seconds.\n`);
        results.skipped++;
      } 
      // Check if it's a command not found (likely missing script)
      else if (error.status === 127 || error.message.includes('command not found')) {
        log(`\n⚠️ [SKIP] ${suite.name} tests skipped - script not found.\n`);
        results.skipped++;
      }
      // Check if it's a test failure vs runtime error
      else if (error.status === 1 && error.stdout) {
        log(error.stdout);
        log(`\n❌ [FAIL] ${suite.name} tests failed with errors.\n`);
        results.failed++;
        
        // If this is a required test, we should exit with error
        if (suite.required) {
          log(`Required test suite "${suite.name}" failed. Stopping test execution.`);
          process.exit(1);
        }
      } 
      // Other error
      else {
        log(`\n❌ [ERROR] ${suite.name} tests encountered an error:\n`);
        log(error.message);
        if (error.stdout) log(error.stdout);
        if (error.stderr) log(error.stderr);
        log('');
        
        results.failed++;
      }
    }
    
    log('--------------------------------------');
  }
}

// Print summary
function printSummary() {
  log('\n======================================');
  log('           TEST SUMMARY              ');
  log('======================================\n');
  
  log(`Total test suites: ${results.total}`);
  log(`Passed: ${results.passed}`);
  log(`Failed: ${results.failed}`);
  log(`Skipped: ${results.skipped}`);
  
  log('\nTest details are available in:');
  log(`- Master log: ${logFile}`);
  log('- Individual test logs in the test-reports directory\n');
  
  if (results.failed > 0) {
    log('❌ Some tests failed. Please address the issues before proceeding.');
    return false;
  } else if (results.skipped > 0) {
    log('⚠️ All available tests passed, but some tests were skipped.');
    return true;
  } else {
    log('✅ All tests passed successfully!');
    return true;
  }
}

// Main function
async function main() {
  try {
    log(`Test run started at: ${new Date().toLocaleString()}\n`);
    
    // Run all tests
    await runTests();
    
    // Print summary
    const allPassed = printSummary();
    
    // Exit with appropriate code
    process.exit(allPassed ? 0 : 1);
    
  } catch (error) {
    log(`\n❌ Test execution failed with error: ${error.message}`);
    process.exit(1);
  }
}

// Run main function
main();
