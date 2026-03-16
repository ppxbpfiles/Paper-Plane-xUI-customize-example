/*
 * word_move_rename.js
 *
 * PPcのインラインリネーム中に、文字種の境界へカーソルをジャンプさせるスクリプト。
 * 境界となる文字種の切れ目:
 *   アルファベット / 数字 / ひらがな / 全角カタカナ / 半角カタカナ / 漢字 / 記号等
 *
 * 例: "abc123あいうアイウｱｲｳ漢字test-456.txt"
 *     境界: 3, 6, 9, 12, 15, 17, 21, 22, 25, 26, 29
 *
 * 使い方:
 *   *script "%0script\word_move_rename.js",right  ← 右の最近接境界へ
 *   *script "%0script\word_move_rename.js",left   ← 左の最近接境界へ
 *
 * 引数:
 *   - 第一引数: "right" または "left"
 *
 * 注意:
 *   - PPcのインラインリネーム中にのみ動作します（K_edit K_lied に登録してください）。
 *   - テキスト端（先頭・末尾）は境界に含みません。
 *   - カーソルが既に境界上にある場合、その境界をスキップして次の境界へ移動します。
 */

// 引数・現在状態を取得
var dir  = PPx.Arguments.Item(0);                    // 移動方向: "right" or "left"
var text = PPx.Extract("%*edittext");                 // リネームボックスのテキスト全体
var cur  = PPx.Extract("%*editprop(start)") - 0;     // 現在のカーソル位置（文字インデックス）

// ── 境界位置を列挙 ──────────────────────────────────────────
// 以下の文字種をそれぞれ別トークンとして扱い、切れ目を境界として収集する。
//   [a-zA-Z]           アルファベット
//   \d                 数字
//   \u3040-\u309F      ひらがな
//   \u30A0-\u30FF      全角カタカナ
//   \uFF65-\uFF9F      半角カタカナ
//   \u4E00-\u9FFF      漢字（CJK統合漢字）
//   \u3400-\u4DBF      漢字（CJK拡張A）
//   上記以外           記号・スペース等
// テキストの末尾位置（= text.length）は境界に含めない。
var boundaries = [];
var re = /[a-zA-Z]+|\d+|[\u3040-\u309F]+|[\u30A0-\u30FF]+|[\uFF65-\uFF9F]+|[\u4E00-\u9FFF\u3400-\u4DBF]+|[^a-zA-Z\d\u3040-\u309F\u30A0-\u30FF\uFF65-\uFF9F\u4E00-\u9FFF\u3400-\u4DBF]+/g;
var m;
while ((m = re.exec(text)) !== null) {
    var pos = m.index + m[0].length;
    if (pos < text.length) boundaries.push(pos);
}

// ── 移動先を決定 ─────────────────────────────────────────────
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

// ── キー送出 ──────────────────────────────────────────────────
// 現在位置 cur から target までの差分だけ %k"right" / %k"left" を送出する。
// 端（@HOME / @END）まで戻らず直接移動するため、カーソルのちらつきがない。
var diff  = target - cur;                        // 正なら右、負なら左
var key   = diff > 0 ? "%k\"right\"" : "%k\"left\"";
var steps = Math.abs(diff);
var keys  = "";
for (var i = 0; i < steps; i++) keys += (i > 0 ? " " : "") + key;

if (keys) PPx.Execute(keys);  // 移動不要（境界なし）の場合は何もしない
