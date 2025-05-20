/*
 * 入力ファイル（例: file1.jpg）と対応するテキストファイル（file1.jpg.txt または file1.txt）の内容を読み込み、
 * 改行を削除してインデックスファイルに追記します。
 * 入力ファイルとテキストファイルは出力ファイルの親フォルダ（例: C:\test）にあると仮定。
 * 入力ファイルのパスは出力ファイルの親フォルダから生成（例: file1.jpg -> C:\test\file1.jpg）。
 * 出力ファイルは第二引数で指定。フルパスでない場合、カレントディレクトリに保存。
 * 実行方法:
 *   cscript //Nologo create_index_utf8.js <フラグ> <出力ファイル> <入力ファイル1> [<入力ファイル2> ...]
 * 例:
 *   cscript //Nologo create_index_utf8.js output_both C:\test\00_index.txt file1.jpg file2.jpg
 *   - 出力例: "file1.jpg HelloWorld" または "file1.jpg [NoTextFile]" または "file1.jpg [NoTextContent]"
 *   cscript //Nologo create_index_utf8.js skip_empty 00_index.txt file1.jpg
 *   - テキストファイルがない/空の場合、出力しない。出力ファイルはカレントディレクトリに保存。
 * 引数:
 *   - 第一引数（フラグ）: テキストファイルが存在しない/空の場合の動作を指定。
 *     - "output_both": 1列目（入力ファイル名）と2列目（[NoTextFile] または [NoTextContent]）の両方を出力。
 *     - "skip_empty": テキストファイルが存在しない/空の場合、出力をスキップ。
 *   - 第二引数（出力ファイル）: 結果を保存するファイル。フルパス指定、またはファイル名のみ（カレントディレクトリに保存）。ファイル名は「00_index」で始まり、拡張子は「.txt」でなければならない。
 *   - 第三引数以降（入力ファイル）: 入力ファイル名（例: file1.jpg）。フルパスは出力ファイルの親フォルダから生成。
 * 出力:
 *   - 指定されたパス（またはカレントディレクトリ）のファイル（例: C:\test\00_index.txt）に作成（UTF-8、BOMなし）。
 *   - 形式: 入力ファイル名と対応するテキストファイルの内容（改行なし）を空白区切りで1行、各エントリは改行で区切り。
 * テキストファイルの検索:
 *   - 出力ファイルの親フォルダ内のみで検索（例: C:\test\file1.jpg.txt または C:\test\file1.txt）。
 * 注意:
 *   - スペースを含むファイル名は引用符で囲んでください（例: "file name.jpg"）。
 *   - テキストファイルはUTF-8エンコーディングを推奨。
 *   - 出力ファイルの親フォルダが存在しない場合、エラーを表示。
 *   - 入力ファイルは出力ファイルの親フォルダに存在する必要があります。
 */

// FileSystemObjectを初期化
var fso = new ActiveXObject("Scripting.FileSystemObject");

// ファイルの内容をUTF-8で読み込み、改行を削除する関数
function readFileContent(filePath) {
    try {
        var stream = new ActiveXObject("ADODB.Stream");
        stream.Type = 2; // テキストモード
        stream.Charset = "utf-8";
        stream.Open();
        stream.LoadFromFile(filePath);
        var content = stream.ReadText();
        stream.Close();
        // 改行を削除
        content = content.replace(/\r\n/g, "").replace(/\n/g, "").replace(/\r/g, "");
        return content;
    } catch (e) {
        WScript.Echo("ファイル読み込みエラー: " + filePath);
        return "";
    }
}

// ファイル名と内容をUTF-8（BOMなし）で指定ファイルに追記する関数
function appendToOutput(outputFile, filename, content) {
    try {
        var stream = new ActiveXObject("ADODB.Stream");
        stream.Type = 2;
        stream.Charset = "utf-8";
        stream.Open();

        // 既存ファイルの内容を読み込む
        var existingContent = "";
        if (fso.FileExists(outputFile)) {
            var readStream = new ActiveXObject("ADODB.Stream");
            readStream.Type = 2;
            readStream.Charset = "utf-8";
            readStream.Open();
            readStream.LoadFromFile(outputFile);
            existingContent = readStream.ReadText();
            readStream.Close();
            existingContent = existingContent.replace(/^\uFEFF/, ""); // BOM削除
        }

        // 新しい内容を準備
        var newContent = existingContent;
        if (newContent !== "" && !newContent.match(/\n$/)) {
            newContent += "\n";
        }
        newContent += filename + " " + content;

        // BOMを削除
        newContent = newContent.replace(/^\uFEFF/, "");

        // ファイルに書き込み
        stream.WriteText(newContent);
        stream.SaveToFile(outputFile, 2); // 上書きモード
        stream.Close();
    } catch (e) {
        WScript.Echo("出力ファイルへの書き込みエラー: " + outputFile);
    }
}

