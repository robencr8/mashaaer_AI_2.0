@echo off
echo Testing frontend startup with updated webpack configuration...

:: Set the NODE_OPTIONS environment variable
set NODE_OPTIONS=--openssl-legacy-provider
echo NODE_OPTIONS set to: %NODE_OPTIONS%

:: Start the frontend in development mode
echo Starting frontend...
npm start