# Mashaaer Enhanced Project - E2E Production Deployment Script
# This script handles the end-to-end deployment process for both frontend and backend components

# Stop on errors
$ErrorActionPreference = "Stop"

Write-Host "Starting Mashaaer Enhanced Project deployment..." -ForegroundColor Green

# Configuration
$FRONTEND_DIR = "."
$BACKEND_DIR = ".\backend"
$BUILD_DIR = ".\build"
$ENV_FILE = ".env"
$PROD_ENV_FILE = ".env.production"

# Check if production environment file exists, otherwise use default
if (Test-Path $PROD_ENV_FILE) {
    Write-Host "Using production environment configuration..." -ForegroundColor Green
    Copy-Item -Path $PROD_ENV_FILE -Destination $ENV_FILE -Force
} else {
    Write-Host "Warning: Production environment file not found. Using existing .env file." -ForegroundColor Yellow
    Write-Host "Consider creating a .env.production file for production deployments." -ForegroundColor Yellow
}

# Function to check if a command exists
function Test-CommandExists {
    param (
        [string]$Command
    )

    $exists = $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
    return $exists
}

# Check required tools
Write-Host "Checking required tools..." -ForegroundColor Green

if (-not (Test-CommandExists "node")) {
    Write-Host "Error: Node.js is not installed. Please install Node.js before deploying." -ForegroundColor Red
    exit 1
}

if (-not (Test-CommandExists "npm")) {
    Write-Host "Error: npm is not installed. Please install npm before deploying." -ForegroundColor Red
    exit 1
}

if (-not (Test-CommandExists "python")) {
    Write-Host "Error: Python is not installed. Please install Python before deploying." -ForegroundColor Red
    exit 1
}

if (-not (Test-CommandExists "pip")) {
    Write-Host "Error: pip is not installed. Please install pip before deploying." -ForegroundColor Red
    exit 1
}

# Deploy Frontend
function Deploy-Frontend {
    Write-Host "Deploying frontend..." -ForegroundColor Green

    # Store original location
    $originalLocation = Get-Location

    # Change to frontend directory
    Set-Location $FRONTEND_DIR

    Write-Host "Installing frontend dependencies..." -ForegroundColor Green
    npm install --production

    Write-Host "Running frontend tests..." -ForegroundColor Green
    npm test -- --watchAll=false

    Write-Host "Building frontend for production..." -ForegroundColor Green
    npm run build

    Write-Host "Frontend build completed successfully." -ForegroundColor Green

    # Deploy to Netlify
    if (Test-CommandExists "netlify") {
        Write-Host "Deploying frontend to Netlify..." -ForegroundColor Green
        netlify deploy --dir=$BUILD_DIR --prod
    } else {
        Write-Host "Warning: Netlify CLI not found. Installing Netlify CLI..." -ForegroundColor Yellow
        npm install netlify-cli -g
        Write-Host "Deploying frontend to Netlify..." -ForegroundColor Green
        netlify deploy --dir=$BUILD_DIR --prod
    }

    Write-Host "Frontend deployment completed." -ForegroundColor Green

    # Return to original location
    Set-Location $originalLocation
}

# Deploy Backend
function Deploy-Backend {
    Write-Host "Deploying backend..." -ForegroundColor Green

    # Store original location
    $originalLocation = Get-Location

    # Change to backend directory
    Set-Location $BACKEND_DIR

    Write-Host "Setting up Python virtual environment..." -ForegroundColor Green
    python -m venv venv

    # Activate virtual environment (Windows)
    Write-Host "Activating virtual environment..." -ForegroundColor Green
    .\venv\Scripts\Activate.ps1

    Write-Host "Installing backend dependencies with tokenizers fix..." -ForegroundColor Green
    # Copy the fix script to the backend directory if it exists
    if (Test-Path "..\fix-tokenizers-install.ps1") {
        Copy-Item -Path "..\fix-tokenizers-install.ps1" -Destination "fix-tokenizers-install.ps1" -Force
        Write-Host "Using tokenizers fix script to install dependencies..." -ForegroundColor Green
        .\fix-tokenizers-install.ps1
    } else {
        Write-Host "Warning: fix-tokenizers-install.ps1 not found, falling back to direct installation" -ForegroundColor Yellow
        pip install -r requirements.txt
    }

    Write-Host "Running backend tests..." -ForegroundColor Green
    python test_memory_store.py

    # Deploy to Render
    Write-Host "Preparing for Render deployment..." -ForegroundColor Green

    # Create render.yaml if it doesn't exist
    $renderYamlPath = Join-Path $BACKEND_DIR "render.yaml"
    if (-not (Test-Path $renderYamlPath)) {
        Write-Host "Creating render.yaml configuration file..." -ForegroundColor Green
        @"
    services:
      - type: web
        name: mashaaer-backend
        env: python
        buildCommand: >
          pip install tokenizers==0.13.3 --only-binary=:all: --no-cache-dir || 
          pip install transformers==4.30.2 --no-deps && 
          pip install -r requirements.txt
        startCommand: python app.py
        envVars:
          - key: PYTHON_VERSION
            value: 3.9.0
          - key: ALPHA_MODE
            value: true
    "@ | Out-File -FilePath $renderYamlPath -Encoding utf8
    }

    Write-Host "Backend prepared for Render deployment." -ForegroundColor Green
    Write-Host "To complete deployment, push this repository to GitHub and connect it to Render." -ForegroundColor Yellow
    Write-Host "Visit https://dashboard.render.com to set up your Render service." -ForegroundColor Yellow

    Write-Host "Backend deployment completed." -ForegroundColor Green

    # Deactivate virtual environment
    deactivate

    # Return to original location
    Set-Location $originalLocation
}

# Main deployment process
Write-Host "Starting deployment process..." -ForegroundColor Green

# Deploy frontend
Deploy-Frontend

# Deploy backend
Deploy-Backend

Write-Host "Deployment preparation completed successfully!" -ForegroundColor Green
Write-Host "===================== DEPLOYMENT SUMMARY =====================" -ForegroundColor Cyan
Write-Host "Frontend: Deployed to Netlify (or prepared for deployment)" -ForegroundColor Cyan
Write-Host "Backend: Prepared for deployment to Render" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. For Netlify: If prompted, authenticate with your Netlify account" -ForegroundColor Yellow
Write-Host "2. For Render: Push this repository to GitHub and connect it to Render" -ForegroundColor Yellow
Write-Host "3. Visit https://dashboard.render.com to complete the backend setup" -ForegroundColor Yellow
Write-Host "4. Share the deployed URLs with 3-5 internal users for testing" -ForegroundColor Yellow
Write-Host "5. Collect feedback in the FEEDBACK.md file" -ForegroundColor Yellow
Write-Host "=============================================================" -ForegroundColor Cyan
