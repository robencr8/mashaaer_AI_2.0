# Fix for MODULE_NOT_FOUND Error Related to Lodash
# This script addresses the error that occurs when lodash modules cannot be found
# Common with Node.js v22+ and react-scripts/html-webpack-plugin

# Set console colors for better readability
$infoColor = "Cyan"
$successColor = "Green"
$warningColor = "Yellow"
$errorColor = "Red"
$highlightColor = "Magenta"

Write-Host "=======================================================" -ForegroundColor $highlightColor
Write-Host "  Mashaaer Enhanced - Fix for MODULE_NOT_FOUND Error" -ForegroundColor $highlightColor
Write-Host "=======================================================" -ForegroundColor $highlightColor
Write-Host ""

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    return $exists
}

# Function to get Node.js version
function Get-NodeVersion {
    try {
        $versionOutput = node --version
        if ($versionOutput -match "v(\d+)\.(\d+)\.(\d+)") {
            $major = [int]$Matches[1]
            $minor = [int]$Matches[2]
            $patch = [int]$Matches[3]
            return @{
                Major = $major
                Minor = $minor
                Patch = $patch
                FullVersion = "v$major.$minor.$patch"
                IsCompatible = ($major -lt 22)
            }
        }
        return $null
    } catch {
        Write-Host "Error getting Node.js version: $_" -ForegroundColor $errorColor
        return $null
    }
}

# Function to check if nvm is installed
function Test-NvmInstalled {
    try {
        $nvmOutput = nvm version 2>&1
        return -not ($nvmOutput -match "not recognized" -or $nvmOutput -match "not found")
    } catch {
        return $false
    }
}

# Step 1: Check Node.js version
Write-Host "Step 1: Checking Node.js version..." -ForegroundColor $infoColor

if (-not (Test-CommandExists "node")) {
    Write-Host "❌ Node.js is not installed or not in PATH." -ForegroundColor $errorColor
    Write-Host "   Please install Node.js from https://nodejs.org/ and try again." -ForegroundColor $errorColor
    exit 1
}

$nodeVersion = Get-NodeVersion
if ($null -eq $nodeVersion) {
    Write-Host "❌ Could not determine Node.js version." -ForegroundColor $errorColor
    Write-Host "   Continuing with cleanup process anyway..." -ForegroundColor $warningColor
} else {
    Write-Host "Detected Node.js $($nodeVersion.FullVersion)" -ForegroundColor $infoColor
    
    if (-not $nodeVersion.IsCompatible) {
        Write-Host "⚠️ You are using Node.js $($nodeVersion.FullVersion), which may cause compatibility issues." -ForegroundColor $warningColor
        Write-Host "   This version is known to cause MODULE_NOT_FOUND errors with lodash and other packages." -ForegroundColor $warningColor
        
        $nvmInstalled = Test-NvmInstalled
        if ($nvmInstalled) {
            Write-Host "✅ NVM (Node Version Manager) is installed on your system." -ForegroundColor $successColor
            $switchVersion = Read-Host "Would you like to switch to Node.js v20.11.1 (recommended)? (y/n)"
            
            if ($switchVersion -eq "y" -or $switchVersion -eq "Y") {
                Write-Host "Switching to Node.js v20.11.1..." -ForegroundColor $infoColor
                nvm install 20.11.1
                nvm use 20.11.1
                
                # Verify the switch
                $newNodeVersion = Get-NodeVersion
                if ($null -ne $newNodeVersion -and $newNodeVersion.Major -eq 20) {
                    Write-Host "✅ Successfully switched to Node.js $($newNodeVersion.FullVersion)" -ForegroundColor $successColor
                } else {
                    Write-Host "❌ Failed to switch Node.js version. Continuing with cleanup process..." -ForegroundColor $errorColor
                }
            } else {
                Write-Host "Continuing with current Node.js version..." -ForegroundColor $warningColor
                Write-Host "Note: If cleanup doesn't resolve the issue, consider downgrading Node.js." -ForegroundColor $warningColor
            }
        } else {
            Write-Host "NVM (Node Version Manager) is not installed on your system." -ForegroundColor $warningColor
            Write-Host "To install a compatible Node.js version:" -ForegroundColor $infoColor
            Write-Host "1. Visit https://nodejs.org/en/download/releases/" -ForegroundColor $infoColor
            Write-Host "2. Download and install Node.js v20.11.1 (LTS) or v18.18.2 (LTS)" -ForegroundColor $infoColor
            Write-Host "3. Run this script again after installing a compatible version" -ForegroundColor $infoColor
            
            $continueAnyway = Read-Host "Would you like to continue with the cleanup process anyway? (y/n)"
            if ($continueAnyway -ne "y" -and $continueAnyway -ne "Y") {
                exit 0
            }
        }
    } else {
        Write-Host "✅ Your Node.js version is compatible." -ForegroundColor $successColor
    }
}

