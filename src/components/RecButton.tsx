import React, { useState, useRef } from 'react';
import { Button, Box } from '@mui/material';

interface RecButtonProps {
  onAudioStop: (audioBlob: Blob) => void; // 録音データを渡すコールバック
}

const RecButton: React.FC<RecButtonProps> = ({ onAudioStop }) => {
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
      onAudioStop(audioBlob); // 親コンポーネントに音声データを渡す
      audioChunks.current = [];
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // 録音を停止する
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
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
