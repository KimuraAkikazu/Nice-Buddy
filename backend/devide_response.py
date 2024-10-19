def divide_response(answer: str):
    # 区切り文字列
    separator = "ここからテキスト説明部分に変わります"

    # 区切り文字で分割
    if separator in answer:
        speech_part, text_part = answer.split(separator, 1)
    else:
        speech_part, text_part = answer, ""  # 区切りがない場合
        
    return speech_part, text_part