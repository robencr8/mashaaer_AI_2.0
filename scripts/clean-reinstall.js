/**
 * Clean Reinstall Script
 * 
 * This script automates the process of completely cleaning and reinstalling
 * npm dependencies for the project. It:
 * 1. Removes node_modules
 * 2. Removes package-lock.json
 * 3. Cleans npm cache
 * 4. Reinstalls dependencies with --legacy-peer-deps
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Print a header
console.log(`${colors.cyan}=====================================${colors.reset}`);
console.log(`${colors.cyan}   MASHAAER CLEAN REINSTALL SCRIPT   ${colors.reset}`);
console.log(`${colors.cyan}=====================================${colors.reset}`);

// Function to run commands and handle errors
function runCommand(command, description) {
  try {
    console.log(`\n${colors.yellow}➤ ${description}...${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`${colors.green}✓ Done!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main function to run the cleanup process
async function cleanAndReinstall() {
  const projectRoot = path.resolve(__dirname, '..');
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  const packageLockPath = path.join(projectRoot, 'package-lock.json');
  
  console.log(`${colors.blue}Working directory: ${projectRoot}${colors.reset}\n`);

  // Check if node_modules exists
  if (fs.existsSync(nodeModulesPath)) {
    if (!runCommand(`rimraf "${nodeModulesPath}"`, 'Removing node_modules directory')) {
      console.log(`${colors.yellow}Trying alternative removal method...${colors.reset}`);
      runCommand(`rm -rf "${nodeModulesPath}"`, 'Removing node_modules with rm -rf');
    }
  } else {
    console.log(`${colors.blue}ℹ node_modules directory doesn't exist, skipping removal${colors.reset}`);
  }

  // Check if package-lock.json exists
  if (fs.existsSync(packageLockPath)) {
    runCommand(`rimraf "${packageLockPath}"`, 'Removing package-lock.json');
  } else {
    console.log(`${colors.blue}ℹ package-lock.json doesn't exist, skipping removal${colors.reset}`);
  }

  // Clean npm cache
  runCommand('npm cache clean --force', 'Cleaning npm cache');

  // Install dependencies with legacy-peer-deps
  if (!runCommand('npm install --legacy-peer-deps', 'Installing dependencies with --legacy-peer-deps')) {
    console.log(`${colors.yellow}Installation failed. Trying again with network timeout increase...${colors.reset}`);
    runCommand('npm install --legacy-peer-deps --network-timeout 100000', 'Retrying installation with increased network timeout');
  }

  console.log(`\n${colors.green}=====================================${colors.reset}`);
  console.log(`${colors.green}   CLEANUP PROCESS COMPLETED   ${colors.reset}`);
  console.log(`${colors.green}=====================================${colors.reset}`);
  console.log(`\n${colors.blue}Next steps:${colors.reset}`);
  console.log(`${colors.blue}1. Run 'npm start' to start the development server${colors.reset}`);
  console.log(`${colors.blue}2. Run 'npm test' to run tests${colors.reset}`);
}

// Run the main function
cleanAndReinstall().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
