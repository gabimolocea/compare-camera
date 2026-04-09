import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

interface Props {
  message?: string;
}

export default function EmptyState({ message = "No items found." }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, color: "text.secondary" }}>
      <InboxIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
}
