import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface LanguageSelectionButtonProps {
    callbackVoicemode: (voicemode: string) => void;
}

const VoiceSelector: React.FC<LanguageSelectionButtonProps> = ({ callbackVoicemode }) => {
    const [voicemode, setVoicemode] = React.useState<string>('alloy');

    const handleChange = (event: SelectChangeEvent) => {
        setVoicemode(event.target.value);
        callbackVoicemode(event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="voicemode-label">Voice</InputLabel>
                <Select
                    labelId="voicemode-label"
                    value={voicemode}
                    onChange={handleChange}
                    label="Voice"
                >
                    <MenuItem value={'alloy'}>alloy</MenuItem>
                    <MenuItem value={'echo'}>echo</MenuItem>
                    <MenuItem value={'fable'}>fable</MenuItem>
                    <MenuItem value={'onyx'}>onyx</MenuItem>
                    <MenuItem value={'nova'}>nova</MenuItem>
                    <MenuItem value={'shimmer'}>shimmer</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default VoiceSelector;
