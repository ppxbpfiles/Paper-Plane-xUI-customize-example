# PPx Customize Example

TORO 氏作のファイラー Paper Plane xUI のカスタマイズ例です。

---

# スクリーンショット

![screenshot1](image/PPx_cust_Readme/screenshot1.png)

---

## このカスタマイズファイルの特長

- タブなしの独立した 1 画面による軽快な動作
- 目的別にまとめて管理できるタブ窓
- サブ窓（参照窓）で処理先を指定するファイルコピー方式
- zoxide によるパス補完
- 事前に生成したディレクトリパスリストを使用したジャンプ（[Shift+G]）
- Everything Search Engine を使用した検索（[W]メニューから選択）
- あらかじめ生成した実行パスリストを使ってジャンプ（[Shift+X]）

---

## ファイル構成

- PPx_kuro_unicode_x64.CFG（カスタマイズファイル本体）
- PPx_color_xxxx.CFG（色設定ファイル（着せ替え用））
- font_example_XXX.cfg (フォント設定例)
- keyhelp.txt（[F1]キーで表示されるキー操作一覧）
- key 検討用\ppxkey.xlsx（キー操作検討・エイリアス登録している実行ファイル詳細）

---

## インストール

### ファイルのコピー

PPx のインストールフォルダーに、実行ファイルと関連ファイル一式を配置します。

添付ファイル一式のうち、`PPx_kuro_unicode_x64.CFG` とその階層にあるファイル、およびサブフォルダーの内容を PPx のインストールフォルダーにコピーしてください。
`PPx_kuro_unicode_x64.CFG` と同じフォルダーに、`PPCW.exe` や `PPLIB64W.DLL` を含む PPx プログラム一式、およびその他の関連ファイルをコピーしてください。

`PPx_kuro_unicode_x64.CFG` の内容をカスタマイザ（`PPCUSTW.exe`）で読み込みます。「（フォルダ：XXX）」と記載がある場合は、そのサブフォルダーを作成し、該当ファイルを格納してください。

**A）PPx 拡張モジュール**

- Message Module （`PPxMES64.dll`）
- CFX Module （`PPxCFX64.dll`）
- Text Module （`PPxtext64.dll`）
- Everything Search Module（`PPXETP64.dll`）
- Module Junk Parts（`PPxjunk64.dll`）
- PPx CCX Module（`PPxccx64.dll`）
- PPx Script Module（`PPxscr64.dll`）
- PPx Window Module（`PPxwin64.dll`）
- PPx WS Module（`PPxws64.dll`）
- Common Dialog Extender（`PPDEX64.exe`/`PPDEX.exe`）

**B）外部モジュール**

- `bregonig.dll`
- `migemo.dll`

**C）圧縮解凍ソフト**

- `7z.dll`
- `7z.exe`
- `7-zip64.dll`
- `RAR.exe` （フォルダ：`tools`）
- `UNRAR64.DLL`
- `UNRAR64J.DLL`
- `UNZZIP64.dll`
- `UNLHA32.dll`
- `CAB32.dll`
- `TAR64.dll`
- `UNBYPASS.dll`
- `unbypass.exe`

**D）64bit Susie プラグイン**

- `iftwic.sph`
- `ifjpegt.sph`
- `iftpsd.sph`
- `ifttf.sph`
- `ifextend.sph`
- `ifavif.sph`
- `axtpsd.sph`
- `axttc.sph`
- `ifgif.sph`
- `iftgdip.sph`
- `iftwebp.sph`
- `axpdf.sph`/`pdfium.dll`
- `runsph.exe` (PDF のサムネイル表示で必要)

**E）32bit Susie プラグイン（フォルダ：`SPI`）**

- `ifcrw_t.spi`（CANON CRW）
- `ifdxfft.spi`（DXF）
- `ifdwg.spi`（DWG）
- `runspi.exe`

**F）コマンドラインツール**

- `xdoc2txt`
  [V]キーで `%ME_pager` の設定に従ってバイナリドキュメントファイルに含まれるテキストを `PPv[A]` で閲覧できます。
