# Unlock Linguistically Validated Files Script
# This script removes the read-only attribute from linguistically validated files to allow modifications

Write-Host "Removing read-only attribute from linguistically validated files..."

# Function to remove read-only attribute
function Remove-ReadOnly {
    param (
        [string]$FilePath
    )
    
    if (Test-Path $FilePath) {
        $file = Get-Item $FilePath
        $file.IsReadOnly = $false
        Write-Host "Unlocked: $FilePath"
    } else {
        Write-Host "Warning: File not found - $FilePath"
    }
}

# Unlock Filipino language files
Remove-ReadOnly "$PSScriptRoot\src\translations\locales\fil.json"
Remove-ReadOnly "$PSScriptRoot\src\translations\locales\fil.json.validated"

# Unlock batch script files
Remove-ReadOnly "$PSScriptRoot\launch-production.bat"
Remove-ReadOnly "$PSScriptRoot\build-and-serve.bat"

# Unlock Python files with Arabic content
Remove-ReadOnly "$PSScriptRoot\backend\music_recommender.py"

Write-Host "`nAll linguistically validated files have been unlocked (read-only attribute removed)."
Write-Host "WARNING: These files have been linguistically validated. Make changes with caution."
Write-Host "After making changes, run the lock-files.ps1 script to protect them again."