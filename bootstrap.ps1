# Mashaaer Enhanced Project - Full System Bootstrapping Script
# This script initializes both frontend and backend components of the Mashaaer Enhanced Project

# Set error action preference to stop on error
$ErrorActionPreference = "Stop"

Write-Host "Starting Mashaaer Enhanced Project Full System Bootstrap..." -ForegroundColor Green

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    return $exists
}

# Function to check prerequisites
function Check-Prerequisites {
    Write-Host "Checking prerequisites..." -ForegroundColor Cyan

    # Check for Node.js
    if (-not (Test-CommandExists "node")) {
        Write-Host "Node.js is not installed. Please install Node.js and try again." -ForegroundColor Red
        exit 1
    }
    $nodeVersion = (node -v)
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Yellow

    # Check for npm
    if (-not (Test-CommandExists "npm")) {
        Write-Host "npm is not installed. Please install npm and try again." -ForegroundColor Red
        exit 1
    }
    $npmVersion = (npm -v)
    Write-Host "npm version: $npmVersion" -ForegroundColor Yellow

    # Check for Python
    if (-not (Test-CommandExists "python")) {
        Write-Host "Python is not installed. Please install Python and try again." -ForegroundColor Red
        exit 1
    }
    $pythonVersion = (python --version)
    Write-Host "Python version: $pythonVersion" -ForegroundColor Yellow

    # Check for pip
    if (-not (Test-CommandExists "pip")) {
        Write-Host "pip is not installed. Please install pip and try again." -ForegroundColor Red
        exit 1
    }
    $pipVersion = (pip --version)
    Write-Host "pip version: $pipVersion" -ForegroundColor Yellow

    Write-Host "All prerequisites are installed." -ForegroundColor Green
}

# Function to install dependencies
function Install-Dependencies {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan

    # Install frontend dependencies
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install

    # Install backend dependencies using the tokenizers fix script
    Write-Host "Installing backend dependencies with tokenizers fix..." -ForegroundColor Yellow
    if (Test-Path "fix-tokenizers-install.ps1") {
        & .\fix-tokenizers-install.ps1
    } else {
        Write-Host "Warning: fix-tokenizers-install.ps1 not found, falling back to direct installation" -ForegroundColor Yellow
        pip install -r backend/requirements.txt
    }

    Write-Host "All dependencies installed." -ForegroundColor Green
}

# Function to initialize backend
function Initialize-Backend {
    Write-Host "Initializing backend components..." -ForegroundColor Cyan

    # Create a virtual environment if it doesn't exist
    if (-not (Test-Path "backend/venv")) {
        Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
        python -m venv backend/venv
    }

    # Activate the virtual environment
    Write-Host "Activating Python virtual environment..." -ForegroundColor Yellow
    & backend/venv/Scripts/Activate.ps1

    # Install backend dependencies in the virtual environment using the tokenizers fix script
    Write-Host "Installing backend dependencies in virtual environment with tokenizers fix..." -ForegroundColor Yellow
    if (Test-Path "fix-tokenizers-install.ps1") {
        & .\fix-tokenizers-install.ps1
    } else {
        Write-Host "Warning: fix-tokenizers-install.ps1 not found, falling back to direct installation" -ForegroundColor Yellow
        pip install -r backend/requirements.txt
    }

    # Start the Flask backend server in a new PowerShell window
    Write-Host "Starting Flask backend server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; & backend/venv/Scripts/Activate.ps1; python backend/app.py"

    # Wait for the backend to start
    Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5

    Write-Host "Backend initialized and running." -ForegroundColor Green
}

# Function to initialize frontend
function Initialize-Frontend {
    Write-Host "Initializing frontend components..." -ForegroundColor Cyan

    # Start the React frontend in a new PowerShell window
    Write-Host "Starting React frontend..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; $env:HOST='0.0.0.0'; $env:DANGEROUSLY_DISABLE_HOST_CHECK='true'; npm start"

    # Wait for the frontend to start
    Write-Host "Waiting for frontend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10

    Write-Host "Frontend initialized and running." -ForegroundColor Green
}

# Function to monitor system health
function Monitor-SystemHealth {
    Write-Host "Setting up system health monitoring..." -ForegroundColor Cyan

    # Open system metrics in a browser
    Write-Host "Opening system metrics dashboard..." -ForegroundColor Yellow
    Start-Process "http://localhost:5000/api/metrics"

    Write-Host "System health monitoring initialized." -ForegroundColor Green
}

# Main execution flow
try {
    # Step 1: Check prerequisites
    Check-Prerequisites

    # Step 2: Install dependencies
    Install-Dependencies

    # Step 3: Initialize backend
    Initialize-Backend

    # Step 4: Initialize frontend
    Initialize-Frontend

    # Step 5: Monitor system health
    Monitor-SystemHealth

    Write-Host "Mashaaer Enhanced Project has been successfully bootstrapped!" -ForegroundColor Green
    Write-Host "Frontend is running at: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Backend is running at: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "System metrics are available at: http://localhost:5000/api/metrics" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C in the respective terminal windows to stop the servers." -ForegroundColor Yellow
} catch {
    Write-Host "An error occurred during bootstrapping: $_" -ForegroundColor Red
    exit 1
}