# Step 2: Clean node_modules and package-lock.json
Write-Host ""
Write-Host "Step 2: Cleaning node_modules and package-lock.json..." -ForegroundColor $infoColor

Write-Host "Removing node_modules directory..." -ForegroundColor $infoColor
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Removing package-lock.json file..." -ForegroundColor $infoColor
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# Step 3: Clear npm cache
Write-Host ""
Write-Host "Step 3: Clearing npm cache..." -ForegroundColor $infoColor
npm cache clean --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Warning: npm cache clean command failed, but continuing..." -ForegroundColor $warningColor
}

# Step 4: Reinstall dependencies
Write-Host ""
Write-Host "Step 4: Reinstalling dependencies..." -ForegroundColor $infoColor
Write-Host "This may take several minutes. Please be patient..." -ForegroundColor $infoColor

# Set NODE_OPTIONS environment variable to handle legacy OpenSSL issues
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Install with legacy-peer-deps flag
npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed. Trying with additional flags..." -ForegroundColor $errorColor
    
    # Try with additional flags
    npm install --legacy-peer-deps --no-fund --no-audit
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed again. Trying one more approach..." -ForegroundColor $errorColor
        
        # Try installing critical packages first
        npm install react react-dom react-scripts --legacy-peer-deps --no-fund --no-audit
        npm install --legacy-peer-deps --no-fund --no-audit
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ All installation attempts failed." -ForegroundColor $errorColor
            Write-Host "   Please try manually running: npm install --legacy-peer-deps" -ForegroundColor $errorColor
            exit 1
        }
    }
}

# Step 5: Verify the installation
Write-Host ""
Write-Host "Step 5: Verifying the installation..." -ForegroundColor $infoColor

$criticalPackages = @(
    "lodash",
    "react-scripts",
    "html-webpack-plugin",
    "webpack",
    "react",
    "react-dom"
)

$missingPackages = @()

foreach ($package in $criticalPackages) {
    if (-not (Test-Path "node_modules\$package")) {
        $missingPackages += $package
    }
}

if ($missingPackages.Count -gt 0) {
    Write-Host "❌ The following critical packages are missing:" -ForegroundColor $errorColor
    foreach ($package in $missingPackages) {
        Write-Host "   - $package" -ForegroundColor $errorColor
    }
    
    Write-Host ""
    Write-Host "Attempting to install missing packages individually..." -ForegroundColor $warningColor
    
    foreach ($package in $missingPackages) {
        Write-Host "Installing $package..." -ForegroundColor $infoColor
        npm install $package --legacy-peer-deps --no-fund --no-audit
    }
    
    # Check again after individual installation
    $stillMissing = @()
    foreach ($package in $missingPackages) {
        if (-not (Test-Path "node_modules\$package")) {
            $stillMissing += $package
        }
    }
    
    if ($stillMissing.Count -gt 0) {
        Write-Host "❌ Some packages are still missing after individual installation:" -ForegroundColor $errorColor
        foreach ($package in $stillMissing) {
            Write-Host "   - $package" -ForegroundColor $errorColor
        }
        Write-Host "You may need to manually resolve these issues." -ForegroundColor $errorColor
    } else {
        Write-Host "✅ All missing packages were successfully installed." -ForegroundColor $successColor
    }
} else {
    Write-Host "✅ All critical packages are installed." -ForegroundColor $successColor
}

