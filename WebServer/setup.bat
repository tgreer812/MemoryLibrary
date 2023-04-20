@echo off
echo Creating symbolic link for shared directory...
mklink /D client\src\shared ..\..\shared

echo Installing server dependencies...
npm install

echo Installing client dependencies...
cd client && npm install