import base64
from openai import OpenAI

def text_to_speech_base64(input_text: str, model: str = "tts-1", voice: str = "alloy") -> str:
    """
    テキストを音声に変換し、Base64でエンコードされた音声データを返す関数

    :param input_text: 音声合成するテキスト
    :param model: 使用する音声合成モデル
    :param voice: 使用する音声のタイプ
    :return: Base64エンコードされた音声データ
    """
    # OpenAIクライアントの初期化
    client = OpenAI()

    # 音声生成のリクエストを送信
    response = client.audio.speech.create(
        model=model,
        voice=voice,
        input=input_text
    )

    # バイナリデータを取得
    audio_content = response.content  # .contentでバイナリデータを取得

    # Base64エンコード
    audio_base64 = base64.b64encode(audio_content).decode('utf-8')

    # Base64エンコードされた音声データを戻り値として返す
    return audio_base64