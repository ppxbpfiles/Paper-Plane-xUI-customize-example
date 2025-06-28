@echo off
REM --- Google Cloud Vision OCRバッチファイル ---
REM 使用方法: ocr_vision_api_batch.bat [入力ファイルパス]
REM
REM ▼ サービスアカウントJSONファイルのパスを必要に応じて設定
REM set "CREDENTIALS=C:\path\to\your\credentials.json"
REM
REM 認証情報ファイルの存在確認（必要な場合のみ有効化）
REM if not exist "%CREDENTIALS%" (
REM     echo エラー: 認証情報ファイル "%CREDENTIALS%" が見つかりません。
REM     exit /b 1
REM )
REM
REM 環境変数設定（必要な場合のみ有効化）
REM set "GOOGLE_APPLICATION_CREDENTIALS=%CREDENTIALS%"

REM ▼ 入力ファイルの取得
set "INPUT_FILE=%~1"

REM 入力ファイルの存在確認
if not defined INPUT_FILE (
    echo エラー: 入力ファイルが指定されていません。
    echo 使用方法: %~nx0 [入力ファイルパス]
    exit /b 1
)
if not exist "%INPUT_FILE%" (
    echo エラー: 入力ファイル "%INPUT_FILE%" が見つかりません。
    exit /b 1
)

REM 入力ファイルのディレクトリ・ベース名・拡張子取得
set "INPUT_DIR=%~dp1"
set "INPUT_BASE=%~n1"
set "INPUT_EXT=%~x1"
set "OUTPUT_FILE=%INPUT_DIR%%INPUT_BASE%%INPUT_EXT%.txt"

REM Pythonスクリプトの存在確認
if not exist "%~dp0ocr_vision_api.py" (
    echo エラー: ocr_vision_api.py が見つかりません。（%~dp0ocr_vision_api.py）
    exit /b 1
)

REM Python実行環境の確認
where python >nul 2>&1
if errorlevel 1 (
    echo エラー: Python がインストールされていないか、PATH に設定されていません。
    exit /b 1
)

REM OCRスクリプト実行
echo OCR処理を開始: "%INPUT_FILE%" → "%OUTPUT_FILE%"
python "%~dp0ocr_vision_api.py" -i "%INPUT_FILE%" -o "%OUTPUT_FILE%"
if errorlevel 1 (
    echo エラー: OCR処理に失敗しました。
    exit /b 1
)

echo 処理が正常に完了しました。
endlocal
exit /b 0