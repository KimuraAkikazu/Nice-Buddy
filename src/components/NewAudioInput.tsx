import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, keyframes } from '@mui/material';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Endpoints from '../config/Endpoints';
import LanguageSelectionButton from './LanguageSelectionButton';
import VoiceSelector from './VoiceSelector';

interface AudioInputProps {
    callbackUploadResult: (speechScript: string, message: string) => void; // chatapiの結果を渡すコールバック
    chat: string[][];
}

type Message = {
    role: string;
    content: string;
};

const NewAudioInput: React.FC<AudioInputProps> = ({ callbackUploadResult, chat }) => {
    const { transcript, resetTranscript, listening } = useSpeechRecognition();
    const [maxTokens, setMaxTokens] = useState<number>(500);
    const [voicemode, setVoicemode] = useState<string>('alloy');
    const [openDialog, setOpenDialog] = useState(false); // ダイアログの開閉状態
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [language, setLanguage] = useState('ja-JP');

    // チャットデータの最大保持数。最新から何個までchatAPIに送信するか
    const MAX_MESSAGE_LENGTH = 10;

    const handleStartListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: false, language });
    };

    const handleStopListening = () => {
        SpeechRecognition.stopListening();

        //transcriptが空でない場合、音声認識結果をAPIに送信
        if (transcript) {
            uploadData(transcript);
        }
    };

    useEffect(() => {
        if (!listening) {
            handleStopListening();
        }
    }, [listening]);

    // チャットデータをAPIに送信する形式に変換する関数
    const convertToMessageObjects = (input: string[][]): Message[] => {
        // chatの要素数が10を超えた場合、最後の10個だけ取得
        const lastTenChats = input.length > MAX_MESSAGE_LENGTH ? input.slice(-MAX_MESSAGE_LENGTH) : input;

        return lastTenChats
            .filter(arr => arr.length === 2) // 要素数が2のものだけをフィルタリング
            .map(([role, content]) => ({ role, content }));
    };

    // APIに音声ファイルと画像を送信する関数
    const uploadData = async (recognizedText: string) => {
        try {
            chat.push(['user', recognizedText || '']); // チャットデータに音声認識結果を追加

            // チャットデータをAPIに送信する形式に変換
            const chat_converted = convertToMessageObjects(chat);
            console.log('chat_converted:', chat_converted);

            // APIにPOSTリクエストを送る（URLはAPIのエンドポイントに置き換えてください）
            const response = await fetch(Endpoints.ChatApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input_messages: chat_converted,
                    language,
                    max_tokens: maxTokens,
                    voicemode,
                }),
            });

            if (!response.ok) {
                console.error('APIの呼び出しに失敗しました:', response.status);
                return;
            }

            const data = await response.json();
            console.log('APIの呼び出しに成功しました:', data);

            const { speech_part_script: speechPartScript, speech_part_base64: speechPartBase64, text_part: textPart } = data;
            callbackUploadResult(speechPartScript, textPart); // 親コンポーネントに回答を渡す
            playAudioFromBase64(speechPartBase64.trim());
        } catch (error) {
            console.error('APIの呼び出し中にエラーが発生しました:', error);
        }
    };

    const playAudioFromBase64 = (base64Audio: string) => {
        const binaryString = window.atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audioRef.current = audio;
        audio.play().catch((error) => console.error('音声の再生に失敗しました:', error));

        // 音声再生終了後に次の音声入力を自動で開始
        audio.onended = handleStartListening;
    };

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);
        console.log('Language changed to:', newLanguage);
    }

    // グラデーションアニメーションの定義
    const gradientAnimation = keyframes`
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    `;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '32px 0', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
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
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={() => setOpenDialog(true)}>
                        設定
                    </Button>
                    <Button variant='contained'>停止</Button>
                </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>設定</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px', // 隙間を広げる
                        marginTop: '16px'
                    }}>
                    <LanguageSelectionButton callbackLanguage={handleLanguageChange} />
                    <TextField
                        label="最大トークン数"
                        type="number"
                        value={maxTokens}
                        onChange={e => setMaxTokens(Number(e.target.value))}
                        sx={{ marginTop: '16px', width: '100%' }}
                    />
                    <VoiceSelector callbackVoicemode={setVoicemode} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>閉じる</Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ border: '2px solid #000', borderRadius: '8px', padding: '8px', width: '70%', minHeight: '30px' }}>
                <Box sx={{ fontSize: '16px' }}>{transcript}</Box>
            </Box>
        </Box>
    );
};

export default NewAudioInput;
