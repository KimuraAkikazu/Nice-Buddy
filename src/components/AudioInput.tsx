import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import './AudioInput.css';

const AudioInput: React.FC = () => {
    const [isListening, setIsListening] = useState(false);

    const toggleListening = () => {
        setIsListening(!isListening);
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            margin: '32px 0',
        }}>
            {/* isListeningがtrueのときにだけ "gradient" クラスを追加 */}
            <Button
                className={`circle ${isListening ? 'gradient' : ''}`}
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
                }}
            >
                {isListening ? "Listening..." : "Click to Start"}
            </Button>
        </Box>
    );
}

export default AudioInput;
