/**
 * Test script for Mashaaer System Diagnostics
 * 
 * This script demonstrates how to run system diagnostics and view the results.
 * It can be executed from Node.js or integrated into a web application.
 */

import { runSystemDiagnostics, generateHtmlReport, saveDiagnosticResults } from './utils/system-diagnostics.js';

// Main function to run tests
async function runDiagnosticTests() {
  console.log('🧪 Starting Mashaaer System Diagnostic Tests');
  
  try {
    // Run quick diagnostics
    console.log('🔍 Running quick diagnostics...');
    const quickResults = await runSystemDiagnostics({ quickTest: true });
    console.log('✅ Quick diagnostic test completed');
    console.log(`📊 Summary: ${quickResults.summary.passed} passed, ${quickResults.summary.failed} failed`);
    
    // Run full diagnostics
    console.log('\n🔍 Running full diagnostics...');
    const fullResults = await runSystemDiagnostics({ quickTest: false });
    console.log('✅ Full diagnostic test completed');
    console.log(`📊 Summary: ${fullResults.summary.passed} passed, ${fullResults.summary.failed} failed`);
    
    // Generate HTML report
    console.log('\n📋 Generating HTML report...');
    const htmlReport = generateHtmlReport(fullResults);
    
    // In a Node.js environment, you could save the HTML report to a file
    if (typeof window === 'undefined') {
      const fs = require('fs');
      fs.writeFileSync('./diagnostic-report.html', htmlReport);
      console.log('📄 Report saved to diagnostic-report.html');
    } else {
      // In a browser environment, you could open the report in a new window
      saveDiagnosticResults(fullResults);
      console.log('💾 Report saved to browser storage');
      
      // Option to display results in a new browser window
      const openReport = confirm('Would you like to open the HTML report in a new window?');
      if (openReport) {
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(htmlReport);
        reportWindow.document.close();
      }
    }
    
    return fullResults;
  } catch (error) {
    console.error('❌ Error running diagnostic tests:', error);
    throw error;
  }
}

// Function to test a single component
async function testSingleComponent(componentId) {
  console.log(`🧪 Testing component: ${componentId}`);
  
  try {
    // Create a mock testing function that only tests one component
    const testComponent = async () => {
      const fullResults = await runSystemDiagnostics();
      
      // Find the specific component test result
      const componentTest = fullResults.tests.find(test => test.componentId === componentId);
      
      if (!componentTest) {
        throw new Error(`Component "${componentId}" not found in test results`);
      }
      
      console.log(`Component: ${componentTest.componentNameEn} (${componentTest.componentName})`);
      console.log(`Status: ${componentTest.status.toUpperCase()}`);
      console.log(`Details: ${componentTest.detailsEn}`);
      
      return componentTest;
    };
    
    return await testComponent();
  } catch (error) {
    console.error(`❌ Error testing component ${componentId}:`, error);
    throw error;
  }
}

// Simulated environment checks for testing in Node.js
function setupNodeTestEnvironment() {
  if (typeof window === 'undefined') {
    console.log('🔧 Setting up Node.js test environment...');
    
    // Mock browser APIs
    global.window = {
      document: {
        getElementById: () => null,
        querySelector: () => null
      },
      localStorage: {
        getItem: () => null,
        setItem: () => {},
        length: 0,
        key: () => null
      },
      open: () => ({
        document: {
          write: () => {},
          close: () => {}
        }
      }),
      mashaaerComponents: {
        version: 'test-version',
        language: 'ar',
        enhancedMemory: {
          getEpisodicMemoryCount: () => 5,
          getSemanticMemoryCount: () => 3
        }
      }
    };
    
    // Mock SpeechSynthesis API
    global.window.speechSynthesis = {
      getVoices: () => [
        { lang: 'ar-SA', name: 'Arabic Voice' },
        { lang: 'en-US', name: 'English Voice' }
      ]
    };
    
    console.log('✅ Node.js test environment set up');
  }
}

// Integration with web UI
function setupDiagnosticButton() {
  if (typeof document !== 'undefined') {
    const button = document.createElement('button');
    button.textContent = 'Run System Diagnostics';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#3498db';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', async () => {
      button.disabled = true;
      button.textContent = 'Running Diagnostics...';
      
      try {
        await runDiagnosticTests();
      } catch (error) {
        console.error('Diagnostic test failed:', error);
        alert('Diagnostic test failed. See console for details.');
      } finally {
        button.disabled = false;
        button.textContent = 'Run System Diagnostics';
      }
    });
    
    document.body.appendChild(button);
  }
}

// Main execution
async function main() {
  // Setup environment if needed
  setupNodeTestEnvironment();
  
  // Decide how to run based on environment
  if (typeof window !== 'undefined' && window.document) {
    // Browser environment - add button to UI when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupDiagnosticButton);
    } else {
      setupDiagnosticButton();
    }
  } else {
    // Node.js environment - run tests directly
    try {
      await runDiagnosticTests();
    } catch (error) {
      process.exit(1);
    }
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  if (typeof process !== 'undefined') {
    process.exit(1);
  }
});

// Export functions for external use
export {
  runDiagnosticTests,
  testSingleComponent
};
