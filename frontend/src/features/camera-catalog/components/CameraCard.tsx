import {
  Card, CardMedia, CardContent, CardActions, Typography,
  Chip, Button, Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { Camera } from "../../../types/api";
import { formatPrice } from "../../../lib/format";

interface Props {
  camera: Camera;
  onCompare?: (camera: Camera) => void;
  compareMode?: boolean;
}

export default function CameraCard({ camera, onCompare, compareMode }: Props) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height={200}
        image={camera.hero_image ?? "/placeholder-camera.jpg"}
        alt={camera.full_name}
        sx={{ objectFit: "contain", bgcolor: "grey.50", p: 1 }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {camera.brand.name}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
          {camera.model_name}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <Chip label={camera.category} size="small" color="primary" variant="outlined" />
          {camera.mount && <Chip label={camera.mount} size="small" variant="outlined" />}
          {camera.status !== "active" && (
            <Chip label={camera.status} size="small" color="warning" />
          )}
        </Box>
        {camera.current_price_estimate && (
          <Typography variant="body2" color="text.secondary">
            ~{formatPrice(camera.current_price_estimate)}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
          {camera.short_summary}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/cameras/${camera.slug}`}>
          View specs
        </Button>
        {onCompare && (
          <Button
            size="small"
            variant={compareMode ? "contained" : "outlined"}
            onClick={() => onCompare(camera)}
          >
            {compareMode ? "Selected" : "Compare"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
