import {
  Box, Typography, Chip, Button, Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { CameraDetail } from "../../../types/api";
import { formatDate, formatPrice } from "../../../lib/format";

interface Props {
  camera: CameraDetail;
}

export default function CameraHeader({ camera }: Props) {
  return (
    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mb: 4 }}>
      <Box
        component="img"
        src={camera.hero_image ?? "/placeholder-camera.jpg"}
        alt={camera.full_name}
        sx={{ width: 300, height: 250, objectFit: "contain", bgcolor: "grey.50", borderRadius: 2, p: 2 }}
      />
      <Box sx={{ flex: 1, minWidth: 240 }}>
        <Typography variant="caption" color="text.secondary">{camera.brand.name}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>{camera.model_name}</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
          <Chip label={camera.category} color="primary" />
          {camera.mount && <Chip label={`Mount: ${camera.mount}`} variant="outlined" />}
          <Chip label={camera.status} color={camera.status === "active" ? "success" : "default"} />
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {camera.short_summary}
        </Typography>
        <Box sx={{ mb: 2 }}>
          {camera.msrp && (
            <Typography variant="h6" color="primary">
              MSRP: {formatPrice(camera.msrp)}
            </Typography>
          )}
          {camera.release_date && (
            <Typography variant="body2" color="text.secondary">
              Released: {formatDate(camera.release_date)}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" component={Link} to={`/compare?left=${camera.slug}`}>
            Compare
          </Button>
          {camera.official_url && (
            <Button variant="outlined" href={camera.official_url} target="_blank" rel="noopener noreferrer">
              Official page
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
