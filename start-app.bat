@echo off
echo ===================================================
echo    Mashaaer Enhanced Project - Application Starter
echo ===================================================
echo.
echo Starting the Mashaaer Enhanced application...
echo.

REM Use the most comprehensive start script
if exist "%~dp0start-full.bat" (
    echo Using start-full.bat to start the application...
    call "%~dp0start-full.bat"
) else (
    echo start-full.bat not found, trying run.bat...
    if exist "%~dp0run.bat" (
        echo Using run.bat to start the application...
        call "%~dp0run.bat"
    ) else (
        echo run.bat not found, trying enhanced-start.bat...
        if exist "%~dp0enhanced-start.bat" (
            echo Using enhanced-start.bat to start the application...
            call "%~dp0enhanced-start.bat"
        ) else (
            echo enhanced-start.bat not found, trying start.bat...
            if exist "%~dp0start.bat" (
                echo Using start.bat to start the application...
                call "%~dp0start.bat"
            ) else (
                echo No start scripts found, using npm start...
                npm start
            )
        )
    )
)

echo.
echo If you encounter any issues, please check the log files in the project directory.
pause