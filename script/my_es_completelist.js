//!*script
// ============================================================================
// スクリプト名  : my_es_completelist.js
//
// 目的 
// 元ファイル名を英文字＋VerNoと仮定して、古いバージョンのファイルをおいてある
// フォルダをEverythingで探してそこにコピー・移動する
// (自分用隠し機能。特殊用途)
//
// %ObsR es %"Everythingで処理先リスト作成"%{%*regexp("%*extract(C.%%C)","h/[A-Za-z]+/") .%T%} > %'temp'%\eslist.txt %:*completelist -free -file:%'temp'%\eslist.txt -detail:"user1" 
// とすればファイルのパスリストを出力できる。
// 更にディレクトリ部分のみ抽出してPPxの一行編集に渡すため、
// 補完リストをスクリプトで加工し、ファイル名部分を行頭コメントに分離する。
//
// 【全体の流れ】
//   1. Everything(コマンド版 es.exe)を実行し、条件に合うファイルのフルパスを
//      1行1件で一時ファイル(esraw.txt)に書き出す
//   2. 書き出された各行を「ファイル名; ディレクトリパス」の形式に変換し、
//      別の一時ファイル(eslist.txt)に書き直す
//      → こうすることで、PPx上で補完候補を選ぶ際にファイル名がコメントとして
//        見えつつ、実際に入力されるのは「ディレクトリパスまで」になる
//   3. 変換後のファイルを PPx の *completelist コマンドに読み込ませ、
//      入力欄でTabキー等による補完候補として使えるようにする
//
// 【前提条件】
//   ・Everything(https://www.voidtools.com/)がインストールされ、
//     コマンドライン版 es.exe にPATHが通っていること
//   ・このスクリプトはPPxの一行編集(K_edit/K_lied)上でキー割り当てや
//     コマンド経由(*script)で呼び出すことを想定している(単体では動作しない)
// ============================================================================


var fso  = PPx.CreateObject("Scripting.FileSystemObject");
var temp = PPx.Extract("%'temp'%");
var rawfile  = temp + "\\esraw.txt";   // es.exe の生出力
var listfile = temp + "\\eslist.txt";  // completelist に渡す整形済みリスト

// 1. es(Everything CLI)で検索し、フルパス一覧を rawfile に出力
var rc1 = PPx.Execute(
    "%ObsR es %\"Everythingで処理先リスト作成\"" +
    "%{%*regexp(\"%*extract(C.%%C)\",\"h/[A-Za-z]+/\") .%T%}" +
    " > \"" + rawfile + "\""
);
if (rc1 != 0) {
    PPx.Echo("es 実行でエラー: " + PPx.Extract("%*errormsg(" + rc1 + ")"));
    PPx.Quit(-1);
}

// 2. 各行を「;ファイル名; ディレクトリ」形式(行頭コメント)に整形
var inTS  = fso.OpenTextFile(rawfile, 1);        // 1 = ForReading
var outTS = fso.CreateTextFile(listfile, true);  // true = 上書き作成

while (!inTS.AtEndOfStream) {
    var line = inTS.ReadLine();
    if (line == "") continue;

    var pos = line.lastIndexOf("\\");
    if (pos < 0) {
        outTS.WriteLine(line); // 区切りが無ければそのまま出力
        continue;
    }
    var dir  = line.substring(0, pos + 1); // 末尾の \ を含めて切り出し
    var name = line.substring(pos + 1);
    outTS.WriteLine(";<" + name + ">; " + dir); // 行頭コメント形式
}
inTS.Close();
outTS.Close();

// 3. 整形済みリストを completelist で読み込む
var rc2 = PPx.Execute(
    "*completelist -free -file:\"" + listfile + "\" -detail:\"user1\""
);
if (rc2 != 0) {
    PPx.Echo("completelist 実行でエラー: " + PPx.Extract("%*errormsg(" + rc2 + ")"));
}