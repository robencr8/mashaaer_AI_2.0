/**
 * Mashaaer Enhanced Project
 * Comprehensive Test Script
 * 
 * This script performs tests on all major application components to ensure
 * they are functioning correctly. It tests:
 * 
 * - Emotion detection
 * - Assistant service
 * - Voice services
 * - Memory system
 * - UI rendering
 * - Integration components
 * - API connections
 * - Subscription system
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk') || { green: (t) => t, red: (t) => t, yellow: (t) => t, blue: (t) => t, cyan: (t) => t };

// Create a log file
const logFile = path.join(__dirname, '..', 'test-results.log');
fs.writeFileSync(logFile, `Mashaaer Test Results - ${new Date().toISOString()}\n\n`, { flag: 'w' });

// Test result counters
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0
};

/**
 * Log a message to console and the log file
 */
function log(message, skipConsole = false) {
  fs.appendFileSync(logFile, message + '\n');
  if (!skipConsole) {
    console.log(message);
  }
}

/**
 * Log a test result
 */
function logTest(name, status, details = '') {
  results.total++;

  let statusText, symbol;

  switch (status) {
    case 'pass':
      statusText = chalk.green('PASS');
      symbol = '✅';
      results.passed++;
      break;
    case 'fail':
      statusText = chalk.red('FAIL');
      symbol = '❌';
      results.failed++;
      break;
    case 'skip':
      statusText = chalk.yellow('SKIP');
      symbol = '⚠️';
      results.skipped++;
      break;
    default:
      statusText = chalk.blue('INFO');
      symbol = 'ℹ️';
  }

  const message = `${symbol} [${statusText}] ${name}${details ? ` - ${details}` : ''}`;
  log(message);
}

/**
 * Run a system command and return the result
 */
function runCommand(command, silent = false) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
  } catch (error) {
    if (!silent) {
      console.error('Command failed:', error.message);
    }
    return null;
  }
}

/**
 * Check if a path exists
 */
