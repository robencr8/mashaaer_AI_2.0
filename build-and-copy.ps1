# Build and Copy Script for Mashaaer Enhanced Project
# This script builds the React application and copies the output to the Flask backend

# Set the source and destination directories
$sourceDir = ".\build"
$staticDestDir = ".\backend\static"
$templatesDestDir = ".\backend\templates"

# Create a timestamp for logging
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "build-and-copy_$timestamp.log"

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
}

# Initialize log file
"[$timestamp] Build and Copy Process Started" | Out-File $logFile

# Step 1: Build the React application
Write-Log "Step 1: Building React application..." "Cyan" "INFO"
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Failed to build React application. Error code: $LASTEXITCODE" "Red" "ERROR"
        exit 1
    }
    Write-Log "React application built successfully" "Green" "INFO"
} catch {
    Write-Log "Error building React application: $_" "Red" "ERROR"
    exit 1
}

# Step 2: Check if build directory exists
Write-Log "Step 2: Checking build directory..." "Cyan" "INFO"
if (-not (Test-Path $sourceDir)) {
    Write-Log "Build directory not found at $sourceDir" "Red" "ERROR"
    exit 1
}
Write-Log "Build directory found at $sourceDir" "Green" "INFO"

# Step 3: Copy files to static directory
Write-Log "Step 3: Copying files to Flask static directory..." "Cyan" "INFO"
try {
    # Clear the destination directory first
    if (Test-Path $staticDestDir) {
        Remove-Item -Path "$staticDestDir\*" -Recurse -Force
        Write-Log "Cleared existing files in static directory" "Yellow" "INFO"
    }

    # Copy all files from build directory to static directory
    Copy-Item -Path "$sourceDir\*" -Destination $staticDestDir -Recurse -Force
    Write-Log "Files copied to static directory successfully" "Green" "INFO"
} catch {
    Write-Log "Error copying files to static directory: $_" "Red" "ERROR"
    exit 1
}

# Step 4: Create index.html in templates directory
Write-Log "Step 4: Creating index.html in templates directory..." "Cyan" "INFO"
try {
    # Create a simple index.html file that redirects to the static/index.html
    $indexHtmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/static/index.html">
    <title>Mashaaer Enhanced</title>
</head>
<body>
    <p>If you are not redirected automatically, follow this <a href="/static/index.html">link to the application</a>.</p>
</body>
</html>
"@

    # Write the content to index.html in templates directory
    $indexHtmlContent | Out-File -FilePath "$templatesDestDir\index.html" -Encoding utf8
    Write-Log "Created index.html in templates directory" "Green" "INFO"
} catch {
    Write-Log "Error creating index.html in templates directory: $_" "Red" "ERROR"
    exit 1
}

# Step 5: Create launch.html in templates directory (alternative entry point)
Write-Log "Step 5: Creating launch.html in templates directory..." "Cyan" "INFO"
try {
    # Create a launch.html file that loads the React application
    $launchHtmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mashaaer Enhanced</title>
    <link rel="stylesheet" href="/static/css/main.css">
</head>
<body>
    <div id="root"></div>
    <script>
        // Dynamically load the main JS file from static directory
        const script = document.createElement('script');
        script.src = '/static/js/main.js';
        document.body.appendChild(script);
    </script>
</body>
</html>
"@

    # Write the content to launch.html in templates directory
    $launchHtmlContent | Out-File -FilePath "$templatesDestDir\launch.html" -Encoding utf8
    Write-Log "Created launch.html in templates directory" "Green" "INFO"
} catch {
    Write-Log "Error creating launch.html in templates directory: $_" "Red" "ERROR"
    exit 1
}

Write-Log "Build and copy process completed successfully!" "Green" "INFO"
Write-Log "The React application has been built and copied to the Flask backend." "Green" "INFO"
Write-Log "You can now run the Flask application to serve the React frontend." "Green" "INFO"