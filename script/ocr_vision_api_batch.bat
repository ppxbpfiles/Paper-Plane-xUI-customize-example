@echo off
REM --- Google Cloud Vision OCRバッチファイル ---
REM 使用方法: ocr_vision_api_batch.bat [入力ファイルパス]

setlocal EnableDelayedExpansion

REM サービスアカウントJSONファイルのパス
REM set "CREDENTIALS=path/to/your/credentials.json"

REM 入力ファイルの取得
set "INPUT_FILE=%~1"

REM 入力ファイルの存在確認
if not defined INPUT_FILE (
    echo エラー: 入力ファイルが指定されていません。
    echo 使用方法: %0 [入力ファイルパス]
    exit /b 1
)
if not exist "%INPUT_FILE%" (
    echo エラー: 入力ファイル "%INPUT_FILE%" が見つかりません。
    exit /b 1
)

REM 入力ファイルのディレクトリ、名前、拡張子を取得
set "INPUT_DIR=%~dp1"
set "INPUT_NAME=%~nx1"
set "OUTPUT_FILE=%INPUT_DIR%%INPUT_NAME%.txt"

REM 認証情報ファイルの存在確認
REM if not exist "%CREDENTIALS%" (
REM     echo エラー: 認証情報ファイル "%CREDENTIALS%" が見つかりません。
REM     exit /b 1
REM )

REM 環境変数設定
REM set "GOOGLE_APPLICATION_CREDENTIALS=%CREDENTIALS%"

REM Python スクリプトの存在確認
if not exist "%~dp0ocr_vision_api.py" (
    echo エラー: ocr_vision_api.py が見つかりません。
    exit /b 1
)

REM Python 実行環境の確認
where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo エラー: Python がインストールされていないか、PATH に設定されていません。
    exit /b 1
)

REM OCRスクリプト実行
echo OCR処理を開始: "%INPUT_FILE%" から "%OUTPUT_FILE%" へ
python "%~dp0ocr_vision_api.py" -i "%INPUT_FILE%" -o "%OUTPUT_FILE%"
if %ERRORLEVEL% neq 0 (
    echo エラー: OCR処理に失敗しました。
    exit /b 1
)

echo 処理が正常に完了しました。
endlocal
exit /b 0