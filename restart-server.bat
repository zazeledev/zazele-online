
@echo off
echo --- Restarting Zazele Online Backend ---

echo 1. Killing any process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a 2>NUL

echo 2. Starting backend with nodemon...
cd backend
start cmd /k "npm run dev"
cd ..

echo Backend start command issued.
echo Wait a few seconds then run diagnostic.bat to verify.
pause
