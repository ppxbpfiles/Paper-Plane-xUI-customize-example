@echo off
rem fonton(ver1.1以降)を使ってフォントをシステムにインストールせず一時登録してPPxを使う。

rem PPxをインストールしているディレクトリに移動
pushd "%~dp0"

rem fontonを起動しフォントを一時登録
rem PPx終了（最後の1窓を閉じる）ときにfontrを実行するよう、CLOSEEVENTにコマンドを書き込む。1度実行したらそのコマンドは消去。
call fonton64.exe

timeout /t 1

start pptrayw.exe -c *linecust rmfont,KC_main:CLOSEEVENT,*if %%%%*ppxlist(+C) == 1 %%%%:*wait 300 %%%%:*launch "%%0fonton64.exe" -s -r %%%%:*linecust rmfont,KC_main:CLOSEEVENT,

rem PPcを起動
start ppcw.exe
popd