# Mashaaer Enhanced Project - Release Preparation Script
# This script creates a .zip archive for GitHub release or production distribution

# Set variables
$releaseVersion = "1.0.0"
$releaseDate = Get-Date -Format "yyyy-MM-dd"
$releaseFileName = "mashaaer-enhanced-$releaseVersion.zip"
$tempDir = ".\release-temp"

# Create temporary directory
Write-Host "Creating temporary directory..." -ForegroundColor Cyan
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -Path $tempDir -ItemType Directory | Out-Null

# Copy required directories
Write-Host "Copying required directories..." -ForegroundColor Cyan
$directories = @("src", "backend", "docs", "tests")
foreach ($dir in $directories) {
    Write-Host "  - Copying $dir..." -ForegroundColor Gray
    Copy-Item -Path ".\$dir" -Destination "$tempDir\$dir" -Recurse
}

# Copy required files
Write-Host "Copying required files..." -ForegroundColor Cyan
$files = @("README.md", "LICENSE", "CHANGELOG.md", "RELEASE_ANNOUNCEMENT.md")
foreach ($file in $files) {
    Write-Host "  - Copying $file..." -ForegroundColor Gray
    Copy-Item -Path ".\$file" -Destination "$tempDir\$file"
}

# Create .zip archive
Write-Host "Creating .zip archive..." -ForegroundColor Cyan
if (Test-Path $releaseFileName) {
    Remove-Item -Path $releaseFileName -Force
}
Compress-Archive -Path "$tempDir\*" -DestinationPath $releaseFileName

# Clean up
Write-Host "Cleaning up..." -ForegroundColor Cyan
Remove-Item -Path $tempDir -Recurse -Force

# Done
Write-Host "Release archive created successfully: $releaseFileName" -ForegroundColor Green
Write-Host "The archive includes:" -ForegroundColor Green
Write-Host "  - Directories: src, backend, docs, tests" -ForegroundColor Green
Write-Host "  - Files: README.md, LICENSE, CHANGELOG.md, RELEASE_ANNOUNCEMENT.md" -ForegroundColor Green
Write-Host ""
Write-Host "To publish this release on GitHub:" -ForegroundColor Yellow
Write-Host "1. Go to your GitHub repository" -ForegroundColor Yellow
Write-Host "2. Click on 'Releases'" -ForegroundColor Yellow
Write-Host "3. Click on 'Draft a new release'" -ForegroundColor Yellow
Write-Host "4. Set the tag version to 'v$releaseVersion'" -ForegroundColor Yellow
Write-Host "5. Set the release title to 'Mashaaer Enhanced v$releaseVersion'" -ForegroundColor Yellow
Write-Host "6. Copy the content from RELEASE_ANNOUNCEMENT.md into the description" -ForegroundColor Yellow
Write-Host "7. Upload the $releaseFileName file" -ForegroundColor Yellow
Write-Host "8. Click 'Publish release'" -ForegroundColor Yellow