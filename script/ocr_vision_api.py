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
from google.cloud import vision
import PyPDF2
from google.cloud.vision_v1 import types  # 追加

def detect_text_image(image_path, output_path):
    """画像ファイルからテキストを検出し、テキストファイルに保存"""
    client = vision.ImageAnnotatorClient()
    
    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()
    
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    
    if response.error.message:
        raise Exception(f"Error: {response.error.message}")
    
    text = response.text_annotations[0].description if response.text_annotations else ""
    
    with open(output_path, 'w', encoding='utf-8') as output_file:
        output_file.write(text)
    
    print(f"Text extracted from {image_path} and saved to {output_path}")

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

    print(f"Text extracted from {pdf_path} and saved to {output_path}")

def main():
    parser = argparse.ArgumentParser(description="OCR text from an image or PDF using Google Cloud Vision API")
    parser.add_argument("-i", "--input", required=True, help="Path to input image or PDF file")
    parser.add_argument("-o", "--output", required=True, help="Path to output text file")
    
    args = parser.parse_args()
    
    input_path = args.input
    output_path = args.output
    
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file {input_path} does not exist")
    
    # ファイル拡張子に基づいて処理を分岐
    file_extension = os.path.splitext(input_path)[1].lower()
    
    if file_extension in  [".png", ".jpg", ".jpeg", ".gif", ".tif", ".tiff", ".bmp"]:
        detect_text_image(input_path, output_path)
    elif file_extension == ".pdf":
        detect_text_pdf(input_path, output_path)
    else:
        raise ValueError(f"Unsupported file type: {file_extension}")

if __name__ == "__main__":
    main()