import {
  Box, Container, Typography, Button, Grid, Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCameras } from "../api/cameras";
import CameraCard from "../features/camera-catalog/components/CameraCard";
import LoadingState from "../components/common/LoadingState";

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["cameras", "recent"],
    queryFn: () => getCameras({ page: 1 }),
  });

  return (
    <Container maxWidth="lg">
      {/* Hero */}
      <Box
        sx={{
          textAlign: "center", py: 10, mb: 6,
          background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
          borderRadius: 4, color: "white",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
          Compare cameras like a pro
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.85, mb: 4 }}>
          Full specs, real reviews, community-verified data.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="contained" color="secondary" size="large" component={Link} to="/cameras">
            Browse Catalog
          </Button>
          <Button variant="outlined" sx={{ color: "white", borderColor: "white" }} size="large" component={Link} to="/compare">
            Compare Cameras
          </Button>
        </Box>
      </Box>

      {/* Recent cameras */}
      <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
        Recently released
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {isLoading ? (
        <LoadingState />
      ) : (
        <Grid container spacing={2}>
          {data?.results.slice(0, 6).map((camera) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={camera.id}>
              <CameraCard camera={camera} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="outlined" component={Link} to="/cameras">
          View all cameras
        </Button>
      </Box>
    </Container>
  );
}
