# Packaging script for Mashaaer Enhanced Electron App
# This script packages the React frontend and Flask backend into an Electron desktop application

# Configuration
$appName = "MashaaerEnhanced"
$appVersion = "1.0.0"
$outputDir = "dist"

Write-Host "Starting Electron packaging process for $appName v$appVersion..." -ForegroundColor Green

# Step 1: Create output directory
Write-Host "Creating output directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

# Step 2: Build React frontend
Write-Host "Building React frontend..." -ForegroundColor Cyan
Set-Location ../..
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error building React frontend. Exiting." -ForegroundColor Red
    exit 1
}

# Step 3: Create a simple icon if it doesn't exist
Write-Host "Checking for icon file..." -ForegroundColor Cyan
Set-Location packaging/electron
if (-not (Test-Path "icon.ico")) {
    Write-Host "Icon file not found. Creating a simple icon..." -ForegroundColor Yellow
    
    # Try to copy an existing icon if available
    if (Test-Path "../../public/favicon.ico") {
        Copy-Item -Path "../../public/favicon.ico" -Destination "icon.ico" -Force
        Write-Host "Copied favicon.ico to icon.ico" -ForegroundColor Green
    } else {
        Write-Host "No favicon found. You'll need to provide an icon.ico file manually." -ForegroundColor Yellow
    }
}

# Step 4: Install Electron dependencies
Write-Host "Installing Electron dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing Electron dependencies. Exiting." -ForegroundColor Red
    exit 1
}

# Step 5: Build Electron app
Write-Host "Building Electron app..." -ForegroundColor Cyan
npm run build:win
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error building Electron app. Exiting." -ForegroundColor Red
    exit 1
}

# Step 6: Copy additional files to the output directory
Write-Host "Copying additional files to output directory..." -ForegroundColor Cyan
Copy-Item -Path "../../README.md" -Destination "$outputDir/README.md" -Force
Copy-Item -Path "../../docs/HOW_TO_TEST_FEATURES.en.md" -Destination "$outputDir/HOW_TO_TEST_FEATURES.en.md" -Force
Copy-Item -Path "../../docs/HOW_TO_TEST_FEATURES.md" -Destination "$outputDir/HOW_TO_TEST_FEATURES.md" -Force

# Step 7: Create a README.txt file
$readmeContent = @"
# $appName v$appVersion - Electron Edition

## Installation

1. Run the installer (MashaaerEnhanced-Setup-1.0.0.exe)
2. Follow the installation instructions
3. Launch the application from the desktop shortcut or start menu

## Features

- Arabic AI Assistant with Emotion Detection
- Text-to-Speech functionality
- Integrated Flask backend
- Desktop application with Electron

## Detailed Documentation

For detailed instructions:
- See HOW_TO_TEST_FEATURES.en.md for English instructions
- See HOW_TO_TEST_FEATURES.md for Arabic instructions

## Troubleshooting

If you encounter any issues:
1. Make sure no other application is using port 5000
2. Check that all files are present in the application folder
3. Try running the application as administrator
"@

Set-Content -Path "$outputDir/README.txt" -Value $readmeContent

Write-Host "Packaging complete!" -ForegroundColor Green
Write-Host "Output: $outputDir/win-unpacked (portable version)" -ForegroundColor Green
Write-Host "Output: $outputDir/MashaaerEnhanced-Setup-1.0.0.exe (installer)" -ForegroundColor Green
Write-Host "You can distribute the installer or the portable version." -ForegroundColor Yellow