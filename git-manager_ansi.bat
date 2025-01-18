@echo off
rem ���ô���ҳΪ UTF-8
chcp 65001 >nul
rem ���ÿ���̨����Ϊ Consolas �� ������
reg add "HKEY_CURRENT_USER\Console" /v "FaceName" /t REG_SZ /d "Consolas" /f >nul
rem �����ӳٱ�����չ
setlocal EnableDelayedExpansion

rem �汾��Ϣ
set VERSION=1.0.1

rem ��ɫ����
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set NC=[0m

rem �˵�ѡ��
set "MENU_TITLE=Git ���������"
set "MENU_CURRENT=��ǰ��֧"
set "MENU_1=1) �ύ����ǰ��֧"
set "MENU_2=2) �����·�֧"
set "MENU_3=3) �л���֧"
set "MENU_4=4) �ϲ�������֧"
set "MENU_5=5) �˳�"
set "MENU_CHOICE=��ѡ����� (1-5): "

rem ���Git
where git >nul 2>nul || (
    echo %RED%Gitδ��װ%NC%
    pause
    exit /b 1
)

rem ���ֿ�
if not exist ".git" (
    echo %RED%��ǰĿ¼����Git�ֿ�%NC%
    pause
    exit /b 1
)

:menu
cls
echo === %MENU_TITLE% v%VERSION% ===
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set current_branch=%%i
echo %MENU_CURRENT%: %current_branch%
echo %MENU_1%
echo %MENU_2%
echo %MENU_3%
echo %MENU_4%
echo %MENU_5%
echo ==========================

choice /c 12345 /n /m "%MENU_CHOICE%"
set choice=%errorlevel%

if %choice%==1 (
    call :do_commit "%current_branch%"
    goto :menu
)
if %choice%==2 goto :create_branch
if %choice%==3 goto :switch_branch
if %choice%==4 goto :merge_main
if %choice%==5 exit /b 0

echo %RED%��Ч��ѡ��%NC%
timeout /t 2 >nul
goto :menu

:do_commit
set branch=%~1
echo %YELLOW%���ڸ��·�֧ %branch%...%NC%
git pull origin "%branch%"

rem ����Ƿ��б��
git status -s > status.txt
set "has_changes="
for /f "tokens=*" %%a in (status.txt) do set "has_changes=1"
del status.txt

if not defined has_changes (
    echo %YELLOW%û����Ҫ�ύ�ı��%NC%
    timeout /t 2 >nul
    exit /b 0
)

rem ��ʾ��ǰ���
echo %YELLOW%��ǰ�����%NC%
git status -s

rem ����Ĭ���ύ��Ϣ
git status -s > status.txt
set "DEFAULT_MSG="
for /f "tokens=1,2*" %%a in (status.txt) do (
    set "STATUS=%%a"
    set "FILE=%%b"
    if "!STATUS!"=="M" (
        if "!DEFAULT_MSG!"=="" (
            set "DEFAULT_MSG=update: !FILE!"
        ) else (
            set "DEFAULT_MSG=!DEFAULT_MSG!, !FILE!"
        )
    )
    if "!STATUS!"=="A" (
        if "!DEFAULT_MSG!"=="" (
            set "DEFAULT_MSG=add: !FILE!"
        ) else (
            set "DEFAULT_MSG=!DEFAULT_MSG!, !FILE!"
        )
    )
    if "!STATUS!"=="D" (
        if "!DEFAULT_MSG!"=="" (
            set "DEFAULT_MSG=remove: !FILE!"
        ) else (
            set "DEFAULT_MSG=!DEFAULT_MSG!, !FILE!"
        )
    )
)
del status.txt

git add .

echo.
echo %YELLOW%Ĭ���ύ��Ϣ: !DEFAULT_MSG!%NC%
set /p COMMIT_MSG="�������ύ��Ϣ (ֱ�ӻس�ʹ��Ĭ����Ϣ): "
if "!COMMIT_MSG!"=="" set "COMMIT_MSG=!DEFAULT_MSG!"

echo %YELLOW%�����ύ...%NC%
git commit -m "!COMMIT_MSG!" 2>nul
if !errorlevel! neq 0 (
    echo %RED%�ύʧ��%NC%
    timeout /t 2 >nul
    exit /b 1
)

echo %YELLOW%�������͵�Զ��...%NC%
rem ���� SSL ��֤
git config --global http.sslVerify false
git push origin "%branch%" 2>nul
if !errorlevel! neq 0 (
    echo %YELLOW%����ʧ�ܣ�5�������...%NC%
    timeout /t 5 >nul
    git push origin "%branch%" 2>nul
    if !errorlevel! neq 0 (
        echo %RED%����ʧ��%NC%
        rem �������� SSL ��֤
        git config --global http.sslVerify true
        timeout /t 2 >nul
        exit /b 1
    )
)

rem �������� SSL ��֤
git config --global http.sslVerify true
echo %GREEN%�����ѳɹ��ύ�� %branch%%NC%
timeout /t 2 >nul
exit /b 0

:create_branch
set /p new_branch="�������·�֧����: "
if "!new_branch!"=="" (
    echo %RED%��֧���Ʋ���Ϊ��%NC%
    timeout /t 2 >nul
    goto :menu
)
echo %YELLOW%���ڴ����·�֧...%NC%
git checkout -b "!new_branch!" 2>nul
if !errorlevel! neq 0 (
    echo %RED%������֧ʧ��%NC%
    timeout /t 2 >nul
    goto :menu
)
echo %GREEN%��֧�����ɹ�%NC%
call :do_commit "!new_branch!"
goto :menu

:switch_branch
echo %YELLOW%��ǰ���÷�֧��%NC%
git branch
echo.
set /p branch="������Ҫ�л��ķ�֧����: "
echo %YELLOW%�����л���֧...%NC%
git checkout "%branch%" 2>nul
if !errorlevel! neq 0 (
    echo %RED%�л���֧ʧ��%NC%
    timeout /t 2 >nul
)
goto :menu

:merge_main
echo %YELLOW%��ǰ���÷�֧��%NC%
git branch
echo.
set /p branch="������Ҫ�ϲ�������֧�ķ�֧����: "
echo %YELLOW%���ںϲ���֧...%NC%
git merge "%branch%" 2>nul
if !errorlevel! neq 0 (
    echo %RED%�ϲ���֧ʧ��%NC%
    timeout /t 2 >nul
)
goto :menu

rem ... �������뱣�ֲ��� ...