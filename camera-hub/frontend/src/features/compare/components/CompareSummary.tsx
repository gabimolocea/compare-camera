import {
  Box, Typography, Grid, Paper, Chip, Stack,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import type { CompareResult } from "../../../types/api";

interface Props {
  result: CompareResult;
}

const SECTION_LABELS: Record<string, string> = {
  sensor: "Sensor",
  video: "Video",
  body: "Body / Portability",
  autofocus: "Autofocus",
  connectivity: "Connectivity",
};

export default function CompareSummary({ result }: Props) {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { side: "left", camera: result.overview.left },
          { side: "right", camera: result.overview.right },
        ].map(({ side, camera }) => (
          <Grid size={6} key={side}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              {camera.hero_image && (
                <Box component="img" src={camera.hero_image} alt={camera.name}
                  sx={{ height: 120, objectFit: "contain", mb: 1 }} />
              )}
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{camera.name}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom>Winner by section</Typography>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
        {Object.entries(result.winner_by_section).map(([section, winner]) => {
          const label = SECTION_LABELS[section] ?? section;
          const winnerName =
            winner === "left"
              ? result.overview.left.name
              : winner === "right"
              ? result.overview.right.name
              : "Tie";
          return (
            <Chip
              key={section}
              icon={winner !== "tie" ? <EmojiEventsIcon /> : undefined}
              label={`${label}: ${winnerName}`}
              color={winner !== "tie" ? "primary" : "default"}
              variant="outlined"
            />
          );
        })}
      </Stack>
    </Box>
  );
}