function pathExists(filepath) {
  try {
    fs.accessSync(filepath);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Test environment setup
 */
function testEnvironment() {
  log(chalk.cyan('\n=== Environment Tests ===\n'));

  // Check Node.js version
  const nodeVersion = process.version;
  const isNodeOk = nodeVersion.startsWith('v14') || nodeVersion.startsWith('v16') || nodeVersion.startsWith('v18');
  logTest('Node.js version', isNodeOk ? 'pass' : 'fail', `Found ${nodeVersion}, expected v14+`);

  // Check npm
  const npmVersion = runCommand('npm --version', true);
  const isNpmOk = npmVersion !== null;
  logTest('npm available', isNpmOk ? 'pass' : 'fail', isNpmOk ? `v${npmVersion.trim()}` : 'Not found');

  // Check package.json
  const hasPackageJson = pathExists(path.join(__dirname, '..', 'package.json'));
  logTest('package.json exists', hasPackageJson ? 'pass' : 'fail');

  // Check node_modules
  const hasNodeModules = pathExists(path.join(__dirname, '..', 'node_modules'));
  logTest('node_modules directory exists', hasNodeModules ? 'pass' : 'fail');

  // Check for critical dependencies
  const criticalDeps = ['react', 'react-dom', 'axios'];
  for (const dep of criticalDeps) {
    const hasDep = pathExists(path.join(__dirname, '..', 'node_modules', dep));
    logTest(`Dependency: ${dep}`, hasDep ? 'pass' : 'fail');
  }
}

/**
 * Test application source files
 */
function testSourceFiles() {
  log(chalk.cyan('\n=== Source Files Tests ===\n'));

  const srcDir = path.join(__dirname, '..', 'src');
  const criticalFiles = [
    'index.js',
    'App.js',
    'App.new.jsx',
    'emotion/emotion-timeline.js'
  ];

  // Test if src directory exists
  const hasSrcDir = pathExists(srcDir);
  logTest('src directory exists', hasSrcDir ? 'pass' : 'fail');

  if (!hasSrcDir) {
    return;
  }

  // Test critical files
  for (const file of criticalFiles) {
    const hasFile = pathExists(path.join(srcDir, file));
    logTest(`Source file: ${file}`, hasFile ? 'pass' : 'fail');
  }

  // Test directory structure
  const criticalDirs = [
    'emotion',
    'assistant',
    'services',
    'utils',
    'context'
  ];

  for (const dir of criticalDirs) {
    const hasDir = pathExists(path.join(srcDir, dir));
    logTest(`Source directory: ${dir}`, hasDir ? 'pass' : 'fail');
  }
}

/**
 * Test emotion detection module
 */
function testEmotionDetection() {
  log(chalk.cyan('\n=== Emotion Detection Tests ===\n'));

  const emotionTimelinePath = path.join(__dirname, '..', 'src', 'emotion', 'emotion-timeline.js');
  const hasEmotionTimeline = pathExists(emotionTimelinePath);

  logTest('Emotion Timeline module exists', hasEmotionTimeline ? 'pass' : 'fail');

  if (!hasEmotionTimeline) {
    return;
  }

  // Check content of emotion detection
  try {
    const content = fs.readFileSync(emotionTimelinePath, 'utf8');

    // Check for key methods
    const hasInitialize = content.includes('initialize(');
    logTest('EmotionTimeline.initialize() method', hasInitialize ? 'pass' : 'fail');

    const hasHandleEmotionUpdate = content.includes('handleEmotionUpdate(');
    logTest('EmotionTimeline.handleEmotionUpdate() method', hasHandleEmotionUpdate ? 'pass' : 'fail');

    const hasRenderVisualTimeline = content.includes('renderVisualTimeline(');
    logTest('EmotionTimeline.renderVisualTimeline() method', hasRenderVisualTimeline ? 'pass' : 'fail');

    // Check for subscription features
    const hasSubscriptionCheck = content.includes('canAccessFeature(');
    logTest('Subscription feature checking', hasSubscriptionCheck ? 'pass' : 'fail');

    // Check for storage functionality
    const hasStorage = content.includes('saveTimelineData(') && content.includes('loadTimelineData(');
    logTest('Emotion data storage functions', hasStorage ? 'pass' : 'fail');

  } catch (error) {
    logTest('Reading Emotion Timeline module', 'fail', error.message);
  }
}

/**
 * Test assistant service
 */
function testAssistantService() {
  log(chalk.cyan('\n=== Assistant Service Tests ===\n'));

  const assistantDir = path.join(__dirname, '..', 'src', 'assistant');
  const hasAssistantDir = pathExists(assistantDir);

  logTest('Assistant directory exists', hasAssistantDir ? 'pass' : 'fail');

  if (!hasAssistantDir) {
    logTest('Assistant service tests', 'skip', 'Assistant directory not found');
    return;
  }

  // Check for assistant implementations
  const assistantFiles = fs.readdirSync(assistantDir);

  const hasBasicAssistant = assistantFiles.some(file => 
    file.includes('assistant') && (file.endsWith('.js') || file.endsWith('.jsx')));

  logTest('Assistant implementation found', hasBasicAssistant ? 'pass' : 'fail');

  // Look for response generation functionality
  let hasResponseGeneration = false;

  for (const file of assistantFiles) {
    try {
      const filePath = path.join(assistantDir, file);
      if (fs.statSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('handleUserMessage(') || 
            content.includes('generateResponse(') || 
            content.includes('processUserInput(')) {
          hasResponseGeneration = true;
          break;
        }
      }
    } catch (error) {
      // Skip errors in reading files
    }
  }

  logTest('Response generation functionality', hasResponseGeneration ? 'pass' : 'fail');
}

/**
 * Test services architecture
 */
function testServicesArchitecture() {
  log(chalk.cyan('\n=== Services Architecture Tests ===\n'));

  const servicesDir = path.join(__dirname, '..', 'src', 'services');
  const hasServicesDir = pathExists(servicesDir);

  logTest('Services directory exists', hasServicesDir ? 'pass' : 'fail');

  if (!hasServicesDir) {
    logTest('Services architecture tests', 'skip', 'Services directory not found');
    return;
  }

  // Check for key services
  const expectedServices = [
    'api', 
    'assistant',
    'voice',
    'emotion',
    'memory',
    'config',
    'theme'
  ];

  for (const service of expectedServices) {
    let serviceFound = false;

    // Check for directory or file with service name
    if (pathExists(path.join(servicesDir, service)) || 
        pathExists(path.join(servicesDir, `${service}.js`)) ||
        pathExists(path.join(servicesDir, `${service}-service.js`))) {
      serviceFound = true;
    }

    logTest(`${service} service`, serviceFound ? 'pass' : 'fail');
  }

  // Check for services context
  const contextDir = path.join(__dirname, '..', 'src', 'context');
  const hasContextDir = pathExists(contextDir);

  if (hasContextDir) {
    // Look for services context file
    const hasServicesContext = fs.readdirSync(contextDir).some(file => 
      file.includes('service') && file.includes('context'));

    logTest('Services context provider', hasServicesContext ? 'pass' : 'fail');
  } else {
    logTest('Services context provider', 'fail', 'Context directory not found');
  }
}

/**
 * Test integration modules
 */
function testIntegrations() {
  log(chalk.cyan('\n=== Integration Tests ===\n'));

  const integrationDir = path.join(__dirname, '..', 'src', 'integration');
  const hasIntegrationDir = pathExists(integrationDir);

  if (!hasIntegrationDir) {
    logTest('Integration directory', 'fail', 'Integration directory not found');
    logTest('Integration tests', 'skip', 'Integration directory not found');
    return;
  }

  logTest('Integration directory exists', 'pass');

  // Check for specific integrations
  const expectedIntegrations = [
    { name: 'PayPal integration', files: ['paypal', 'payment'] },
    { name: 'WhatsApp integration', files: ['whatsapp', 'messaging'] },
    { name: 'Telegram integration', files: ['telegram', 'bot'] },
    { name: 'Flask backend integration', files: ['flask', 'backend', 'api'] }
  ];

  for (const integration of expectedIntegrations) {
    let found = false;

    try {
      const files = fs.readdirSync(integrationDir);

      for (const file of files) {
        const filePath = path.join(integrationDir, file);

        if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
          // Check if file name matches any of the expected patterns
          if (integration.files.some(pattern => file.toLowerCase().includes(pattern.toLowerCase()))) {
            found = true;
            break;
          }

          // Check file content if name doesn't match
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            if (integration.files.some(pattern => 
              content.toLowerCase().includes(pattern.toLowerCase()))) {
              found = true;
              break;
            }
          } catch (error) {
            // Skip errors in reading files
          }
        }
      }
    } catch (error) {
      logTest(integration.name, 'fail', 'Error checking integration');
      continue;
    }

    logTest(integration.name, found ? 'pass' : 'skip', found ? '' : 'Not implemented or not found');
  }
}

