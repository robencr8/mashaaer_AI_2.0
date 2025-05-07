# Packaging script for Mashaaer Enhanced Project
# This script packages the React frontend and Flask backend into a single executable

# Configuration
$appName = "MashaaerEnhanced"
$appVersion = "1.0.0"
$outputDir = "dist"
$reactBuildDir = "../build"
$flaskDir = "../flask-backend"
$pythonVirtualEnv = "venv"

Write-Host "Starting packaging process for $appName v$appVersion..." -ForegroundColor Green

# Step 1: Create output directory
Write-Host "Creating output directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

# Step 1.5: Run tests
Write-Host "Running tests..." -ForegroundColor Cyan
Set-Location ..
npm run test -- --watchAll=false
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed. Exiting." -ForegroundColor Red
    exit 1
}

# Step 2: Build React frontend
Write-Host "Building React frontend..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error building React frontend. Exiting." -ForegroundColor Red
    exit 1
}
Set-Location packaging

# Step 3: Install PyInstaller if not already installed
Write-Host "Setting up Python environment..." -ForegroundColor Cyan
if (-not (Test-Path "$flaskDir\$pythonVirtualEnv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv "$flaskDir\$pythonVirtualEnv"
}

Write-Host "Activating virtual environment and installing dependencies..." -ForegroundColor Yellow
& "$flaskDir\$pythonVirtualEnv\Scripts\Activate.ps1"

# Install dependencies using the tokenizers fix script if available
if (Test-Path "..\fix-tokenizers-install.ps1") {
    Write-Host "Using tokenizers fix script to install dependencies..." -ForegroundColor Yellow
    Copy-Item -Path "..\fix-tokenizers-install.ps1" -Destination "$flaskDir\fix-tokenizers-install.ps1" -Force
    Set-Location $flaskDir
    .\fix-tokenizers-install.ps1
    Set-Location ..\packaging
} else {
    Write-Host "Warning: fix-tokenizers-install.ps1 not found, falling back to direct installation" -ForegroundColor Yellow
    pip install -r "$flaskDir\requirements.txt"
}
pip install pyinstaller
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing Python dependencies. Exiting." -ForegroundColor Red
    exit 1
}

# Step 4: Create spec file for PyInstaller
$specContent = @"
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['$flaskDir/app.py'],
    pathex=['$flaskDir'],
    binaries=[],
    datas=[
        ('$reactBuildDir', 'build'),
        ('$flaskDir/models', 'models'),
        ('$flaskDir/templates', 'templates'),
        ('$flaskDir/static', 'static'),
        ('../README.ar.md', '.'),
        ('../README.en.md', '.'),
    ],
    hiddenimports=['engineio.async_drivers.threading'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='$appName',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='$appName',
)
"@

$specFile = "$flaskDir\$appName.spec"
Write-Host "Creating PyInstaller spec file..." -ForegroundColor Cyan
Set-Content -Path $specFile -Value $specContent

# Step 5: Run PyInstaller
Write-Host "Running PyInstaller to create executable..." -ForegroundColor Cyan
Set-Location $flaskDir
pyinstaller --clean "$appName.spec"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error creating executable with PyInstaller. Exiting." -ForegroundColor Red
    exit 1
}
Set-Location ..\packaging

# Step 6: Copy the dist folder to the output directory
Write-Host "Copying packaged application to output directory..." -ForegroundColor Cyan
Copy-Item -Path "$flaskDir\dist\$appName" -Destination "$outputDir\$appName-$appVersion" -Recurse -Force

# Step 7: Copy README files and create a basic README.txt
Write-Host "Copying README files..." -ForegroundColor Cyan
Copy-Item -Path "..\README.ar.md" -Destination "$outputDir\$appName-$appVersion\" -Force
Copy-Item -Path "..\README.en.md" -Destination "$outputDir\$appName-$appVersion\" -Force

$readmeContent = @"
# $appName v$appVersion

## Running the Application

1. Navigate to the application folder
2. Run the $appName.exe file
3. Open your browser and go to http://localhost:5000

## Features

- Arabic AI Assistant with Emotion Detection
- Text-to-Speech functionality
- Offline support via PWA
- Integrated Flask backend

## Detailed Documentation

For detailed instructions:
- See README.ar.md for Arabic instructions
- See README.en.md for English instructions

## Troubleshooting

If you encounter any issues:
1. Make sure no other application is using port 5000
2. Check that all files are present in the application folder
3. Try running the application as administrator
"@

Set-Content -Path "$outputDir\$appName-$appVersion\README.txt" -Value $readmeContent

# Step 8: Create a batch file for easy launching
$batchContent = @"
@echo off
echo Starting $appName v$appVersion...
start "" "$appName.exe"
timeout /t 2 /nobreak > nul
start "" http://localhost:5000
echo $appName is now running. You can access it at http://localhost:5000
"@

Set-Content -Path "$outputDir\$appName-$appVersion\Start-$appName.bat" -Value $batchContent -Encoding ASCII

# Step 9: Create a zip archive
Write-Host "Creating zip archive..." -ForegroundColor Cyan
Compress-Archive -Path "$outputDir\$appName-$appVersion" -DestinationPath "$outputDir\$appName-$appVersion.zip" -Force

Write-Host "Packaging complete!" -ForegroundColor Green
Write-Host "Output: $outputDir\$appName-$appVersion.zip" -ForegroundColor Green
Write-Host "You can distribute the zip file or the folder directly." -ForegroundColor Yellow
