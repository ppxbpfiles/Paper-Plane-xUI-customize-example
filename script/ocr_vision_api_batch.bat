@echo off
setlocal
REM Google Cloud Vision OCR バッチ起動用スクリプト
REM 使い方: ocr_vision_api_batch.bat [入力ファイルパス]
REM
REM ▼ サービスアカウントJSONファイルのパスを必要に応じて設定
REM set "CREDENTIALS=C:\path\to\your\credentials.json"
REM
REM 認証情報ファイルの存在確認（必要な場合のみ有効化）
REM if not exist "%CREDENTIALS%" goto :missing_credentials
REM
REM 環境変数設定（必要な場合のみ有効化）
REM set "GOOGLE_APPLICATION_CREDENTIALS=%CREDENTIALS%"

set "INPUT_FILE=%~1"

if not defined INPUT_FILE goto :no_input
if not exist "%INPUT_FILE%" goto :missing_input

set "INPUT_DIR=%~dp1"
set "INPUT_BASE=%~n1"
set "INPUT_EXT=%~x1"
set "OUTPUT_FILE=%INPUT_DIR%%INPUT_BASE%%INPUT_EXT%.txt"

if not exist "%~dp0ocr_vision_api.py" goto :missing_script

set "PYTHON_CMD="
where python >nul 2>&1 && set "PYTHON_CMD=python"
if not defined PYTHON_CMD for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "(Get-Command python.exe -ErrorAction SilentlyContinue).Source"`) do if not defined PYTHON_CMD set "PYTHON_CMD=%%I"
if not defined PYTHON_CMD where py >nul 2>&1 && set "PYTHON_CMD=py"
if not defined PYTHON_CMD goto :missing_python

echo OCR 処理を開始します: "%INPUT_FILE%" ^> "%OUTPUT_FILE%"
"%PYTHON_CMD%" "%~dp0ocr_vision_api.py" -i "%INPUT_FILE%" -o "%OUTPUT_FILE%"
if errorlevel 1 goto :ocr_failed

echo OCR 処理が正常に完了しました。
endlocal
exit /b 0

:no_input
echo エラー: 入力ファイルが指定されていません。
echo 使い方: %~nx0 [入力ファイルパス]
endlocal
exit /b 1

:missing_input
echo エラー: 入力ファイルが見つかりません: "%INPUT_FILE%"
endlocal
exit /b 1

:missing_script
echo エラー: ocr_vision_api.py が見つかりません: %~dp0ocr_vision_api.py
endlocal
exit /b 1

:missing_python
echo エラー: Python 実行ファイルが cmd.exe から見つかりません。
echo        python.exe を PATH に通すか、PowerShell の Get-Command で見つかる状態にしてください。
endlocal
exit /b 1

:missing_credentials
echo エラー: 認証情報ファイル "%CREDENTIALS%" が見つかりません。
endlocal
exit /b 1

:ocr_failed
echo エラー: OCR 処理に失敗しました。
endlocal
exit /b 1
