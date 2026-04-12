import {
  Box, Typography, Card, CardContent, CardActionArea, CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Camera } from "../../../types/api";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface Props {
  cameras: Camera[];
  currentId: number;
}

function releaseYear(camera: Camera): string | null {
  if (!camera.release_date) return null;
  return camera.release_date.substring(0, 4);
}

export default function CameraSeriesRow({ cameras, currentId }: Props) {
  const navigate = useNavigate();

  if (!cameras.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No other cameras found in this series.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        pb: 1,
        "&::-webkit-scrollbar": { height: 6 },
        "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "divider" },
      }}
    >
      {cameras
        .filter((c) => c.id !== currentId)
        .map((camera) => (
          <Card
            key={camera.id}
            variant="outlined"
            sx={{ minWidth: 160, maxWidth: 180, flexShrink: 0 }}
          >
            <CardActionArea onClick={() => navigate(`/cameras/${camera.slug}`)}>
              {camera.hero_image ? (
                <CardMedia
                  component="img"
                  image={camera.hero_image}
                  alt={camera.full_name}
                  sx={{ objectFit: "contain", bgcolor: "grey.50", p: 1, aspectRatio: "16/9", height: "auto" }}
                />
              ) : (
                <Box
                  sx={{
                    aspectRatio: "16/9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                  }}
                >
                  <CameraAltIcon sx={{ fontSize: 40, color: "grey.400" }} />
                </Box>
              )}
              <CardContent sx={{ py: 1, px: 1.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  {camera.brand.name}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                  {camera.model_name}
                </Typography>
                {releaseYear(camera) && (
                  <Typography variant="caption" color="text.secondary">
                    {releaseYear(camera)}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
    </Box>
  );
}
