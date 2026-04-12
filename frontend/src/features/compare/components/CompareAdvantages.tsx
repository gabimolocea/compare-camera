import {
  Box, Typography, Grid, Paper, List, ListItem, ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import HandshakeIcon from "@mui/icons-material/Handshake";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutlined";
import type { FieldDiff, CompareResult } from "../../../types/api";

interface Props {
  diffs: FieldDiff[];
  cameras: CompareResult["cameras"];
}

const COL_COLORS = ["primary.main", "secondary.main", "success.main", "warning.main"];
const NEUTRAL_COLOR = "text.secondary";

function AdvantageList({
  items,
  color,
  icon,
  emptyText,
}: {
  items: FieldDiff[];
  color: string;
  icon: React.ReactNode;
  emptyText: string;
}) {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.disabled" sx={{ px: 2, py: 1 }}>
        {emptyText}
      </Typography>
    );
  }
  return (
    <List dense disablePadding>
      {items.map((diff) => (
        <ListItem key={diff.field} disablePadding sx={{ px: 1 }}>
          <ListItemIcon sx={{ minWidth: 32, color }}>{icon}</ListItemIcon>
          <ListItemText
            primary={diff.label}
            slotProps={{ primary: { variant: "body2" } }}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default function CompareAdvantages({ diffs, cameras }: Props) {
  const n = cameras.length;

  // Exclusive advantages: camera idx wins but it's not a universal tie
  const advantages: FieldDiff[][] = cameras.map((_, camIdx) =>
    diffs.filter(
      (d) => d.best_indices.includes(camIdx) && d.best_indices.length < n && d.best_indices.length > 0,
    ),
  );

  // Common strengths: all cameras are best (boolean=all true, numeric=all tied)
  const commonStrengths = diffs.filter(
    (d) => d.best_indices.length === n,
  );

  // Common weaknesses: no winner at all (all "No" booleans → best_indices=[])
  // And at least one camera has a "No" value (detect boolean fields where all are No)
  const commonWeaknesses = diffs.filter(
    (d) => d.best_indices.length === 0 && d.values.some((v) => v === "No"),
  );

  return (
    <Box sx={{ mb: 4 }}>
      {/* Per-camera advantages */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cameras.map((cam, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: Math.floor(12 / n) as 6 }} key={cam.id}>
            <Paper variant="outlined" sx={{ height: "100%" }}>
              <Box sx={{ px: 2, py: 1.5, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COL_COLORS[idx] }}>
                  Reasons to choose {cam.name}
                </Typography>
              </Box>
              <AdvantageList
                items={advantages[idx]}
                color={COL_COLORS[idx]}
                icon={<CheckCircleOutlineIcon fontSize="small" />}
                emptyText="No exclusive advantages"
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Common strengths + weaknesses */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ height: "100%" }}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: "success.50", borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "success.dark" }}>
                Common Strengths
              </Typography>
            </Box>
            <AdvantageList
              items={commonStrengths}
              color="success.main"
              icon={<HandshakeIcon fontSize="small" />}
              emptyText="No common strengths found"
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ height: "100%" }}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: "error.50", borderBottom: "1px solid", borderColor: "divider",
              borderRadius: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "error.dark" }}>
                Common Weaknesses
              </Typography>
            </Box>
            <AdvantageList
              items={commonWeaknesses}
              color={NEUTRAL_COLOR}
              icon={<RemoveCircleOutlineIcon fontSize="small" />}
              emptyText="No common weaknesses found"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
