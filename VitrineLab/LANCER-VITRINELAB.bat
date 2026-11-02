@echo off
cd /d "%~dp0"
echo Demarrage de VitrineLab...
start "" http://localhost:8000/index.html
python -m http.server 8000
pause
