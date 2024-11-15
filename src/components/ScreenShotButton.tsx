import React from 'react';
import { Box, Button } from '@mui/material';
import Endpoints from '../config/Endpoints';

interface ScreenShotButtonProps {
    onScreenshotCapture: (screenshot: string) => void; // 画像データを渡すコールバック
}

const ScreenShotButton: React.FC<ScreenShotButtonProps> = ({ onScreenshotCapture }) => {
    // スクリーンショットAPIを呼び出す
    const takeScreenshot = async () => {
        try {
            const response = await fetch(Endpoints.ScreenShotApiUrl, {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                // body: JSON.stringify({ x1, y1, x2, y2 }),
            });

            if (!response.ok) {
                console.error('Failed to take screenshot');
                return;
            }

            const data = await response.json();
            const screenshotBase64 = data.screenshot_base64;
            console.log('Screenshot取得:', screenshotBase64);
            onScreenshotCapture(screenshotBase64);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box>
            <Button variant="contained" onClick={takeScreenshot}>
                スクショ
            </Button>
        </Box>
    );
};

export default ScreenShotButton;
