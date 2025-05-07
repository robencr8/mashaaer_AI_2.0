# Mashaaer Enhanced Project Startup Script
# This PowerShell script handles the startup process for the Mashaaer Enhanced project.

Write-Host "✨ Starting Mashaaer Enhanced Project ✨" -ForegroundColor Cyan

# Check if node_modules exists
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "⚠️ node_modules not found! Running clean installation..." -ForegroundColor Yellow
    
    # Check if rimraf is installed globally
    $rimrafExists = $null -ne (Get-Command npx -ErrorAction SilentlyContinue)
    
    if ($rimrafExists) {
        Write-Host "Removing package-lock.json (if exists)..." -ForegroundColor Blue
        if (Test-Path -Path "package-lock.json") {
            Remove-Item -Path "package-lock.json" -Force
        }
        
        Write-Host "Cleaning npm cache..." -ForegroundColor Blue
        npm cache clean --force
        
        Write-Host "Installing dependencies with legacy-peer-deps..." -ForegroundColor Blue
        npm install --legacy-peer-deps
    } else {
        Write-Host "Running npm install..." -ForegroundColor Blue
        npm install --legacy-peer-deps
    }
}

# Start the development server
Write-Host "🚀 Launching development server..." -ForegroundColor Green
npm start
