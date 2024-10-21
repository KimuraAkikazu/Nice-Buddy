from PIL import ImageGrab
import base64
from io import BytesIO

def screenshot():
    # 全体のスクリーンショットを取得
    screenshot = ImageGrab.grab()

    # Imageオブジェクトをバイナリ形式に変換
    buffer = BytesIO() # メモリ上で扱う関数
    screenshot.save(buffer, format="PNG")  # PNGで保存
    binary_screenshot = buffer.getvalue()

    # バイナリデータをbase64にエンコード
    encoded_screenshot = base64.b64encode(binary_screenshot).decode('utf-8')

    # エンコード結果を返す
    return encoded_screenshot
