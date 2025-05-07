# Test script for Webpack configuration fix
# This script sets the NODE_OPTIONS environment variable and runs npm start

Write-Host "Testing Webpack configuration fix..." -ForegroundColor Green
Write-Host "Setting NODE_OPTIONS=--openssl-legacy-provider" -ForegroundColor Yellow

# Set the environment variable
$env:NODE_OPTIONS="--openssl-legacy-provider"

# Run npm start
Write-Host "Running npm start..." -ForegroundColor Cyan
npm start

# Note: This script will continue running until the application is stopped with Ctrl+C