# Upload to Google Drive Script for Mashaaer Enhanced Project
# This script automates the process of uploading the distributable to Google Drive
#
# Prerequisites:
# - Install the GoogleDrive PowerShell module: Install-Module -Name GoogleDrive
# - Authenticate with Google Drive: Get-GDriveAuthentication

# Configuration
param(
    [string]$FolderName = "Mashaaer Enhanced",
    [string]$Version = "v1.0.0",
    [switch]$CreatePublicLinks = $false,
    [string]$DistDir = "dist"
)

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  Mashaaer Enhanced Project - Upload to Google Drive" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check prerequisites
Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Cyan

# Check if GoogleDrive module is installed
$moduleInstalled = Get-Module -ListAvailable -Name GoogleDrive
if (-not $moduleInstalled) {
    Write-Host "❌ GoogleDrive PowerShell module is not installed" -ForegroundColor Red
    Write-Host "Please install it by running: Install-Module -Name GoogleDrive" -ForegroundColor Yellow
    Write-Host "You may need to run PowerShell as Administrator to install modules." -ForegroundColor Yellow
    exit 1
}

# Import the module
try {
    Import-Module GoogleDrive -ErrorAction Stop
    Write-Host "✅ GoogleDrive module imported successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to import GoogleDrive module: $_" -ForegroundColor Red
    exit 1
}

# Check if the distributable directory exists
if (-not (Test-Path $DistDir)) {
    Write-Host "❌ Distributable directory not found at $DistDir" -ForegroundColor Red
    Write-Host "Please run create-distributable.ps1 first to create the distributable." -ForegroundColor Yellow
    exit 1
}

# Check if the distributable files exist
$installerPath = Get-ChildItem -Path $DistDir -Filter "*.exe" | Where-Object { $_.Name -like "*Setup*.exe" } | Select-Object -First 1 -ExpandProperty FullName
$zipPath = Get-ChildItem -Path $DistDir -Filter "*.zip" | Where-Object { $_.Name -like "*full*.zip" } | Select-Object -First 1 -ExpandProperty FullName

