import {
  Box, Typography, Card, CardActionArea, CardMedia, CardContent,
  Chip, Divider, Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CameraIcon from "@mui/icons-material/Camera";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { Camera, Lens } from "../../../types/api";

interface Props {
  seriesCameras: Camera[];
  lenses: Lens[];
  mount: string;
  currentId: number;
}

const LENS_TYPE_COLOR: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "info"> = {
  prime: "primary",
  zoom: "secondary",
  tele: "warning",
  macro: "success",
};

export default function CameraRelatedSidebar({ seriesCameras, lenses, mount, currentId }: Props) {
  const navigate = useNavigate();
  const hasRelated = seriesCameras.filter((c) => c.id !== currentId).length > 0;
  const hasLenses = lenses.length > 0 && mount && mount !== "Fixed Lens";

  if (!hasRelated && !hasLenses) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Related cameras in the same series */}
      {hasRelated && (
        <Box>
          <Typography
            variant="overline"
            sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1 }}
          >
            Related Cameras
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {seriesCameras
              .filter((c) => c.id !== currentId)
              .map((camera) => (
                <Card key={camera.id} variant="outlined">
                  <CardActionArea
                    onClick={() => navigate(`/cameras/${camera.slug}`)}
                    sx={{ display: "flex", alignItems: "center", p: 1, gap: 1.5 }}
                  >
                    {camera.hero_image ? (
                      <CardMedia
                        component="img"
                        image={camera.hero_image}
                        alt={camera.full_name}
                        sx={{ width: 80, aspectRatio: "16/9", height: "auto", objectFit: "contain", flexShrink: 0, bgcolor: "grey.50", borderRadius: 1 }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 80, aspectRatio: "16/9", flexShrink: 0, borderRadius: 1,
                          bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <CameraAltIcon sx={{ color: "grey.400", fontSize: 28 }} />
                      </Box>
                    )}
                    <CardContent sx={{ p: "0 !important", flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
                        {camera.brand.name}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }} noWrap>
                        {camera.model_name}
                      </Typography>
                      {camera.release_date && (
                        <Typography variant="caption" color="text.disabled">
                          {camera.release_date.substring(0, 4)}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
          </Box>
        </Box>
      )}

      {hasRelated && hasLenses && <Divider />}

      {/* Recommended lenses */}
      {hasLenses && (
        <Box>
          <Typography
            variant="overline"
            sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 1 }}
          >
            Recommended {mount} Lenses
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {lenses.map((lens) => (
              <Card key={lens.id} variant="outlined">
                <Box
                  sx={{
                    height: 72,
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "grey.300",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "inset 0 0 0 5px rgba(0,0,0,0.08)",
                    }}
                  >
                    <CameraIcon sx={{ fontSize: 20, color: "grey.500" }} />
                  </Box>
                </Box>
                <Box sx={{ p: 1.25 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.5 }}>
                    {lens.name}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 0.5 }}>
                    {lens.focal_length && (
                      <Chip label={lens.focal_length} size="small" variant="outlined" sx={{ fontSize: "0.65rem" }} />
                    )}
                    {lens.max_aperture && (
                      <Chip label={lens.max_aperture} size="small" variant="outlined" sx={{ fontSize: "0.65rem" }} />
                    )}
                    {lens.lens_type && (
                      <Chip
                        label={lens.lens_type}
                        size="small"
                        color={LENS_TYPE_COLOR[lens.lens_type] ?? "default"}
                        sx={{ fontSize: "0.65rem" }}
                      />
                    )}
                  </Box>
                  {lens.official_url && (
                    <Link
                      href={lens.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="caption"
                      sx={{ display: "inline-flex", alignItems: "center", gap: 0.25 }}
                    >
                      View <OpenInNewIcon sx={{ fontSize: 10 }} />
                    </Link>
                  )}
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
