from PIL import ImageGrab, Image
import base64
from io import BytesIO

def encode_base64(img):
    buffer = BytesIO()
    try:
        img.save(buffer, format="PNG")
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode('utf-8')
    except Exception as e:
        print(f"Error saving image: {e}")
        return None

def selected_area_screenshot(x1, y1, x2, y2):
    # 座標に基づいてスクリーンショットを取得
    screenshot = ImageGrab.grab((x1, y1, x2, y2))

    # Base64 にエンコード
    screenshot_base64 = encode_base64(screenshot)
    return screenshot_base64
