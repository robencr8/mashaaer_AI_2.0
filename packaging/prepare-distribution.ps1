# Script to prepare Mashaaer Enhanced for distribution
# This script creates distribution packages and prepares files for hosting

param (
    [string]$Version = "1.0.0",
    [string]$OutputDir = "dist",
    [switch]$CreateInstaller = $true,
    [switch]$CreatePortable = $true,
    [switch]$PrepareForGitHub = $true,
    [switch]$PrepareForGoogleDrive = $true
)

# Configuration
$appName = "MashaaerEnhanced"
$fullAppName = "Mashaaer Enhanced"
$releaseNotes = "Release notes for version $Version.`n- Added license activation system`n- Improved installer with custom branding`n- Fixed various bugs and improved performance"

Write-Host "Preparing $fullAppName v$Version for distribution..." -ForegroundColor Green

# Create output directories
$distDir = Join-Path $PSScriptRoot $OutputDir
$githubDir = Join-Path $distDir "github-release"
$googleDriveDir = Join-Path $distDir "google-drive"

# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path $distDir | Out-Null
if ($PrepareForGitHub) {
    New-Item -ItemType Directory -Force -Path $githubDir | Out-Null
}
if ($PrepareForGoogleDrive) {
    New-Item -ItemType Directory -Force -Path $googleDriveDir | Out-Null
}

# Step 1: Download placeholder images for the installer if they don't exist
Write-Host "Checking for installer assets..." -ForegroundColor Cyan
$electronDir = Join-Path $PSScriptRoot "electron"
$downloadAssetsScript = Join-Path $electronDir "download-assets.ps1"

if (Test-Path $downloadAssetsScript) {
    Write-Host "Running download-assets.ps1 to get placeholder images..." -ForegroundColor Yellow
    Set-Location $electronDir
    & $downloadAssetsScript
    Set-Location $PSScriptRoot
}

