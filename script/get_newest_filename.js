//!*script
// ファイル名: get_newest_filename.js
// 概要: PPxで現在開いているディレクトリにある、最後に変更またはアクセスしたファイル名を返す。
// 第一引数: "Modify"（最終更新ファイル）または "Access"（最終アクセスファイル）
//
// 使用例:
// KC_main = {
// 8    ,%J %*script("%0script\get_newest_filename.js" Modify)
// 9    ,%J %*script("%0script\get_newest_filename.js" Access)
// }

// 引数がなければ終了
if (PPx.Arguments.Length < 1) {
  PPx.Echo("引数が正しくありません");
  PPx.Quit();
}

var newestType = PPx.Argument(0);
if (newestType !== "Modify" && newestType !== "Access") {
  PPx.Echo('引数は "Modify" または "Access" で指定してください');
  PPx.Quit();
}

var newestFile = null;
var newestDate = null;

// 各エントリを走査
for (var i = 0; i < PPx.Entry.Count; i++) {
  // ディレクトリ（Attributes & 16）を除外
  if (!(PPx.Entry.Item(i).Attributes & 16)) {
    var date = null;
    // 指定タイプに応じて日付を取得
    if (newestType === "Modify") {
      date = PPx.Entry.Item(i).DateLastModified;
    } else if (newestType === "Access") {
      date = PPx.Entry.Item(i).DateLastAccessed;
    }
    // より新しい日付なら記録
    if (newestDate === null || date > newestDate) {
      newestFile = PPx.Entry.Item(i).Name;
      newestDate = date;
    }
  }
}

PPx.result = newestFile;
