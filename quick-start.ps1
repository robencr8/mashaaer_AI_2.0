# Quick Start Script for Mashaaer Enhanced Project
# This script implements the steps from the issue description

Write-Host "Starting Mashaaer Enhanced Project Quick Start..." -ForegroundColor Green

# Step 1: Install cross-env if not already installed
Write-Host "Step 1: Checking if cross-env is installed..." -ForegroundColor Cyan
$packageJson = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
$hasCrossEnv = $false

foreach ($dep in $packageJson.devDependencies.PSObject.Properties) {
    if ($dep.Name -eq "cross-env") {
        $hasCrossEnv = $true
        break
    }
}

if (-not $hasCrossEnv) {
    Write-Host "Installing cross-env..." -ForegroundColor Yellow
    npm install --save-dev cross-env
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install cross-env" -ForegroundColor Red
        exit 1
    }
    Write-Host "cross-env installed successfully" -ForegroundColor Green
} else {
    Write-Host "cross-env is already installed" -ForegroundColor Green
}

# Step 2: Set the NODE_OPTIONS environment variable
Write-Host "Step 2: Setting NODE_OPTIONS environment variable..." -ForegroundColor Cyan
$env:NODE_OPTIONS = "--openssl-legacy-provider"
Write-Host "NODE_OPTIONS set to: $env:NODE_OPTIONS" -ForegroundColor Green

# Step 3: Start the Flask backend in a new window
Write-Host "Step 3: Starting Flask backend..." -ForegroundColor Cyan

# Create a backend startup command
$backendCommand = @"
cd '$PWD'
Write-Host 'Starting Flask backend server...' -ForegroundColor Cyan

# Activate virtual environment
if (Test-Path '.\venv\Scripts\Activate.ps1') {
    try {
        . .\venv\Scripts\Activate.ps1
        Write-Host 'Virtual environment activated successfully' -ForegroundColor Green
    } catch {
        Write-Host 'Error activating virtual environment: ' + `$_ -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host 'Virtual environment not found. Creating one...' -ForegroundColor Yellow
    python -m venv venv
    if (`$LASTEXITCODE -ne 0) {
        Write-Host 'Failed to create virtual environment' -ForegroundColor Red
        exit 1
    }
    . .\venv\Scripts\Activate.ps1
}

# Start Flask app
Write-Host 'Starting Flask application...' -ForegroundColor Cyan
python backend/app.py
"@

try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand -WindowStyle Normal
    Write-Host "Backend server started in a new window" -ForegroundColor Green
} catch {
    Write-Host "Failed to start backend server: $_" -ForegroundColor Red
    exit 1
}

# Wait for the backend to start
Write-Host "Waiting for backend server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Step 4: Start the frontend
Write-Host "Step 4: Starting frontend..." -ForegroundColor Cyan
npm start
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start frontend" -ForegroundColor Red
    exit 1
}

# Note: The script will continue running until the frontend server is stopped with Ctrl+C
