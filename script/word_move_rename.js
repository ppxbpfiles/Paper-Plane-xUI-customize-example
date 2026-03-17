/*
 * word_move_rename.js
 *
 * PPcの一行編集リネームダイアログ等で、数字列と非数字列の境界へカーソルをジャンプさせるスクリプト。
 * 例: "abc123def456.txt" の境界は位置3, 6, 9, 12 の4箇所。
 *
 * 使い方:
 *   *script "%0script\word_move_rename.js",right  ← 右の最近接境界へ
 *   *script "%0script\word_move_rename.js",left   ← 左の最近接境界へ
 *
 * 引数:
 *   - 第一引数: "right" または "left"
 *
 * 注意:
 *   - PPcの一行編集で動作します（K_edit K_lied に登録してください）。
 *   - テキスト端（先頭・末尾）は境界に含みません。
 *   - カーソルが既に境界上にある場合、その境界をスキップして次の境界へ移動します。
 */
//*script
// 引数・現在状態を取得
var dir  = PPx.Arguments.Item(0);                    // 移動方向: "right" or "left"
var text = PPx.Extract("%*edittext");                 // リネームボックスのテキスト全体
var cur  = PPx.Extract("%*editprop(start)") - 0;     // 現在のカーソル位置（文字インデックス）

// ── 境界位置を列挙 ─────────────────────────────
// 正規表現で「数字列」または「非数字列」のトークンに分割し、
// 各トークンの末尾位置（= 次のトークンの先頭）を境界として収集する。
// テキストの末尾位置（= text.length）は境界に含めない。
//
// 例: "abc123def456.txt"
//      トークン: "abc"(0-2), "123"(3-5), "def"(6-8), "456"(9-11), ".txt"(12-15)
//      境界:     3, 6, 9, 12  （15はtext.lengthなので除外）
var boundaries = [];
var re = /\d+|[^\d]+/g;
var m;
while ((m = re.exec(text)) !== null) {
    var pos = m.index + m[0].length;
    if (pos < text.length) boundaries.push(pos);
}

// ── 移動先を決定 ──────────────────────────────
// right: cur より右にある境界のうち最も近いもの
// left:  cur より左にある境界のうち最も近いもの
//        （カーソルが境界上にある場合はその境界をスキップして手前へ）
var target = cur;  // 境界が見つからなければ現在位置のまま
if (dir === "right") {
    for (var i = 0; i < boundaries.length; i++) {
        if (boundaries[i] > cur) { target = boundaries[i]; break; }
    }
} else {
    for (var i = boundaries.length - 1; i >= 0; i--) {
        if (boundaries[i] < cur) { target = boundaries[i]; break; }
    }
}

// ── キー送出 ─────────────────────────────────
// 現在位置 cur から target までの差分だけ %k"right" / %k"left" を送出する。
// 端（@HOME / @END）まで戻らず直接移動するため、カーソルのちらつきがない。
var diff  = target - cur;                        // 正なら右、負なら左
var key   = diff > 0 ? "%k\"right\"" : "%k\"left\"";
var steps = Math.abs(diff);
var keys  = "";
for (var i = 0; i < steps; i++) keys += (i > 0 ? " " : "") + key;

if (keys) PPx.Execute(keys);  // 移動不要（境界なし）の場合は何もしない
