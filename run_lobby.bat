@echo off
setlocal EnableDelayedExpansion

rem === 设置代码页 ===
chcp 65001>nul
cls

rem === 修复管理员权限检查 ===
net session >nul 2>&1
if !errorlevel! equ 0 (
    goto :menu
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

rem === 修复菜单部分 ===
:menu
cls
echo ======================================
echo            Luna Game Lobby
echo            启动模式选择
echo ======================================
echo 1. 开发模式 (清理依赖 + npm run dev^)
echo 2. 预览模式 (清理依赖 + npm run preview^)
echo 3. 快速开发模式 (保留依赖 + npm run dev^)
echo 4. 快速预览模式 (保留依赖 + npm run preview^)
echo 5. 完整构建模式 (clean + build + preview^)
echo 6. 依赖检查模式 (检查并更新依赖^)
echo 7. 语言文件同步 (同步多语言文件^)
echo 0. 退出程序
echo ======================================

rem === 修复选择逻辑 ===
choice /c 012345678 /n /m "请选择选项 (0-7): "
set "choice_result=!errorlevel!"

rem === 添加命令执行调试 ===
echo [DEBUG] 等待用户输入...
choice /c 012345678 /n /m "请选择选项 (0-7): " >nul 2>&1
set choice_result=%errorlevel%
echo [DEBUG] 用户选择: %choice_result%
set /a choice_result-=1
echo [DEBUG] 调整后的模式: %choice_result%

if %choice_result% equ 0 goto :exitprogram
if %choice_result% equ 1 goto :dev
if %choice_result% equ 2 goto :preview
if %choice_result% equ 3 goto :quickdev
if %choice_result% equ 4 goto :quickpreview
if %choice_result% equ 5 goto :fullbuild
if %choice_result% equ 6 goto :checkdeps
if %choice_result% equ 7 goto :synclang
goto :menu

:dev
echo 正在以开发模式启动...
:: 清理依赖
if exist "node_modules" (
    echo 清理 node_modules...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo 清理 package-lock.json...
    del /f /q package-lock.json
)

echo 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 依赖安装失败
    pause
    exit /b 1
)

:: 启动开发服务器
echo 启动开发服务器...
call npm run dev
goto :end

:preview
echo 正在以预览模式启动...
:: 清理依赖
if exist "node_modules" (
    echo 清理 node_modules...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo 清理 package-lock.json...
    del /f /q package-lock.json
)

:: 安装依赖
echo 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 依赖安装失败
    pause
    exit /b 1
)

:: 构建并预览
echo 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败
    pause
    exit /b 1
)

echo 启动预览服务器...
call npm run preview
goto :end

:quickdev
echo 快速启动开发模式...
if not exist "node_modules" (
    echo 安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo 依赖安装失败
        pause
        exit /b 1
    )
)

echo 启动开发服务器...
call npm run dev
goto :end

:quickpreview
echo 快速启动预览模式...
if not exist "node_modules" (
    echo 安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo 依赖安装失败
        pause
        exit /b 1
    )
)

echo 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败
    pause
    exit /b 1
)

echo 启动预览服务器...
call npm run preview
goto :end

:fullbuild
echo 执行完整构建...
call npm run clean
if %errorlevel% neq 0 (
    echo 清理失败
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo 构建失败
    pause
    exit /b 1
)

echo 启动预览服务器...
call npm run preview
goto :end

:checkdeps
echo 检查依赖更新...
call npm outdated
echo.
choice /c yn /n /m "是否更新依赖? (Y/N): "
if %errorlevel% equ 2 goto :menu
call npm update
echo 依赖更新完成
pause
goto :menu

:synclang
echo 同步多语言文件...
:: 检查 i18next-scanner 是否安装
if not exist "node_modules/i18next-scanner" (
    echo 安装 i18next-scanner...
    call npm install --save-dev i18next-scanner
)
:: 运行语言文件扫描
call npx i18next-scanner --config i18next-scanner.config.js
echo 多语言文件同步完成
pause
goto :menu

:exitprogram
echo 正在退出...
exit /b 0

:end
echo.
echo 操作完成
pause
goto :menu