- `zoxide.exe`（フォルダ:`tools`）
- `es.exe`（フォルダ:`tools`）
- `exiftool`（フォルダ:`tools`）
- `busybox64u.exe`
- `rg.exe`（フォルダ:`tools`）
- `fcp.exe`（フォルダ:`tools`）
- `ls2lf.exe`（フォルダ:`auxcmd`）

**G）フォント**

**メインウィンドウ**

- Plemol JP ConsoleNFJ-medium (https://github.com/yuru7/PlemolJP)
- UDEV Gothic (https://github.com/yuru7/udev-gothic)
- ばぐまるゴシック (https://debugx.net/BugSoft.aspx?Soft=BugMaruGothic)

※個人的には、少し太めのゼロ斜め線入りが好みです。

**一行編集・ダイアログ**

- Migu 1c (https://github.com/yuru7/udev-gothic)
- プログラミング用フォント Utatane (https://github.com/nv-h/Utatane)
- ばぐまる P ゴシック (https://debugx.net/BugSoft.aspx?Soft=BugMaruGothic)

**H）スクリプト**

必須ではないがあれば便利なもの

- `check_installed_module.js`（必要なファイルがインストールされているかチェック）
- `get_newest_filename.js`（カレントディレクトリのファイルの中で、最後に更新されたもの、または最後にアクセスされたものの名前を返す）
- `ocr_vision_api.py`（Google Vision OCR を Python から使う）
- `ocr_vision_api_batch.bat`（`ocr_vision_ocr.py` を少しだけ使いやすくするための bat ファイル）
- `create_index.js`（Google Vision OCR で OCR 処理したファイルから `00_index.txt` を生成）

---

### カスタマイズファイルの読み込み方法

1.  PPx フォルダーに実行ファイルと関連ファイル一式を配置します。
2.  `PPx_kuro_unicode_x64.CFG` および同階層にあるファイルやサブフォルダーの内容を PPx フォルダーに配置します。
3.  `PPx_kuro_unicode_x64.CFG` の内容を読み込みます。

---

### 初期設定

**A）X_save フォルダーの設定**

**`KC_main` の `FIRSTEVENT` に記述されている設定に従って自動で作成されます。**

1.  PPx インストールフォルダーが `C:\Program Files` 以下（例：`C:\Program Files\PPx`）の場合
    `X_save = %'APPDATA'\TOROID\PPx\userdata`
2.  PPx インストールフォルダーが `C:\Program Files` 以外（ポータブルインストール）の場合
    `X_save = （PPx インストールフォルダー）\userdata`

`X_save` フォルダー内には、リストファイル保存用の `listfile` フォルダーも自動で作成されます。

**B）zoxide の設定**

`zoxide.exe` を（PPx インストールフォルダー）`\tools` フォルダーに配置してください。

デフォルト設定の場合、独立窓 `PPc[A]` 起動時に zoxide の db（`db.zo`）を PPx の補完候補用ファイル（`l_dirzoxide.txt`）に自動変換します。

**C）Everything の設定**

Everything Search Module をインストールすると、一行編集の補完リストにも Everything の検索結果が表示されますが、ファイル・ディレクトリの区別がなく使いにくいため、OFF（`ETP_PART=0`）にすることを推奨します。

Everything Search Module の検索結果をリストアップしない代わりに、実行ファイル専用（`l_exeEverything.txt`）とディレクトリ専用（`l_dirEverything.txt`）の補完リストを Everything のコマンドライン版 `es.exe` で作成し、専用の一行編集窓から呼び出してジャンプできます（[Shift+Z]、[Shift+G]）。

また、実行ファイルリストを使って [Shift+X] キーで任意のプログラムからファイルを開くこともできます。

**設定手順：**

1. メニュー「設定(&O)」→「Everything を最小化してバックグラウンドで特権実行」を選び、サービス登録ダイアログが出たら「OK」を押します。
2. もう一度同じメニューでサービスが登録されているか確認します。
   正しく設定されていれば確認画面が表示されます。
   ![1716628595438](image/PPx_cust_Readme/1716628595438.png)
3. Everything の ETP サーバ側も設定が必要です。図の通り設定してください（パスワード初期値は「password」）。
   ![1716620910860](image/PPx_cust_Readme/1716620910860.png)
4. PPx の CFG では、以下のように設定します。必要に応じて書き換えてください。

```.js
  _User	= {
  ETP_FULL	= 10000
  ETP_PART	= 0
  ETP_PASS	= password
  ETP_PORT	= 23
  ETP_USER	= username
  EverythingAdminExec	= EverythingAdminExec
  }
```

[W]キーでファイル名検索（Everything）メニューを選ぶと、一行編集窓が開きます。

![1716626930901](image/PPx_cust_Readme/1716626930901.png)

「Fullp/Name(S)」ボタンは、検索対象のドライブやパスをツリーから選択して絞り込むためのボタンです。もう一度押すとパス指定が解除されます（トグル動作）。

サブ窓（参照窓）にもこの一行編集窓を表示して、Everything 検索結果一覧を出すことができます。

ファイル hoge を同じフォルダーにコピーしたい場合は、コピー先にファイル hoge のパスをそのまま指定できます。これによりファイルの仕分けが効率化されます。

**D）Susie プラグインの設定**

PDF をサムネイルプレビューしたい場合は `ifextend.sph` の拡張子に PDF を登録してください。
`axpdf.sph` は「使用する」のチェックを外してください（インストール自体は必要です）。

**E）`PPXUMASK.TXT`・`PPXUPATH.TXT` の配置**

`PPWXXXX.DAT` が存在するフォルダーに配置してください。このカスタマイズ（`PPx_kuro_unicode.cfg`）では、`X_save` で指定したディレクトリ（`～\userdata`）の 1 つ上のフォルダーに配置します。

---

### 起動時およびアクティブ時の初期化設定

**`KC_main` の `FIRSTEVENT` では、以下の初期化処理を行います。**

- `X_save` フォルダーの自動設定
  - `C:\Program Files\PPx` の場合 → `X_save = %APPDATA%\TOROID\PPx\userdata`
  - それ以外の場合 → `X_save = （PPx インストールフォルダー）\userdata`
- `X_save` フォルダー内に `listfile` フォルダーがなければ自動作成
- エントリの並び順を「名前数値順」に設定
- 起動時ファイルマスクのリセット
- 連動ビュー（`PPv[X]`）を必ず OFF に設定
- タブ付きウィンドウ起動時のエントリ表示設定
- タブ付きウィンドウ起動時、記憶したディレクトリがあれば自動でジャンプ
- `zoxide.exe` が存在する場合、zoxide の `db.zo` を `l_dirZoxide.txt` に自動変換
- `PPc[W]` 起動時、コメント表示用のビュー設定

**`KC_main` の `ACTIVEEVENT` では、以下の処理を行います。主に一行編集をカスタマイズした後の設定初期化に使っています。**

- `XC_rmsk` のデフォルト値を設定（GUI で設定してもこの設定で上書きされます）
- REF ボタンの設定（条件により `K_lied:REFBUTTON` に `*refsel` を設定）
- `PPc[X]` 起動後に他の PPc がアクティブになった場合、コマンドを無効化しメッセージを表示
  - サブ窓でのコピー・移動には PPx Message Module が必須ですが、何らかの理由で動作しない場合に備え、`PPx_kuro_unicode.cfg` のコメントアウト部分を解除すると有効になる代替手段を用意しています。この設定は、その代替手段を有効にした際に使用されます。
- `Edit_OptionCmd` および `Edit_OptionTitle` の初期化

これらの設定は `KC_main` の `FIRSTEVENT` および `ACTIVEEVENT` に記述されており、PPx 起動時やアクティブ時に自動で実行されます。

---

### おわりに

- 本カスタマイズは自由に改変してご利用いただけます。
- 本ドキュメントの内容は予告なく加筆・修正されることがあります。
