import {
  Card, CardContent, CardActions, Typography, Box, Chip,
  Button, Divider, Stack,
} from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import type { Review } from "../../../types/api";
import { formatDate } from "../../../lib/format";

interface Props {
  review: Review;
  onVote?: (id: number) => void;
}

export default function ReviewCard({ review, onVote }: Props) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{review.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              by {review.author_display_name || review.author_username} · {formatDate(review.created_at)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Chip label={`${review.rating_overall}/10`} color="primary" />
          </Box>
        </Box>

        <Stack direction="row" spacing={2} sx={{ my: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Photo: <strong>{review.rating_photo}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Video: <strong>{review.rating_video}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Value: <strong>{review.rating_value}</strong>
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={review.ownership_status} size="small" variant="outlined" />
          <Chip label={review.experience_level} size="small" variant="outlined" />
          <Chip label={review.usage_type} size="small" variant="outlined" />
        </Stack>

        <Typography variant="body2" sx={{ mb: 2 }}>{review.body}</Typography>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="success.main">Pros</Typography>
            <Typography variant="body2">{review.pros}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="error.main">Cons</Typography>
            <Typography variant="body2">{review.cons}</Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2 }}>
        <Button
          size="small"
          startIcon={review.has_voted ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          onClick={() => onVote?.(review.id)}
          color={review.has_voted ? "primary" : "inherit"}
        >
          Helpful ({review.helpful_votes_count})
        </Button>
      </CardActions>
    </Card>
  );
}
