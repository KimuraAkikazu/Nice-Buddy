import base64
from dotenv import load_dotenv
from openai import OpenAI
import  os
import sys
print(sys.executable)


load_dotenv()

# 画像をbase64にエンコードする関数
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
# メインの関数
# text: 入力に使うテキスト（音声で取得した部分）
# base64_image: スクショ画像をbase64エンコードしたもの
# max_tokens: 生成するテキストの最大トークン数
def chatapi(input_text, base64_image = None, max_tokens = 300):
   # OpenAI APIのクライアントを作成する.
    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    
    if (base64_image == None):
        # チャットの応答を生成する
        # print("テキストだけでapiを叩きます")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": input_text,
                }
            ],
            max_tokens=max_tokens,
        )
    else:
        # チャットの応答を生成する
        # print("テキスト+画像でapiを叩きます")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": input_text},  # ここに質問を書く
                        {"type": "image_url", "image_url":{"url": f"data:image/jpeg;base64,{base64_image}"}},  # 画像の指定の仕方がちょい複雑
                    ],
                }
            ],
            max_tokens=300,
        )
    
    # print(response)
    return response


# 画像のパス
image_path = "image/codeimage.png"

# 画像をbase64にエンコードする
base64_image = encode_image(image_path)

# チャットの応答を生成する
# response = chatapi("この画面の下の方に映っているエラーの原因を教えて下さい。", base64_image)

# print(response)
