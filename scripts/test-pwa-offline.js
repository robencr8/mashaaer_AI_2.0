// Test PWA Offline Mode Script
// This script helps test the PWA's offline capabilities by serving the build directory
// and providing utilities to simulate offline mode

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const open = require('open');
const chalk = require('chalk');

// Configuration
const PORT = 5000;
const BUILD_DIR = path.join(__dirname, '..', 'build');

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error(chalk.red('Error: Build directory not found. Please run "npm run build" first.'));
  process.exit(1);
}

// Create HTTP server
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: BUILD_DIR,
    rewrites: [
      { source: '**', destination: '/index.html' }
    ]
  });
});

// Start server
server.listen(PORT, () => {
  console.log(chalk.green(`\n✅ PWA is running at http://localhost:${PORT}\n`));
  
  console.log(chalk.yellow('To test offline capabilities:'));
  console.log('1. Open Chrome DevTools (F12 or Ctrl+Shift+I)');
  console.log('2. Go to the "Application" tab');
  console.log('3. In the left sidebar, under "Service Workers", check "Offline"');
  console.log('4. Refresh the page to see how the app behaves offline');
  console.log('5. You can also use the "Network" tab and select "Offline" from the dropdown');
  
  console.log(chalk.yellow('\nTo run a Lighthouse audit:'));
  console.log('1. Open Chrome DevTools (F12 or Ctrl+Shift+I)');
  console.log('2. Go to the "Lighthouse" tab');
  console.log('3. Select the categories you want to audit (make sure "Progressive Web App" is checked)');
  console.log('4. Click "Generate report"');
  
  console.log(chalk.yellow('\nTo install the PWA:'));
  console.log('1. Look for the install icon in the address bar');
  console.log('2. Or go to Chrome menu > Install Mashaaer Enhanced...');
  
  console.log(chalk.blue('\nPress Ctrl+C to stop the server\n'));
  
  // Open the browser
  open(`http://localhost:${PORT}`);
});

// Handle server shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\nShutting down the server...'));
  server.close(() => {
    console.log(chalk.green('Server stopped'));
    process.exit(0);
  });
});