import React from "react";
import { Box, FormControl, Select, SelectChangeEvent } from "@mui/material";

interface LanguageSelectionButtonProps {
    callbackVoicemode: (voicemode: string) => void;
}

const VoiceSelector: React.FC<LanguageSelectionButtonProps> = ({ callbackVoicemode }) => {
    const [voicemode, setVoicemode] = React.useState<string>('text');

    const handleChange = (event: SelectChangeEvent) => {
        setVoicemode(event.target.value);
        callbackVoicemode(event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            <FormControl>
                <Select
                    native
                    value={voicemode}
                    onChange={handleChange}
                    inputProps={{
                        name: 'voicemode',
                        id: 'voicemode',
                    }}
                >
                    <option value={'alloy'}>alloy</option>
                    <option value={'echo'}>echo</option>
                    <option value={'fable'}>fable</option>
                    <option value={'onyx'}>onyx</option>
                    <option value={'nova'}>nova</option>
                    <option value={'shimmer'}>shimmer</option>
                </Select>
            </FormControl>
        </Box>
    );
}

export default VoiceSelector;