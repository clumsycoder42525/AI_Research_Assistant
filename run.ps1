# Vedanta AI Research Assistant - Single Command Startup Script

Write-Host "`n====================================================" -ForegroundColor Cyan
Write-Host "   Vedanta AI Research Assistant - Starting Up" -ForegroundColor Cyan
Write-Host "====================================================`n" -ForegroundColor Cyan

# 1. Check for Virtual Environment
if (!(Test-Path "venv\Scripts\Activate.ps1")) {
    Write-Host "[!] Virtual environment (venv) is missing or corrupted." -ForegroundColor Yellow
    Write-Host "[*] Creating a new virtual environment..." -ForegroundColor Gray
    if (Test-Path "venv") { Remove-Item -Recurse -Force venv }
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[X] Failed to create venv. Please ensure Python is installed." -ForegroundColor Red
        exit
    }
}

# 2. Install/Update Backend Dependencies
Write-Host "[*] Updating backend dependencies..." -ForegroundColor Gray
Start-Process powershell -Wait -NoNewWindow -ArgumentList "-Command", "& .\venv\Scripts\Activate.ps1; pip install -r backend/requirements.txt"

# 3. Check Frontend Dependencies
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "[!] Frontend node_modules missing. Installing dependencies..." -ForegroundColor Yellow
    Start-Process powershell -Wait -NoNewWindow -ArgumentList "-Command", "cd frontend; npm install"
}

# 4. Start Services
Write-Host "`n[*] Launching services in separate windows..." -ForegroundColor Cyan

# Start Backend
$backendCommand = "& ../venv/Scripts/Activate.ps1; uvicorn app.main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- BACKEND SERVER ---' -ForegroundColor Yellow; cd backend; $backendCommand"

# Start Frontend
$frontendCommand = "npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- FRONTEND SERVER ---' -ForegroundColor Green; cd frontend; $frontendCommand"

Write-Host "`n[SUCCESS] Both services are starting!" -ForegroundColor Green
Write-Host "----------------------------------------------------"
Write-Host "Backend API:    http://localhost:8000" -ForegroundColor Gray
Write-Host "Frontend App:   http://localhost:5173" -ForegroundColor Gray
Write-Host "----------------------------------------------------"
Write-Host "Keep this window open or close it as you wish.`n"
