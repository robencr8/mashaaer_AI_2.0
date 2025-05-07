# PowerShell script to fix react-dev-utils

Write-Host "Running fix for react-dev-utils..." -ForegroundColor Cyan
Write-Host ""

npm run fix:react-dev-utils

Write-Host ""
Write-Host "If the fix was successful, you can now try running the app with:" -ForegroundColor Green
Write-Host "npm start" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to exit"