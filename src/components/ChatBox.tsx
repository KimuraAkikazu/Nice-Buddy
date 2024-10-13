import { Typography, Box } from "@mui/material";

export default function ChatBox({ chat }: { chat: string[] }) {
    return (
        <Box sx={{ margin: '0 10% 16px 10%', border: 'solid', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Box sx={{display: 'flex', justifyContent: 'flex-start', margin: '8px'}}>
                <Typography variant="h6" sx={{borderBottom: 'solid'}}>
                    回答テキスト
                </Typography>
            </Box>
            {chat.map((chat, index) => (
                <Typography key={index} variant="body1" sx={{display: 'flex', justifyContent: 'flex-start', margin: '0 16px'}}>
                    {chat}
                </Typography>
            ))}
        </Box>
    );
}

/*
    <Typography key={index} variant="body1" sx={{ whiteSpace: 'pre-line' }}>
        {chat}
    </Typography>
    として改行を反映させることが可能？chatAPIの出力テキストがどうなっているかによる。
*/