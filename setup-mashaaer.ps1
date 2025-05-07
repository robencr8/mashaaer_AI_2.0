# Setup script for Mashaaer Enhanced Project
# This script will perform the steps mentioned in the issue description

Write-Host "Starting setup for Mashaaer Enhanced Project..." -ForegroundColor Green

# Step 1: Clean Installation
Write-Host "Step 1: Performing clean installation..." -ForegroundColor Cyan
Write-Host "Removing node_modules and package-lock.json..." -ForegroundColor Yellow
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 2: Fix security issues
Write-Host "`nStep 2: Fixing security issues..." -ForegroundColor Cyan
Write-Host "Running npm audit fix..." -ForegroundColor Yellow
npm audit fix

Write-Host "Running npm audit fix --force (this may change some versions)..." -ForegroundColor Yellow
Write-Host "If you encounter conflicts, you can press Ctrl+C to stop this step." -ForegroundColor Red
npm audit fix --force

# Step 3: Verify react-scripts version
Write-Host "`nStep 3: Verifying react-scripts version..." -ForegroundColor Cyan
$packageJson = Get-Content -Path "package.json" -Raw | ConvertFrom-Json
$reactScriptsVersion = $packageJson.dependencies."react-scripts"
Write-Host "Current react-scripts version: $reactScriptsVersion" -ForegroundColor Yellow

if ($reactScriptsVersion -ne "^5.0.1") {
    Write-Host "Installing react-scripts@5.0.1..." -ForegroundColor Yellow
    npm install react-scripts@5.0.1 --save
} else {
    Write-Host "react-scripts is already at version 5.0.1" -ForegroundColor Green
}

# Step 4: Start the project
Write-Host "`nSetup completed successfully!" -ForegroundColor Green
Write-Host "You can now start the project by running: npm start" -ForegroundColor Cyan
Write-Host "If you encounter any issues, please refer to the issue description for additional steps." -ForegroundColor Yellow