// メイン処理
try {
    var args = WScript.Arguments;
    if (args.length < 1) {
        WScript.Echo("エラー: フラグ（output_both または skip_empty）を指定してください。");
        WScript.Quit(1);
    }
    if (args.length < 2) {
        WScript.Echo("エラー: 出力ファイル（例：C:\\test\\00_index.txt または 00_index.txt）を指定してください。");
        WScript.Quit(1);
    }
    if (args.length < 3) {
        WScript.Echo("エラー: 少なくとも1つの入力ファイルを指定してください。");
        WScript.Quit(1);
    }

    var flag = args(0);
    // フラグが有効かチェック
    if (flag !== "output_both" && flag !== "skip_empty") {
        WScript.Echo("エラー: フラグは「output_both」または「skip_empty」でなければなりません: " + flag);
        WScript.Quit(1);
    }

    var outputFile = args(1);
    // 出力ファイルをフルパスに変換（相対パスの場合、カレントディレクトリを使用）
    outputFile = fso.GetAbsolutePathName(outputFile);

    // 出力ファイル名が「00_index」で始まり、拡張子が.txtかチェック
    var outputFilename = fso.GetFileName(outputFile);
    if (!outputFilename.match(/^00_index.*\.txt$/i)) {
        WScript.Echo("エラー: 出力ファイル名は「00_index」で始まり、\n拡張子が「.txt」でなければなりません（例: 00_index_something.txt）: " + outputFilename);
        WScript.Quit(1);
    }
    if (outputFilename === "" || outputFilename.match(/[\\\/:*?"<>|]/) || 
        outputFilename.match(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i)) {
        WScript.Echo("エラー: 無効な出力ファイル名です: " + outputFilename);
        WScript.Quit(1);
    }

    // 出力ファイルの親フォルダが存在するかチェック
    var outputDir = fso.GetParentFolderName(outputFile);
    if (!fso.FolderExists(outputDir)) {
        WScript.Echo("エラー: 出力ファイルの親フォルダが存在しません: " + outputDir);
        WScript.Quit(1);
    }

    // 各入力ファイル（第三引数以降）を処理
    for (var i = 2; i < args.length; i++) {
        // 入力ファイル名（例: file1.jpg）
        var shortFilename = args(i);
        // 入力ファイルのフルパスを生成（出力ファイルの親フォルダを使用）
        var filePath = outputDir + "\\" + shortFilename;

        if (!fso.FileExists(filePath)) {
            WScript.Echo("警告: ファイルが存在しません: " + filePath);
            continue;
        }

        // 対応するテキストファイル名を決定（出力ファイルの親フォルダ内のみ検索）
        var txtPath1 = filePath + ".txt"; // file1.jpg.txt
        var txtPath2 = outputDir + "\\" + fso.GetBaseName(filePath) + ".txt"; // file1.txt

        var content = "";
        if (fso.FileExists(txtPath1)) {
            content = readFileContent(txtPath1);
            if (content === "") {
                content = "[NoTextContent]"; // テキストファイルの内容が空の場合
            }
        } else if (fso.FileExists(txtPath2)) {
            content = readFileContent(txtPath2);
            if (content === "") {
                content = "[NoTextContent]"; // テキストファイルの内容が空の場合
            }
        } else {
            content = "[NoTextFile]"; // テキストファイルがない場合
        }

        // フラグに基づいて出力するかどうかを決定
        if (flag === "skip_empty" && (content === "[NoTextFile]" || content === "[NoTextContent]")) {
            continue; // テキストファイルがない/空の場合、スキップ
        }

        // 出力ファイルに追記
        appendToOutput(outputFile, shortFilename, content);
    }

} catch (e) {
    WScript.Echo("エラー: " + e.description);
    WScript.Quit(1);
}