import { useState, type FormEvent } from "react";
import { Box, TextField, Button } from "@mui/material";
import { createComment } from "../../../api/comments";
import { isAuthenticated } from "../../../api/auth";
import { useSnackbar } from "../../../app/SnackbarContext";

interface Props {
  contentType: number;
  objectId: number;
  parentId?: number;
  onSuccess: () => void;
}

export default function CommentForm({ contentType, objectId, parentId, onSuccess }: Props) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  if (!isAuthenticated()) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      await createComment({ body, content_type: contentType, object_id: objectId, parent: parentId ?? null });
      setBody("");
      onSuccess();
      showSnackbar("Comment posted!", "success");
    } catch {
      showSnackbar("Failed to post comment.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1, mb: 2 }}>
      <TextField
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment…"
        size="small"
        multiline
        minRows={2}
        fullWidth
      />
      <Button type="submit" variant="contained" disabled={loading || !body.trim()} sx={{ alignSelf: "flex-end" }}>
        Post
      </Button>
    </Box>
  );
}
