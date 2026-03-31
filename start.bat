@echo off
echo Starting Jordan Heritage Website...
echo.
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed.
    echo Please download and install it from: https://nodejs.org
    echo Choose the "LTS" version, install it, then run this file again.
    pause
    exit /b
)
node server.js
pause
