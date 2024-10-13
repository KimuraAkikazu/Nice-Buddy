import { Typography } from "@mui/material";

export default function Title({ title = "引数にタイトルを入れてね" }: { title?: string }) {
  return (
    <Typography variant="h4" sx={{ borderBottom: "2px solid black", paddingBottom: "8px" }}>
      {title}
    </Typography>

  );
}
