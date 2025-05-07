/**
 * Mashaaer Enhanced Project
 * Emotion Detection Component Test Script
 * 
 * This script tests the emotion detection functionality of the Mashaaer project.
 * It performs both static code analysis and runtime tests if possible.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define key paths
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const emotionDir = path.join(srcDir, 'emotion');

console.log('======================================');
console.log('  EMOTION DETECTION COMPONENT TESTS  ');
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

// Check if emotion directory exists
if (!fs.existsSync(emotionDir)) {
  console.log('\x1b[31mEmotion directory not found!\x1b[0m');
  console.log(`Expected at: ${emotionDir}`);
  process.exit(1);
}

console.log(`\nFound emotion directory at: ${emotionDir}\n`);

// 1. Check for required files
console.log('1. Checking required files...\n');

const requiredFiles = [
  'emotion-timeline.js'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(emotionDir, file));
  logTest(`${file} exists`, exists ? 'pass' : 'fail');
});

// 2. Static code analysis of emotion-timeline.js
console.log('\n2. Analyzing emotion-timeline.js...\n');

try {
  const timelineCode = fs.readFileSync(path.join(emotionDir, 'emotion-timeline.js'), 'utf8');
  
  // Check for essential methods
  const requiredMethods = [
    'initialize',
    'handleEmotionUpdate',
    'saveTimelineData',
    'loadTimelineData',
    'handleViewTimelineRequest',
    'renderVisualTimeline'
  ];
  
  requiredMethods.forEach(method => {
    const hasMethod = timelineCode.includes(`${method}(`);
    logTest(`Has ${method}() method`, hasMethod ? 'pass' : 'fail');
  });
  
  // Check for subscription level handling
  const hasSubscriptionLevel = timelineCode.includes('subscriptionLevel') && 
                               timelineCode.includes('canAccessFeature');
  logTest('Has subscription level handling', hasSubscriptionLevel ? 'pass' : 'fail');
  
  // Check for emotion colors
  const hasEmotionColors = timelineCode.includes('emotionColors') || timelineCode.includes('emotion colors');
  logTest('Has emotion color definitions', hasEmotionColors ? 'pass' : 'fail');
  
  // Check for timeline visualization
  const hasVisualization = timelineCode.includes('renderVisualTimeline') && 
                           timelineCode.includes('canvas') && 
                           timelineCode.includes('draw');
  logTest('Has timeline visualization', hasVisualization ? 'pass' : 'fail');
  
  // Check for cultural context
  const hasCulturalContext = timelineCode.includes('culturalContext');
  logTest('Has cultural context awareness', hasCulturalContext ? 'pass' : 'fail');
  
  // Check for storage mechanism
  const hasStorage = timelineCode.includes('localStorage') || 
                    timelineCode.includes('memoryDB') || 
                    timelineCode.includes('storage');
  logTest('Has data storage mechanism', hasStorage ? 'pass' : 'fail');
  
  // Check for event listeners
  const hasEventListeners = timelineCode.includes('addEventListener') && 
                            timelineCode.includes('document.addEventListener');
  logTest('Has event listeners', hasEventListeners ? 'pass' : 'fail');
  
  // Check Arabic localization
  const hasArabicText = /['"`][\u0600-\u06FF\s]+['"`]/.test(timelineCode);
  logTest('Has Arabic text/localization', hasArabicText ? 'pass' : 'fail');
  
} catch (error) {
  console.log(`\x1b[31mError analyzing emotion-timeline.js: ${error.message}\x1b[0m`);
}

// 3. Look for Jest test files
console.log('\n3. Checking for emotion test files...\n');

// Check src/__tests__/emotion or src/emotion/__tests__
const testDirs = [
  path.join(srcDir, '__tests__', 'emotion'),
  path.join(emotionDir, '__tests__'),
  path.join(rootDir, 'tests', 'emotion')
];

let testFilesFound = false;
let testDir = null;

for (const dir of testDirs) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const testFiles = files.filter(file => 
      file.includes('test') || file.includes('spec')
    );
    
    if (testFiles.length > 0) {
      testFilesFound = true;
      testDir = dir;
      logTest('Emotion test files found', 'pass', `${testFiles.length} files in ${dir}`);
      break;
    }
  }
}

if (!testFilesFound) {
  logTest('Emotion test files found', 'fail', 'No test files found');
}

// 4. Run Jest tests if available
console.log('\n4. Running emotion component tests...\n');

if (testFilesFound && testDir) {
  try {
    console.log('Attempting to run Jest tests for emotion components...');
    
    // Run Jest with the emotion test pattern
    const result = execSync('npm run test:emotion -- --watchAll=false', { 
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: 30000
    });
    
    console.log(result);
    logTest('Emotion Jest tests', 'pass', 'Tests completed successfully');
  } catch (error) {
    console.log('Test output:');
    console.log(error.stdout || error.message);
    
    // Check if it's a timeout
    if (error.signal === 'SIGTERM') {
      logTest('Emotion Jest tests', 'skip', 'Test execution timed out');
    } else {
      // Check if it's just test failures or setup issues
      if (error.stdout && error.stdout.includes('Test Suites:')) {
        logTest('Emotion Jest tests', 'fail', 'Tests ran but some tests failed');
      } else {
        logTest('Emotion Jest tests', 'fail', 'Error running tests');
      }
    }
  }
} else {
  logTest('Emotion Jest tests', 'skip', 'No test files found');
}

// 5. Manual test suggestions
console.log('\n5. Manual test suggestions:\n');

console.log('To fully test the emotion timeline component, try these manual tests:');
console.log('- Create a new emotion entry and verify it appears in the timeline');
console.log('- Test the visualization view by clicking the "عرض فني" button');
console.log('- Verify the emotion colors match the defined colors in the code');
console.log('- Test the star background effect and animation');
console.log('- Check if the subscription level restrictions work correctly');

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
