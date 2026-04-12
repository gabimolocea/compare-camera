import { useState, Fragment } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Box, Switch, FormControlLabel, Chip,
} from "@mui/material";
import type { FieldDiff, CompareResult } from "../../../types/api";

interface Props {
  diffs: FieldDiff[];
  cameras: CompareResult["cameras"];
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

const COL_COLORS = ["primary.main", "secondary.main", "success.main", "warning.main"];

export default function CompareTable({ diffs, cameras }: Props) {
  const [onlyDiffs, setOnlyDiffs] = useState(false);

  const filtered = onlyDiffs ? diffs.filter((d) => d.best_indices.length < cameras.length) : diffs;

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
              <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>Spec</TableCell>
              {cameras.map((cam, idx) => (
                <TableCell key={cam.id} align="center" sx={{ fontWeight: 700, color: COL_COLORS[idx] }}>
                  {cam.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(grouped).map(([section, rows]) => (
              <Fragment key={section}>
                <TableRow>
                  <TableCell
                    colSpan={1 + cameras.length}
                    sx={{ bgcolor: "grey.100", fontWeight: 700, py: 0.5 }}
                  >
                    {SECTION_LABELS[section] ?? section}
                  </TableCell>
                </TableRow>
                {rows.map((diff) => (
                  <TableRow key={diff.field} hover>
                    <TableCell>{diff.label}</TableCell>
                    {cameras.map((cam, idx) => {
                      const isWinner = diff.best_indices.includes(idx);
                      return (
                        <TableCell
                          key={cam.id}
                          align="center"
                          sx={{
                            fontWeight: isWinner ? 700 : 400,
                            color: isWinner ? COL_COLORS[idx] : "inherit",
                          }}
                        >
                          {diff.values[idx] ?? "—"}
                          {isWinner && diff.best_indices.length < cameras.length && (
                            <Chip label="✓" size="small" sx={{ ml: 0.5, height: 18, bgcolor: COL_COLORS[idx], color: "white" }} />
                          )}
                        </TableCell>
                      );
                    })}
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
