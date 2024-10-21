import base64
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

# 画像をbase64にエンコードする関数
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
# メインの関数
# input_messages: 過去の履歴も含めたユーザーの入力メッセージ 
# base64_image: スクショ画像をbase64エンコードしたもの
# max_tokens: 生成するテキストの最大トークン数
def chatapi(input_messages, language, base64_image = None, max_tokens = 300):
    # テスト用
    print("バックエンドで受け取ったinput_messages:", input_messages)
    
    # 新しいメッセージを先頭に追加
    if language == "ja-JP":
        system_message = {
            "role": "user",
            "content": "あなたは優秀なAIアシスタントです。できるだけ簡潔に、わかりやすく、正確に回答してください。基本的に回答は口頭で説明してほしいのですが、もしテキストで表示したほうが良いような内容（ソースコードなど）がある場合は、口頭で説明したい部分とテキストで説明したい部分に分けて、その区切りは「code102」という文字列で行ってください。${max_tokens}トークン以内で回答してください。また、テキストで説明するよ、という旨を口頭で説明する部分に入れてください。"
        }
    elif language == "en-US":
        system_message = {
            "role": "user",
            "content": "You are an excellent AI assistant. Please respond as concisely, clearly, and accurately as possible. Generally, I would like you to explain things verbally, but if it's better to display certain information (such as source code) as text, divide the verbal explanation and the text explanation with the string 'code102'. Keep the response within ${max_tokens} tokens. Also, include in your verbal explanation a note mentioning that you will provide certain parts as text."
        }
    else:
        print("言語が不正です。")
        return
    
    input_messages.insert(0, system_message)
    
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