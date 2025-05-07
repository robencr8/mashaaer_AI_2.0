/**
 * Setup Script
 * 
 * This script provides a safer alternative to npm-force-resolutions.
 * It ensures that the specific versions of dependencies specified in the "resolutions" field
 * are properly enforced during installation without relying on the problematic npm-force-resolutions package.
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

console.log(`${colors.cyan}=====================================${colors.reset}`);
console.log(`${colors.cyan}   MASHAAER SETUP SCRIPT   ${colors.reset}`);
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

// Main function to run the setup process
async function setup() {
  const projectRoot = path.resolve(__dirname, '..');
  console.log(`${colors.blue}Working directory: ${projectRoot}${colors.reset}\n`);

  // Read package.json to get resolutions
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const resolutions = packageJson.resolutions || {};

  if (Object.keys(resolutions).length > 0) {
    console.log(`${colors.blue}Found the following resolutions in package.json:${colors.reset}`);
    for (const [pkg, version] of Object.entries(resolutions)) {
      console.log(`  - ${pkg}: ${version}`);
    }
    console.log('');
  } else {
    console.log(`${colors.blue}No resolutions found in package.json${colors.reset}\n`);
  }

  // Install dependencies with legacy-peer-deps
  if (!runCommand('npm install --legacy-peer-deps', 'Installing dependencies with --legacy-peer-deps')) {
    console.log(`${colors.yellow}Installation failed. Trying again with network timeout increase...${colors.reset}`);
    if (!runCommand('npm install --legacy-peer-deps --network-timeout 100000', 'Retrying installation with increased network timeout')) {
      console.log(`${colors.yellow}Installation still failed. Trying clean reinstall...${colors.reset}`);
      runCommand('node scripts/clean-reinstall.js', 'Running clean reinstall script');
      return;
    }
  }

  // Manually enforce resolutions if needed
  if (Object.keys(resolutions).length > 0) {
    console.log(`${colors.yellow}➤ Enforcing package resolutions...${colors.reset}`);
    for (const [pkg, version] of Object.entries(resolutions)) {
      console.log(`  - Enforcing ${pkg}@${version}`);
      runCommand(`npm install ${pkg}@${version} --legacy-peer-deps --no-save`, `Installing ${pkg}@${version}`);
    }
  }

  console.log(`\n${colors.green}=====================================${colors.reset}`);
  console.log(`${colors.green}   SETUP PROCESS COMPLETED   ${colors.reset}`);
  console.log(`${colors.green}=====================================${colors.reset}`);
  console.log(`\n${colors.blue}Next steps:${colors.reset}`);
  console.log(`${colors.blue}1. Run 'npm start' to start the development server${colors.reset}`);
  console.log(`${colors.blue}2. Run 'npm test' to run tests${colors.reset}`);
}

// Run the main function
setup().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});