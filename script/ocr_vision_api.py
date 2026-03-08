# OCR Vision API スクリプト
# セットアップ手順:
# 1. 必要なパッケージをインストール:
#    pip install google-cloud-vision PyPDF2
# 2. Google Cloudの認証情報を設定:
#    - Google Cloudプロジェクトを作成し、Vision APIを有効化
#    - サービスアカウントキーのJSONファイルをダウンロード
#    - 環境変数を設定: export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/credentials.json"
#
# 使用方法:
# コマンドラインからスクリプトを実行:
# python ocr_vision_api.py -i <入力ファイル> -o <出力ファイル>
# - <入力ファイル>: 画像ファイル(png, jpg, jpeg, gif, tif, tiff, bmp)またはPDFファイルのパス
# - <出力ファイル>: 抽出されたテキストを保存するファイルのパス
#
# 例:
# python ocr_vision_api.py -i document.pdf -o output.txt
# python ocr_vision_api.py -i image.png -o output.txt

import argparse
import io
import os

try:
    from google.cloud import vision
except ImportError as exc:
    raise SystemExit(
        'google-cloud-vision がインストールされていません。'
        ' `pip install google-cloud-vision` を実行してください。'
    ) from exc

try:
    import PyPDF2
except ImportError as exc:
    raise SystemExit(
        'PyPDF2 がインストールされていません。'
        ' `pip install PyPDF2` を実行してください。'
    ) from exc


def validate_runtime():
    """依存関係と認証情報を実行前に確認する"""
    credentials = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', '')
    if not credentials:
        raise EnvironmentError(
            '環境変数 GOOGLE_APPLICATION_CREDENTIALS が設定されていません。'
        )
    if not os.path.exists(credentials):
        raise FileNotFoundError(
            f'認証情報ファイルが見つかりません: {credentials}'
        )

def detect_text_image(image_path, output_path):
    """画像ファイルからテキストを検出し、テキストファイルに保存"""
    client = vision.ImageAnnotatorClient()
    
    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()
    
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    
    if response.error.message:
        raise Exception(f"OCR API エラー: {response.error.message}")
    
    text = response.text_annotations[0].description if response.text_annotations else ""
    
    with open(output_path, 'w', encoding='utf-8') as output_file:
        output_file.write(text)
    
    print(f"OCRテキストを抽出し、{output_path} に保存しました: {image_path}")

def detect_text_pdf(pdf_path, output_path):
    """PDFファイルからテキストを検出し、テキストファイルに保存"""
    client = vision.ImageAnnotatorClient()

    with io.open(pdf_path, 'rb') as f:
        content = f.read()

    input_config = vision.InputConfig(
        mime_type="application/pdf",
        content=content
    )
    feature = vision.Feature(type_=vision.Feature.Type.DOCUMENT_TEXT_DETECTION)

    pdf_reader = PyPDF2.PdfReader(pdf_path)
    num_pages = len(pdf_reader.pages)
    # 1始まりでページ番号を作成
    pages = [[i + 1 for i in range(j, min(j + 5, num_pages))] for j in range(0, num_pages, 5)]

    ocr_text = {}
    for batch in pages:
        requests = [
            vision.AnnotateFileRequest(
                input_config=input_config,
                features=[feature],
                pages=batch
            )
        ]
        response = client.batch_annotate_files(requests=requests)
        if response.responses and response.responses[0].responses:
            for idx, image_response in enumerate(response.responses[0].responses):
                page_no = batch[idx]  # batchは1始まり
                text = image_response.full_text_annotation.text if image_response.full_text_annotation.text else ""
                ocr_text[f"Page_{page_no}"] = text
        else:
            for idx, page_no in enumerate(batch):
                ocr_text[f"Page_{page_no}"] = ""

    full_text = "\n".join(ocr_text[page] for page in sorted(ocr_text.keys(), key=lambda x: int(x.split('_')[1])))

    with open(output_path, 'w', encoding='utf-8') as output_file:
        output_file.write(full_text)

    print(f"OCRテキストを抽出し、{output_path} に保存しました: {pdf_path}")

def main():
    parser = argparse.ArgumentParser(description="Google Cloud Vision API を使って画像またはPDFからOCRテキストを抽出します")
    parser.add_argument("-i", "--input", required=True, help="入力する画像またはPDFファイルのパス")
    parser.add_argument("-o", "--output", required=True, help="抽出したテキストの出力先ファイルパス")
    
    args = parser.parse_args()
    
    input_path = args.input
    output_path = args.output

    validate_runtime()

    if not os.path.exists(input_path):
        raise FileNotFoundError(f"入力ファイルが存在しません: {input_path}")
    
    # ファイル拡張子に基づいて処理を分岐
    file_extension = os.path.splitext(input_path)[1].lower()
    
    if file_extension in  [".png", ".jpg", ".jpeg", ".gif", ".tif", ".tiff", ".bmp"]:
        detect_text_image(input_path, output_path)
    elif file_extension == ".pdf":
        detect_text_pdf(input_path, output_path)
    else:
        raise ValueError(
            f"未対応のファイル形式です: {file_extension}"
            " 対応形式は png, jpg, jpeg, gif, tif, tiff, bmp, pdf です。"
        )

if __name__ == "__main__":
    main()
