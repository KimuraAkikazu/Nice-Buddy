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
                <Box 
                    key={index}
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        margin: '8px 16px',
                    }}
                >
                    <Box
                        sx={{
                            padding: '8px 16px',
                            backgroundColor: '#f1f0f0',
                            borderRadius: '15px 15px 15px 0', // 吹き出しの形状
                            maxWidth: '80%', // 幅を制限
                            wordWrap: 'break-word',
                            boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                        }}
                    >
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                            {chat}
                        </Typography>
                    </Box>
                </Box>
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