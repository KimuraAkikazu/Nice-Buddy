import base64
from dotenv import load_dotenv
from openai import OpenAI
import os
from take_screenshot import screenshot
from typing import List
from models import TextContent, ImageUrl, ImageContent, Message

load_dotenv()

# 画像をbase64にエンコードする関数
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
def transform_content_for_image(base64_image, messages):
    # 最初のメッセージ（画像くれって言うやつ）を削除
    del messages[0]
    
    # 最後のメッセージを取得
    last_message = messages[-1]
    
    # 元のcontentの値を取得
    original_content = last_message.content

    # 新しいcontentをPydanticモデルで作成
    # まだ警告出る。後で直す
    new_content = [
        {
            "type": "text",
            "text": original_content  # 元のcontentを使用
        },
        {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
            }
        }
    ]
    
    # 最後のメッセージのcontentを新しいものに置き換える
    last_message.content = new_content

    return messages

def is_image_needed(answer: str):
    # chatapiの回答から画像が必要かどうかを判定する
    keyword = "code101"
    if keyword in answer:
        return True
    return False


# メインの関数
# input_messages: 過去の履歴も含めたユーザーの入力メッセージ 
# base64_image: スクショ画像をbase64エンコードしたもの
# max_tokens: 生成するテキストの最大トークン数
def chatapi(input_messages, language, base64_image = None, max_tokens = 300):
    # テスト用
    print("バックエンドで受け取ったinput_messages:", input_messages)
    
    # 新しいメッセージを先頭に追加
    if language == "ja-JP":
        system_messages = [
            {
                "role": "user",
                "content": "ユーザーが画面情報を参照して言ってそうなら、「code101」というメッセージのみ返してください。ただし、むやみやたらに「code101」と返すのはやめてください。"
            },
            {
                "role": "user",
                "content": (
                    "あなたは優秀なAIアシスタントです。できるだけ簡潔に、わかりやすく、正確に回答してください。"
                    "基本的に回答は口頭で、30~50文字程度で説明してください。しかし、もしテキストで表示したほうが良いような内容がある場合は、"
                    "前半を口頭で説明したい部分、後半をテキストで説明したい部分というように分けて、その区切りは「code102」"
                    "という文字列で行ってください。${max_tokens}トークン以内で回答してください。"
                )
            }
        ]
    elif language == "en-US":
        system_messages = [
            {
                "role": "user",
                "content": "If you are referring to the screen information, please return only the message 'code101'."
            },
            {
                "role": "user",
                "content": (
                    "You are an excellent AI assistant. Please answer as concisely, clearly, and accurately as possible."
                    "Basically, I want you to explain orally, but if there is content that should be displayed in text (such as source code),"
                    "please divide the content into parts that you want to explain orally and parts that you want to explain in text," 
                    "and use the string 'code102' as a separator. Please answer within ${max_tokens} tokens."
                    "Also, please include the part where you want to explain in text, saying that you will explain in text."
                )
            }
        ]
    else:
        print("言語が不正です。")
        return
    
    input_messages = system_messages + input_messages
    
    # OpenAI APIのクライアントを作成する.
    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    
    if (base64_image == None):
        # テキストのみの場合
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=input_messages,
            max_tokens=max_tokens,
        )
        # レスポンスの内容に応じて、スクショ画像が必要かどうかを判定する処理を追加
        if is_image_needed(response.choices[0].message.content):
            # 画像が必要な場合の処理を追加
            print("画像が必要です")
            screenshot_base64 = screenshot()
            input_messages = transform_content_for_image(screenshot_base64, input_messages)
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=input_messages,
                max_tokens=max_tokens,
            )   
        
    else:
        # テキストと画像の両方を含む場合
        input_messages = transform_content_for_image(base64_image, input_messages)
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=input_messages,
            max_tokens=max_tokens,
        )
    
    print(response.choices[0].message.content)
    return response

# def main():
#     # 画像のパス
#     image_path = "image/codeimage.png"

#     # 画像をbase64にエンコードする
#     base64_image = encode_image(image_path)

#     # チャットの応答を生成する
#     response = chatapi("この画面の下の方に映っているエラーの原因を教えて下さい。", base64_image, 1000)
#     answer = response.choices[0].message.content
#     print(answer)

#     # 区切り文字列
#     separator = "ここからテキスト説明部分に変わります"

#     # 区切り文字で分割
#     if separator in answer:
#         speech_part, text_part = answer.split(separator, 1)
#     else:
#         speech_part, text_part = answer, ""  # 区切りがない場合
        
#     print("Speech Part:")
#     print(speech_part.strip())  # 前後の空白を削除して整形
#     print("\nText Part:")
#     print(text_part.strip())

# if __name__ == "__main__":
#     main()