@echo off
TASKKILL /FI "WINDOWTITLE eq web-morpher" /F
start "web-morpher" node test.js
exit