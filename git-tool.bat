@echo off
chcp 65001>nul
setlocal EnableDelayedExpansion

rem Check Git installation
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git not installed
    pause
    exit /b 1
)

rem Check Git repository
git rev-parse --git-dir >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Not a Git repository
    pause
    exit /b 1
)

:menu
cls
echo ============================
echo    Git Tool v1.1.10
echo ============================
echo.
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set "current_branch=%%i"
echo Current Branch: %current_branch%
echo.
echo [1] Commit and Push
echo [2] Create Branch
echo [3] Switch Branch
echo [4] Pull from Remote
echo [5] Force Push to Remote
echo [6] Exit
echo.
set /p choice=Select (1-6): 

if "%choice%"=="1" goto commit
if "%choice%"=="2" goto create_branch
if "%choice%"=="3" goto switch_branch
if "%choice%"=="4" goto pull
if "%choice%"=="5" goto force_push
if "%choice%"=="6" exit /b 0
goto menu

:commit
echo.
echo Checking status...
git status -s
echo.

echo Checking for sensitive information...
git diff --cached | findstr /I "private_key api_key secret credential password token" >nul
if %ERRORLEVEL% EQU 0 (
    echo Warning: Potential sensitive information detected!
    echo The following options are available:
    echo [1] Continue with push (Not recommended)
    echo [2] Review changes
    echo [3] Cancel
    set /p "sensitive_choice=Select option (1-3): "

    if "!sensitive_choice!"=="1" (
        echo Proceeding with push...
    ) else if "!sensitive_choice!"=="2" (
        git diff --cached
        echo.
        set /p "continue_choice=Continue with push? (y/N): "
        if /I not "!continue_choice!"=="y" goto menu
    ) else (
        goto menu
    )
)

git add .
set /p "commit_msg=Enter commit message (or press Enter for 'update'): "
if "%commit_msg%"=="" set commit_msg=update

echo Committing changes...
git commit -m "%commit_msg%"

:push_changes
echo Pushing to remote...
git config --global http.sslVerify false

git push origin %current_branch%
if %ERRORLEVEL% NEQ 0 (
    echo Push failed. Checking for security warnings...
    
    git push origin %current_branch% 2>&1 | findstr /I "secret-scanning push-protection" >nul
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo GitHub detected sensitive information in your commits.
        echo Options:
        echo [1] Visit security settings page
        echo [2] Remove sensitive information
        echo [3] Cancel push
        set /p "security_choice=Select option (1-3): "

        if "!security_choice!"=="1" (
            start https://github.com/gameloft333/luna-game-lobby-1213/settings/security_analysis
            echo Please review security settings and try again.
        ) else if "!security_choice!"=="2" (
            echo Please remove sensitive information and commit again.
        )
        goto menu
    ) else (
        echo Retrying push in 5 seconds...
        timeout /t 5 >nul
        goto push_changes
    )
)

git config --global http.sslVerify true
echo Changes pushed successfully
timeout /t 2 >nul
goto menu

:create_branch
echo.
set /p "new_branch=Enter new branch name: "
if "%new_branch%"=="" (
    echo Branch name cannot be empty
    timeout /t 2 >nul
    goto menu
)

git checkout -b "%new_branch%"
if %ERRORLEVEL% NEQ 0 (
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
set /p "branch=Enter branch name: "
if "%branch%"=="" (
    echo Branch name cannot be empty
    timeout /t 2 >nul
    goto menu
)

git checkout "%branch%"
if %ERRORLEVEL% NEQ 0 (
    echo Failed to switch branch
    timeout /t 2 >nul
    goto menu
)

echo Switched to branch %branch%
timeout /t 2 >nul
goto menu

:pull
echo Pulling from remote...
git pull origin %current_branch%
if %ERRORLEVEL% NEQ 0 (
    echo Pull failed
    timeout /t 2 >nul
    goto menu
)
echo Pull successful
timeout /t 2 >nul
goto menu

:force_push
echo Force pushing to remote...
git config --global http.sslVerify false

git push --force-with-lease origin %current_branch%
if %ERRORLEVEL% NEQ 0 (
    echo Push failed, retrying in 5 seconds...
    timeout /t 5 >nul
    git push --force-with-lease origin %current_branch%
    if %ERRORLEVEL% NEQ 0 (
        echo Push failed
        git config --global http.sslVerify true
        timeout /t 2 >nul
        goto menu
    )
)

git config --global http.sslVerify true
echo Changes pushed successfully
timeout /t 2 >nul
goto menu