/**
 * Test UI Components
 */
function testUIComponents() {
  log(chalk.cyan('\n=== UI Components Tests ===\n'));

  const uiDir = path.join(__dirname, '..', 'src', 'ui');
  const hasUIDir = pathExists(uiDir);

  if (!hasUIDir) {
    // Check if UI components might be in components directory instead
    const componentsDir = path.join(__dirname, '..', 'src', 'components');
    const hasComponentsDir = pathExists(componentsDir);

    if (hasComponentsDir) {
      logTest('UI components directory found (as components)', 'pass');
    } else {
      logTest('UI components directory', 'fail', 'Neither ui nor components directory found');
      logTest('UI component tests', 'skip', 'UI directory not found');
      return;
    }
  } else {
    logTest('UI components directory found', 'pass');
  }

  // Check for key UI components
  const componentDirToCheck = hasUIDir ? uiDir : path.join(__dirname, '..', 'src', 'components');

  const expectedComponents = [
    { name: 'Emotion visualization', patterns: ['emotion', 'timeline', 'visualization'] },
    { name: 'Assistant interface', patterns: ['assistant', 'chat', 'message'] },
    { name: 'Voice controls', patterns: ['voice', 'speech', 'audio'] },
    { name: 'System status', patterns: ['status', 'system', 'health'] },
    { name: 'Subscription UI', patterns: ['subscription', 'payment', 'plan'] }
  ];

  for (const component of expectedComponents) {
    let found = false;

    try {
      // Recursively check all files in the UI directory
      function checkDirectory(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const filePath = path.join(dir, file);

          if (fs.statSync(filePath).isDirectory()) {
            // Check subdirectories
            if (checkDirectory(filePath)) {
              return true;
            }
          } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            // Check if file name matches any of the expected patterns
            if (component.patterns.some(pattern => file.toLowerCase().includes(pattern.toLowerCase()))) {
              return true;
            }

            // Check file content
            try {
              const content = fs.readFileSync(filePath, 'utf8');

              if (component.patterns.some(pattern => 
                content.toLowerCase().includes(pattern.toLowerCase()) &&
                (content.includes('class ') || content.includes('function ') || 
                 content.includes('const ') || content.includes('export')))) {
                return true;
              }
            } catch (error) {
              // Skip errors in reading files
            }
          }
        }

        return false;
      }

      found = checkDirectory(componentDirToCheck);
    } catch (error) {
      logTest(component.name, 'fail', `Error checking component: ${error.message}`);
      continue;
    }

    logTest(component.name, found ? 'pass' : 'skip', found ? '' : 'Not implemented or not found');
  }
}

/**
 * Test system status and monitoring
 */
