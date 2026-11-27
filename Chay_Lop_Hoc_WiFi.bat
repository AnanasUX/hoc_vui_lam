@echo off
chcp 65001 >nul
echo Dang khoi dong may chu Lop Hoc Wi-Fi (Hoc Thong Minh)...
start "" http://localhost:8765/room.html
python lan_server.py
pause
