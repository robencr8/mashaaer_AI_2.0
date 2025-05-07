@echo off
echo Testing frontend startup with updated webpack configuration (CSP fix)...

:: Set the NODE_OPTIONS environment variable
set NODE_OPTIONS=--openssl-legacy-provider
echo NODE_OPTIONS set to: %NODE_OPTIONS%

:: Start the frontend in development mode
echo Starting frontend with source-map devtool (CSP-safe)...
npm start