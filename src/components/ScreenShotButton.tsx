import React, { useRef, useState } from 'react';
import { Box, Button } from '@mui/material';

interface ScreenShotButtonProps {
    onScreenshotCapture: (screenshot: string) => void; // 画像データを渡すコールバック
}

const ScreenShotButton: React.FC<ScreenShotButtonProps> = ({ onScreenshotCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    // 画面キャプチャを開始する関数
    const startCapture = async () => {
        console.log('startCapture');
        try {
            console.log('try');
            const captureStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: 'always' } as any,
                audio: false,
            });

            if (videoRef.current) {
                console.log('videoRef');
                videoRef.current.srcObject = captureStream;

                // Videoストリームの解像度を取得してCanvasに反映
                const videoTrack = captureStream.getVideoTracks()[0];
                const settings = videoTrack.getSettings();

                if (canvasRef.current) {
                    // Canvasのサイズをビデオストリームの解像度に合わせる
                    canvasRef.current.width = settings.width || 1920; // デフォルト幅（例: 1920）
                    canvasRef.current.height = settings.height || 1080; // デフォルト高さ（例: 1080）
                }

                setIsCapturing(true);
                console.log('timeoutの前');
                setTimeout(() => {
                    takeScreenshot(captureStream); // captureStreamを直接渡す
                }, 3000); //なるべく最短で
            }
            console.log('try終了');
        } catch (err) {
            console.error('Error starting capture:', err);
        }
    };

    // スクリーンショットを撮る関数
    const takeScreenshot = (captureStream: MediaStream) => {
        console.log('takeScreenshot');
        console.log('canvasRef.current:', canvasRef.current);
        console.log('videoRef.current:', videoRef.current);
        if (canvasRef.current && videoRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // CanvasにVideoのフレームを描画
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                // Base64形式の画像データを取得
                const image = canvas.toDataURL('image/png');
                onScreenshotCapture(image); // 親コンポーネントにスクリーンショットを渡す
            }

            // スクリーンショットを撮った後、画面共有を終了
            const tracks = captureStream.getTracks();
            tracks.forEach((track) => track.stop()); // すべてのトラックを停止
            setIsCapturing(false); // キャプチャ状態を終了
            console.log('キャプチャ終了');
        }
    };

    return (
        <Box>
            {isCapturing && <p>画面キャプチャ中...</p>}
            <Button variant="contained" onClick={startCapture} disabled={isCapturing}>
                スクリーンショットを撮る
            </Button>
            <video ref={videoRef} autoPlay style={{ visibility: 'hidden', width: '0', height: '0' }}></video>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

        </Box>
    );
};

export default ScreenShotButton;
