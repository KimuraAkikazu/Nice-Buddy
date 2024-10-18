# %%
import base64
from dotenv import load_dotenv
from openai import OpenAI
import  os

load_dotenv()

# 画像をbase64にエンコードする関数
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# 画像のパス
image_path = "codeimage.png"

# 画像をbase64にエンコードする
base64_image = encode_image(image_path)

# OpenAI APIのクライアントを作成する.
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

# チャットの応答を生成する
response = client.chat.completions.create(
    # model の名前は gpt-4-vision-previewが使えなくなったので、以下に変更.
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "この画面の下の方に映っているエラーの原因を教えて下さい。"},  # ここに質問を書く
                {"type": "image_url", "image_url":{"url": f"data:image/jpeg;base64,{base64_image}"}},  # 画像の指定の仕方がちょい複雑
            ],
        }
    ],
    max_tokens=300,
)

# 応答を表示する
print(response.choices[0])
