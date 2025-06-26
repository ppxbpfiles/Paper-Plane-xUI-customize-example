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
  { file: "ppxcfx64.dll", name: "PPx CFX Module", path: "" },
  { file: "ppxmes64.dll", name: "PPx Message Module", path: "" },
  { file: "ppxtext64.dll", name: "PPx Text Module", path: "" },
  { file: "ppxwin64.dll", name: "PPx Window Module", path: "" },
  { file: "ppxjunk64.dll", name: "PPx Junk Module", path: "" },
  { file: "ppxetp64.dll", name: "PPx Everything Search Module", path: "" },
  { file: "ppxccx64.dll", name: "PPx CCX Module", path: "" },
  { file: "xdoc2txt.exe", name: "xdoc2txt", path: "tools\\" },
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

// スクリプト終了
