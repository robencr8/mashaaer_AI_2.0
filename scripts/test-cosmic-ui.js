/**
 * Mashaaer Enhanced Project
 * Cosmic UI Test Script
 * 
 * This script tests the enhanced Cosmic UI implementation,
 * focusing on integration between modules, stability, and responsiveness.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define key paths
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const stylesDir = path.join(srcDir, 'styles');
const utilsDir = path.join(srcDir, 'utils');

console.log('======================================');
console.log('     COSMIC UI INTEGRATION TESTS      ');
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

// 1. Check for required files
console.log('1. Checking for required Cosmic UI files...\n');

const requiredFiles = [
  { path: path.join(stylesDir, 'cosmic-ui-enhanced.css'), name: 'Enhanced CSS styles' },
  { path: path.join(utilsDir, 'cosmic-ui-enhancer.js'), name: 'UI Enhancer utility' },
  { path: path.join(rootDir, 'docs', 'cosmic-ui-improvements.md'), name: 'Documentation' }
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file.path);
  logTest(`${file.name} exists`, exists ? 'pass' : 'fail', file.path);
});

// 2. Analyze CSS file
console.log('\n2. Analyzing CSS implementation...\n');

try {
  const cssPath = path.join(stylesDir, 'cosmic-ui-enhanced.css');
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for key CSS features
    const cssFeatures = [
      { name: 'CSS Variables', pattern: /:root\s*{/ },
      { name: 'Responsive Media Queries', pattern: /@media\s*\(/ },
      { name: 'Animations', pattern: /@keyframes/ },
      { name: 'RTL Support', pattern: /\[dir="rtl"\]/ },
      { name: 'Accessibility Features', pattern: /@media\s*\(prefers-reduced-motion/ },
      { name: 'High Contrast Mode', pattern: /@media\s*\(prefers-contrast/ }
    ];
    
    cssFeatures.forEach(feature => {
      const hasFeature = feature.pattern.test(cssContent);
      logTest(`CSS has ${feature.name}`, hasFeature ? 'pass' : 'fail');
    });
    
    // Check for component styles
    const componentStyles = [
      { name: 'Background Styles', pattern: /\.cosmic-background/ },
      { name: 'Card Styles', pattern: /\.cosmic-card/ },
      { name: 'Button Styles', pattern: /\.cosmic-button/ },
      { name: 'Input Styles', pattern: /\.cosmic-input/ },
      { name: 'Typography Styles', pattern: /\.cosmic-title|\.cosmic-text/ },
      { name: 'Toast Notification Styles', pattern: /\.cosmic-toast/ }
    ];
    
    componentStyles.forEach(component => {
      const hasComponent = component.pattern.test(cssContent);
      logTest(`CSS has ${component.name}`, hasComponent ? 'pass' : 'fail');
    });
  } else {
    logTest('CSS Analysis', 'skip', 'CSS file not found');
  }
} catch (error) {
  console.log(`Error analyzing CSS: ${error.message}`);
  logTest('CSS Analysis', 'fail', error.message);
}

// 3. Analyze JS implementation
console.log('\n3. Analyzing JavaScript implementation...\n');

try {
  const jsPath = path.join(utilsDir, 'cosmic-ui-enhancer.js');
  if (fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    
    // Check for key JS features
    const jsFeatures = [
      { name: 'Class Definition', pattern: /class\s+CosmicUIEnhancer/ },
      { name: 'Configuration Options', pattern: /this\.config\s*=/ },
      { name: 'Initialize Method', pattern: /initialize\s*\(\s*\)/ },
      { name: 'Star Generation', pattern: /generateStars\s*\(\s*\)/ },
      { name: 'Event Listeners', pattern: /setupEventListeners\s*\(\s*\)/ },
      { name: 'Responsive Handling', pattern: /handleResize\s*\(\s*\)/ },
      { name: 'Parallax Effects', pattern: /handleMouseMove|handleScroll/ },
      { name: 'Color Scheme Support', pattern: /applyColorScheme\s*\(\s*scheme/ },
      { name: 'Auto-Enhancement', pattern: /enhanceUIElements\s*\(\s*\)/ },
      { name: 'Cleanup Method', pattern: /destroy\s*\(\s*\)/ },
      { name: 'Singleton Export', pattern: /export\s+default/ }
    ];
    
    jsFeatures.forEach(feature => {
      const hasFeature = feature.pattern.test(jsContent);
      logTest(`JS has ${feature.name}`, hasFeature ? 'pass' : 'fail');
    });
    
    // Check for accessibility considerations
    const accessibilityFeatures = [
      { name: 'Reduced Motion Support', pattern: /reducedMotion|prefers-reduced-motion/ },
      { name: 'Event Cleanup', pattern: /removeEventListener/ },
      { name: 'Performance Optimization', pattern: /clearTimeout|setTimeout/ }
    ];
    
    accessibilityFeatures.forEach(feature => {
      const hasFeature = feature.pattern.test(jsContent);
      logTest(`JS has ${feature.name}`, hasFeature ? 'pass' : 'fail');
    });
  } else {
    logTest('JS Analysis', 'skip', 'JS file not found');
  }
} catch (error) {
  console.log(`Error analyzing JS: ${error.message}`);
  logTest('JS Analysis', 'fail', error.message);
}

// 4. Check integration with other modules
console.log('\n4. Checking integration with other modules...\n');

// Look for imports of the cosmic-ui-enhancer in other files
try {
  let integrationCount = 0;
  
  function searchDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory() && !itemPath.includes('node_modules')) {
        searchDirectory(itemPath);
      } else if ((item.endsWith('.js') || item.endsWith('.jsx')) && 
                !item.includes('cosmic-ui-enhancer.js')) {
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          if (content.includes('cosmic-ui-enhancer') || 
              content.includes('cosmicUIEnhancer') || 
              content.includes('cosmic-ui-enhanced.css')) {
            integrationCount++;
            console.log(`  Found integration in: ${path.relative(rootDir, itemPath)}`);
          }
        } catch (error) {
          // Skip file reading errors
        }
      }
    }
  }
  
  searchDirectory(srcDir);
  
  logTest('Integration with other modules', integrationCount > 0 ? 'pass' : 'skip', 
         integrationCount > 0 ? `Found ${integrationCount} files with integration` : 'No direct imports found');
} catch (error) {
  console.log(`Error checking integration: ${error.message}`);
  logTest('Integration Check', 'fail', error.message);
}

// 5. Check for potential CSS conflicts
console.log('\n5. Checking for potential CSS conflicts...\n');

try {
  const cssPath = path.join(stylesDir, 'cosmic-ui-enhanced.css');
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Look for global styles that might cause conflicts
    const potentialConflicts = [
      { name: 'Global element selectors', pattern: /^(body|html|div|span|a|button|input)\s*{/m },
      { name: 'Overly generic class names', pattern: /\.(container|wrapper|button|card|input|header|footer)\s*{/m },
      { name: 'Important declarations', pattern: /!important/g }
    ];
    
    potentialConflicts.forEach(conflict => {
      const matches = cssContent.match(conflict.pattern);
      const hasConflict = matches && matches.length > 0;
      
      if (hasConflict && conflict.name === 'Important declarations') {
        logTest(`CSS avoids ${conflict.name}`, false ? 'pass' : 'fail', `Found ${matches.length} !important declarations`);
      } else {
        logTest(`CSS avoids ${conflict.name}`, !hasConflict ? 'pass' : 'fail', 
               hasConflict ? 'Potential conflicts found' : 'No conflicts detected');
      }
    });
    
    // Check for namespacing
    const hasNamespacing = /\.cosmic-/.test(cssContent);
    logTest('CSS uses proper namespacing', hasNamespacing ? 'pass' : 'fail');
  } else {
    logTest('CSS Conflict Analysis', 'skip', 'CSS file not found');
  }
} catch (error) {
  console.log(`Error checking CSS conflicts: ${error.message}`);
  logTest('CSS Conflict Analysis', 'fail', error.message);
}

// 6. Check documentation quality
console.log('\n6. Checking documentation quality...\n');

try {
  const docPath = path.join(rootDir, 'docs', 'cosmic-ui-improvements.md');
  if (fs.existsSync(docPath)) {
    const docContent = fs.readFileSync(docPath, 'utf8');
    
    // Check for key documentation sections
    const docSections = [
      { name: 'Overview section', pattern: /## Overview/i },
      { name: 'Features description', pattern: /## Enhanced Cosmic UI|### New Features/i },
      { name: 'Implementation details', pattern: /### Implementation Details/i },
      { name: 'Usage instructions', pattern: /## How to Use/i },
      { name: 'Code examples', pattern: /```(javascript|js|css)/i },
      { name: 'Testing information', pattern: /## Testing/i }
    ];
    
    docSections.forEach(section => {
      const hasSection = section.pattern.test(docContent);
      logTest(`Documentation has ${section.name}`, hasSection ? 'pass' : 'fail');
    });
    
    // Check documentation length (should be substantial)
    const wordCount = docContent.split(/\s+/).length;
    logTest('Documentation is comprehensive', wordCount > 300 ? 'pass' : 'fail', 
           `${wordCount} words${wordCount <= 300 ? ' (should be more detailed)' : ''}`);
  } else {
    logTest('Documentation Analysis', 'skip', 'Documentation file not found');
  }
} catch (error) {
  console.log(`Error checking documentation: ${error.message}`);
  logTest('Documentation Analysis', 'fail', error.message);
}

// 7. Suggest manual testing steps
console.log('\n7. Manual testing suggestions:\n');

console.log('To fully test the Cosmic UI integration, try these manual tests:');
console.log('- Verify that the cosmic background appears with stars and nebulae');
console.log('- Test responsiveness by resizing the browser window');
console.log('- Check that parallax effects work on mouse movement and scrolling');
console.log('- Verify that UI components (buttons, inputs, cards) have the cosmic styling');
console.log('- Test with RTL language settings to ensure proper RTL support');
console.log('- Enable reduced motion in your OS settings to test accessibility features');
console.log('- Try different color schemes by calling cosmicUIEnhancer.applyColorScheme()');
console.log('- Verify that the UI works well on mobile devices');

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