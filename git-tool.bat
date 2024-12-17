@echo off
chcp 65001>nul

rem Check Git installation
where git >nul 2>nul || (
    echo Error: Git not installed
    pause
    exit /b 1
)

rem Check Git repository
git rev-parse --git-dir >nul 2>nul || (
    echo Error: Not a Git repository
    pause
    exit /b 1
)

:menu
cls
echo ============================
echo    Git Tool v1.0.0
echo ============================
echo.
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set "current_branch=%%i"
echo Current Branch: %current_branch%
echo.
echo [1] Commit and Push
echo [2] Create Branch
echo [3] Switch Branch
echo [4] Exit
echo.
set /p choice=Select (1-4): 

if "%choice%"=="1" goto commit
if "%choice%"=="2" goto create_branch
if "%choice%"=="3" goto switch_branch
if "%choice%"=="4" exit /b 0
goto menu

:commit
echo.
echo Checking status...
git status -s
echo.

git diff --quiet --exit-code
if %errorlevel% equ 0 (
    git diff --cached --quiet --exit-code
    if %errorlevel% equ 0 (
        echo No changes to commit
        timeout /t 2 >nul
        goto menu
    )
)

git add .
set /p commit_msg=Enter commit message (or press Enter for 'update'): 
if "%commit_msg%"=="" set commit_msg=update

echo Committing changes...
git commit -m "%commit_msg%"

echo Pushing to remote...
rem Disable SSL verification
git config --global http.sslVerify false

git push origin %current_branch%
if %errorlevel% neq 0 (
    echo Push failed, retrying in 5 seconds...
    timeout /t 5 >nul
    git push origin %current_branch%
    if %errorlevel% neq 0 (
        echo Push failed
        rem Re-enable SSL verification
        git config --global http.sslVerify true
        timeout /t 2 >nul
        goto menu
    )
)

rem Re-enable SSL verification
git config --global http.sslVerify true
echo Changes pushed successfully
timeout /t 2 >nul
goto menu

:create_branch
echo.
set /p new_branch=Enter new branch name: 
if "%new_branch%"=="" (
    echo Branch name cannot be empty
    timeout /t 2 >nul
    goto menu
)

git checkout -b "%new_branch%"
if %errorlevel% neq 0 (
    echo Failed to create branch
    timeout /t 2 >nul
    goto menu
)

echo Branch created successfully
timeout /t 2 >nul
goto menu

:switch_branch
echo.
echo Available branches:
git branch
echo.
set /p branch=Enter branch name: 
if "%branch%"=="" (
    echo Branch name cannot be empty
    timeout /t 2 >nul
    goto menu
)

git checkout "%branch%"
if %errorlevel% neq 0 (
    echo Failed to switch branch
    timeout /t 2 >nul
    goto menu
)

echo Switched to branch %branch%
timeout /t 2 >nul
goto menu
