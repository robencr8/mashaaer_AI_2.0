# Start script for Mashaaer Enhanced Project with legacy OpenSSL provider
# This script sets the NODE_OPTIONS environment variable and starts the application

Write-Host "Starting Mashaaer Enhanced Project with legacy OpenSSL provider..." -ForegroundColor Green
Write-Host "Setting NODE_OPTIONS=--openssl-legacy-provider" -ForegroundColor Yellow

# Set the environment variable
$env:NODE_OPTIONS="--openssl-legacy-provider"

# Start the application
Write-Host "Starting the application..." -ForegroundColor Cyan
npm start

# Note: The script will continue running until the application is stopped with Ctrl+C