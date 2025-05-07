# Test script to verify that the fix-npm-install script resolves the "application not working" issue

# Create log file with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "test-fix_$timestamp.txt"

# Initialize log file
"[$timestamp] Testing fix for 'application not working' issue" | Out-File $logFile

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

# Step 1: Run the fix-npm-install.ps1 script
Write-Log "Step 1: Running fix-npm-install.ps1 script..." "Cyan" "INFO"
try {
    & .\fix-npm-install.ps1
    if ($LASTEXITCODE -ne 0) {
        Write-Log "❌ fix-npm-install.ps1 failed with exit code $LASTEXITCODE" "Red" "ERROR"
        exit 1
    }
    Write-Log "✅ fix-npm-install.ps1 completed successfully" "Green" "INFO"
} catch {
    Write-Log "❌ Error running fix-npm-install.ps1: $_" "Red" "ERROR"
    exit 1
}

# Step 2: Verify that node_modules exists and contains critical dependencies
Write-Log "Step 2: Verifying node_modules..." "Cyan" "INFO"
if (-not (Test-Path "node_modules")) {
    Write-Log "❌ node_modules directory does not exist" "Red" "ERROR"
    exit 1
}

$criticalDeps = @("react", "react-dom", "react-scripts", "axios", "webpack")
$missingDeps = @()

foreach ($dep in $criticalDeps) {
    if (-not (Test-Path "node_modules/$dep")) {
        $missingDeps += $dep
    }
}

if ($missingDeps.Count -eq 0) {
    Write-Log "✅ All critical dependencies are installed" "Green" "INFO"
} else {
    Write-Log "❌ Missing dependencies: $($missingDeps -join ', ')" "Red" "ERROR"
    exit 1
}

# Step 3: Start the application in test mode (frontend only, no backend)
Write-Log "Step 3: Starting the application in test mode..." "Cyan" "INFO"
Write-Log "Note: This will only test if the frontend can start without errors" "Yellow" "INFO"
Write-Log "To fully test the application, run start-mashaaer.ps1 after this test" "Yellow" "INFO"

# Set NODE_OPTIONS environment variable
$env:NODE_OPTIONS="--openssl-legacy-provider"

# Start the React app with a timeout
Write-Log "Starting React app (will timeout after 30 seconds)..." "Yellow" "INFO"
$reactProcess = Start-Process npm -ArgumentList "start" -NoNewWindow -PassThru

# Wait for 30 seconds or until the process exits
$timeout = 30
$elapsed = 0
$interval = 5

while ($elapsed -lt $timeout -and -not $reactProcess.HasExited) {
    Write-Log "Waiting for React app to start... ($elapsed/$timeout seconds)" "Yellow" "INFO"
    Start-Sleep -Seconds $interval
    $elapsed += $interval
}

# Check if the process is still running (which means it started successfully)
if (-not $reactProcess.HasExited) {
    Write-Log "✅ React app started successfully!" "Green" "INFO"
    Write-Log "Stopping test process..." "Yellow" "INFO"
    Stop-Process -Id $reactProcess.Id -Force
    Write-Log "✅ Test completed successfully. The fix has resolved the issue." "Green" "INFO"
    Write-Log "You can now run start-mashaaer.ps1 to start the full application." "Cyan" "INFO"
} else {
    Write-Log "❌ React app failed to start" "Red" "ERROR"
    Write-Log "Please check the npm error output for details" "Yellow" "INFO"
    exit 1
}

# Final success message
Write-Log "Test completed. See $logFile for details." "Green" "INFO"