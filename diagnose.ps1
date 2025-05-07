# Diagnose script for Mashaaer Enhanced Project
# This script checks and creates all required directories for the project

# Create log file with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "diagnose_log_$timestamp.txt"

# Initialize log file
"[$timestamp] Mashaaer Enhanced Project Directory Diagnosis" | Out-File $logFile

# Function to write to log file and console
function Write-Log {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Message,

        [Parameter(Mandatory=$false)]
        [string]$ForegroundColor = "White",

        [Parameter(Mandatory=$false)]
        [string]$Type = "INFO"
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Type] $Message"

    # Write to console with color
    Write-Host $Message -ForegroundColor $ForegroundColor

    # Write to log file
    $logMessage | Out-File -Append $logFile

    # Return success for piping
    return $true
}

Write-Log "Starting Mashaaer Enhanced Project Directory Diagnosis..." "Green" "INFO"

# Function to check and create directory
function Ensure-Directory {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Path,

        [Parameter(Mandatory=$false)]
        [string]$Description = ""
    )

    try {
        if (-not (Test-Path -Path $Path)) {
            Write-Log "Creating directory: $Path" "Yellow" "CREATE"
            New-Item -Path $Path -ItemType Directory -Force | Out-Null
            if ($Description) {
                Write-Log "  Purpose: $Description" "Cyan" "INFO"
            }
            return $true
        } else {
            Write-Log "Directory exists: $Path" "Green" "CHECK"
            if ($Description) {
                Write-Log "  Purpose: $Description" "Cyan" "INFO"
            }
            return $false
        }
    } catch {
        Write-Log "Error creating directory $Path : $_" "Red" "ERROR"
        return $false
    }
}

# Main directories
Write-Log "Checking main project directories..." "Magenta" "SECTION"

$mainDirectories = @(
    @{Path = "data"; Description = "General data storage directory"},
    @{Path = "logs"; Description = "Application logs directory"},
    @{Path = "cache"; Description = "Temporary cache files directory"},
    @{Path = "temp"; Description = "Temporary files directory"}
)

$createdCount = 0
$existingCount = 0

foreach ($dir in $mainDirectories) {
    $created = Ensure-Directory -Path $dir.Path -Description $dir.Description
    if ($created) {
        $createdCount++
    } else {
        $existingCount++
    }
}

# Backend directories
Write-Log "Checking backend directories..." "Magenta" "SECTION"

$backendDirectories = @(
    @{Path = "backend\data"; Description = "Backend data storage"},
    @{Path = "backend\fine_tune_corpus"; Description = "Training data and logs for model fine-tuning"},
    @{Path = "backend\mashaer_base_model"; Description = "Base model files"},
    @{Path = "backend\routes"; Description = "API route definitions"}
)

foreach ($dir in $backendDirectories) {
    $created = Ensure-Directory -Path $dir.Path -Description $dir.Description
    if ($created) {
        $createdCount++
    } else {
        $existingCount++
    }
}

# Module-specific directories
Write-Log "Checking module-specific directories..." "Magenta" "SECTION"

$moduleDirectories = @(
    @{Path = "backend\data\dreams"; Description = "Dream simulator data storage"},
    @{Path = "backend\data\emotions"; Description = "Emotion data storage"},
    @{Path = "backend\data\feelings"; Description = "Feeling recorder data storage"},
    @{Path = "backend\data\empathy"; Description = "Empathy interface data storage"},
    @{Path = "backend\data\legacy"; Description = "Legacy mode data storage"},
    @{Path = "backend\data\consciousness"; Description = "Long-term consciousness data storage"},
    @{Path = "backend\data\reflections"; Description = "Loop reflection engine data storage"},
    @{Path = "backend\data\memory"; Description = "Memory indexer data storage"},
    @{Path = "backend\data\associations"; Description = "Memory-persona associations storage"},
    @{Path = "backend\data\evolution"; Description = "Parallel personas network data storage"},
    @{Path = "backend\data\blend"; Description = "Persona mesh data storage"},
    @{Path = "backend\data\shadow"; Description = "Shadow engine data storage"},
    @{Path = "backend\data\state"; Description = "State integrator data storage"},
    @{Path = "backend\data\metrics"; Description = "System metrics data storage"}
)

foreach ($dir in $moduleDirectories) {
    $created = Ensure-Directory -Path $dir.Path -Description $dir.Description
    if ($created) {
        $createdCount++
    } else {
        $existingCount++
    }
}

# Summary
Write-Log "Directory diagnosis complete!" "Green" "INFO"
Write-Log "Summary:" "Cyan" "SUMMARY"
Write-Log "  Directories checked: $($mainDirectories.Count + $backendDirectories.Count + $moduleDirectories.Count)" "Cyan" "SUMMARY"
Write-Log "  Directories already existing: $existingCount" "Green" "SUMMARY"
Write-Log "  Directories created: $createdCount" "Yellow" "SUMMARY"

if ($createdCount -gt 0) {
    Write-Log "✅ Created $createdCount directories that were missing" "Green" "SUCCESS"
} else {
    Write-Log "✅ All required directories already exist" "Green" "SUCCESS"
}

Write-Log "Diagnosis log saved to: $logFile" "Cyan" "INFO"