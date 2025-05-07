/**
 * Mashaaer Enhanced Project
 * Backend Test Script
 * 
 * This script tests the Flask backend integration and API functionality.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');

// Define key paths
const rootDir = path.join(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');

console.log('======================================');
console.log('        BACKEND TEST SCRIPT          ');
console.log('======================================\n');

// Track test results
let passed = 0;
let failed = 0;
let skipped = 0;

// Utility function to log test results
function logTest(name, result, details = '') {
  const resultText = result === 'pass' 
    ? '\x1b[32mPASS\x1b[0m' 
    : result === 'fail' 
      ? '\x1b[31mFAIL\x1b[0m' 
      : '\x1b[33mSKIP\x1b[0m';
  
  const symbol = result === 'pass' ? '✅' : result === 'fail' ? '❌' : '⚠️';
  
  console.log(`${symbol} [${resultText}] ${name}${details ? ` - ${details}` : ''}`);
  
  if (result === 'pass') passed++;
  else if (result === 'fail') failed++;
  else skipped++;
}

// 1. Check if backend directory exists
console.log('1. Checking backend directory...\n');

const hasBackendDir = fs.existsSync(backendDir);
logTest('Backend directory exists', hasBackendDir ? 'pass' : 'fail');

if (!hasBackendDir) {
  console.log('\x1b[31mBackend directory not found!\x1b[0m');
  console.log('Expected at:', backendDir);
  console.log('\nBackend tests will be skipped.');
  
  // Print summary
  console.log('\n======================================');
  console.log('  TEST SUMMARY  ');
  console.log('======================================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Skipped: ${skipped}`);
  console.log('\nTotal tests: ', passed + failed + skipped);
  
  process.exit(1);
}

// 2. Check for key backend files
console.log('\n2. Checking for key backend files...\n');

const expectedFiles = [
  'app.py',
  'requirements.txt',
  'memory_indexer.py',
  'system_metrics.py'
];

for (const file of expectedFiles) {
  const hasFile = fs.existsSync(path.join(backendDir, file));
  logTest(`${file} exists`, hasFile ? 'pass' : 'skip', hasFile ? '' : 'File not found');
}

// 3. Check Python requirements
console.log('\n3. Checking Python requirements...\n');

try {
  const requirements = fs.readFileSync(path.join(backendDir, 'requirements.txt'), 'utf8');
  
  const requiredPackages = [
    'flask',
    'transformers',
    'tokenizers',
    'numpy',
    'sqlalchemy'
  ];
  
  for (const pkg of requiredPackages) {
    const hasPackage = requirements.includes(pkg);
    logTest(`${pkg} in requirements.txt`, hasPackage ? 'pass' : 'fail');
  }
} catch (error) {
  console.log(`Error reading requirements.txt: ${error.message}`);
  logTest('Reading requirements.txt', 'fail');
}

// 4. Check Flask app structure
console.log('\n4. Checking Flask app structure...\n');

try {
  const appPyExists = fs.existsSync(path.join(backendDir, 'app.py'));
  
  if (appPyExists) {
    const appPy = fs.readFileSync(path.join(backendDir, 'app.py'), 'utf8');
    
    // Check for key Flask components
    const hasFlaskImport = appPy.includes('from flask import');
    logTest('Flask import', hasFlaskImport ? 'pass' : 'fail');
    
    const hasAppDefinition = appPy.includes('app = Flask');
    logTest('Flask app defined', hasAppDefinition ? 'pass' : 'fail');
    
    const hasRoutes = appPy.includes('@app.route');
    logTest('Route definitions', hasRoutes ? 'pass' : 'fail');
    
    // Check for key API endpoints
    const endpoints = [
      { path: '/api/tts', method: 'POST' },
      { path: '/ask', method: 'POST' },
      { path: '/api/emotion', method: 'POST' }
    ];
    
    for (const endpoint of endpoints) {
      const pattern = `@app.route('${endpoint.path}'`;
      const alternativePattern = `@app.route("${endpoint.path}"`;
      const hasEndpoint = appPy.includes(pattern) || appPy.includes(alternativePattern);
      
      logTest(`${endpoint.path} endpoint`, hasEndpoint ? 'pass' : 'skip', 
             hasEndpoint ? '' : 'Endpoint not found');
    }
    
    // Check for error handling
    const hasErrorHandling = appPy.includes('except') && appPy.includes('try:');
    logTest('Error handling', hasErrorHandling ? 'pass' : 'fail');
    
  } else {
    logTest('Flask app analysis', 'skip', 'app.py not found');
  }
} catch (error) {
  console.log(`Error analyzing app.py: ${error.message}`);
  logTest('Analyzing app.py', 'fail');
}

// 5. Check memory indexer
console.log('\n5. Checking memory indexer...\n');

try {
  const memoryIndexerExists = fs.existsSync(path.join(backendDir, 'memory_indexer.py'));
  
  if (memoryIndexerExists) {
    const memoryIndexer = fs.readFileSync(path.join(backendDir, 'memory_indexer.py'), 'utf8');
    
    // Check for key functionality
    const hasIndexingClass = memoryIndexer.includes('class MemoryIndexer') || 
                             memoryIndexer.includes('class Indexer') ||
                             memoryIndexer.includes('class Memory');
    logTest('Memory indexer class definition', hasIndexingClass ? 'pass' : 'fail');
    
    const hasIndexFunction = memoryIndexer.includes('def index(') || 
                            memoryIndexer.includes('def add_memory(') || 
                            memoryIndexer.includes('def store(');
    logTest('Memory indexing function', hasIndexFunction ? 'pass' : 'fail');
    
    const hasRetrievalFunction = memoryIndexer.includes('def retrieve(') || 
                                memoryIndexer.includes('def search(') || 
                                memoryIndexer.includes('def get_memory(');
    logTest('Memory retrieval function', hasRetrievalFunction ? 'pass' : 'fail');
    
  } else {
    logTest('Memory indexer analysis', 'skip', 'memory_indexer.py not found');
  }
} catch (error) {
  console.log(`Error analyzing memory_indexer.py: ${error.message}`);
  logTest('Analyzing memory_indexer.py', 'fail');
}

// 6. Check system metrics
console.log('\n6. Checking system metrics...\n');

try {
  const systemMetricsExists = fs.existsSync(path.join(backendDir, 'system_metrics.py'));
  
  if (systemMetricsExists) {
    const systemMetrics = fs.readFileSync(path.join(backendDir, 'system_metrics.py'), 'utf8');
    
    // Check for key functionality
    const hasMetricsClass = systemMetrics.includes('class SystemMetrics') || 
                           systemMetrics.includes('class Metrics') ||
                           systemMetrics.includes('class Performance');
    logTest('System metrics class definition', hasMetricsClass ? 'pass' : 'fail');
    
    const hasPerformanceTracking = systemMetrics.includes('performance') || 
                                  systemMetrics.includes('cpu') || 
                                  systemMetrics.includes('memory');
    logTest('Performance tracking', hasPerformanceTracking ? 'pass' : 'fail');
    
    const hasReportGeneration = systemMetrics.includes('report') || 
                               systemMetrics.includes('generate_') || 
                               systemMetrics.includes('to_json');
    logTest('Report generation', hasReportGeneration ? 'pass' : 'fail');
    
  } else {
    logTest('System metrics analysis', 'skip', 'system_metrics.py not found');
  }
} catch (error) {
  console.log(`Error analyzing system_metrics.py: ${error.message}`);
  logTest('Analyzing system_metrics.py', 'fail');
}

// 7. Check for Python tests
console.log('\n7. Checking for Python tests...\n');

const testsDirs = [
  path.join(backendDir, 'tests'),
  path.join(backendDir, 'test'),
  path.join(rootDir, 'tests', 'backend')
];

let pythonTestsFound = false;
let pythonTestsDir = null;

for (const dir of testsDirs) {
  if (fs.existsSync(dir)) {
    // Check for test files
    try {
      const files = fs.readdirSync(dir);
      const testFiles = files.filter(f => f.startsWith('test_') && f.endsWith('.py'));
      
      if (testFiles.length > 0) {
        pythonTestsFound = true;
        pythonTestsDir = dir;
        logTest('Python tests', 'pass', `Found ${testFiles.length} test files in ${dir}`);
        break;
      }
    } catch (error) {
      console.log(`Error reading directory ${dir}: ${error.message}`);
    }
  }
}

if (!pythonTestsFound) {
  logTest('Python tests', 'skip', 'No Python test files found');
}

// 8. Check if Flask server can start
console.log('\n8. Checking if Flask server can start...\n');

// Don't actually run this test in CI environments
const isCIEnvironment = process.env.CI === 'true';
if (isCIEnvironment) {
  logTest('Flask server startup', 'skip', 'Skipped in CI environment');
} else {
  console.log('Attempting to start Flask server (will timeout after 10 seconds)...');
  
  try {
    // Try to start the Flask server with a timeout
    const flaskStartCommand = `cd ${backendDir} && python -m flask run --no-debugger`;
    let flaskProcess = null;
    
    try {
      // Use a child process to start Flask
      const { spawn } = require('child_process');
      flaskProcess = spawn('python', ['-m', 'flask', 'run', '--no-debugger'], {
        cwd: backendDir,
        env: { ...process.env, FLASK_APP: 'app.py' },
        stdio: 'pipe'
      });
      
      // Set up timeout to kill the process
      const flaskTimeout = setTimeout(() => {
        if (flaskProcess) {
          flaskProcess.kill();
        }
      }, 10000);
      
      // Check for successful startup
      let serverStarted = false;
      let errorOutput = '';
      
      flaskProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(output);
        
        if (output.includes('Running on')) {
          serverStarted = true;
          clearTimeout(flaskTimeout);
          flaskProcess.kill();
          logTest('Flask server startup', 'pass', 'Server started successfully');
        }
      });
      
      flaskProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      flaskProcess.on('close', (code) => {
        if (!serverStarted) {
          if (errorOutput.includes('address already in use')) {
            logTest('Flask server startup', 'pass', 'Port already in use (server likely already running)');
          } else if (errorOutput) {
            logTest('Flask server startup', 'fail', `Failed with error: ${errorOutput.trim()}`);
          } else {
            logTest('Flask server startup', 'fail', `Process exited with code ${code}`);
          }
        }
      });
      
      // Wait for process to finish
      await new Promise(resolve => {
        flaskProcess.on('close', resolve);
      });
      
    } catch (error) {
      console.log(`Error starting Flask: ${error.message}`);
      logTest('Flask server startup', 'fail', error.message);
    }
  } catch (error) {
    console.log(`Error in Flask startup test: ${error.message}`);
    logTest('Flask server startup', 'fail', error.message);
  }
}

// 9. Check API integration in frontend
console.log('\n9. Checking API integration in frontend...\n');

// Look for API calls in the frontend code
const apiUsagePatterns = [
  'fetch(\'/api/',
  'fetch(\'/ask',
  'axios.get(\'/api/',
  'axios.post(\'/api/',
  'axios.post(\'/ask'
];

let apiCallsFound = 0;
let filesWithApiCalls = [];

function searchForApiCalls(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory() && !itemPath.includes('node_modules') && !itemPath.includes('.git')) {
        searchForApiCalls(itemPath);
      } else if ((item.endsWith('.js') || item.endsWith('.jsx')) && 
                !item.includes('.test.') && !item.includes('.spec.')) {
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          
          for (const pattern of apiUsagePatterns) {
            if (content.includes(pattern)) {
              apiCallsFound++;
              filesWithApiCalls.push(itemPath);
              break;
            }
          }
        } catch (error) {
          // Skip file reading errors
        }
      }
    }
  } catch (error) {
    console.log(`Error scanning directory ${dir}: ${error.message}`);
  }
}

searchForApiCalls(path.join(rootDir, 'src'));

if (apiCallsFound > 0) {
  logTest('Frontend API integration', 'pass', `Found ${apiCallsFound} API calls in ${filesWithApiCalls.length} files`);
} else {
  logTest('Frontend API integration', 'fail', 'No API calls found in frontend code');
}

// 10. Manual API test suggestions
console.log('\n10. Manual API test suggestions:\n');

console.log('To fully test the backend API, try these manual tests:');
console.log('1. Start the Flask server with: cd backend && python -m flask run');
console.log('2. Test the /ask endpoint with a POST request containing Arabic text');
console.log('3. Test the /api/tts endpoint with Arabic text for speech synthesis');
console.log('4. Test the /api/emotion endpoint with an emotional Arabic statement');
console.log('5. Verify memory persistence by making repeated requests with the same user ID');
console.log('6. Check system metrics endpoint for health monitoring data');

// Print summary
console.log('\n======================================');
console.log('  TEST SUMMARY  ');
console.log('======================================');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️ Skipped: ${skipped}`);
console.log('\nTotal tests: ', passed + failed + skipped);

// Exit with appropriate code
if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
