import {
  Box, Typography, Grid, Card, CardContent, CardActions,
  Button, Chip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CameraIcon from "@mui/icons-material/Camera";
import type { Lens } from "../../../types/api";

interface Props {
  mount: string;
  lenses: Lens[];
}

const LENS_TYPE_COLOR: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "info"> = {
  prime: "primary",
  zoom: "secondary",
  tele: "warning",
  macro: "success",
};

function LensPlaceholder() {
  return (
    <Box
      sx={{
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        borderBottom: "1px solid",
        borderColor: "divider",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: "grey.300",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "inset 0 0 0 6px rgba(0,0,0,0.08)",
        }}
      >
        <CameraIcon sx={{ fontSize: 28, color: "grey.500" }} />
      </Box>
    </Box>
  );
}

export default function CameraLensSection({ mount, lenses }: Props) {
  if (!lenses.length) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          No popular lenses listed for the {mount} mount yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {mount} is an interchangeable-lens mount with a growing ecosystem of native optics from first-party
        and third-party manufacturers. Below are some of the most popular choices.
      </Typography>
      <Grid container spacing={2}>
        {lenses.map((lens) => (
          <Grid key={lens.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <LensPlaceholder />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>
                  {lens.name}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                  {lens.focal_length && (
                    <Chip label={lens.focal_length} size="small" variant="outlined" />
                  )}
                  {lens.max_aperture && (
                    <Chip label={lens.max_aperture} size="small" variant="outlined" />
                  )}
                  {lens.lens_type && (
                    <Chip
                      label={lens.lens_type}
                      size="small"
                      color={LENS_TYPE_COLOR[lens.lens_type] ?? "default"}
                    />
                  )}
                </Box>
              </CardContent>
              {lens.official_url && (
                <CardActions sx={{ pt: 0 }}>
                  <Button
                    size="small"
                    href={lens.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<OpenInNewIcon fontSize="inherit" />}
                  >
                    View
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
