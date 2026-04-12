import {
  Box, Typography, Divider, Button, Card, CardContent,
  Chip, Stack, Rating,
} from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import EditNoteIcon from "@mui/icons-material/EditNote";
import type { Review } from "../../../types/api";
import { formatDate } from "../../../lib/format";

interface Props {
  reviews: Review[];
  onVote: (id: number) => void;
  onWriteReview?: () => void;
  canWrite: boolean;
}

function CompactReviewCard({ review, onVote }: { review: Review; onVote: (id: number) => void }) {
  return (
    <Card variant="outlined" sx={{ mb: 1.5 }}>
      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, mr: 1 }} noWrap>
            {review.author_display_name || review.author_username}
          </Typography>
          <Chip label={`${review.rating_overall}/10`} size="small" color="primary" sx={{ flexShrink: 0 }} />
        </Box>

        <Rating
          value={review.rating_overall / 2}
          precision={0.5}
          size="small"
          readOnly
          sx={{ mb: 0.5 }}
        />

        <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3, mb: 0.5 }}>
          {review.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 0.75,
          }}
        >
          {review.body}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip label={review.usage_type} size="small" variant="outlined" sx={{ fontSize: "0.65rem" }} />
          <Chip label={review.experience_level} size="small" variant="outlined" sx={{ fontSize: "0.65rem" }} />
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="caption" color="text.disabled">
            {formatDate(review.created_at)}
          </Typography>
          <Button
            size="small"
            startIcon={review.has_voted ? <ThumbUpIcon fontSize="inherit" /> : <ThumbUpOutlinedIcon fontSize="inherit" />}
            onClick={() => onVote(review.id)}
            color={review.has_voted ? "primary" : "inherit"}
            sx={{ minWidth: 0, px: 0.5, fontSize: "0.7rem" }}
          >
            {review.helpful_votes_count}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function CameraReviewsSidebar({ reviews, onVote, onWriteReview, canWrite }: Props) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 80,
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
        pr: 0.5,
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-thumb": { borderRadius: 2, bgcolor: "divider" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="overline" sx={{ fontWeight: 700, color: "text.secondary" }}>
          User Reviews ({reviews.length})
        </Typography>
        {canWrite && onWriteReview && (
          <Button
            size="small"
            variant="contained"
            startIcon={<EditNoteIcon fontSize="small" />}
            onClick={onWriteReview}
            sx={{ fontSize: "0.7rem", py: 0.25 }}
          >
            Write
          </Button>
        )}
      </Box>
      <Divider sx={{ mb: 1.5 }} />

      {reviews.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            No reviews yet.
          </Typography>
          {canWrite && onWriteReview && (
            <Button size="small" variant="outlined" onClick={onWriteReview}>
              Be the first!
            </Button>
          )}
        </Box>
      ) : (
        reviews.map((review) => (
          <CompactReviewCard key={review.id} review={review} onVote={onVote} />
        ))
      )}
    </Box>
  );
}
