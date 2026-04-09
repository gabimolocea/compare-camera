import { useState } from "react";
import {
  Box, Typography, Avatar, Button, Divider,
} from "@mui/material";
import type { Comment } from "../../../types/api";
import { formatDate } from "../../../lib/format";
import CommentForm from "./CommentForm";

interface Props {
  comments: Comment[];
  contentType: number;
  objectId: number;
  onNewComment: () => void;
}

function CommentItem({ comment, contentType, objectId, onNewComment }: {
  comment: Comment;
  contentType: number;
  objectId: number;
  onNewComment: () => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
          {(comment.user_display_name || comment.user_username || "?")[0].toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" component="span">
            {comment.user_display_name || comment.user_username}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {formatDate(comment.created_at)}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>{comment.body}</Typography>
          <Button size="small" sx={{ mt: 0.5, p: 0 }} onClick={() => setShowReplyForm((v) => !v)}>
            Reply
          </Button>
          {showReplyForm && (
            <Box sx={{ mt: 1 }}>
              <CommentForm
                contentType={contentType}
                objectId={objectId}
                parentId={comment.id}
                onSuccess={() => { setShowReplyForm(false); onNewComment(); }}
              />
            </Box>
          )}
          {comment.replies?.map((reply) => (
            <Box key={reply.id} sx={{ pl: 2, mt: 1, borderLeft: "2px solid", borderColor: "grey.200" }}>
              <CommentItem
                comment={reply}
                contentType={contentType}
                objectId={objectId}
                onNewComment={onNewComment}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default function CommentThread({ comments, contentType, objectId, onNewComment }: Props) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Comments ({comments.length})</Typography>
      <CommentForm contentType={contentType} objectId={objectId} onSuccess={onNewComment} />
      <Divider sx={{ my: 2 }} />
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} contentType={contentType} objectId={objectId} onNewComment={onNewComment} />
      ))}
    </Box>
  );
}
