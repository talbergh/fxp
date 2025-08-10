@echo off
:: FXP CLI - Windows Installation Script
:: Author: talbergh
:: Repository: https://github.com/talbergh/fxp

setlocal enabledelayedexpansion

set "REPO=talbergh/fxp"
set "INSTALL_DIR=%LOCALAPPDATA%\fxp"
set "BINARY_NAME=fxp.exe"

echo.
echo 🚀 FXP CLI Installation
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📦 Installing FXP CLI for Windows...
echo 📁 Install directory: %INSTALL_DIR%
echo.

:: Create install directory
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Download latest release
echo 📥 Downloading latest release...
set "DOWNLOAD_URL=https://github.com/%REPO%/releases/latest/download/fxp-win.exe"

:: Use PowerShell to download
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%INSTALL_DIR%\%BINARY_NAME%'}"

if not exist "%INSTALL_DIR%\%BINARY_NAME%" (
    echo ❌ Download failed. Please check your internet connection.
    pause
    exit /b 1
)

:: Add to PATH
echo ⚠️  Adding %INSTALL_DIR% to PATH...
setx PATH "%PATH%;%INSTALL_DIR%" >nul 2>&1

echo.
echo ✅ FXP CLI installed successfully!
echo.
echo 🚀 Quick Start:
echo    fxp create my-resource
echo    fxp list
echo    fxp --help
echo.
echo 📚 Documentation:
echo    https://github.com/%REPO%
echo.
echo 💡 Restart your terminal to use the 'fxp' command
echo.

:: Test installation
echo 🎉 Installation complete! Testing...
"%INSTALL_DIR%\%BINARY_NAME%" --version

echo.
echo Happy modding! 🎮
pause
