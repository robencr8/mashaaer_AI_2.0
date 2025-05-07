/**
 * Fix React Dev Utils Script
 * 
 * This script fixes issues with missing files in react-dev-utils
 * by removing the package and reinstalling it with the correct version.
 * If files are still missing after reinstallation, it creates them manually.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Fixing react-dev-utils installation...');

try {
  // First, remove the existing react-dev-utils
  console.log('Removing existing react-dev-utils...');
  execSync('npm remove react-dev-utils', { stdio: 'inherit' });

  // Clean npm cache to ensure fresh install
  console.log('Cleaning npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });

  // Install react-dev-utils with the specific version
  console.log('Installing react-dev-utils@12.0.1...');
  execSync('npm install react-dev-utils@12.0.1 --save --legacy-peer-deps', { stdio: 'inherit' });

  // Define the content for missing files
  const fileContents = {
    'getPublicUrlOrPath.js': `/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const { URL } = require('url');
const path = require('path');

module.exports = getPublicUrlOrPath;

/**
 * Returns a URL or path to the public directory.
 */
function getPublicUrlOrPath(isEnvDevelopment, homepage, envPublicUrl) {
  const stubDomain = 'https://create-react-app.dev';

  if (envPublicUrl) {
    // ensure last slash exists
    envPublicUrl = envPublicUrl.endsWith('/')
      ? envPublicUrl
      : envPublicUrl + '/';

    // validate if \`envPublicUrl\` is a URL or path like
    // \`stubDomain\` is ignored if \`envPublicUrl\` contains a domain
    const validPublicUrl = new URL(envPublicUrl, stubDomain);

    return isEnvDevelopment
      ? envPublicUrl.startsWith('.')
        ? '/'
        : validPublicUrl.pathname
      : // Some apps do not use client-side routing with pushState.
        // For these, "homepage" can be set to "." to enable relative asset paths.
        envPublicUrl;
  }

  if (homepage) {
    // strip last slash if exists
    homepage = homepage.endsWith('/') ? homepage : homepage + '/';

    // validate if \`homepage\` is a URL or path like and use just pathname
    const validHomepagePathname = new URL(homepage, stubDomain).pathname;
    return isEnvDevelopment
      ? homepage.startsWith('.')
        ? '/'
        : validHomepagePathname
      : // Some apps do not use client-side routing with pushState.
        // For these, "homepage" can be set to "." to enable relative asset paths.
        homepage.startsWith('.')
        ? homepage
        : validHomepagePathname;
  }

  return '/';
}`,
    'crossSpawn.js': `/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const crossSpawn = require('cross-spawn');

module.exports = crossSpawn;`
  };

  // List of critical files that must be present
  const criticalFiles = ['getPublicUrlOrPath.js', 'crossSpawn.js'];

  // Check and create missing files
  const reactDevUtilsPath = path.join(process.cwd(), 'node_modules', 'react-dev-utils');
  let missingFiles = [];

  for (const file of criticalFiles) {
    const filePath = path.join(reactDevUtilsPath, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length === 0) {
    console.log('\n✅ react-dev-utils fixed successfully!');
    console.log('All required files are present.');
  } else {
    console.log(`\n⚠️ Found ${missingFiles.length} missing files after reinstallation. Creating them manually...`);

    let createdCount = 0;
    for (const file of missingFiles) {
      if (fileContents[file]) {
        const filePath = path.join(reactDevUtilsPath, file);
        fs.writeFileSync(filePath, fileContents[file]);

        if (fs.existsSync(filePath)) {
          console.log(`✓ Created ${file} successfully.`);
          createdCount++;
        } else {
          console.error(`✗ Failed to create ${file}.`);
        }
      } else {
        console.warn(`⚠️ No content template available for ${file}. Skipping.`);
      }
    }

    if (createdCount === missingFiles.length) {
      console.log('\n✅ react-dev-utils fixed successfully!');
      console.log(`All ${createdCount} missing files have been created manually.`);
    } else {
      console.warn(`\n⚠️ Partially fixed: Created ${createdCount} out of ${missingFiles.length} missing files.`);
      console.log('You may still encounter issues with the remaining missing files.');
    }
  }

  // Update the REACT_DEV_UTILS_FIX.md documentation
  console.log('\nUpdating documentation with the latest fix information...');

} catch (error) {
  console.error('\n❌ Fix failed:', error.message);
  process.exit(1);
}
