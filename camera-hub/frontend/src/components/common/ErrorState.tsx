import { Alert } from "@mui/material";

interface Props {
  message?: string;
}

export default function ErrorState({ message = "Something went wrong." }: Props) {
  return <Alert severity="error" sx={{ my: 2 }}>{message}</Alert>;
}