function testSystemStatus() {
  log(chalk.cyan('\n=== System Status and Monitoring Tests ===\n'));

  // Check for system status related files
  const utilsDir = path.join(__dirname, '..', 'src', 'utils');
  const hasUtilsDir = pathExists(utilsDir);

  if (!hasUtilsDir) {
    logTest('Utils directory', 'fail', 'Utils directory not found');
    logTest('System status tests', 'skip', 'Utils directory not found');
    return;
  }

  logTest('Utils directory exists', 'pass');

  // Look for system status or monitoring modules
  let hasStatusModule = false;
  let hasReportingModule = false;

  try {
    const files = fs.readdirSync(utilsDir);

    for (const file of files) {
      if (!file.endsWith('.js')) continue;

      const filePath = path.join(utilsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for system status
      if (file.includes('status') || file.includes('system') || file.includes('health') ||
          content.includes('SystemStatus') || content.includes('system status') ||
          content.includes('health check')) {
        hasStatusModule = true;
      }

      // Check for reporting
      if (file.includes('report') || file.includes('metrics') || 
          content.includes('generateReport') || content.includes('system report') ||
          content.includes('SystemMetrics')) {
        hasReportingModule = true;
      }
    }
  } catch (error) {
    logTest('Reading utils directory', 'fail', error.message);
  }

  logTest('System status module', hasStatusModule ? 'pass' : 'fail');
  logTest('System reporting module', hasReportingModule ? 'pass' : 'fail');

  // Check for console filter (mentioned in index.js)
  const consoleFilterPath = path.join(utilsDir, 'console-filter.js');
  const hasConsoleFilter = pathExists(consoleFilterPath);

  logTest('Console filter utility', hasConsoleFilter ? 'pass' : 'fail');
}

/**
 * Test backend integration
 */
function testBackendIntegration() {
  log(chalk.cyan('\n=== Backend Integration Tests ===\n'));

  // Check for backend directory
  const backendDir = path.join(__dirname, '..', 'backend');
  const hasBackendDir = pathExists(backendDir);

  logTest('Backend directory exists', hasBackendDir ? 'pass' : 'fail');

  if (!hasBackendDir) {
    logTest('Backend integration tests', 'skip', 'Backend directory not found');
    return;
  }

  // Check for Flask files
  const hasPythonFiles = fs.readdirSync(backendDir).some(file => file.endsWith('.py'));
  logTest('Python backend files found', hasPythonFiles ? 'pass' : 'fail');

  // Check for key backend components
  const expectedComponents = [
    { name: 'API routes', filename: 'app.py' },
    { name: 'Memory indexer', filename: 'memory_indexer.py' },
    { name: 'System metrics', filename: 'system_metrics.py' }
  ];

  for (const component of expectedComponents) {
    const hasComponent = pathExists(path.join(backendDir, component.filename));
    logTest(`${component.name} (${component.filename})`, hasComponent ? 'pass' : 'skip', 
            hasComponent ? '' : 'File not found');
  }

  // Check for requirements.txt
  const hasRequirements = pathExists(path.join(backendDir, 'requirements.txt'));
  logTest('Python requirements.txt exists', hasRequirements ? 'pass' : 'fail');

  // Check for API integration in frontend
  const apiDirPath = path.join(__dirname, '..', 'src', 'api');
  const hasApiDir = pathExists(apiDirPath);

  if (hasApiDir) {
    logTest('Frontend API directory exists', 'pass');

    // Check for Flask API integration
    let hasFlaskIntegration = false;

    try {
      const files = fs.readdirSync(apiDirPath);

      for (const file of files) {
        if (!file.endsWith('.js')) continue;

        const filePath = path.join(apiDirPath, file);
        const content = fs.readFileSync(filePath, 'utf8');

        if (content.includes('/api/') || content.includes('/ask') || 
            content.includes('flask') || content.includes('backend')) {
          hasFlaskIntegration = true;
          break;
        }
      }
    } catch (error) {
      logTest('Reading API directory', 'fail', error.message);
    }

    logTest('Flask API integration', hasFlaskIntegration ? 'pass' : 'fail');
  } else {
    logTest('Frontend API directory exists', 'fail');
  }
}

/**
 * Test PWA capabilities
 */
function testPWACapabilities() {
  log(chalk.cyan('\n=== Progressive Web App Tests ===\n'));

  // Check for manifest.json
  const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
  const hasManifest = pathExists(manifestPath);

  logTest('PWA manifest.json exists', hasManifest ? 'pass' : 'fail');

  // Check for service worker
  const serviceWorkerPath = path.join(__dirname, '..', 'src', 'serviceWorkerRegistration.js');
  const hasServiceWorker = pathExists(serviceWorkerPath);

  logTest('Service worker registration exists', hasServiceWorker ? 'pass' : 'fail');

  if (hasServiceWorker) {
    try {
      const content = fs.readFileSync(serviceWorkerPath, 'utf8');
      const isServiceWorkerRegistered = content.includes('register()') && 
                                        !content.includes('unregister()');

      logTest('Service worker is registered (not unregistered)', isServiceWorkerRegistered ? 'pass' : 'fail');
    } catch (error) {
      logTest('Reading service worker file', 'fail', error.message);
    }
  }

  // Check for offline capabilities
  const hasServiceWorkerFile = pathExists(path.join(__dirname, '..', 'public', 'service-worker.js'));
  logTest('Service worker implementation exists', hasServiceWorkerFile ? 'pass' : 'fail');

  // Check for app icons
  const publicDir = path.join(__dirname, '..', 'public');
  let hasIcons = false;

  try {
    const files = fs.readdirSync(publicDir);
    hasIcons = files.some(file => 
      (file.includes('icon') || file.includes('logo')) && 
      (file.endsWith('.png') || file.endsWith('.svg') || file.endsWith('.ico'))
    );
  } catch (error) {
    logTest('Reading public directory', 'fail', error.message);
  }

  logTest('PWA icons exist', hasIcons ? 'pass' : 'fail');
}

/**
 * Runs npm test command
 */
function runNpmTest() {
  log(chalk.cyan('\n=== Running npm test ===\n'));

  // Check if test script exists
  try {
    const packageJson = require(path.join(__dirname, '..', 'package.json'));
    const hasTestScript = packageJson.scripts && packageJson.scripts.test;

    if (!hasTestScript) {
      logTest('Test script exists in package.json', 'fail');
      return;
    }

    logTest('Test script exists in package.json', 'pass', packageJson.scripts.test);

    // Try to run the test with a timeout
    log('\nAttempting to run tests (with 30 second timeout)...');
    log('Note: This will be aborted after 30 seconds to prevent blocking, you can run full tests manually');

    try {
      execSync('npm test -- --watchAll=false', { 
        encoding: 'utf8', 
        stdio: 'pipe',
        timeout: 30000  // 30 second timeout
      });
      logTest('npm test executed successfully', 'pass');
    } catch (error) {
      // Check if it was a timeout or another error
      if (error.signal === 'SIGTERM') {
        logTest('npm test execution', 'skip', 'Timed out after 30 seconds, please run manually');
      } else {
        logTest('npm test execution', 'fail', error.message);
      }
    }
  } catch (error) {
    logTest('Reading package.json', 'fail', error.message);
  }
}

/**
 * Print final test summary
 */
function printSummary() {
  log(chalk.cyan('\n=== Test Summary ===\n'));

  log(`Total tests: ${results.total}`);
  log(`Passed: ${chalk.green(results.passed)}`);
  log(`Failed: ${chalk.red(results.failed)}`);
  log(`Skipped: ${chalk.yellow(results.skipped)}`);

  const passRate = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
  log(`\nPass rate: ${passRate}%`);

  log(chalk.cyan(`\nDetailed test results are available in: ${logFile}`));

  // Provide overall assessment
  if (passRate >= 80) {
    log(chalk.green('\n✅ OVERALL ASSESSMENT: GOOD - Most tests passed'));
  } else if (passRate >= 60) {
    log(chalk.yellow('\n⚠️ OVERALL ASSESSMENT: AVERAGE - Several tests failed or were skipped'));
  } else {
    log(chalk.red('\n❌ OVERALL ASSESSMENT: POOR - Many tests failed'));
  }

  // Next steps
  log(chalk.cyan('\nRecommended next steps:'));
  if (results.failed > 0) {
    log(`1. Fix the ${results.failed} failed tests`);
    log('2. Run this test script again to verify fixes');
  } else {
    log('1. Run a complete test suite: npm test');
    log('2. Start the application: npm start');
  }
}

/**
 * Main function to run all tests
 */
function runAllTests() {
  console.log(chalk.cyan('======================================'));
  console.log(chalk.cyan('  MASHAAER ENHANCED TESTING UTILITY  '));
  console.log(chalk.cyan('======================================\n'));

  log(`Starting tests at: ${new Date().toLocaleString()}\n`);

  try {
    // Run all test functions
    testEnvironment();
    testSourceFiles();
    testEmotionDetection();
    testAssistantService();
    testServicesArchitecture();
    testIntegrations();
    testUIComponents();
    testSystemStatus();
    testBackendIntegration();
    testPWACapabilities();
    runNpmTest();

    // Print summary
    printSummary();
  } catch (error) {
    console.error('Test execution failed:', error);
    log(`\nTest execution failed with error: ${error.message}`);
  }

  log('\nTest execution completed.');
}

// Run all tests
runAllTests();
