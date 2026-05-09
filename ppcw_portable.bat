@echo off
rem fonton(ver1.1以降)を使ってフォントをシステムにインストールせず一時登録してPPxを使う。
rem このファイルはPPx本体をインストールしているフォルダに配置する。
rem fontonは https://toro.d.dooo.jp/slwin4.html#fonton または、https://github.com/toroidj/toroidj.github.io/blob/master/win/fonton11.zip からDLする。

rem PPxをインストールしているディレクトリに移動
pushd "%~dp0"

rem fontonを起動しフォントを一時登録
rem PPx終了（最後の1窓を閉じる）ときにfonton -s -rを実行してフォント登録解除するよう、CLOSEEVENTにコマンドを書き込む。1度実行したらそのコマンドは消去。
call fonton64.exe

timeout /t 1

start pptrayw.exe -c *linecust rmfont,KC_main:CLOSEEVENT,*if %%%%*ppxlist(+C) == 1 %%%%:*wait 300 %%%%:*launch "%%0fonton64.exe" -s -r %%%%:*linecust rmfont,KC_main:CLOSEEVENT,

rem PPcを起動
start ppcw.exe
popd