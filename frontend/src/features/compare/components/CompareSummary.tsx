import {
  Box, Typography, Grid, Paper, Chip, Stack,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import type { CompareResult, CameraDetail } from "../../../types/api";
import { formatPrice } from "../../../lib/format";
import CameraScorePanel from "../../camera-detail/components/CameraScorePanel";

interface Props {
  result: CompareResult;
  cameraDetails: (CameraDetail | undefined)[];
}

const SECTION_LABELS: Record<string, string> = {
  sensor: "Sensor",
  screen: "Screen & Viewfinder",
  autofocus: "Autofocus",
  shooting: "Shooting",
  video: "Video",
  connectivity: "Connectivity",
  physical: "Physical",
};

const COL_COLORS = ["primary", "secondary", "success", "warning"] as const;

export default function CompareSummary({ result, cameraDetails }: Props) {
  const n = result.cameras.length;
  const gridSize = Math.floor(12 / n) as 1 | 2 | 3 | 4 | 5 | 6 | 12;

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {result.cameras.map((cam, idx) => {
          const detail = cameraDetails[idx];
          return (
            <Grid size={{ xs: 6, md: gridSize }} key={cam.id}>
              <Paper sx={{ p: 2 }}>
                {/* Score panel + image: stacks vertically on xs, side-by-side on sm+ */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1,
                    mb: 1,
                    alignItems: "stretch",
                  }}
                >
                  {detail && <CameraScorePanel camera={detail} direction="responsive" />}
                  <Box
                    component="img"
                    src={cam.hero_image ?? "/placeholder-camera.svg"}
                    alt={cam.name}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      objectFit: "contain",
                      bgcolor: "grey.50",
                      borderRadius: 2,
                      p: 1,
                      aspectRatio: "16/9",
                      height: "auto",
                      width: "100%",
                    }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: "center" }}>{cam.name}</Typography>
                {cam.msrp && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, textAlign: "center" }}>
                    ~{formatPrice(parseFloat(cam.msrp))}
                  </Typography>
                )}
                <Box sx={{ textAlign: "center" }}>
                  <Chip
                    label={`Camera ${idx + 1}`}
                    color={COL_COLORS[idx]}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Typography variant="h6" gutterBottom>Winner by section</Typography>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        {Object.entries(result.winner_by_section).map(([section, winnerIndices]) => {
          const label = SECTION_LABELS[section] ?? section;
          const isTied = winnerIndices.length === 0 || winnerIndices.length === n;
          const winnerLabel = isTied
            ? "Tie"
            : winnerIndices.map((i) => result.cameras[i]?.name ?? `#${i + 1}`).join(" & ");

          return (
            <Chip
              key={section}
              icon={!isTied ? <EmojiEventsIcon /> : undefined}
              label={`${label}: ${winnerLabel}`}
              color={!isTied ? COL_COLORS[winnerIndices[0]] : "default"}
              variant="outlined"
            />
          );
        })}
      </Stack>
    </Box>
  );
}