# Step 2: Build the application
if ($CreateInstaller -or $CreatePortable) {
    Write-Host "Building the application..." -ForegroundColor Cyan
    
    # Run the electron packaging script
    $packageElectronScript = Join-Path $electronDir "package-electron.ps1"
    if (Test-Path $packageElectronScript) {
        Write-Host "Running package-electron.ps1 to create installer..." -ForegroundColor Yellow
        Set-Location $electronDir
        & $packageElectronScript
        Set-Location $PSScriptRoot
        
        # Copy the installer and portable version to the distribution directory
        $electronDistDir = Join-Path $electronDir "dist"
        if (Test-Path $electronDistDir) {
            if ($CreateInstaller) {
                $installerPath = Join-Path $electronDistDir "$appName-Setup-$Version.exe"
                if (Test-Path $installerPath) {
                    Copy-Item -Path $installerPath -Destination $distDir -Force
                    Write-Host "Installer copied to $distDir" -ForegroundColor Green
                } else {
                    Write-Host "Installer not found at $installerPath" -ForegroundColor Red
                }
            }
            
            if ($CreatePortable) {
                $portablePath = Join-Path $electronDistDir "win-unpacked"
                if (Test-Path $portablePath) {
                    $portableZipPath = Join-Path $distDir "$appName-Portable-$Version.zip"
                    Compress-Archive -Path "$portablePath\*" -DestinationPath $portableZipPath -Force
                    Write-Host "Portable version created at $portableZipPath" -ForegroundColor Green
                } else {
                    Write-Host "Portable version not found at $portablePath" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "Electron dist directory not found at $electronDistDir" -ForegroundColor Red
        }
    } else {
        Write-Host "Electron packaging script not found at $packageElectronScript" -ForegroundColor Red
    }
}

# Step 3: Prepare for GitHub Releases
if ($PrepareForGitHub) {
    Write-Host "Preparing files for GitHub Releases..." -ForegroundColor Cyan
    
    # Create README for GitHub release
    $githubReadmePath = Join-Path $githubDir "README.md"
    $githubReadmeContent = @"
# $fullAppName v$Version

## Release Notes
$releaseNotes

## Installation

### Windows Installer
1. Download the `$appName-Setup-$Version.exe` file
2. Run the installer and follow the instructions
3. Launch the application from the desktop shortcut or start menu

### Portable Version
1. Download the `$appName-Portable-$Version.zip` file
2. Extract the zip file to a location of your choice
3. Run `$appName.exe` to start the application

## System Requirements
- Windows 10 or later
- 4GB RAM minimum, 8GB recommended
- 500MB free disk space

## Support
For support or to report issues, please visit our GitHub repository or contact support@mashaaer.com
"@
    
    Set-Content -Path $githubReadmePath -Value $githubReadmeContent
    
    # Copy distribution files to GitHub directory
    if (Test-Path (Join-Path $distDir "$appName-Setup-$Version.exe")) {
        Copy-Item -Path (Join-Path $distDir "$appName-Setup-$Version.exe") -Destination $githubDir -Force
    }
    
    if (Test-Path (Join-Path $distDir "$appName-Portable-$Version.zip")) {
        Copy-Item -Path (Join-Path $distDir "$appName-Portable-$Version.zip") -Destination $githubDir -Force
    }
    
    Write-Host "GitHub release files prepared in $githubDir" -ForegroundColor Green
}

# Step 4: Prepare for Google Drive
if ($PrepareForGoogleDrive) {
    Write-Host "Preparing files for Google Drive..." -ForegroundColor Cyan
    
    # Create README for Google Drive
    $googleDriveReadmePath = Join-Path $googleDriveDir "README.txt"
    $googleDriveReadmeContent = @"
$fullAppName v$Version

RELEASE NOTES
$releaseNotes

INSTALLATION

Windows Installer:
1. Download the $appName-Setup-$Version.exe file
2. Run the installer and follow the instructions
3. Launch the application from the desktop shortcut or start menu

Portable Version:
1. Download the $appName-Portable-$Version.zip file
2. Extract the zip file to a location of your choice
3. Run $appName.exe to start the application

SYSTEM REQUIREMENTS
- Windows 10 or later
- 4GB RAM minimum, 8GB recommended
- 500MB free disk space

SUPPORT
For support or to report issues, please contact support@mashaaer.com
"@
    
    Set-Content -Path $googleDriveReadmePath -Value $googleDriveReadmeContent
    
    # Copy distribution files to Google Drive directory
    if (Test-Path (Join-Path $distDir "$appName-Setup-$Version.exe")) {
        Copy-Item -Path (Join-Path $distDir "$appName-Setup-$Version.exe") -Destination $googleDriveDir -Force
    }
    
    if (Test-Path (Join-Path $distDir "$appName-Portable-$Version.zip")) {
        Copy-Item -Path (Join-Path $distDir "$appName-Portable-$Version.zip") -Destination $googleDriveDir -Force
    }
    
    Write-Host "Google Drive files prepared in $googleDriveDir" -ForegroundColor Green
}

# Step 5: Create a distribution summary
$summaryPath = Join-Path $distDir "distribution-summary.txt"
$summaryContent = @"
$fullAppName v$Version - Distribution Summary
Generated on $(Get-Date)

DISTRIBUTION FILES:
"@

if (Test-Path (Join-Path $distDir "$appName-Setup-$Version.exe")) {
    $installerSize = (Get-Item (Join-Path $distDir "$appName-Setup-$Version.exe")).Length / 1MB
    $summaryContent += "`n- Installer: $appName-Setup-$Version.exe ($('{0:N2}' -f $installerSize) MB)"
}

if (Test-Path (Join-Path $distDir "$appName-Portable-$Version.zip")) {
    $portableSize = (Get-Item (Join-Path $distDir "$appName-Portable-$Version.zip")).Length / 1MB
    $summaryContent += "`n- Portable: $appName-Portable-$Version.zip ($('{0:N2}' -f $portableSize) MB)"
}

$summaryContent += @"

DISTRIBUTION CHANNELS:
"@

if ($PrepareForGitHub) {
    $summaryContent += "`n- GitHub Releases: Files prepared in $githubDir"
}

if ($PrepareForGoogleDrive) {
    $summaryContent += "`n- Google Drive: Files prepared in $googleDriveDir"
}

$summaryContent += @"

NEXT STEPS:
1. Upload the installer and portable zip to your chosen distribution platforms
2. Update your website with download links
3. Announce the release to your users
4. Monitor for any issues or feedback

For GitHub Releases:
- Create a new release on GitHub
- Tag it as v$Version
- Upload the installer and portable zip files
- Copy the content from $githubDir\README.md as the release description

For Google Drive:
- Upload the files from $googleDriveDir to your Google Drive folder
- Set appropriate sharing permissions
- Share the download links with your users
"@

Set-Content -Path $summaryPath -Value $summaryContent

Write-Host "Distribution preparation complete!" -ForegroundColor Green
Write-Host "Summary saved to $summaryPath" -ForegroundColor Green
Write-Host "Next steps are detailed in the summary file." -ForegroundColor Yellow