@echo off
TASKKILL /FI "WINDOWTITLE eq Web Morpher" /F
start "Web Morpher" node --harmony --harmony_typeof app.js