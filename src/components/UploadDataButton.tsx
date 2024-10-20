import React, { useState } from 'react';
import { Button, Box, TextField } from '@mui/material';
import ScreenShotButton from './ScreenShotButton'; // スクリーンショットを撮るコンポーネント
import Endpoints from '../config/Endpoints';
import AudioInput from './AudioInput';

interface UploadDataButtonProps {
  callbackUploadResult: (speech: string, message: string) => void; // chatapiの結果を渡すコールバック
  chat: string[][];
}

type Message = {
  role: string;
  content: string;
};

const UploadDataButton: React.FC<UploadDataButtonProps> = ({callbackUploadResult, chat}) => {
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [maxTokens, setMaxTokens] = useState<number>(100);

  // 録音停止時にファイルを保存するためのコールバック
  const handleAudioStop = (text: string) => {
    setSpeechText(text);
    console.log('speechTextがセットされました');
    chat.push(['user', text]);
    console.log('chatにspeechTextが追加されました');
    console.log('chat:', chat);
  };

  // スクリーンショット取得時に画像データを保存するためのコールバック
  const handleScreenshotCapture = (screenshot: string) => {
    setImageData(screenshot);
    console.log('画像がセットされました');
  };

  // チャットデータをAPIに送信する形式に変換する関数
  const convertToMessageObjects = (input: string[][]): Message[] => {
    return input
      .filter(arr => arr.length === 2) // 要素数が2のものだけをフィルタリング
      .map(([role, content]) => ({ role, content }));
  };

  // APIに音声ファイルと画像を送信する関数
  const uploadData = async () => {
    try {
      // チャットデータをAPIに送信する形式に変換
      const chat_converted = convertToMessageObjects(chat);
      console.log('chat_converted:', chat_converted);

      // APIにPOSTリクエストを送る（URLはAPIのエンドポイントに置き換えてください）
      const response = await fetch(Endpoints.ChatApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_messages: chat_converted,     // 必須
          base64_image: imageData,    // オプショナル
          max_tokens: maxTokens            // 必須
        }),
      });

      if (!response.ok) {
        console.error('APIの呼び出しに失敗しました:', response.status);
        return;
      }
      const data = await response.json();
      console.log('APIの呼び出しに成功しました:', data);

      const { speech_part: speechPartBase64, text_part: textPart} = data;
      console.log('speechPartBase64:', speechPartBase64);
      // なんかうまくいかない。テストデータではtrimしたらうまくいった
      callbackUploadResult(speechPartBase64.trim(), textPart); // 親コンポーネントに回答を渡す

    } catch (error) {
      console.error('APIの呼び出し中にエラーが発生しました:', error);
    }
  };

  return (
    <Box>
      {/* スクリーンショットを撮るコンポーネント */}
      <ScreenShotButton onScreenshotCapture={handleScreenshotCapture} />

      {/* 録音をするコンポーネント */}
      <AudioInput callbackSpeechResult={handleAudioStop} />

      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <TextField id='outlined-basic' label='最大トークン数' variant='outlined' type='number' value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} sx={{ margin: '16px', width: '128px'}}/>

      {/* 音声ファイルと画像データが揃っている場合にAPIへアップロード */}
      <Button
        variant="contained"
        onClick={uploadData}
        disabled={!speechText}
        sx={{ margin: '16px' }}
      >
        データをアップロード
      </Button>
      </Box>
    </Box>
  );
};

export default UploadDataButton;
