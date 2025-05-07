/**
 * Simple Install Script
 * 
 * A lightweight alternative to clean-reinstall.js
 * This script installs dependencies with --legacy-peer-deps flag
 */

const { execSync } = require('child_process');

console.log('Installing dependencies with --legacy-peer-deps...');

try {
  // Run npm install with legacy-peer-deps flag
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('\n✅ Installation completed successfully!');
} catch (error) {
  console.error('\n❌ Installation failed:', error.message);
  console.log('\nTrying alternative installation with increased timeout...');
  
  try {
    execSync('npm install --legacy-peer-deps --network-timeout 100000', { stdio: 'inherit' });
    console.log('\n✅ Installation completed successfully with extended timeout!');
  } catch (secondError) {
    console.error('\n❌ Installation failed again:', secondError.message);
    console.log('\nPlease try running the clean-reinstall.js script instead:');
    console.log('node scripts/clean-reinstall.js');
    process.exit(1);
  }
}
