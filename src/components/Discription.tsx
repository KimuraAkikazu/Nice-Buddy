import { Box, Typography } from "@mui/material";

export default function Discription({ discription }: { discription: string[] }) {
    return (
        <Box sx={{ margin: '0 10% 16px 10%'}}>
            {discription.map((discription, index) => (
                <Typography key={index} variant="body1">
                    {discription}
                </Typography>
            ))}
        </Box>
    );
}

/*
    コメントの内容はApp.tsxで指定
    テキストを中央揃えにしているが、後ほど検討する必要あり
*/