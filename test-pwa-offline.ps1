# PowerShell script to test PWA offline mode

Write-Host "Testing PWA Offline Mode..." -ForegroundColor Green
Write-Host ""
Write-Host "This script will:" -ForegroundColor Cyan
Write-Host "- Start a local server to serve the build directory"
Write-Host "- Open the application in your default browser"
Write-Host "- Provide instructions for testing offline mode"
Write-Host ""
Write-Host "Make sure you have built the application first with:" -ForegroundColor Yellow
Write-Host "npm run build"
Write-Host ""
Write-Host "Press any key to continue or Ctrl+C to cancel..." -ForegroundColor Magenta
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Check if build directory exists
if (-not (Test-Path -Path ".\build")) {
    Write-Host "Error: Build directory not found. Please run 'npm run build' first." -ForegroundColor Red
    Write-Host "Would you like to build the application now? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "Y" -or $response -eq "y") {
        Write-Host "Building application..." -ForegroundColor Green
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error building application. Exiting." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Exiting script." -ForegroundColor Red
        exit 1
    }
}

# Run the test:pwa-offline script
npm run test:pwa-offline