/*
 * テキストファイルを読み込み、内容から改行を削除してインデックスファイルに追記します。
 * 実行方法:
 *   cscript //Nologo create_index.js <出力ファイル> <入力ファイル1> [<入力ファイル2> ...]
 * 例:
 *   cscript //Nologo create_index.js 00_index.txt C:\test\file1.txt
 *   - 出力は "file1.txt HelloWorld"
 * 引数:
 *   - 出力ファイル: 結果を保存するファイル名（例：00_index.txt）。
 *   - 入力ファイル: 処理するテキストファイル（UTF-8推奨）。
 * 出力:
 *   - 最初の入力ファイルの親フォルダに<出力ファイル>を作成（UTF-8、BOMなし）。
 *   - 形式: 入力ファイル名と内容（改行なし）を空白区切りで1行、各エントリは改行で区切り。
 * エラー:
 *   - 引数が不足した場合やファイルが存在しない場合にエラーメッセージを表示。
 * 注意:
 *   - スペースを含むファイルパスは引用符で囲んでください（例："C:\test\file name.txt"）。
 *   - 入力ファイルはUTF-8エンコーディングを推奨。
 */

// FileSystemObjectを初期化
var fso = new ActiveXObject("Scripting.FileSystemObject"); // ファイル操作用オブジェクト

// ファイルの内容をUTF-8で読み込み、改行を削除する関数
function readFileContent(filePath) {
    try {
        // ADODB.Streamを使用してUTF-8で読み込み
        var stream = new ActiveXObject("ADODB.Stream");
        stream.Type = 2; // テキストモード
        stream.Charset = "utf-8"; // UTF-8エンコーディング
        stream.Open();
        stream.LoadFromFile(filePath); // ファイル読み込み
        var content = stream.ReadText(); // 全内容を取得
        stream.Close(); // ストリームを閉じる
        // 改行（CRLF, LF, CR）を削除
        content = content.replace(/\r\n/g, "").replace(/\n/g, "").replace(/\r/g, "");
        return content;
    } catch (e) {
        // 読み込み失敗時はエラーメッセージを表示し空文字列を返す
        WScript.Echo("ファイル読み込みエラー: " + filePath);
        return "";
    }
}

// ファイル名と内容をUTF-8（BOMなし）で指定ファイルに追記する関数
function appendToOutput(outputFile, filename, content) {
    try {
        // ADODB.Streamを使用してUTF-8出力を保証
        var stream = new ActiveXObject("ADODB.Stream");
        stream.Type = 2; // テキストモード
        stream.Charset = "utf-8"; // UTF-8エンコーディング
        stream.Open();

        // 既存ファイルの内容を読み込む（初回書き込み時はスキップ）
        var existingContent = "";
        if (fso.FileExists(outputFile)) {
            var readStream = new ActiveXObject("ADODB.Stream");
            readStream.Type = 2;
            readStream.Charset = "utf-8";
            readStream.Open();
            readStream.LoadFromFile(outputFile);
            existingContent = readStream.ReadText();
            readStream.Close();
            // 既存内容からBOMを削除
            existingContent = existingContent.replace(/^\uFEFF/, "");
        }

        // 新しい内容を準備（既存内容 + 新しい行）
        var newContent = existingContent;
        if (newContent !== "" && !newContent.match(/\n$/)) {
            newContent += "\n"; // 既存内容の末尾に改行がない場合追加
        }
        newContent += filename + " " + content; // ファイル名と内容を追加

        // BOMを削除
        newContent = newContent.replace(/^\uFEFF/, "");

        // ファイルに書き込み（UTF-8で上書き）
        stream.WriteText(newContent); // 既存内容と新しい内容を書き込み
        stream.SaveToFile(outputFile, 2); // ファイルに保存（上書きモード）
        stream.Close(); // ストリームを閉じる
    } catch (e) {
        // 書き込みエラー時にメッセージを表示
        WScript.Echo("出力ファイルへの書き込みエラー: " + outputFile);
    }
}

// メイン処理
try {
    // コマンドライン引数を取得
    var args = WScript.Arguments;
    if (args.length < 1) {
        // 出力ファイル名が指定されていない場合、エラーを表示して終了
        WScript.Echo("エラー: 出力ファイル名（例：00_index.txt）を指定してください。");
        WScript.Quit(1);
    }
    if (args.length < 2) {
        // 入力ファイルが指定されていない場合、エラーを表示して終了
        WScript.Echo("エラー: 少なくとも1つの入力ファイルを指定してください。");
        WScript.Quit(1);
    }

    // 出力ファイル名を第一引数から取得
    var outputFilename = args(0);
    // 無効なファイル名（空、特殊文字、予約名）をチェック
    if (outputFilename === "" || outputFilename.match(/[\\\/:*?"<>|]/) || 
        outputFilename.match(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i)) {
        WScript.Echo("エラー: 無効な出力ファイル名です: " + outputFilename);
        WScript.Quit(1);
    }

    // 出力ファイルパスを生成（最初の入力ファイルの親フォルダ + 出力ファイル名）
    var outputDir = fso.GetParentFolderName(fso.GetAbsolutePathName(args(1)));
    var outputFile = outputDir + "\\" + outputFilename;

    // 各入力ファイル（第二引数以降）を処理
    for (var i = 1; i < args.length; i++) {
        var filePath = args(i);
        if (!fso.FileExists(filePath)) {
            // ファイルが存在しない場合、警告を表示してスキップ
            WScript.Echo("警告: ファイルが存在しません: " + filePath);
            continue;
        }

        // ファイルの内容を読み込む
        var content = readFileContent(filePath);
        if (content === "") {
            // 内容が空の場合、スキップ
            WScript.Echo("警告: ファイルの内容が空です: " + filePath);
            continue;
        }

        // 入力ファイル名のみを取得
        var shortFilename = fso.GetFileName(filePath);

        // 出力ファイルに追記
        appendToOutput(outputFile, shortFilename, content);
    }

} catch (e) {
    // 全体のエラー時にメッセージを表示
    WScript.Echo("エラー: " + e.description);
    WScript.Quit(1);
}
