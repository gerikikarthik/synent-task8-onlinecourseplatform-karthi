@echo off
title MERN Project Starter

echo Starting Backend...
start cmd /k "cd server && npm run dev"

timeout /t 3 >nul

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

timeout /t 5 >nul

start http://localhost:5173