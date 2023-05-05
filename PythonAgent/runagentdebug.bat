@echo off
CLS
ECHO.
ECHO =============================
ECHO Running Batch File As Admin
ECHO =============================

:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
   goto :continue
) else (
   echo You must run this script as an administrator!
   echo.
   pause
   exit /b
)

:: Batch file commands go here
:continue


python C:\Users\tgree\source\repos\MemoryLibrary\PythonAgent\agent.py --scan --pid 27432 --value-type "int" --value 27432 --start-address 65536 --end-address 140737488355327 --max-found 100000 --alignment 4
pause
