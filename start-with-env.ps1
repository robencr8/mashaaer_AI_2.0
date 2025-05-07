# Set environment variables
$env:REACT_APP_API_BASE_URL = "http://localhost:5000"

# Display the set environment variables
Write-Host "Environment variables set:"
Write-Host "REACT_APP_API_BASE_URL=$env:REACT_APP_API_BASE_URL"

# Run the application
Write-Host "Starting the application..."
npm run start