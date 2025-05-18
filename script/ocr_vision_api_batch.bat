@echo off
REM --- Google Cloud Vision OCR�o�b�`�t�@�C�� ---
REM �g�p���@: ocr_vision_api_batch.bat [���̓t�@�C���p�X]

setlocal EnableDelayedExpansion

REM �T�[�r�X�A�J�E���gJSON�t�@�C���̃p�X
REM set "CREDENTIALS=path/to/your/credentials.json"

REM ���̓t�@�C���̎擾
set "INPUT_FILE=%~1"

REM ���̓t�@�C���̑��݊m�F
if not defined INPUT_FILE (
    echo �G���[: ���̓t�@�C�����w�肳��Ă��܂���B
    echo �g�p���@: %0 [���̓t�@�C���p�X]
    exit /b 1
)
if not exist "%INPUT_FILE%" (
    echo �G���[: ���̓t�@�C�� "%INPUT_FILE%" ��������܂���B
    exit /b 1
)

REM ���̓t�@�C���̃f�B���N�g���A���O�A�g���q���擾
set "INPUT_DIR=%~dp1"
set "INPUT_NAME=%~nx1"
set "OUTPUT_FILE=%INPUT_DIR%%INPUT_NAME%.txt"

REM �F�؏��t�@�C���̑��݊m�F
REM if not exist "%CREDENTIALS%" (
REM     echo �G���[: �F�؏��t�@�C�� "%CREDENTIALS%" ��������܂���B
REM     exit /b 1
REM )

REM ���ϐ��ݒ�
REM set "GOOGLE_APPLICATION_CREDENTIALS=%CREDENTIALS%"

REM Python �X�N���v�g�̑��݊m�F
if not exist "%~dp0ocr_vision_api.py" (
    echo �G���[: ocr_vision_api.py ��������܂���B
    exit /b 1
)

REM Python ���s���̊m�F
where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo �G���[: Python ���C���X�g�[������Ă��Ȃ����APATH �ɐݒ肳��Ă��܂���B
    exit /b 1
)

REM OCR�X�N���v�g���s
echo OCR�������J�n: "%INPUT_FILE%" ���� "%OUTPUT_FILE%" ��
python "%~dp0ocr_vision_api.py" -i "%INPUT_FILE%" -o "%OUTPUT_FILE%"
if %ERRORLEVEL% neq 0 (
    echo �G���[: OCR�����Ɏ��s���܂����B
    exit /b 1
)

echo ����������Ɋ������܂����B
endlocal
exit /b 0