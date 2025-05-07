# Run script for Python 3.13+ compatibility
# This script activates the virtual environment and runs the Flask application

Write-Host "Running Mashaaer Enhanced with Python 3.13+..." -ForegroundColor Green

# Check if virtual environment exists
if (-not (Test-Path ".\venv")) {
    Write-Host "Virtual environment not found. Please run setup-python313.ps1 first." -ForegroundColor Red
    exit 1
}

# Activate the virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
if (-not $?) {
    Write-Host "Failed to activate virtual environment." -ForegroundColor Red
    exit 1
}

# Set environment variables
$env:FLASK_APP = "backend\app.py"
$env:FLASK_ENV = "development"
$env:DEBUG = "true"

# Run the Flask application
Write-Host "Starting Flask application..." -ForegroundColor Yellow
Write-Host "Note: Some advanced features requiring transformers/tokenizers will be disabled." -ForegroundColor Yellow
Write-Host "To use all features, please install Python 3.10 and run the original setup script." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the application." -ForegroundColor Cyan
Write-Host ""

try {
    python backend\app.py
}
catch {
    Write-Host "An error occurred while running the application:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
finally {
    # Deactivate the virtual environment
    deactivate
}