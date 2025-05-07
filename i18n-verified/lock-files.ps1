# Lock Linguistically Validated Files Script
# This script sets all linguistically validated files to read-only to prevent accidental modifications

Write-Host "Setting linguistically validated files to read-only..."

# Function to set a file to read-only
function Set-ReadOnly {
    param (
        [string]$FilePath
    )
    
    if (Test-Path $FilePath) {
        $file = Get-Item $FilePath
        $file.IsReadOnly = $true
        Write-Host "Locked: $FilePath"
    } else {
        Write-Host "Warning: File not found - $FilePath"
    }
}

# Lock Filipino language files
Set-ReadOnly "$PSScriptRoot\src\translations\locales\fil.json"
Set-ReadOnly "$PSScriptRoot\src\translations\locales\fil.json.validated"

# Lock batch script files
Set-ReadOnly "$PSScriptRoot\launch-production.bat"
Set-ReadOnly "$PSScriptRoot\build-and-serve.bat"

# Lock Python files with Arabic content
Set-ReadOnly "$PSScriptRoot\backend\music_recommender.py"

Write-Host "`nAll linguistically validated files have been locked (set to read-only)."
Write-Host "To unlock files for editing, run the unlock-files.ps1 script."