if (-not $installerPath -and -not $zipPath) {
    Write-Host "❌ No distributable files found in $DistDir" -ForegroundColor Red
    Write-Host "Please run create-distributable.ps1 first to create the distributable." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Prerequisites checked successfully" -ForegroundColor Green
if ($installerPath) {
    Write-Host "Installer: $installerPath" -ForegroundColor Green
}
if ($zipPath) {
    Write-Host "Zip File: $zipPath" -ForegroundColor Green
}

# Step 2: Authenticate with Google Drive
Write-Host ""
Write-Host "Step 2: Authenticating with Google Drive..." -ForegroundColor Cyan

try {
    # Check if already authenticated
    $auth = Get-GDriveAuthentication -ErrorAction SilentlyContinue
    
    if (-not $auth) {
        Write-Host "You need to authenticate with Google Drive." -ForegroundColor Yellow
        Write-Host "A browser window will open. Please log in and grant the requested permissions." -ForegroundColor Yellow
        
        # Authenticate with Google Drive
        $auth = Get-GDriveAuthentication
    }
    
    Write-Host "✅ Authenticated with Google Drive successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to authenticate with Google Drive: $_" -ForegroundColor Red
    Write-Host "Please try running Get-GDriveAuthentication manually to troubleshoot." -ForegroundColor Yellow
    exit 1
}

# Step 3: Create or find the folder
Write-Host ""
Write-Host "Step 3: Creating or finding the folder '$FolderName'..." -ForegroundColor Cyan

try {
    # Check if folder exists
    $folder = Find-GDriveItem -Name $FolderName -ItemType Folder
    
    if (-not $folder) {
        # Create the folder
        $folder = New-GDriveItem -Name $FolderName -ItemType Folder
        Write-Host "✅ Folder '$FolderName' created successfully" -ForegroundColor Green
    } else {
        Write-Host "✅ Folder '$FolderName' found" -ForegroundColor Green
    }
    
    $folderId = $folder.Id
    Write-Host "Folder ID: $folderId" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create or find folder: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Create a version subfolder
Write-Host ""
Write-Host "Step 4: Creating version subfolder '$Version'..." -ForegroundColor Cyan

try {
    # Check if version subfolder exists
    $versionFolder = Find-GDriveItem -Name $Version -ItemType Folder -Parents $folderId
    
    if (-not $versionFolder) {
        # Create the version subfolder
        $versionFolder = New-GDriveItem -Name $Version -ItemType Folder -Parents $folderId
        Write-Host "✅ Version subfolder '$Version' created successfully" -ForegroundColor Green
    } else {
        Write-Host "✅ Version subfolder '$Version' found" -ForegroundColor Green
    }
    
    $versionFolderId = $versionFolder.Id
    Write-Host "Version Folder ID: $versionFolderId" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create or find version subfolder: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Upload files
Write-Host ""
Write-Host "Step 5: Uploading files..." -ForegroundColor Cyan

function Upload-File {
    param(
        [string]$FilePath,
        [string]$ParentId
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "⚠️ File not found: $FilePath" -ForegroundColor Yellow
        return
    }
    
    $fileName = Split-Path $FilePath -Leaf
    $fileSize = (Get-Item $FilePath).Length
    
    try {
        Write-Host "Uploading $fileName ($([math]::Round($fileSize / 1MB, 2)) MB)..." -ForegroundColor Yellow
        
        # Check if file already exists
        $existingFile = Find-GDriveItem -Name $fileName -Parents $ParentId
        
        if ($existingFile) {
            # Update existing file
            $file = Update-GDriveItem -Id $existingFile.Id -Path $FilePath
            Write-Host "✅ $fileName updated successfully" -ForegroundColor Green
        } else {
            # Upload new file
            $file = Add-GDriveItem -Path $FilePath -Parents $ParentId
            Write-Host "✅ $fileName uploaded successfully" -ForegroundColor Green
        }
        
        # Create public link if requested
        if ($CreatePublicLinks) {
            $permission = Add-GDrivePermission -Id $file.Id -Type Anyone -Role Reader
            $link = "https://drive.google.com/file/d/$($file.Id)/view?usp=sharing"
            $directLink = "https://drive.google.com/uc?export=download&id=$($file.Id)"
            
            Write-Host "Public Link: $link" -ForegroundColor Green
            Write-Host "Direct Download Link: $directLink" -ForegroundColor Green
            
            return @{
                Id = $file.Id
                Name = $fileName
                Link = $link
                DirectLink = $directLink
            }
        } else {
            return @{
                Id = $file.Id
                Name = $fileName
            }
        }
    } catch {
        Write-Host "❌ Failed to upload $fileName: $_" -ForegroundColor Red
        return $null
    }
}

$uploadedFiles = @()

# Upload installer if it exists
if ($installerPath) {
    $installerResult = Upload-File -FilePath $installerPath -ParentId $versionFolderId
    if ($installerResult) {
        $uploadedFiles += $installerResult
    }
}

# Upload zip file if it exists
if ($zipPath) {
    $zipResult = Upload-File -FilePath $zipPath -ParentId $versionFolderId
    if ($zipResult) {
        $uploadedFiles += $zipResult
    }
}

# Step 6: Generate file hashes
Write-Host ""
Write-Host "Step 6: Generating file hashes..." -ForegroundColor Cyan

$hashesContent = "# File Hashes for Mashaaer Enhanced $Version`n`n"

if ($installerPath) {
    $installerHash = Get-FileHash -Algorithm SHA256 -Path $installerPath
    $hashesContent += "## Installer (`$(Split-Path $installerPath -Leaf))`n`n"
    $hashesContent += "- SHA256: $($installerHash.Hash)`n`n"
}

if ($zipPath) {
    $zipHash = Get-FileHash -Algorithm SHA256 -Path $zipPath
    $hashesContent += "## Zip File (`$(Split-Path $zipPath -Leaf))`n`n"
    $hashesContent += "- SHA256: $($zipHash.Hash)`n`n"
}

# Create a file with the hashes
$hashesFile = "$DistDir\file-hashes-$Version.md"
Set-Content -Path $hashesFile -Value $hashesContent

Write-Host "✅ File hashes generated and saved to $hashesFile" -ForegroundColor Green

# Upload the hashes file
$hashesResult = Upload-File -FilePath $hashesFile -ParentId $versionFolderId
if ($hashesResult) {
    $uploadedFiles += $hashesResult
}

# Step 7: Create a README file with links
Write-Host ""
Write-Host "Step 7: Creating README with links..." -ForegroundColor Cyan

if ($CreatePublicLinks) {
    $readmeContent = "# Mashaaer Enhanced $Version Download Links`n`n"
    
    foreach ($file in $uploadedFiles) {
        if ($file.Name -like "*Setup*.exe") {
            $readmeContent += "## Installer`n`n"
            $readmeContent += "- [Download Installer]($($file.Link))`n"
            $readmeContent += "- Direct download link: $($file.DirectLink)`n`n"
        } elseif ($file.Name -like "*full*.zip") {
            $readmeContent += "## Portable Version (Zip)`n`n"
            $readmeContent += "- [Download Zip]($($file.Link))`n"
            $readmeContent += "- Direct download link: $($file.DirectLink)`n`n"
        } elseif ($file.Name -like "*file-hashes*.md") {
            $readmeContent += "## File Hashes`n`n"
            $readmeContent += "- [View File Hashes]($($file.Link))`n`n"
        }
    }
    
    $readmeFile = "$DistDir\README-$Version.md"
    Set-Content -Path $readmeFile -Value $readmeContent
    
    Write-Host "✅ README with links created and saved to $readmeFile" -ForegroundColor Green
    
    # Upload the README file
    Upload-File -FilePath $readmeFile -ParentId $versionFolderId
}

# Final summary
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  Upload to Google Drive Complete!" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files uploaded to Google Drive folder: $FolderName/$Version" -ForegroundColor Cyan
Write-Host ""

if ($CreatePublicLinks) {
    Write-Host "Public links have been created for all files." -ForegroundColor Cyan
    Write-Host "You can find these links in the README file: $DistDir\README-$Version.md" -ForegroundColor Cyan
} else {
    Write-Host "No public links were created. To share files, you need to:" -ForegroundColor Cyan
    Write-Host "1. Go to Google Drive in your browser" -ForegroundColor Cyan
    Write-Host "2. Navigate to the '$FolderName/$Version' folder" -ForegroundColor Cyan
    Write-Host "3. Right-click on files and select 'Share'" -ForegroundColor Cyan
    Write-Host "4. Configure sharing settings as needed" -ForegroundColor Cyan
}

Write-Host ""