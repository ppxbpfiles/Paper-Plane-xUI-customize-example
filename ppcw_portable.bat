@echo off
rem fonton(ver1.1�ȍ~)���g���ăt�H���g���V�X�e���ɃC���X�g�[�������ꎞ�o�^����PPx���g���B

rem PPx���C���X�g�[�����Ă���f�B���N�g���Ɉړ�
pushd "%~dp0"

rem fonton���N�����t�H���g���ꎞ�o�^
rem PPx�I���i�Ō��1�������j�Ƃ���fontr�����s����悤�ACLOSEEVENT�ɃR�}���h���������ށB1�x���s�����炻�̃R�}���h�͏����B
call fonton64.exe

timeout /t 1

start pptrayw.exe -c *linecust rmfont,KC_main:CLOSEEVENT,*if %%%%*ppxlist(+C) == 1 %%%%:*wait 300 %%%%:*launch "%%0fonton64.exe" -s -r %%%%:*linecust rmfont,KC_main:CLOSEEVENT,

rem PPc���N��
start ppcw.exe
popd