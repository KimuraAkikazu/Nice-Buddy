import base64
from dotenv import load_dotenv
from openai import OpenAI
import os
from take_screenshot import screenshot

load_dotenv()

# 画像をbase64にエンコードする関数
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
def transform_content_for_image(base64_image, messages):
    # 最後のメッセージを取得
    last_message = messages[-1]
    
    # 元のcontentの値を取得
    original_content = last_message.content
    
    # 新しいcontentの構造
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
def chatapi(input_messages, base64_image = None, max_tokens = 300):
    # テスト用
    print("バックエンドで受け取ったinput_messages:", input_messages)
    
    # 新しいメッセージを先頭に追加
    system_message = {
        "role": "user",
        "content": "あなたは優秀なAIアシスタントです。できるだけ簡潔に、わかりやすく、正確に回答してください。基本的に回答は口頭で説明してほしいのですが、もしテキストで表示したほうが良いような内容（ソースコードなど）がある場合は、口頭で説明したい部分とテキストで説明したい部分に分けて、その区切りは「ここからテキスト説明部分に変わります。」という文字列で行ってください。${max_tokens}トークン以内で回答してください。また、テキストで説明するよ、という旨を口頭で説明する部分に入れてください。「ユーザーが画面情報を参照して言っている」かつ、「画像が送られてきていない」なら、「code101」というメッセージのみ返してください。"
    }
    input_messages.insert(0, system_message)
    
    # OpenAI APIのクライアントを作成する.
    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    
    if (base64_image == None):
        # テキストのみの場合
        response = client.chat.completions.create(
            model="gpt-4o-mini",
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
                model="gpt-4o-mini",
                messages=input_messages,
                max_tokens=max_tokens,
            )   
        
    else:
        # テキストと画像の両方を含む場合
        input_messages = transform_content_for_image(base64_image, input_messages)
        
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