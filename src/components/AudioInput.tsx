import React, { useEffect } from 'react';
import { Box, Button, keyframes } from '@mui/material';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface AudioInputProps {
    callbackSpeechResult: (message: string) => void; // 音声認識結果を渡すコールバック
}

const AudioInput: React.FC<AudioInputProps> = ({ callbackSpeechResult }) => {
    const { transcript, resetTranscript, listening } = useSpeechRecognition();

    const handleStartListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: false, language: 'ja-JP' });
    };

    const handleStopListening = () => {
        SpeechRecognition.stopListening();
        callbackSpeechResult(transcript); // 認識結果を親コンポーネントに渡す
    };

    // 音声認識が停止したら自動的に結果を処理
    useEffect(() => {
        if (!listening) {
            handleStopListening();
        }
    }, [listening]);

    // グラデーションアニメーションの定義
    const gradientAnimation = keyframes`
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    `;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
            <Button
                onClick={listening ? handleStopListening : handleStartListening}
                sx={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '16px',
                    color: 'white',
                    backgroundColor: listening ? 'transparent' : '#ccc',
                    transition: 'background-color 0.3s ease',
                    outline: 'none',
                    boxShadow: 'none',
                    '&:focus': {
                        outline: 'none',
                        boxShadow: '0 0 0 4px rgba(82, 243, 196, 0.5)',
                    },
                    ...(listening && {
                        background: 'linear-gradient(270deg, #ff6ec4, #7873f5, #52f3c4)',
                        backgroundSize: '400% 400%',
                        animation: `${gradientAnimation} 3s ease infinite`,
                    }),
                }}
            >
                {listening ? 'Listening...' : 'Click to Start'}
            </Button>
            <Box sx={{ marginLeft: '16px', fontSize: '16px' }}>
                {transcript}
            </Box>
        </Box>
    );
};

export default AudioInput;
