import React, { useState } from 'react';
import { Box, Button, keyframes } from '@mui/material';

const AudioInput: React.FC = () => {
    const [isListening, setIsListening] = useState(false);

    const toggleListening = () => {
        setIsListening(!isListening);
    };

    // グラデーションアニメーションを定義
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
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            margin: '32px 0',
        }}>
            <Button
                onClick={toggleListening}
                sx={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '16px',
                    color: 'white',
                    backgroundColor: isListening ? 'transparent' : '#ccc', // 非リスニング時の背景色
                    transition: 'background-color 0.3s ease',
                    outline: 'none',
                    boxShadow: 'none',
                    '&:focus': {
                        outline: 'none',
                        boxShadow: '0 0 0 4px rgba(82, 243, 196, 0.5)', // カスタムフォーカススタイル
                    },
                    ...(isListening && {
                        background: 'linear-gradient(270deg, #ff6ec4, #7873f5, #52f3c4)',
                        backgroundSize: '400% 400%',
                        animation: `${gradientAnimation} 3s ease infinite`,
                    }),
                }}
            >
                {isListening ? "Listening..." : "Click to Start"}
            </Button>
        </Box>
    );
}

export default AudioInput;
