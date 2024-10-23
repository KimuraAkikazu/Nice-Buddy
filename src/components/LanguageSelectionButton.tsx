import React, { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";

interface LanguageSelectionButtonProps {
    callbackLanguage: (language: string) => void;
}

const LanguageSelectionButton: React.FC<LanguageSelectionButtonProps> = ({ callbackLanguage }) => {
    const [language, setLanguage] = useState<string>('ja-JP');

    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newLanguage: string | null
    ) => {
        if (newLanguage) {
            setLanguage(newLanguage); // 言語の状態を更新
            callbackLanguage(newLanguage); // コールバック関数を呼び出し
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            <ToggleButtonGroup
                value={language}
                exclusive
                onChange={handleChange}
                aria-label="Language selection"
            >
                <ToggleButton value="ja-JP" aria-label="Japanese">
                    Ja
                </ToggleButton>
                <ToggleButton value="en-US" aria-label="English">
                    En
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default LanguageSelectionButton;
