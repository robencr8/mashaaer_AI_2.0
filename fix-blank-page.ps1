# Mashaaer Enhanced - Fix Blank Page Utility

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Mashaaer Enhanced - Fix Blank Page Utility" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will build the React frontend and copy it to the Flask backend" -ForegroundColor White
Write-Host "to fix the blank page issue." -ForegroundColor White
Write-Host ""
Write-Host "Please make sure you have Node.js and npm installed before proceeding." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to continue or Ctrl+C to cancel..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Green
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install dependencies." -ForegroundColor Red
        Write-Host "Please make sure Node.js and npm are installed correctly." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Building React frontend..." -ForegroundColor Green
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to build React frontend." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 3: Copying build files to Flask backend..." -ForegroundColor Green
if (-not (Test-Path "build")) {
    Write-Host "Error: Build directory not found." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path "backend\static")) {
    New-Item -Path "backend\static" -ItemType Directory | Out-Null
    Write-Host "Created backend\static directory." -ForegroundColor Yellow
}

try {
    Copy-Item -Path "build\*" -Destination "backend\static" -Recurse -Force
} catch {
    Write-Host "Error: Failed to copy build files to backend\static." -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 4: Creating template files..." -ForegroundColor Green
if (-not (Test-Path "backend\templates")) {
    New-Item -Path "backend\templates" -ItemType Directory | Out-Null
    Write-Host "Created backend\templates directory." -ForegroundColor Yellow
}

$indexHtmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/static/index.html">
    <title>Mashaaer Enhanced</title>
</head>
<body>
    <p>If you are not redirected automatically, follow this <a href="/static/index.html">link to the application</a>.</p>
</body>
</html>
"@

try {
    $indexHtmlContent | Out-File -FilePath "backend\templates\index.html" -Encoding utf8
} catch {
    Write-Host "Error: Failed to create index.html template file." -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Success! The blank page issue should now be fixed." -ForegroundColor Green
Write-Host ""
Write-Host "To run the application:" -ForegroundColor White
Write-Host "1. Open a command prompt" -ForegroundColor White
Write-Host "2. Navigate to the backend directory: cd backend" -ForegroundColor White
Write-Host "3. Run the Flask application: python app.py" -ForegroundColor White
Write-Host "4. Open your browser and go to: http://127.0.0.1:5000" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")