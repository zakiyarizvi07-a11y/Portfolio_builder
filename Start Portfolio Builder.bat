@echo off
setlocal
cd /d "%~dp0"
title Portfolio Builder - Localhost

echo.
echo  =============================================
echo   Portfolio Builder - Starting Local Server
echo  =============================================
echo.

:: 1. Locate Node.js (system PATH first, then local .npm-bootstrap)
set "NODE_EXE="
where node >nul 2>&1
if %errorlevel%==0 (
  for /f "delims=" %%I in ('where node') do (
    if not defined NODE_EXE set "NODE_EXE=%%I"
  )
) else if exist "%~dp0.npm-bootstrap\node.exe" (
  set "NODE_EXE=%~dp0.npm-bootstrap\node.exe"
  set "PATH=%~dp0.npm-bootstrap;%PATH%"
)

if not defined NODE_EXE (
  echo  [ERROR] Node.js was not found on this computer.
  echo  Please install Node.js v18+ from https://nodejs.org/ and try again.
  echo.
  pause
  exit /b 1
)

:: 2. Install dependencies automatically if node_modules is missing
if not exist "%~dp0node_modules\vite\bin\vite.js" (
  echo  Installing dependencies for the first time...
  where npm >nul 2>&1
  if %errorlevel%==0 (
    call npm install
  ) else if exist "%~dp0.npm-bootstrap\npm-extracted\package\bin\npm-cli.js" (
    "%NODE_EXE%" "%~dp0.npm-bootstrap\npm-extracted\package\bin\npm-cli.js" install
  ) else (
    echo  [ERROR] npm was not found to install dependencies.
    pause
    exit /b 1
  )
  if errorlevel 1 (
    echo.
    echo  [ERROR] Failed to install dependencies.
    pause
    exit /b 1
  )
)

:: 3. Start Vite dev server and automatically open the localhost URL in default browser
echo  Opening Portfolio Builder in your browser...
echo  Keep this window open while using the app. Press Ctrl+C to stop.
echo.

"%NODE_EXE%" "%~dp0node_modules\vite\bin\vite.js" --open
if errorlevel 1 (
  echo.
  echo  [ERROR] The server stopped unexpectedly.
  pause
)
