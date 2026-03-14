//!*script
// PPx 用モジュールのインストール状況を確認する。
// 実行ディレクトリ(%0)配下と %0\tools\ 以下の必要モジュールの存在を確認する。
// 通常実行: *script "%0script\check_installed_module.js"
//   - _user:checkmodule=1 の場合、不足モジュールがあるときだけダイアログ表示
//   - _user:checkmodule=0 の場合、通常チェックはスキップ
// 強制表示: *script "%0script\check_installed_module.js" force
//   - _user:checkmodule の値に関係なく結果を表示する

// _user:checkmodule が未設定なら 1 をセット
if (PPx.Extract('%su"checkmodule"') === '') {
  PPx.Execute('*setcust _user:checkmodule=1');
}

// "force" 指定時は常に結果を表示する
var forceMode = PPx.Arguments.length > 0 && PPx.Argument(0) === 'force';

// _user:checkmodule=0 かつ force でなければ通常チェックをスキップ
if (!forceMode && PPx.Extract('%su"checkmodule"') === '0') {
  PPx.Quit(1);
}

// ファイルシステム操作用オブジェクト
var fs = PPx.CreateObject('Scripting.FileSystemObject');

// 実行ディレクトリ取得
var basePath = PPx.Extract('%0');

// チェック対象モジュール一覧
var modules = [
  // PPx 用追加モジュール
  { file: 'PPxccx64.dll', name: 'PPx CCX Module', path: '' },
  { file: 'PPxcfx64.dll', name: 'PPx CFX Module', path: '' },
  { file: 'PPxetp64.dll', name: 'PPx Everything Search Module', path: '' },
  { file: 'PPxjunk64.dll', name: 'PPx Junk Module', path: '' },
  { file: 'PPxmes64.dll', name: 'PPx Message Module', path: '' },
  { file: 'PPxscr64.dll', name: 'PPx Script Module', path: '' },
  { file: 'PPxtext64.dll', name: 'PPx Text Module', path: '' },
  { file: 'PPxwin64.dll', name: 'PPx Window Module', path: '' },
  { file: 'PPxws64.dll', name: 'PPx WS Module', path: '' },
  // 正規表現・migemo 関連
  { file: 'bregonig.dll', name: 'bregonig.dll', path: '' },
  { file: 'migemo.dll', name: 'migemo.dll', path: '' },
  // 圧縮・展開・書庫関連 DLL/EXE
  { file: '7z.dll', name: '7-zip DLL', path: '' },
  { file: '7z.exe', name: '7-zip EXE', path: '' },
  { file: 'rar.exe', name: 'console RAR EXE', path: 'tools\\' },
  { file: 'unbypass.dll', name: 'UNBYPASS DLL', path: '' },
  { file: 'unbypass.exe', name: 'unbypass EXE', path: '' },
  { file: '7-zip64.dll', name: '7-zip64 DLL', path: '' },
  { file: 'unrar64.dll', name: 'UNRAR64 DLL', path: '' },
  { file: 'unrar64j.dll', name: 'UNRAR64J DLL', path: '' },
  { file: 'unzzip64.dll', name: 'UNZZIP64 DLL', path: '' },
  { file: 'unlha32.dll', name: 'UNLHA32 DLL', path: '' },
  { file: 'cab32.dll', name: 'CAB32 DLL', path: '' },
  { file: 'tar64.dll', name: 'TAR64 DLL', path: '' },
  // Susie プラグイン
  { file: 'iftwic.sph', name: 'iftwic.sph', path: '' },
  { file: 'ifjpegt.sph', name: 'ifjpegt.sph', path: '' },
  { file: 'iftpsd.sph', name: 'iftpsd.sph', path: '' },
  { file: 'ifttf.sph', name: 'ifttf.sph', path: '' },
  { file: 'ifextend.sph', name: 'ifextend.sph', path: '' },
  { file: 'ifheif.sph', name: 'ifheif.sph', path: '' },
  { file: 'axtpsd.sph', name: 'axtpsd.sph', path: '' },
  { file: 'axttc.sph', name: 'axttc.sph', path: '' },
  { file: 'ifgif.sph', name: 'ifgif.sph', path: '' },
  { file: 'iftgdip.sph', name: 'iftgdip.sph', path: '' },
  { file: 'iftwebp.sph', name: 'iftwebp.sph', path: '' },
  { file: 'axpdf.sph', name: 'axpdf.sph', path: '' },
  { file: 'pdfium.dll', name: 'axpdf.sph 用 DLL', path: '' },
  // Susie プラグイン(SPI)
  { file: 'ifcrw_t.spi', name: 'ifcrw_t.spi', path: 'SPI\\' },
  { file: 'ifdxfft.spi', name: 'ifdxfft.spi', path: 'SPI\\' },
  { file: 'ifdwg.spi', name: 'ifdwg.spi', path: 'SPI\\' },
  { file: 'runspi.exe', name: 'runspi.exe', path: 'SPI\\' },
  // その他外部ツール
  { file: 'busybox64u.exe', name: 'busybox64', path: '' },
  { file: 'ppdex64.exe', name: 'PPx common dialog extender', path: '' },
  { file: 'ppdex.exe', name: 'PPx common dialog extender', path: '' },
  { file: 'ppdex64.dll', name: 'PPx common dialog extender DLL', path: '' },
  { file: 'ppdex.dll', name: 'PPx common dialog extender DLL', path: '' },
  { file: 'xdoc2txt.exe', name: 'xdoc2txt', path: 'tools\\' },
  { file: 'zoxide.exe', name: 'zoxide', path: 'tools\\' },
  { file: 'es.exe', name: 'everything cli', path: 'tools\\' },
  { file: 'exiftool.exe', name: 'exiftool', path: 'tools\\' },
  { file: 'rg.exe', name: 'ripgrep', path: 'tools\\' },
  { file: 'fcp.exe', name: 'fastcopy cli', path: 'tools\\' },
  { file: 'ls2lf.exe', name: 'ls2lf', path: 'auxcmd\\' },
  { file: 'fzf.exe', name: 'fzf (Interactive Search)', path: 'tools\\' }
];

// 未導入モジュールのメッセージを収集
var errorMessages = [];
for (var i = 0; i < modules.length; i++) {
  var m = modules[i];
  var fullPath = basePath + m.path + m.file;

  // ファイルが存在しないものだけ一覧へ追加
  if (!fs.FileExists(fullPath)) {
    errorMessages.push(
      m.name + ' (%0' + m.path + m.file + ') がインストールされていません。'
    );
  }
}

// 不足が無ければ終了。force 時だけ完了メッセージを表示する。
if (errorMessages.length === 0) {
  if (forceMode) {
    PPx.Execute('%"check_installed_module.js"%:*msgbox "必要モジュールはすべて導入済みです。"');
  }
  PPx.Quit(1);
}

// エラーメッセージ作成
var message = errorMessages.join('\r\n');
if (!forceMode) {
  message +=
    '\r\n以後このメッセージを表示しない場合は _user:checkmodule=0 に設定してください。';
}

// ダイアログ表示
// はい: 以後は通常チェックを表示しない
// いいえ: 次回以降も通常チェックを表示する
var result = PPx.Extract(
  '%*choice(-title:"check_installed_module.js" -type:yn -text"' + message + '")'
);
if (!forceMode && result === '1') {
  PPx.Execute('*setcust _user:checkmodule=0');
}
