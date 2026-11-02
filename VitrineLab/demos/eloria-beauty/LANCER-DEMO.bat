@echo off
cd /d "%~dp0"
echo Demarrage de la boutique de demonstration ELORIA BEAUTY...
start "" http://localhost:8000/index.html
python -m http.server 8000
pause
