//!*script
// 現在窓のドライブでごみ箱を使えるなら %K"@D"(ごみ箱へ)、使えないなら %K"@\D"(完全削除)を実行する

var fso = PPx.CreateObject("Scripting.FileSystemObject");
var sh  = PPx.CreateObject("WScript.Shell");

// 現在窓のドライブ名を "C:" 形式で取得(UNCなら "\\" や "\\pc\share" になる)
var drive = PPx.Extract('%*name(H,"%1")');

// このドライブでごみ箱を使えるか。ごみ箱が無いと分かったときだけ false にする
var hasRecycleBin = true;

var policyPath = "\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\\NoRecycleFiles";
var bucketPath = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\BitBucket\\Volume\\";

// レジストリ値を取得する。未登録や読み取り失敗は null
function readReg(path) {
    try {
        return sh.RegRead(path);
    } catch (e) {
        return null;
    }
}

if (readReg("HKCU" + policyPath) == 1 || readReg("HKLM" + policyPath) == 1) {
    // ポリシーでごみ箱が無効化されている
    hasRecycleBin = false;
} else if (!/^[A-Za-z]:$/.test(drive) || fso.GetDrive(drive).DriveType != 2) {
    // UNC・ネットワークドライブ(3)・リムーバブル(1)などはごみ箱が無い
    hasRecycleBin = false;
} else {
    // 固定ドライブ。mountvol の出力を一時ファイルに取る(ウィンドウは出さず、終了まで待つ)
    var tmp = fso.GetSpecialFolder(2) + "\\ppx_vol.txt";
    sh.Run('cmd /c mountvol ' + drive + ' /L > "' + tmp + '" 2>nul', 0, true);

    var f = fso.OpenTextFile(tmp, 1);
    var out = f.AtEndOfStream ? "" : f.ReadAll();
    f.Close();
    fso.DeleteFile(tmp);

    // \\?\Volume{GUID}\ から {GUID} を切り出し、NukeOnDelete が 1 ならごみ箱を使わない設定
    var m = out.match(/\{[0-9a-fA-F-]+\}/);
    if (m && readReg(bucketPath + m[0] + "\\NukeOnDelete") == 1) {
        hasRecycleBin = false;
    }
}

// ごみ箱を使えるなら @D、使えないなら @\D
PPx.Execute(hasRecycleBin ? '%K"@D"' : '%K"@\\D"');