# Step 6: Check for lodash modules specifically
Write-Host ""
Write-Host "Step 6: Checking for lodash modules..." -ForegroundColor $infoColor

$lodashModules = @(
    "_baseIsNative",
    "_getNative",
    "_root",
    "isObject",
    "now"
)

$missingLodashModules = @()

foreach ($module in $lodashModules) {
    $modulePath = "node_modules\lodash\$module.js"
    if (-not (Test-Path $modulePath)) {
        $missingLodashModules += $module
    }
}

if ($missingLodashModules.Count -gt 0) {
    Write-Host "❌ The following lodash modules are missing:" -ForegroundColor $errorColor
    foreach ($module in $missingLodashModules) {
        Write-Host "   - $module" -ForegroundColor $errorColor
    }
    
    Write-Host ""
    Write-Host "Attempting to reinstall lodash specifically..." -ForegroundColor $warningColor
    npm uninstall lodash
    npm install lodash@latest --legacy-peer-deps --no-fund --no-audit
    
    # Check again after reinstallation
    $stillMissingLodash = @()
    foreach ($module in $missingLodashModules) {
        $modulePath = "node_modules\lodash\$module.js"
        if (-not (Test-Path $modulePath)) {
            $stillMissingLodash += $module
        }
    }
    
    if ($stillMissingLodash.Count -gt 0) {
        Write-Host "❌ Some lodash modules are still missing after reinstallation." -ForegroundColor $errorColor
        Write-Host "   This may indicate a deeper compatibility issue with your Node.js version." -ForegroundColor $errorColor
        
        if ($nodeVersion -and -not $nodeVersion.IsCompatible) {
            Write-Host "   We strongly recommend downgrading to Node.js v20.11.1 or v18.18.2." -ForegroundColor $errorColor
        }
    } else {
        Write-Host "✅ All lodash modules are now present." -ForegroundColor $successColor
    }
} else {
    Write-Host "✅ All required lodash modules are present." -ForegroundColor $successColor
}

# Final summary
Write-Host ""
Write-Host "=======================================================" -ForegroundColor $highlightColor
Write-Host "                  Fix Process Complete" -ForegroundColor $highlightColor
Write-Host "=======================================================" -ForegroundColor $highlightColor
Write-Host ""

if ($nodeVersion -and -not $nodeVersion.IsCompatible) {
    Write-Host "⚠️ IMPORTANT: You are still using Node.js $($nodeVersion.FullVersion)" -ForegroundColor $warningColor
    Write-Host "   If you continue to experience MODULE_NOT_FOUND errors, please consider:" -ForegroundColor $warningColor
    Write-Host "   1. Downgrading to Node.js v20.11.1 or v18.18.2 (recommended)" -ForegroundColor $warningColor
    Write-Host "   2. Using the project's Docker setup if available" -ForegroundColor $warningColor
}

Write-Host "To start the application, run one of the following commands:" -ForegroundColor $infoColor
Write-Host "   npm start" -ForegroundColor $infoColor
Write-Host "   npm run dev" -ForegroundColor $infoColor
Write-Host "   .\start-app.bat" -ForegroundColor $infoColor
Write-Host ""
Write-Host "If you still encounter issues, please refer to the troubleshooting" -ForegroundColor $infoColor
Write-Host "section in the README.md file or contact the project maintainers." -ForegroundColor $infoColor
Write-Host ""