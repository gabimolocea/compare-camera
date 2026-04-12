import {
  Box, Typography, Button, Grid, Divider,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ReviewCard from "../../reviews/components/ReviewCard";
import type { Review } from "../../../types/api";

interface Props {
  reviews: Review[];
  onVote: (id: number) => void;
  onWriteReview?: () => void;
  canWrite: boolean;
  cameraName: string;
}

export default function CameraReviewsSection({ reviews, onVote, onWriteReview, canWrite, cameraName }: Props) {
  return (
    <Box id="reviews" sx={{ mt: 6 }}>
      <Divider sx={{ mb: 4 }} />
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            User Reviews
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {reviews.length === 0
              ? `Be the first to review the ${cameraName}`
              : `${reviews.length} review${reviews.length !== 1 ? "s" : ""} for the ${cameraName}`}
          </Typography>
        </Box>
        {canWrite && onWriteReview && (
          <Button
            variant="contained"
            startIcon={<EditNoteIcon />}
            onClick={onWriteReview}
          >
            Write a Review
          </Button>
        )}
      </Box>

      {reviews.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
          <Typography variant="body1">No reviews yet.</Typography>
          {canWrite && onWriteReview && (
            <Button variant="outlined" sx={{ mt: 2 }} onClick={onWriteReview}>
              Be the first to review
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2}>
          {reviews.map((review) => (
            <Grid key={review.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <ReviewCard review={review} onVote={onVote} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
