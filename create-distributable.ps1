# Create Distributable Script for Mashaaer Enhanced Project
# This script creates a zipped distributable version of the Mashaaer Enhanced application

# Configuration
$appName = "MashaaerEnhanced"
$appVersion = "1.0.0"
$outputDir = "dist"
$zipFileName = "$appName-$appVersion-full.zip"

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  Mashaaer Enhanced Project - Create Distributable" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create output directory
Write-Host "Step 1: Creating output directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

# Step 2: Build the React application
Write-Host "Step 2: Building React application..." -ForegroundColor Cyan
try {
    Write-Host "Running: npm run build" -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to build React application. Error code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ React application built successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Error building React application: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Package the Electron application
Write-Host ""
Write-Host "Step 3: Packaging Electron application..." -ForegroundColor Cyan
try {
    # Navigate to the Electron directory
    Set-Location packaging\electron
    
    # Run the packaging script
    Write-Host "Running: .\package-electron.ps1" -ForegroundColor Cyan
    .\package-electron.ps1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to package Electron application. Error code: $LASTEXITCODE" -ForegroundColor Red
        Set-Location ..\..
        exit 1
    }
    
    # Navigate back to the root directory
    Set-Location ..\..
    
    Write-Host "✅ Electron application packaged successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Error packaging Electron application: $_" -ForegroundColor Red
    # Make sure we're back in the root directory
    if ((Get-Location).Path -like "*packaging\electron*") {
        Set-Location ..\..
    }
    exit 1
}

# Step 4: Copy the unified launcher files
Write-Host ""
Write-Host "Step 4: Copying unified launcher files..." -ForegroundColor Cyan
try {
    # Create a directory for the launcher files
    $launcherDir = "$outputDir\$appName-$appVersion-launcher"
    New-Item -ItemType Directory -Force -Path $launcherDir | Out-Null
    
    # Copy the launcher files
    Copy-Item -Path "start-electron.bat" -Destination "$launcherDir\" -Force
    Copy-Item -Path "scripts\start-electron-app.js" -Destination "$launcherDir\" -Force
    
    # Create a package.json file for the launcher
    $launcherPackageJson = @"
{
  "name": "mashaaer-launcher",
  "version": "$appVersion",
  "description": "Launcher for Mashaaer Enhanced Application",
  "main": "start-electron-app.js",
  "scripts": {
    "start": "node start-electron-app.js"
  },
  "dependencies": {}
}
"@
    Set-Content -Path "$launcherDir\package.json" -Value $launcherPackageJson
    
    # Create a README.md file for the launcher
    $launcherReadme = @"
# Mashaaer Enhanced Launcher

This launcher allows you to start the Mashaaer Enhanced application with a single click.

## Usage

1. Double-click the `start-electron.bat` file to start the application
2. The launcher will start both the Flask backend server and the Electron frontend

## Requirements

- Node.js
- Python
- The Mashaaer Enhanced application installed

## Troubleshooting

If you encounter any issues, please check the `electron-app-launcher.log` file for error messages.
"@
    Set-Content -Path "$launcherDir\README.md" -Value $launcherReadme
    
    Write-Host "✅ Launcher files copied successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Error copying launcher files: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Create a zip file of the distributable app
Write-Host ""
Write-Host "Step 5: Creating zip file of the distributable app..." -ForegroundColor Cyan
try {
    # Create a zip file of the Electron app
    $electronDistDir = "packaging\electron\dist"
    $electronAppDir = "$electronDistDir\win-unpacked"
    $electronInstallerPath = Get-ChildItem -Path $electronDistDir -Filter "*.exe" | Where-Object { $_.Name -like "*Setup*.exe" } | Select-Object -First 1 -ExpandProperty FullName
    
    if (-not (Test-Path $electronAppDir)) {
        Write-Host "❌ Electron app directory not found at $electronAppDir" -ForegroundColor Red
        exit 1
    }
    
    # Create a directory for the full distributable
    $distDir = "$outputDir\$appName-$appVersion-full"
    New-Item -ItemType Directory -Force -Path $distDir | Out-Null
    
    # Copy the Electron app to the distributable directory
    Copy-Item -Path "$electronAppDir\*" -Destination $distDir -Recurse -Force
    
    # Copy the installer to the output directory
    if (Test-Path $electronInstallerPath) {
        Copy-Item -Path $electronInstallerPath -Destination $outputDir -Force
        Write-Host "✅ Installer copied to $outputDir" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Installer not found" -ForegroundColor Yellow
    }
    
    # Copy the launcher files to the distributable directory
    Copy-Item -Path "$launcherDir\*" -Destination $distDir -Recurse -Force
    
    # Create a README.md file for the distributable
    $distReadme = @"
# Mashaaer Enhanced v$appVersion

## Installation

### Option 1: Use the Installer

1. Run the installer (`MashaaerEnhanced-Setup-$appVersion.exe`)
2. Follow the installation instructions
3. Launch the application from the desktop shortcut or start menu

### Option 2: Use the Portable Version

1. Extract the zip file to a directory of your choice
2. Double-click the `start-electron.bat` file to start the application

## Features

- Arabic AI Assistant with Emotion Detection
- Text-to-Speech functionality
- Integrated Flask backend
- Desktop application with Electron
- Unified launcher for easy startup

## Detailed Documentation

For detailed instructions, see the documentation files in the `docs` directory.

## Troubleshooting

If you encounter any issues:
1. Make sure no other application is using port 5000
2. Check that all files are present in the application folder
3. Check the `electron-app-launcher.log` file for error messages
4. Try running the application as administrator
"@
    Set-Content -Path "$distDir\README.md" -Value $distReadme
    
    # Create the zip file
    Compress-Archive -Path $distDir -DestinationPath "$outputDir\$zipFileName" -Force
    
    Write-Host "✅ Zip file created successfully at $outputDir\$zipFileName" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creating zip file: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  Distributable Creation Complete!" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "The following files have been created:" -ForegroundColor Cyan
Write-Host "1. Installer: $outputDir\$(Split-Path $electronInstallerPath -Leaf)" -ForegroundColor Cyan
Write-Host "2. Zip file: $outputDir\$zipFileName" -ForegroundColor Cyan
Write-Host "3. Launcher: $launcherDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can distribute either the installer or the zip file." -ForegroundColor Cyan
Write-Host "The launcher can be used to start the application with a single click." -ForegroundColor Cyan
Write-Host ""