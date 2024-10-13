import React, { useState, useRef } from 'react';
import { Button, Box } from '@mui/material';

const RecButton: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // 録音を開始する
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      saveAudioFile(audioBlob); // ファイルとして保存
      audioChunks.current = []; // チャンクをリセット
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // 録音を停止する
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // 録音データをWAVファイルとして保存
  const saveAudioFile = (audioBlob: Blob) => {
    const a = document.createElement('a');
    const url = URL.createObjectURL(audioBlob);
    a.href = url;
    a.download = 'recording.wav';  // ファイル名を指定
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ marginBottom: '32px'}}>
      <Button
        variant="contained"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? '録音停止' : '録音開始'}
      </Button>
    </Box>
  );
};

export default RecButton;
