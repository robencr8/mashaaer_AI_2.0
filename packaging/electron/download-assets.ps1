# Script to download placeholder images for the installer
# Run this script before packaging the application

$outputDir = "."
$placeholderImageUrl = "https://via.placeholder.com/600x400/3498db/FFFFFF?text=Mashaaer+Enhanced"
$sidebarImageUrl = "https://via.placeholder.com/164x314/2c3e50/FFFFFF?text=Mashaaer+Enhanced"

Write-Host "Downloading placeholder images for the installer..." -ForegroundColor Cyan

# Download splash screen image
Write-Host "Downloading splash.png..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $placeholderImageUrl -OutFile "$outputDir\splash.png"

# Download installer background image
Write-Host "Downloading installer-background.png..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $sidebarImageUrl -OutFile "$outputDir\installer-background.png"

Write-Host "Placeholder images downloaded successfully." -ForegroundColor Green
Write-Host "Note: Replace these placeholder images with your actual branded images before distribution." -ForegroundColor Yellow