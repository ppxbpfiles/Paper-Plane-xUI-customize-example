//!*script
// PPx拡張モジュールのインストールチェック
// 実行ディレクトリ（%0）および %0\tools\ 内の必要モジュールの存在を確認します。
// ・通常実行: *script "%0script\check_installed_module.js"
//   - _user:checkmodule=1 の場合、モジュール欠如時にダイアログ表示
//   - _user:checkmodule=0 の場合、ダイアログをスキップ
// ・強制表示: *script "%0script\check_installed_module.js" force
//   - _user:checkmodule の値に関係なくエラーメッセージを表示

// _user:checkmodule が未設定なら 1 をセット
if (PPx.Extract('%su"checkmodule"') === "") {
  PPx.Execute("*setcust _user:checkmodule=1");
}

// "force"指定時は常にダイアログ表示
var forceMode = PPx.Arguments.length > 0 && PPx.Argument(0) === "force";

// _user:checkmodule=0 かつ forceでなければチェックをスキップ
if (!forceMode && PPx.Extract('%su"checkmodule"') === "0") {
  PPx.Quit(1);
}

// ファイルシステム操作用オブジェクト
var fs = PPx.CreateObject("Scripting.FileSystemObject");

// 実行ディレクトリ取得
var basePath = PPx.Extract("%0");

// チェック対象モジュールリスト
var modules = [
  //PPx拡張モジュール
  { file: "PPxccx64.dll", name: "PPx CCX Module", path: "" },
  { file: "PPxcfx64.dll", name: "PPx CFX Module", path: "" },
  { file: "PPxetp64.dll", name: "PPx Everything Search Module", path: "" },
  { file: "PPxjunk64.dll", name: "PPx Junk Module", path: "" },
  { file: "PPxmes64.dll", name: "PPx Message Module", path: "" },
  { file: "PPxscr64.dll", name: "PPx Script Module", path: "" },
  { file: "PPxtext64.dll", name: "PPx Text Module", path: "" },
  { file: "PPxwin64.dll", name: "PPx Window Module", path: "" },
  { file: "PPxws64.dll", name: "PPx WS Module", path: "" },
  //正規表現・migemoモジュール
  { file: "bregonig.dll", name: "bregonig.dll", path: "" },
  { file: "migemo.dll", name: "migemo.dll", path: "" },
  // 圧縮・解凍・統合アーカイバDLL
  { file: "7z.dll", name: "7-zip DLL", path: "" },
  { file: "7z.exe", name: "7-zip EXE", path: "" },
  { file: "rar.exe", name: "console RAR EXE", path: "tools\\" },
  { file: "unbypass.dll", name: "UNBYPASS DLL", path: "" },
  { file: "unbypass.exe", name: "unbypass EXE", path: "" },
  { file: "7-zip64.dll", name: "7-zip64 DLL", path: "" },
  { file: "unrar64.dll", name: "UNRAR64 DLL", path: "" },
  { file: "unrar64j.dll", name: "UNRAR64J DLL", path: "" },
  { file: "unzzip64.dll", name: "UNZZIP64 DLL", path: "" },
  { file: "unlha32.dll", name: "UNLHA32 DLL", path: "" },
  { file: "cab32.dll", name: "CAB32 DLL", path: "" },
  { file: "tar64.dll", name: "TAR64 DLL", path: "" },
  //Susieプラグイン
  { file: "iftwic.sph", name: "iftwic.sph", path: "" },
  { file: "ifjpegt.sph", name: "ifjpegt.sph", path: "" },
  { file: "iftpsd.sph", name: "iftpsd.sph", path: "" },
  { file: "ifttf.sph", name: "ifttf.sph", path: "" },
  { file: "ifextend.sph", name: "ifextend.sph", path: "" },
  { file: "ifavif.sph", name: "ifavif.sph", path: "" },
  { file: "axtpsd.sph", name: "axtpsd.sph", path: "" },
  { file: "axttc.sph", name: "axttc.sph", path: "" },
  { file: "ifgif.sph", name: "ifgif.sph", path: "" },
  { file: "iftgdip.sph", name: "iftgdip.sph", path: "" },
  { file: "iftwebp.sph", name: "iftwebp.sph", path: "" },
  { file: "axpdf.sph", name: "axpdf.sph", path: "" },
  { file: "pdfium.dll", name: "axpdf.sph用DLL", path: "" },
  //Susieプラグイン（SPI）
  { file: "ifcrw_t.spi", name: "ifcrw_t.spi", path: "SPI\\" },
  { file: "ifdxfft.spi", name: "ifdxfft.spi", path: "SPI\\" },
  { file: "ifdwg.spi", name: "ifdwg.spi", path: "SPI\\" },
  { file: "runspi.exe", name: "runspi.exe", path: "SPI\\" },
  //その他外部ツール
  { file: "busybox64u.exe", name: "busybox64", path: "" },
  { file: "ppdex64.exe", name: "PPx common dialog extender", path: "" },
  { file: "ppdex.exe", name: "PPx common dialog extender", path: "" },
  { file: "ppdex64.dll", name: "PPx common dialog extender DLL", path: "" },
  { file: "ppdex.dll", name: "PPx common dialog extender DLL", path: "" },
  { file: "xdoc2txt.exe", name: "xdoc2txt", path: "tools\\" },
  { file: "zoxide.exe", name: "zoxide", path: "tools\\" },
  { file: "es.exe", name: "everything cli", path: "tools\\" },
  { file: "exiftool.exe", name: "exiftool", path: "tools\\" },
  { file: "rg.exe", name: "ripgrep", path: "tools\\" },
  { file: "fcp.exe", name: "fastcopy cli", path: "tools\\" },
  { file: "ls2lf.exe", name: "ls2lf", path: "auxcmd\\" },
];

// 欠如モジュールのエラーメッセージ収集
var errorMessages = [];
for (var i = 0; i < modules.length; i++) {
  var m = modules[i];
  var fullPath = basePath + m.path + m.file;
  // ファイルが存在しない場合のみエラーに追加
  if (!fs.FileExists(fullPath)) {
    errorMessages.push(
      m.name + "（%0" + m.path + m.file + "）がインストールされていません。"
    );
  }
}

// 欠如がなければ終了
if (errorMessages.length === 0) {
  PPx.Quit(1);
}

// エラーメッセージ作成
var message = errorMessages.join("\r\n");
if (!forceMode) {
  message +=
    "\r\n以後このメッセージを表示しない（再表示は _user:checkmodule=1 に設定）";
}

// ダイアログ表示（「はい」=以降非表示、「いいえ」=今後も表示）
var result = PPx.Extract(
  '%*choice(-title:"check_installed_module.js" -type:yn -text"' + message + '")'
);
if (!forceMode && result === "1") {
  PPx.Execute("*setcust _user:checkmodule=0");
}
