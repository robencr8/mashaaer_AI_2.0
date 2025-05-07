@echo off
echo Packaging Electron App...
echo.
echo This script will:
echo - Build the React application
echo - Install Electron dependencies
echo - Package the application for Windows
echo - Create an installer and portable version
echo.
echo The output will be in:
echo - packaging/electron/dist/win-unpacked (portable version)
echo - packaging/electron/dist/MashaaerEnhanced-Setup-1.0.0.exe (installer)
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

npm run package:electron

echo.
echo If the packaging was successful, you can find the output in:
echo - packaging/electron/dist/win-unpacked (portable version)
echo - packaging/electron/dist/MashaaerEnhanced-Setup-1.0.0.exe (installer)
echo.
echo Press any key to exit...
pause > nul