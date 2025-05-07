# Setup script for Python 3.13+ compatibility
# This script sets up a virtual environment with Python 3.13+ and installs compatible dependencies

Write-Host "Setting up Python 3.13+ compatibility for Mashaaer Enhanced..." -ForegroundColor Green

# Check Python version
$pythonVersion = python --version
Write-Host "Detected Python version: $pythonVersion" -ForegroundColor Cyan

# Create a virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv
if (-not $?) {
    Write-Host "Failed to create virtual environment. Please make sure Python is installed correctly." -ForegroundColor Red
    exit 1
}

# Activate the virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
if (-not $?) {
    Write-Host "Failed to activate virtual environment." -ForegroundColor Red
    exit 1
}

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip
if (-not $?) {
    Write-Host "Failed to upgrade pip." -ForegroundColor Red
    exit 1
}

# Install feedparser specifically
Write-Host "Installing feedparser specifically..." -ForegroundColor Yellow
python -m pip install feedparser==6.0.10
if (-not $?) {
    Write-Host "Warning: Failed to install feedparser. AI news functionality will be disabled." -ForegroundColor Yellow
}

# Install compatible dependencies
Write-Host "Installing other compatible dependencies..." -ForegroundColor Yellow
$backendDir = Join-Path $PSScriptRoot "backend"
$requirementsFile = Join-Path $backendDir "requirements.txt"

if (Test-Path $requirementsFile) {
    python -m pip install -r $requirementsFile
    if (-not $?) {
        Write-Host "Warning: Some dependencies may have failed to install." -ForegroundColor Yellow
        Write-Host "This is expected for packages not compatible with Python 3.13+." -ForegroundColor Yellow
        Write-Host "Basic functionality should still work." -ForegroundColor Yellow
    }
} else {
    Write-Host "Requirements file not found at: $requirementsFile" -ForegroundColor Red
    exit 1
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Note: Some advanced features requiring transformers/tokenizers will be disabled." -ForegroundColor Yellow
Write-Host "To use all features, please install Python 3.10 and run the original setup script." -ForegroundColor Yellow
Write-Host ""
Write-Host "To activate the virtual environment, run:" -ForegroundColor Cyan
Write-Host ".\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run the application, run:" -ForegroundColor Cyan
Write-Host "python backend\app.py" -ForegroundColor Cyan
