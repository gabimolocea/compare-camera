import {
  Container, Box, Typography, Avatar, Divider, Chip, Stack, Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";
import type { User, Review } from "../types/api";
import ReviewCard from "../features/reviews/components/ReviewCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();

  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ["user", username],
    queryFn: async () => {
      const { data } = await apiClient.get(`/auth/users/${username}/`);
      return data;
    },
    enabled: !!username,
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["user-reviews", username],
    queryFn: async () => {
      const { data } = await apiClient.get("/reviews/", { params: { author__username: username } });
      return data.results ?? data;
    },
    enabled: !!username,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !user) return <ErrorState message="User not found." />;

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Avatar
            src={user.avatar ?? undefined}
            sx={{ width: 80, height: 80, fontSize: 32 }}
          >
            {user.username[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {user.display_name || user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">@{user.username}</Typography>
            {user.bio && <Typography variant="body2" sx={{ mt: 1 }}>{user.bio}</Typography>}
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip label={`Role: ${user.role}`} size="small" />
              <Chip label={`Reputation: ${user.reputation_score}`} size="small" color="primary" />
            </Stack>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>Reviews</Typography>
      <Divider sx={{ mb: 2 }} />
      {!reviews || reviews.length === 0 ? (
        <EmptyState message="No reviews yet." />
      ) : (
        reviews.map((r) => <ReviewCard key={r.id} review={r} />)
      )}
    </Container>
  );
}
