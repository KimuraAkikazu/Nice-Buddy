import base64
from dotenv import load_dotenv
from openai import OpenAI
import os
import sys
print(sys.executable)


load_dotenv()

# 画像をbase64にエンコードする関数
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
# メインの関数
# input_messages: 過去の履歴も含めたユーザーの入力メッセージ 
# base64_image: スクショ画像をbase64エンコードしたもの
# max_tokens: 生成するテキストの最大トークン数
def chatapi(input_messages, base64_image = None, max_tokens = 300):
    # テスト用
    print("バックエンドで受け取ったinput_messages:", input_messages)
    
    # OpenAI APIのクライアントを作成する.
    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    
    if (base64_image == None):
        # チャットの応答を生成する
        # print("テキストだけでapiを叩きます")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=input_messages,
            max_tokens=max_tokens,
        )
    else:
        # チャットの応答を生成する
        # print("テキスト+画像でapiを叩きます")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=input_messages,
            max_tokens=max_tokens,
        )
    
    # print(response)
    return response

def main():
    # 画像のパス
    image_path = "image/codeimage.png"

    # 画像をbase64にエンコードする
    base64_image = encode_image(image_path)

    # チャットの応答を生成する
    response = chatapi("この画面の下の方に映っているエラーの原因を教えて下さい。", base64_image, 1000)
    answer = response.choices[0].message.content
    print(answer)

    # 区切り文字列
    separator = "ここからテキスト説明部分に変わります"

    # 区切り文字で分割
    if separator in answer:
        speech_part, text_part = answer.split(separator, 1)
    else:
        speech_part, text_part = answer, ""  # 区切りがない場合
        
    print("Speech Part:")
    print(speech_part.strip())  # 前後の空白を削除して整形
    print("\nText Part:")
    print(text_part.strip())

if __name__ == "__main__":
    main()