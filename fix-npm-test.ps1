# Script to fix npm test issues by reinstalling dependencies with correct versions

Write-Host "Starting fix for npm test issues..." -ForegroundColor Green

# Step 1: Remove node_modules and package-lock.json
Write-Host "Removing node_modules and package-lock.json..." -ForegroundColor Yellow
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# Step 2: Install react-scripts explicitly
Write-Host "Installing react-scripts v4.0.3 explicitly..." -ForegroundColor Yellow
npm install --save react-scripts@4.0.3

# Step 3: Reinstall all dependencies
Write-Host "Reinstalling all dependencies..." -ForegroundColor Yellow
npm install

# Step 4: Run tests to verify the fix
Write-Host "Running tests to verify the fix..." -ForegroundColor Yellow
npm test

Write-Host "Fix process completed!" -ForegroundColor Green
Write-Host "If tests are still failing, please check the console output for errors." -ForegroundColor Yellow