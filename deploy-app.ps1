# PowerShell script to deploy the Mashaaer Enhanced Project to different platforms

function Show-Menu {
    Clear-Host
    Write-Host "Mashaaer Enhanced Project - Deployment Tool" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "This script will help you deploy the application to a platform." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please select a deployment platform:" -ForegroundColor Yellow
    Write-Host "1. Netlify"
    Write-Host "2. Vercel"
    Write-Host "3. GitHub Pages"
    Write-Host ""
    Write-Host "Enter your choice (1-3) or press Ctrl+C to cancel:" -ForegroundColor Yellow
}

function Check-Prerequisites {
    param (
        [string]$platform
    )
    
    switch ($platform) {
        "Netlify" {
            Write-Host "Checking Netlify CLI installation..." -ForegroundColor Cyan
            $netlifyInstalled = $null -ne (Get-Command netlify -ErrorAction SilentlyContinue)
            
            if (-not $netlifyInstalled) {
                Write-Host "Netlify CLI is not installed." -ForegroundColor Red
                Write-Host "Would you like to install it now? (Y/N)" -ForegroundColor Yellow
                $response = Read-Host
                
                if ($response -eq "Y" -or $response -eq "y") {
                    Write-Host "Installing Netlify CLI..." -ForegroundColor Green
                    npm install -g netlify-cli
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "Error installing Netlify CLI. Please install it manually with 'npm install -g netlify-cli'." -ForegroundColor Red
                        return $false
                    }
                } else {
                    Write-Host "Netlify CLI is required for deployment. Please install it manually with 'npm install -g netlify-cli'." -ForegroundColor Red
                    return $false
                }
            }
            
            Write-Host "Checking Netlify login status..." -ForegroundColor Cyan
            # This is a simple check and might not be 100% accurate
            $netlifyLoggedIn = (netlify status 2>&1) -match "Logged in"
            
            if (-not $netlifyLoggedIn) {
                Write-Host "You need to log in to Netlify." -ForegroundColor Red
                Write-Host "Would you like to log in now? (Y/N)" -ForegroundColor Yellow
                $response = Read-Host
                
                if ($response -eq "Y" -or $response -eq "y") {
                    Write-Host "Logging in to Netlify..." -ForegroundColor Green
                    netlify login
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "Error logging in to Netlify. Please log in manually with 'netlify login'." -ForegroundColor Red
                        return $false
                    }
                } else {
                    Write-Host "Netlify login is required for deployment. Please log in manually with 'netlify login'." -ForegroundColor Red
                    return $false
                }
            }
            
            return $true
        }
        "Vercel" {
            Write-Host "Checking Vercel CLI installation..." -ForegroundColor Cyan
            $vercelInstalled = $null -ne (Get-Command vercel -ErrorAction SilentlyContinue)
            
            if (-not $vercelInstalled) {
                Write-Host "Vercel CLI is not installed." -ForegroundColor Red
                Write-Host "Would you like to install it now? (Y/N)" -ForegroundColor Yellow
                $response = Read-Host
                
                if ($response -eq "Y" -or $response -eq "y") {
                    Write-Host "Installing Vercel CLI..." -ForegroundColor Green
                    npm install -g vercel
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "Error installing Vercel CLI. Please install it manually with 'npm install -g vercel'." -ForegroundColor Red
                        return $false
                    }
                } else {
                    Write-Host "Vercel CLI is required for deployment. Please install it manually with 'npm install -g vercel'." -ForegroundColor Red
                    return $false
                }
            }
            
            # Vercel login check is more complex, so we'll just prompt the user
            Write-Host "Make sure you're logged in to Vercel. If not, please run 'vercel login' in a separate terminal." -ForegroundColor Yellow
            Write-Host "Are you logged in to Vercel? (Y/N)" -ForegroundColor Yellow
            $response = Read-Host
            
            if ($response -eq "Y" -or $response -eq "y") {
                return $true
            } else {
                Write-Host "Please log in to Vercel with 'vercel login' and then run this script again." -ForegroundColor Red
                return $false
            }
        }
        "GitHub Pages" {
            Write-Host "Checking gh-pages package installation..." -ForegroundColor Cyan
            $packageJson = Get-Content -Path "package.json" -Raw | ConvertFrom-Json
            $ghPagesInstalled = $packageJson.devDependencies.PSObject.Properties.Name -contains "gh-pages"
            
            if (-not $ghPagesInstalled) {
                Write-Host "gh-pages package is not installed." -ForegroundColor Red
                Write-Host "Would you like to install it now? (Y/N)" -ForegroundColor Yellow
                $response = Read-Host
                
                if ($response -eq "Y" -or $response -eq "y") {
                    Write-Host "Installing gh-pages package..." -ForegroundColor Green
                    npm install --save-dev gh-pages
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "Error installing gh-pages package. Please install it manually with 'npm install --save-dev gh-pages'." -ForegroundColor Red
                        return $false
                    }
                } else {
                    Write-Host "gh-pages package is required for deployment. Please install it manually with 'npm install --save-dev gh-pages'." -ForegroundColor Red
                    return $false
                }
            }
            
            return $true
        }
    }
}

function Deploy-To-Platform {
    param (
        [string]$platform
    )
    
    Write-Host "Deploying to $platform..." -ForegroundColor Green
    
    switch ($platform) {
        "Netlify" {
            npm run deploy:netlify
        }
        "Vercel" {
            npm run deploy:vercel
        }
        "GitHub Pages" {
            npm run deploy:gh-pages
        }
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment to $platform completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Deployment to $platform failed. Please check the error messages above." -ForegroundColor Red
    }
}

# Main script
Show-Menu
$choice = Read-Host

switch ($choice) {
    "1" {
        $platform = "Netlify"
        if (Check-Prerequisites -platform $platform) {
            Deploy-To-Platform -platform $platform
        }
    }
    "2" {
        $platform = "Vercel"
        if (Check-Prerequisites -platform $platform) {
            Deploy-To-Platform -platform $platform
        }
    }
    "3" {
        $platform = "GitHub Pages"
        if (Check-Prerequisites -platform $platform) {
            Deploy-To-Platform -platform $platform
        }
    }
    default {
        Write-Host "Invalid choice. Please run the script again and select a valid option (1-3)." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")