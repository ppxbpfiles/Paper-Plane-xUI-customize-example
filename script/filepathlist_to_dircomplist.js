//!*script
// ============================================================================
// スクリプト名  : filepathlist_to_dircomplist.js
//
// 目的 
//
// 本スクリプトは、そのフルパス一覧をディレクトリ部分のみ抽出してPPxの
// 一行編集に渡すため、補完リストをスクリプトで加工し、ファイル名部分を
// 行頭コメントに分離する。
//
// 【全体の流れ】
//   1. 第1引数(PPx.Argument(0))で指定された入力ファイル(フルパス一覧、
//      1行1件)を読み込む
//   2. 各行を「;<ファイル名>; ディレクトリパス」の形式(行頭コメント)に
//      変換し、一時ファイル(%'temp'%\dircomplist.txt)に書き直す
//      → こうすることで、PPx上で補完候補を選ぶ際にファイル名がコメントとして
//        見えつつ、実際に入力されるのは「ディレクトリパスまで」になる
//
// 【前提条件】
//   ・第1引数に渡すファイルは、1行1件でフルパスが列挙されたテキスト
//     ファイルであること。es(Everything CLI) や fd(find) の出力を想定
//   ・入出力ともにUTF-8として扱う(ADODB.Streamを使用)
// ============================================================================

var fso = PPx.CreateObject("Scripting.FileSystemObject");

// 引数チェック
var rawfile = PPx.Argument(0);
if (rawfile == "") {
    PPx.Echo("引数エラー: 入力ファイルのパスを第1引数で指定してください");
    PPx.Quit(-1);
}

// 入力ファイル存在チェック
if (!fso.FileExists(rawfile)) {
    PPx.Echo("入力ファイルが見つかりません: " + rawfile);
    PPx.Quit(-1);
}

var listfile = PPx.Extract("%'temp'%") + "\\dircomplist.txt";

// 入力ファイルをUTF-8で読み込む
var inStream = PPx.CreateObject("ADODB.Stream");
inStream.Type = 2; // adTypeText
inStream.Charset = "utf-8";
inStream.Open();
inStream.LoadFromFile(rawfile);
var text = inStream.ReadText();
inStream.Close();

// 各行を行頭コメント形式に変換する
var lines = text.split(/\r\n|\n/);
var out = [];
for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line == "") continue;

    var pos = line.lastIndexOf("\\");
    out.push(pos < 0 ? line : ";<" + line.substring(pos + 1) + ">; " + line.substring(0, pos + 1));
}

// UTF-8(BOM付き)で書き出す
var outStream = PPx.CreateObject("ADODB.Stream");
outStream.Type = 2;
outStream.Charset = "utf-8";
outStream.Open();
outStream.WriteText(out.join("\r\n") + "\r\n");
outStream.SaveToFile(listfile, 2); // 2 = adSaveCreateOverWrite
outStream.Close();