# Script to fix npm installation issues for Mashaaer Enhanced Project
# This script addresses common issues with npm dependencies and webpack configuration

Write-Host "Starting fix for npm installation issues..." -ForegroundColor Green

# Step 1: Remove node_modules and package-lock.json
Write-Host "Removing node_modules and package-lock.json..." -ForegroundColor Yellow
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# Step 2: Enable the preinstall script to handle resolutions
Write-Host "Enabling preinstall script for resolutions..." -ForegroundColor Yellow
(Get-Content -Path "package.json") -replace '"preinstall-disabled": "echo skipping resolutions"', '"preinstall": "npx npm-force-resolutions"' | Set-Content -Path "package.json"

# Step 3: Install react-scripts explicitly
Write-Host "Installing react-scripts v4.0.3 explicitly..." -ForegroundColor Yellow
npm install --save react-scripts@4.0.3

# Step 4: Install key dependencies explicitly with compatible versions
Write-Host "Installing key dependencies with compatible versions..." -ForegroundColor Yellow
npm install --save-exact postcss@8.4.31
npm install --save-exact nth-check@2.1.1

# Step 5: Install webpack polyfill dependencies
Write-Host "Installing webpack polyfill dependencies..." -ForegroundColor Yellow
npm install --save buffer process stream-browserify path-browserify os-browserify browserify-fs assert events browserify-zlib

# Step 6: Reinstall all dependencies with legacy OpenSSL provider
Write-Host "Reinstalling all dependencies with legacy OpenSSL provider..." -ForegroundColor Yellow
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm install

# Step 7: Verify the installation
Write-Host "Verifying the installation..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules directory exists" -ForegroundColor Green
    
    # Check for critical dependencies
    $criticalDeps = @("react", "react-dom", "react-scripts", "axios", "webpack")
    $missingDeps = @()
    
    foreach ($dep in $criticalDeps) {
        if (-not (Test-Path "node_modules/$dep")) {
            $missingDeps += $dep
        }
    }
    
    if ($missingDeps.Count -eq 0) {
        Write-Host "✅ All critical dependencies are installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing dependencies: $($missingDeps -join ', ')" -ForegroundColor Red
    }
} else {
    Write-Host "❌ node_modules directory does not exist" -ForegroundColor Red
}

Write-Host "Fix process completed!" -ForegroundColor Green
Write-Host "To start the application, run: .\start-mashaaer.ps1" -ForegroundColor Cyan