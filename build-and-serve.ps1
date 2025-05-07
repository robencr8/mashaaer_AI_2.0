# Set environment variables
$env:REACT_APP_API_BASE_URL = "http://localhost:5000"

# Display the set environment variables
Write-Host "Environment variables set:"
Write-Host "REACT_APP_API_BASE_URL=$env:REACT_APP_API_BASE_URL"

# Build the application
Write-Host "Building the application..."
npm run build

# Check if build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed with error code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Serve the built application
Write-Host ""
Write-Host "Build complete. Starting server on port 4000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server."
Write-Host ""
serve -s build -l 4000