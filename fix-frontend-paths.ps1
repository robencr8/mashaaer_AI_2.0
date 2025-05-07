# Fix Frontend Paths Script for Mashaaer Enhanced Project
# This script updates the launch.html template to reference the correct files with hashes

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Mashaaer Enhanced - Fix Frontend Paths Utility" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will update the launch.html template to reference the correct files with hashes." -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue or Ctrl+C to cancel..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 1: Find the CSS and JS files with hashes in the build directory
Write-Host ""
Write-Host "Step 1: Finding CSS and JS files with hashes..." -ForegroundColor Green

$cssFiles = Get-ChildItem -Path "build\static\css" -Filter "main.*.css" | Where-Object { $_.Name -match "main\.[a-f0-9]+\.css" }
$jsFiles = Get-ChildItem -Path "build\static\css" -Filter "main.*.js" | Where-Object { $_.Name -match "main\.[a-f0-9]+\.js" }

# If no CSS or JS files were found in the build directory, check the backend/static directory
if (-not $cssFiles -or -not $jsFiles) {
    Write-Host "No CSS or JS files found in build directory. Checking backend/static directory..." -ForegroundColor Yellow
    $cssFiles = Get-ChildItem -Path "backend\static\static\css" -Filter "main.*.css" | Where-Object { $_.Name -match "main\.[a-f0-9]+\.css" }
    $jsFiles = Get-ChildItem -Path "backend\static\static\js" -Filter "main.*.js" | Where-Object { $_.Name -match "main\.[a-f0-9]+\.js" }
}

# If still no CSS or JS files were found, check the index.html file for the filenames
if (-not $cssFiles -or -not $jsFiles) {
    Write-Host "No CSS or JS files found in directories. Extracting filenames from index.html..." -ForegroundColor Yellow
    $indexHtml = Get-Content -Path "backend\static\index.html" -Raw
    
    $cssMatch = $indexHtml | Select-String -Pattern 'href="/static/css/main\.([a-f0-9]+)\.css"' -AllMatches
    $jsMatch = $indexHtml | Select-String -Pattern 'src="/static/js/main\.([a-f0-9]+)\.js"' -AllMatches
    
    if ($cssMatch.Matches.Count -gt 0) {
        $cssHash = $cssMatch.Matches[0].Groups[1].Value
        $cssFilename = "main.$cssHash.css"
        Write-Host "Found CSS filename in index.html: $cssFilename" -ForegroundColor Green
    } else {
        Write-Host "Error: Could not find CSS filename in index.html." -ForegroundColor Red
        exit 1
    }
    
    if ($jsMatch.Matches.Count -gt 0) {
        $jsHash = $jsMatch.Matches[0].Groups[1].Value
        $jsFilename = "main.$jsHash.js"
        Write-Host "Found JS filename in index.html: $jsFilename" -ForegroundColor Green
    } else {
        Write-Host "Error: Could not find JS filename in index.html." -ForegroundColor Red
        exit 1
    }
} else {
    $cssFilename = $cssFiles[0].Name
    $jsFilename = $jsFiles[0].Name
    Write-Host "Found CSS file: $cssFilename" -ForegroundColor Green
    Write-Host "Found JS file: $jsFilename" -ForegroundColor Green
}

# Step 2: Update the launch.html template
Write-Host ""
Write-Host "Step 2: Updating launch.html template..." -ForegroundColor Green

$launchHtmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mashaaer Enhanced</title>
    <link rel="stylesheet" href="/static/static/css/$cssFilename">
</head>
<body>
    <div id="root"></div>
    <script src="/static/cosmic-theme.js"></script>
    <script src="/static/static/js/$jsFilename"></script>
</body>
</html>
"@

try {
    $launchHtmlContent | Out-File -FilePath "backend\templates\launch.html" -Encoding utf8
    Write-Host "Updated launch.html template successfully." -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to update launch.html template." -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Success! The launch.html template has been updated." -ForegroundColor Green
Write-Host ""
Write-Host "To run the application:" -ForegroundColor White
Write-Host "1. Open a command prompt" -ForegroundColor White
Write-Host "2. Navigate to the backend directory: cd backend" -ForegroundColor White
Write-Host "3. Run the Flask application: python app.py" -ForegroundColor White
Write-Host "4. Open your browser and go to: http://127.0.0.1:5000/launch" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")