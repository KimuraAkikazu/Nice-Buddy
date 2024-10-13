import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import ScreenShotButton from './ScreenShotButton'; // スクリーンショットを撮るコンポーネント
import RecButton from './RecButton'; // 録音をするコンポーネント
import Endpoints from '../config/Endpoints';

const UploadDataButton: React.FC = () => {
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  
  // 録音停止時にファイルを保存するためのコールバック
  const handleAudioStop = (audioBlob: Blob) => {
    setAudioFile(audioBlob);
    console.log('audioがセットされました');
  };

  // スクリーンショット取得時に画像データを保存するためのコールバック
  const handleScreenshotCapture = (screenshot: string) => {
    setImageData(screenshot);
    console.log('画像がセットされました');
  };

  // APIに音声ファイルと画像を送信する関数
  const uploadData = async () => {
    if (!audioFile || !imageData) {
      alert('音声ファイルまたはスクリーンショットがありません');
      return;
    }

    // フォームデータを作成
    const formData = new FormData();
    formData.append('audio', audioFile, 'recording.wav');
    formData.append('screenshot', imageData);

    try {
      // APIにPOSTリクエストを送る（URLはAPIのエンドポイントに置き換えてください）
      const response = await fetch(Endpoints.SendImageAndTextBaseUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('データのアップロードに成功しました');
      } else {
        alert('データのアップロードに失敗しました');
      }
    } catch (error) {
      console.error('APIの呼び出し中にエラーが発生しました:', error);
      alert('APIの呼び出し中にエラーが発生しました');
    }
  };

  return (
    <Box>
      {/* スクリーンショットを撮るコンポーネント */}
      <ScreenShotButton onScreenshotCapture={handleScreenshotCapture} />
      
      {/* 録音をするコンポーネント */}
      <RecButton onAudioStop={handleAudioStop} />
      
      {/* 音声ファイルと画像データが揃っている場合にAPIへアップロード */}
      <Button
        variant="contained"
        onClick={uploadData}
        disabled={!audioFile || !imageData}
      >
        データをアップロード
      </Button>
    </Box>
  );
};

export default UploadDataButton;
