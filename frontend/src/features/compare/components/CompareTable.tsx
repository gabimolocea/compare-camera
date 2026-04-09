import { useState, Fragment } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Box, Switch, FormControlLabel, Chip,
} from "@mui/material";
import type { FieldDiff } from "../../../types/api";

interface Props {
  diffs: FieldDiff[];
  leftName: string;
  rightName: string;
}

const SECTION_LABELS: Record<string, string> = {
  sensor: "Sensor",
  video: "Video",
  body: "Body",
  autofocus: "Autofocus",
  connectivity: "Connectivity",
};

export default function CompareTable({ diffs, leftName, rightName }: Props) {
  const [onlyDiffs, setOnlyDiffs] = useState(false);

  const filtered = onlyDiffs ? diffs.filter((d) => d.winner !== "tie") : diffs;

  const grouped = filtered.reduce<Record<string, FieldDiff[]>>((acc, diff) => {
    (acc[diff.section] ??= []).push(diff);
    return acc;
  }, {});

  return (
    <Box>
      <FormControlLabel
        control={<Switch checked={onlyDiffs} onChange={(e) => setOnlyDiffs(e.target.checked)} />}
        label="Show differences only"
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Spec</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: "primary.main" }}>
                {leftName}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: "secondary.main" }}>
                {rightName}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(grouped).map(([section, rows]) => (
              <Fragment key={section}>
                <TableRow>
                  <TableCell colSpan={3} sx={{ bgcolor: "grey.100", fontWeight: 700, py: 0.5 }}>
                    {SECTION_LABELS[section] ?? section}
                  </TableCell>
                </TableRow>
                {rows.map((diff) => (
                  <TableRow key={diff.field} hover>
                    <TableCell>{diff.label}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: diff.winner === "left" ? 700 : 400,
                        color: diff.winner === "left" ? "primary.main" : "inherit",
                      }}
                    >
                      {diff.left}
                      {diff.winner === "left" && (
                        <Chip label="✓" size="small" color="primary" sx={{ ml: 1, height: 18 }} />
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: diff.winner === "right" ? 700 : 400,
                        color: diff.winner === "right" ? "secondary.main" : "inherit",
                      }}
                    >
                      {diff.right}
                      {diff.winner === "right" && (
                        <Chip label="✓" size="small" color="secondary" sx={{ ml: 1, height: 18 }} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
