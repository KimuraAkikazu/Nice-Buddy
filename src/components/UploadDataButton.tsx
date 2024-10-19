import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import ScreenShotButton from './ScreenShotButton'; // スクリーンショットを撮るコンポーネント
import Endpoints from '../config/Endpoints';
import AudioInput from './AudioInput';

const UploadDataButton: React.FC = () => {
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  // 録音停止時にファイルを保存するためのコールバック
  const handleAudioStop = (text: string) => {
    setSpeechText(text);
    console.log('speechTextがセットされました');
  };

  // スクリーンショット取得時に画像データを保存するためのコールバック
  const handleScreenshotCapture = (screenshot: string) => {
    setImageData(screenshot);
    console.log('画像がセットされました');
  };

  // APIに音声ファイルと画像を送信する関数
  const uploadData = async () => {
    if (!speechText || !imageData) {
      alert('音声ファイルまたはスクリーンショットがありません');
      return;
    }

    try {
      // APIにPOSTリクエストを送る（URLはAPIのエンドポイントに置き換えてください）
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_text: speechText,     // 必須
          base64_image: imageData,    // オプショナル
          max_tokens: 100             // 必須
        }),
      });

      if (!response.ok) {
        console.error('APIの呼び出しに失敗しました:', response.status);
        return;
      }
      const data = await response.json();
      console.log('APIの呼び出しに成功しました:', data);

      const answer = data.choices[0]?.message?.content || '回答がありません';
      console.log('回答:', answer);
      
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

      {/* 音声ファイルと画像データが揃っている場合にAPIへアップロード */}
      <Button
        variant="contained"
        onClick={uploadData}
        disabled={!speechText || !imageData}
      >
        データをアップロード
      </Button>
    </Box>
  );
};

export default UploadDataButton;
