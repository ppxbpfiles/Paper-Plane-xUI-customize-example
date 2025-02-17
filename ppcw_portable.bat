rem fonton、fontrを使ってフォントをシステムにインストールせず一時登録してPPxを使う。

@echo off
rem PPxをインストールしているディレクトリに移動
pushd "%~dp0"

rem fontonを起動しフォントを一時登録
rem PPx終了（最後の1窓を閉じる）ときにfontrを実行するよう、CLOSEEVENTにコマンドを書き込む。1度実行したらそのコマンドは消去。
start pptrayw.exe -c *launch "%%0fonton64.exe" %%:*linecust rmfont,KC_main:CLOSEEVENT,*if %%%%*ppxlist(+C) == 1 %%%%:*wait 300 %%%%:*launch "%%0fontr64.exe" %%%%:*linecust rmfont,KC_main:CLOSEEVENT,

rem PPcを起動
start ppcw.exe
popd