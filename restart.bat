@echo off
TASKKILL /FI "WINDOWTITLE eq web-morpher" /F
start "web-morpher" node app.js