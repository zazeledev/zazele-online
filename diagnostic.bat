
@echo off
echo --- Zazele Online System Diagnostics ---
echo.

echo 1. Checking Node.js processes...
tasklist /FI "IMAGENAME eq node.exe"
echo.

echo 2. Checking port 5000...
netstat -ano | findstr :5000
echo.

echo 3. Checking Backend Health...
powershell -Command "try { Invoke-RestMethod -Uri http://localhost:5000/api/health | ConvertTo-Json } catch { echo $_.Exception.Message }"
echo.

echo 4. Checking MongoDB connection (via debug-system.js)...
cd backend
node debug-system.js
cd ..
echo.

echo --- Diagnostics Complete ---
pause
