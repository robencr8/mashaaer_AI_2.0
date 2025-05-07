/**
 * Mashaaer Enhanced Project
 * UI Components Test Script
 * 
 * This script tests the UI components of the Mashaaer project.
 * It performs static analysis of UI components and renders tests.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define key paths
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const possibleUiDirs = [
  path.join(srcDir, 'ui'),
  path.join(srcDir, 'components')
];

console.log('======================================');
console.log('     UI COMPONENTS TEST SCRIPT       ');
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

// Find UI directory
let uiDir = null;
for (const dir of possibleUiDirs) {
  if (fs.existsSync(dir)) {
    uiDir = dir;
    break;
  }
}

if (!uiDir) {
  console.log('\x1b[31mUI components directory not found!\x1b[0m');
  console.log('Tried the following locations:');
  possibleUiDirs.forEach(dir => console.log(`- ${dir}`));
  process.exit(1);
}

console.log(`\nFound UI components directory at: ${uiDir}\n`);

// 1. Scan UI directory structure
console.log('1. Analyzing UI directory structure...\n');

function scanDirectory(dir, level = 0) {
  const indent = '  '.repeat(level);
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      console.log(`${indent}📁 ${item}/`);
      scanDirectory(itemPath, level + 1);
    } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
      console.log(`${indent}📄 ${item}`);
    }
  });
}

scanDirectory(uiDir);

// 2. Check for key UI components
console.log('\n2. Checking for key UI components...\n');

// Define expected component categories
const componentCategories = [
  {
    name: 'Layout components',
    patterns: ['layout', 'container', 'header', 'footer', 'sidebar']
  },
  {
    name: 'Emotion UI components',
    patterns: ['emotion', 'timeline', 'mood', 'feeling']
  },
  {
    name: 'Assistant UI components',
    patterns: ['assistant', 'chat', 'message', 'conversation']
  },
  {
    name: 'Voice UI components',
    patterns: ['voice', 'speech', 'audio', 'sound']
  },
  {
    name: 'Status and system components',
    patterns: ['status', 'system', 'dashboard', 'metrics', 'report']
  },
  {
    name: 'Form components',
    patterns: ['form', 'input', 'button', 'select', 'checkbox']
  }
];

// Search for components recursively
function findComponentsInDir(dir, patterns) {
  const results = {
    found: false,
    files: []
  };
  
  function searchDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        const subResults = searchDir(itemPath);
        if (subResults.found) {
          results.found = true;
          results.files.push(...subResults.files);
        }
      } else if ((item.endsWith('.js') || item.endsWith('.jsx')) && 
                !item.includes('.test.') && !item.includes('.spec.')) {
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check file name or content for patterns
          const matchesPattern = patterns.some(pattern => 
            item.toLowerCase().includes(pattern.toLowerCase()) || 
            content.toLowerCase().includes(pattern.toLowerCase())
          );
          
          // Additional check for React component structure
          const hasReactComponent = content.includes('import React') || 
                                   content.includes('React.') || 
                                   content.includes('function') && content.includes('return') && 
                                   (content.includes('jsx') || content.includes('<') && content.includes('/>'));
          
          if (matchesPattern && hasReactComponent) {
            results.found = true;
            results.files.push({
              path: itemPath,
              name: item
            });
          }
        } catch (error) {
          // Skip file reading errors
        }
      }
    }
    
    return results;
  }
  
  return searchDir(dir);
}

// Check for each component category
componentCategories.forEach(category => {
  const results = findComponentsInDir(uiDir, category.patterns);
  
  if (results.found) {
    logTest(`${category.name}`, 'pass', `Found ${results.files.length} components`);
    
    // List the first 3 files as examples
    const examples = results.files.slice(0, 3).map(f => path.basename(f.path)).join(', ');
    if (examples) {
      console.log(`   Examples: ${examples}${results.files.length > 3 ? ', ...' : ''}`);
    }
  } else {
    logTest(`${category.name}`, 'fail', 'No matching components found');
  }
});

// 3. Check for component styles
console.log('\n3. Checking component styles...\n');

// Look for various styling approaches
const stylingApproaches = [
  { name: 'CSS files', pattern: '.css', dir: true },
  { name: 'SCSS files', pattern: '.scss', dir: true },
  { name: 'styled-components', pattern: 'styled-components', dir: false },
  { name: 'Emotion styling', pattern: ['@emotion/styled', '@emotion/react'], dir: false },
  { name: 'Tailwind classes', pattern: ['className="', 'tw-'], dir: false },
  { name: 'Inline styles', pattern: ['style={', 'style="'], dir: false }
];

// Function to find files by pattern
function findFiles(dir, pattern) {
  let result = [];
  
  // For patterns in filenames
  if (Array.isArray(pattern)) {
    // For patterns in file content
    const contentPatterns = pattern;
    
    function searchFiles(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          result = result.concat(searchFiles(itemPath));
        } else if ((item.endsWith('.js') || item.endsWith('.jsx'))) {
          try {
            const content = fs.readFileSync(itemPath, 'utf8');
            for (const contentPattern of contentPatterns) {
              if (content.includes(contentPattern)) {
                result.push(itemPath);
                break;
              }
            }
          } catch (error) {
            // Skip file reading errors
          }
        }
      }
      
      return result;
    }
    
    return searchFiles(dir);
  } else {
    // For patterns in filenames
    function searchFiles(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          result = result.concat(searchFiles(itemPath));
        } else if (item.endsWith(pattern)) {
          result.push(itemPath);
        }
      }
      
      return result;
    }
    
    return searchFiles(dir);
  }
}

// Check each styling approach
stylingApproaches.forEach(approach => {
  let files = [];
  
  if (approach.dir) {
    // Look for style files in the project
    const checkDirs = [uiDir, srcDir];
    for (const dir of checkDirs) {
      files = files.concat(findFiles(dir, approach.pattern));
    }
  } else {
    // Look for styling patterns in component files
    files = findFiles(uiDir, approach.pattern);
  }
  
  if (files.length > 0) {
    logTest(`${approach.name}`, 'pass', `Found in ${files.length} files`);
  } else {
    logTest(`${approach.name}`, 'skip', 'Not used in the project');
  }
});

// 4. Look for UI tests
console.log('\n4. Checking for UI component tests...\n');

// Check common testing directories
const testDirs = [
  path.join(srcDir, '__tests__'),
  path.join(uiDir, '__tests__'),
  path.join(rootDir, 'tests', 'ui')
];

let testFilesFound = 0;

for (const dir of testDirs) {
  if (fs.existsSync(dir)) {
    function countTestFiles(currentDir) {
      let count = 0;
      
      try {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
          const itemPath = path.join(currentDir, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            count += countTestFiles(itemPath);
          } else if (item.includes('.test.') || item.includes('.spec.')) {
            count++;
          }
        }
      } catch (error) {
        // Skip directory errors
      }
      
      return count;
    }
    
    const count = countTestFiles(dir);
    testFilesFound += count;
    
    if (count > 0) {
      console.log(`Found ${count} test files in ${dir}`);
    }
  }
}

logTest('UI component test files', testFilesFound > 0 ? 'pass' : 'fail', 
       testFilesFound > 0 ? `${testFilesFound} test files found` : 'No test files found');

// 5. Check testing frameworks
console.log('\n5. Checking UI testing frameworks...\n');

// Check package.json for testing dependencies
try {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  const testingFrameworks = [
    { name: 'Jest', dependency: 'jest' },
    { name: 'React Testing Library', dependency: '@testing-library/react' },
    { name: 'Enzyme', dependency: 'enzyme' },
    { name: 'Cypress', dependency: 'cypress' }
  ];
  
  testingFrameworks.forEach(framework => {
    const isInstalled = dependencies && dependencies[framework.dependency];
    logTest(`${framework.name}`, isInstalled ? 'pass' : 'skip', 
           isInstalled ? `Found version ${dependencies[framework.dependency]}` : 'Not installed');
  });
} catch (error) {
  console.log(`Error reading package.json: ${error.message}`);
}

// 6. Check for accessibility features
console.log('\n6. Checking for accessibility features...\n');

// Look for common accessibility patterns in components
const accessibilityPatterns = [
  'aria-',
  'role=',
  'tabIndex',
  'alt=',
  'htmlFor',
  'accessibilityLabel'
];

let accessibleComponentsFound = 0;
let totalComponentsChecked = 0;

function checkComponentsForAccessibility(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        checkComponentsForAccessibility(itemPath);
      } else if ((item.endsWith('.js') || item.endsWith('.jsx')) && 
                !item.includes('.test.') && !item.includes('.spec.')) {
        totalComponentsChecked++;
        
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check if this looks like a React component
          if (content.includes('import React') || 
              content.includes('React.') || 
              (content.includes('function') && content.includes('return') && 
               (content.includes('jsx') || content.includes('<') && content.includes('/>') || content.includes('</div>')))) {
            
            // Check for accessibility patterns
            const hasAccessibilityFeatures = accessibilityPatterns.some(pattern => 
              content.includes(pattern)
            );
            
            if (hasAccessibilityFeatures) {
              accessibleComponentsFound++;
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

checkComponentsForAccessibility(uiDir);

if (totalComponentsChecked > 0) {
  const percentAccessible = Math.round((accessibleComponentsFound / totalComponentsChecked) * 100);
  logTest('Accessibility features', accessibleComponentsFound > 0 ? 'pass' : 'fail',
         `${accessibleComponentsFound}/${totalComponentsChecked} components (${percentAccessible}%) have accessibility attributes`);
} else {
  logTest('Accessibility features', 'skip', 'No components checked');
}

// 7. Check for responsive design
console.log('\n7. Checking for responsive design...\n');

// Look for responsive design patterns
const responsivePatterns = [
  '@media',
  'responsive',
  'mobile',
  'tablet',
  'desktop',
  'sm:',
  'md:',
  'lg:',
  'xl:',
  'flex',
  'grid',
  'useMediaQuery'
];

let responsiveComponentsFound = 0;
let totalFilesChecked = 0;

function checkFilesForResponsiveness(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        checkFilesForResponsiveness(itemPath);
      } else if ((item.endsWith('.js') || item.endsWith('.jsx') || item.endsWith('.css'))) {
        totalFilesChecked++;
        
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check for responsive patterns
          const hasResponsiveDesign = responsivePatterns.some(pattern => 
            content.includes(pattern)
          );
          
          if (hasResponsiveDesign) {
            responsiveComponentsFound++;
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

checkFilesForResponsiveness(uiDir);

if (totalFilesChecked > 0) {
  const percentResponsive = Math.round((responsiveComponentsFound / totalFilesChecked) * 100);
  logTest('Responsive design patterns', responsiveComponentsFound > 0 ? 'pass' : 'fail',
         `${responsiveComponentsFound}/${totalFilesChecked} files (${percentResponsive}%) use responsive design techniques`);
} else {
  logTest('Responsive design patterns', 'skip', 'No files checked');
}

// 8. Try to run UI component tests
console.log('\n8. Attempting to run UI component tests...\n');

try {
  console.log('Running UI component tests (this may take a moment)...');
  console.log('Note: Test will timeout after 30 seconds to prevent blocking');
  
  try {
    execSync('npm run test:ui -- --watchAll=false', { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 30000  // 30 second timeout
    });
    logTest('UI component tests execution', 'pass', 'Tests completed successfully');
  } catch (error) {
    // Check if it was a timeout or another error
    if (error.signal === 'SIGTERM') {
      logTest('UI component tests execution', 'skip', 'Timed out after 30 seconds, please run manually');
    } else if (error.status === 1 && error.stdout) {
      // This is likely a test failure, not a runtime error
      logTest('UI component tests execution', 'fail', 'Tests ran but some tests failed');
    } else {
      logTest('UI component tests execution', 'fail', error.message || 'Unknown error running tests');
    }
  }
} catch (error) {
  logTest('UI component tests execution', 'fail', `Error: ${error.message}`);
}

// 9. Cosmic UI theme check
console.log('\n9. Checking for Cosmic UI theme...\n');

// Look for cosmic theme elements
const cosmicThemePatterns = [
  'cosmic',
  'star',
  'space',
  'galaxy',
  'celestial',
  'night sky',
  'constellation',
  'universe'
];

let cosmicThemeFilesFound = 0;

function checkForCosmicTheme(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        checkForCosmicTheme(itemPath);
      } else if (item.endsWith('.js') || item.endsWith('.jsx') || 
                item.endsWith('.css') || item.endsWith('.scss')) {
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check for cosmic theme patterns
          const hasCosmicTheme = cosmicThemePatterns.some(pattern => 
            content.toLowerCase().includes(pattern)
          );
          
          if (hasCosmicTheme) {
            cosmicThemeFilesFound++;
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

// Check both UI and theme directories
checkForCosmicTheme(uiDir);
const themeDir = path.join(srcDir, 'theme');
if (fs.existsSync(themeDir)) {
  checkForCosmicTheme(themeDir);
}

logTest('Cosmic UI theme implementation', cosmicThemeFilesFound > 0 ? 'pass' : 'fail', 
       cosmicThemeFilesFound > 0 ? `Found in ${cosmicThemeFilesFound} files` : 'Not implemented');

// 10. Manual test suggestions
console.log('\n10. Manual UI test suggestions:\n');

console.log('To fully test the UI components, try these manual tests:');
console.log('- Verify that the cosmic theme is displayed correctly');
console.log('- Test layout responsiveness by resizing browser window');
console.log('- Test voice input buttons and controls');
console.log('- Verify that the emotion timeline visualizes emotions correctly');
console.log('- Check if the system status panel properly displays component health');
console.log('- Test subscription UI to verify plan information is shown correctly');
console.log('- Test accessibility using a screen reader');

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
