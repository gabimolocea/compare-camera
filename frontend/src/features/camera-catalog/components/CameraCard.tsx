import {
  Card, CardActionArea, CardContent, CardActions,
  Typography, Button, Box,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useNavigate } from "react-router-dom";
import type { Camera } from "../../../types/api";
import { useCompareTray } from "../../../context/useCompareTray";

interface Props {
  camera: Camera;
}

export default function CameraCard({ camera }: Props) {
  const { isSelected, toggle, isFull } = useCompareTray();
  const navigate = useNavigate();
  const selected = isSelected(camera.slug);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle({ slug: camera.slug, name: camera.full_name, image: camera.hero_image ?? null });
  };

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Clickable area — entire card navigates to detail page */}
      <CardActionArea
        onClick={() => navigate(`/cameras/${camera.slug}`)}
        sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        {/* Image with score badge */}
        <Box sx={{ position: "relative", bgcolor: "grey.50" }}>
          <Box
            component="img"
            src={camera.hero_image ?? "/placeholder-camera.svg"}
            alt={camera.full_name}
            sx={{
              width: "100%",
              aspectRatio: "16/9",
              objectFit: "contain",
              display: "block",
              p: 1,
            }}
          />
          {camera.overall_score != null && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                bgcolor: "#e57373",
                color: "#fff",
                borderRadius: 1,
                px: 0.75,
                py: 0.25,
                lineHeight: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, lineHeight: 1.2 }}>Score</Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 800, lineHeight: 1 }}>{camera.overall_score}</Typography>
            </Box>
          )}
        </Box>

        <CardContent sx={{ flex: 1, pb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {camera.brand.name} {camera.model_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
            {camera.short_summary}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Compare button */}
      <CardActions sx={{ pt: 0, px: 2, pb: 1.5 }}>
        <Button
          fullWidth
          variant={selected ? "contained" : "outlined"}
          color={selected ? "primary" : "inherit"}
          startIcon={<CompareArrowsIcon />}
          disabled={!selected && isFull}
          onClick={handleToggle}
          sx={{ fontWeight: 600 }}
        >
          {selected ? "Added to Compare" : isFull ? "Tray full" : "Compare"}
        </Button>
      </CardActions>
    </Card>
  );
}
