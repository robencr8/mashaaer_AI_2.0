# Upload to GitHub Releases Script for Mashaaer Enhanced Project
# This script automates the process of uploading the distributable to GitHub Releases

# Configuration
param(
    [string]$RepoOwner = "",
    [string]$RepoName = "mashaaer-enhanced",
    [string]$TagName = "v1.0.0",
    [string]$ReleaseName = "Mashaaer Enhanced v1.0.0",
    [string]$ReleaseNotes = "Initial release of Mashaaer Enhanced",
    [switch]$Draft = $false,
    [switch]$Prerelease = $false,
    [string]$Token = "",
    [string]$DistDir = "dist"
)

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  Mashaaer Enhanced Project - Upload to GitHub Releases" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Validate parameters
Write-Host "Step 1: Validating parameters..." -ForegroundColor Cyan

if ([string]::IsNullOrEmpty($RepoOwner)) {
    $RepoOwner = Read-Host -Prompt "Enter GitHub repository owner (username or organization)"
}

if ([string]::IsNullOrEmpty($Token)) {
    $Token = Read-Host -Prompt "Enter GitHub personal access token (with 'repo' scope)"
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

Write-Host "✅ Parameters validated successfully" -ForegroundColor Green
Write-Host "Repository: $RepoOwner/$RepoName" -ForegroundColor Green
Write-Host "Tag: $TagName" -ForegroundColor Green
Write-Host "Release Name: $ReleaseName" -ForegroundColor Green
if ($installerPath) {
    Write-Host "Installer: $installerPath" -ForegroundColor Green
}
if ($zipPath) {
    Write-Host "Zip File: $zipPath" -ForegroundColor Green
}

# Step 2: Create a new release
Write-Host ""
Write-Host "Step 2: Creating a new release..." -ForegroundColor Cyan

$releaseData = @{
    tag_name = $TagName
    name = $ReleaseName
    body = $ReleaseNotes
    draft = $Draft.IsPresent
    prerelease = $Prerelease.IsPresent
}

$releaseDataJson = $releaseData | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "token $Token"
        "Accept" = "application/vnd.github.v3+json"
    }

    $releaseResponse = Invoke-RestMethod -Uri "https://api.github.com/repos/$RepoOwner/$RepoName/releases" -Method Post -Headers $headers -Body $releaseDataJson -ContentType "application/json"
    
    $releaseId = $releaseResponse.id
    $releaseUrl = $releaseResponse.html_url
    
    Write-Host "✅ Release created successfully" -ForegroundColor Green
    Write-Host "Release ID: $releaseId" -ForegroundColor Green
    Write-Host "Release URL: $releaseUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create release" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Upload assets
Write-Host ""
Write-Host "Step 3: Uploading assets..." -ForegroundColor Cyan

function Upload-Asset {
    param(
        [string]$FilePath,
        [string]$ReleaseId
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "⚠️ File not found: $FilePath" -ForegroundColor Yellow
        return
    }
    
    $fileName = Split-Path $FilePath -Leaf
    $fileSize = (Get-Item $FilePath).Length
    $fileBytes = [System.IO.File]::ReadAllBytes($FilePath)
    
    try {
        $uploadHeaders = @{
            "Authorization" = "token $Token"
            "Accept" = "application/vnd.github.v3+json"
            "Content-Type" = "application/octet-stream"
        }
        
        $uploadUrl = "https://uploads.github.com/repos/$RepoOwner/$RepoName/releases/$ReleaseId/assets?name=$fileName"
        
        Write-Host "Uploading $fileName ($([math]::Round($fileSize / 1MB, 2)) MB)..." -ForegroundColor Yellow
        
        $uploadResponse = Invoke-RestMethod -Uri $uploadUrl -Method Post -Headers $uploadHeaders -Body $fileBytes
        
        Write-Host "✅ $fileName uploaded successfully" -ForegroundColor Green
        Write-Host "Download URL: $($uploadResponse.browser_download_url)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to upload $fileName" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

# Upload installer if it exists
if ($installerPath) {
    Upload-Asset -FilePath $installerPath -ReleaseId $releaseId
}

# Upload zip file if it exists
if ($zipPath) {
    Upload-Asset -FilePath $zipPath -ReleaseId $releaseId
}

# Step 4: Generate file hashes
Write-Host ""
Write-Host "Step 4: Generating file hashes..." -ForegroundColor Cyan

$hashesContent = "# File Hashes for Mashaaer Enhanced $TagName`n`n"

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
$hashesFile = "$DistDir\file-hashes-$TagName.md"
Set-Content -Path $hashesFile -Value $hashesContent

Write-Host "✅ File hashes generated and saved to $hashesFile" -ForegroundColor Green

# Step 5: Update release notes with file hashes
Write-Host ""
Write-Host "Step 5: Updating release notes with file hashes..." -ForegroundColor Cyan

$updatedReleaseNotes = $ReleaseNotes + "`n`n" + $hashesContent

$updateData = @{
    body = $updatedReleaseNotes
}

$updateDataJson = $updateData | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "https://api.github.com/repos/$RepoOwner/$RepoName/releases/$releaseId" -Method Patch -Headers $headers -Body $updateDataJson -ContentType "application/json"
    
    Write-Host "✅ Release notes updated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to update release notes" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

# Final summary
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  Upload to GitHub Releases Complete!" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Release URL: $releaseUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can share this URL with your users to download the distributable." -ForegroundColor Cyan
Write-Host ""