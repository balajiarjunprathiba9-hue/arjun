@echo off
title DB Visualizer Launcher
color 0b

echo ========================================================
echo   Launching Interactive Database System Visualizer
echo ========================================================
echo.

set "PATH=C:\Program Files\nodejs;%PATH%"

echo [1/3] Starting Backend Server on http://localhost:5000 ...
start "DB Visualizer Backend" cmd /k "cd /d %~dp0backend && npm start"

echo [2/3] Starting Frontend Dev Server on http://localhost:5173 ...
start "DB Visualizer Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ========================================================
echo   Application is now running!
echo   Keep the two command windows open while using the app.
echo ========================================================
