# Launch Production Script for Mashaaer Enhanced Project
# This script builds the React application and runs the Flask backend

# Set console colors for better readability
$infoColor = "Cyan"
$successColor = "Green"
$warningColor = "Yellow"
$errorColor = "Red"

Write-Host "=======================================================" -ForegroundColor $infoColor
Write-Host "  Mashaaer Enhanced Project - Production Launcher" -ForegroundColor $infoColor
Write-Host "=======================================================" -ForegroundColor $infoColor
Write-Host ""

# Step 1: Build the React application
Write-Host "Step 1: Building React application..." -ForegroundColor $infoColor
try {
    Write-Host "Running: npm run build" -ForegroundColor $infoColor
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to build React application. Error code: $LASTEXITCODE" -ForegroundColor $errorColor
        exit 1
    }
    Write-Host "✅ React application built successfully" -ForegroundColor $successColor
} catch {
    Write-Host "❌ Error building React application: $_" -ForegroundColor $errorColor
    exit 1
}

# Step 2: Copy build files to Flask static directory
Write-Host ""
Write-Host "Step 2: Copying build files to Flask static directory..." -ForegroundColor $infoColor
try {
    # Check if build directory exists
    if (-not (Test-Path "build")) {
        Write-Host "❌ Build directory not found. Make sure the React build was successful." -ForegroundColor $errorColor
        exit 1
    }

    # Create static and templates directories if they don't exist
    if (-not (Test-Path "backend\static")) {
        New-Item -Path "backend\static" -ItemType Directory -Force | Out-Null
        Write-Host "Created backend\static directory" -ForegroundColor $infoColor
    }
    if (-not (Test-Path "backend\templates")) {
        New-Item -Path "backend\templates" -ItemType Directory -Force | Out-Null
        Write-Host "Created backend\templates directory" -ForegroundColor $infoColor
    }

    # Copy build files to static directory
    Copy-Item -Path "build\*" -Destination "backend\static" -Recurse -Force
    Write-Host "✅ Build files copied to Flask static directory" -ForegroundColor $successColor
} catch {
    Write-Host "❌ Error copying build files: $_" -ForegroundColor $errorColor
    exit 1
}

# Step 3: Run the Flask application
Write-Host ""
Write-Host "Step 3: Starting Flask application..." -ForegroundColor $infoColor
try {
    # Method 1: Using flask --app command
    Write-Host "Running Flask with: flask --app backend.app run" -ForegroundColor $infoColor
    flask --app backend.app run

    # If the above command fails, try the alternative method
    if ($LASTEXITCODE -ne 0) {
        Write-Host "First method failed, trying alternative method..." -ForegroundColor $warningColor
        
        # Method 2: Using environment variable
        Write-Host "Setting FLASK_APP environment variable and running flask" -ForegroundColor $infoColor
        $env:FLASK_APP = "backend/app.py"
        flask run
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to start Flask application with both methods" -ForegroundColor $errorColor
            exit 1
        }
    }
} catch {
    Write-Host "❌ Error starting Flask application: $_" -ForegroundColor $errorColor
    exit 1
}

Write-Host ""
Write-Host "✅ Flask application is running" -ForegroundColor $successColor
Write-Host "You can access the application at: http://localhost:5000" -ForegroundColor $successColor
Write-Host ""