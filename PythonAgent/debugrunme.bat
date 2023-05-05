CLS
ECHO.
ECHO =============================
ECHO Running Client.py
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

python C:\Users\tgree\source\repos\MemoryLibrary\PythonAgent\client.py --host 127.0.0.1 --port 3001 --debug
