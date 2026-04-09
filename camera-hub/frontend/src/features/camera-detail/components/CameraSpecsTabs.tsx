import { useState } from "react";
import {
  Box, Tabs, Tab, Table, TableBody, TableCell, TableRow, TableContainer,
  Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface SpecRow {
  label: string;
  value: string | number | boolean | null;
}

interface TabData {
  label: string;
  rows: SpecRow[];
}

interface Props {
  tabs: TabData[];
}

function SpecValue({ value }: { value: string | number | boolean | null }) {
  if (value === null || value === undefined || value === "") return <span style={{ opacity: 0.4 }}>—</span>;
  if (typeof value === "boolean") {
    return value ? <CheckIcon color="success" fontSize="small" /> : <CloseIcon color="disabled" fontSize="small" />;
  }
  return <>{value}</>;
}

export default function CameraSpecsTabs({ tabs }: Props) {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        {tabs.map((t, i) => <Tab key={i} label={t.label} />)}
      </Tabs>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableBody>
            {tabs[tab]?.rows.map((row, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ fontWeight: 500, width: "45%", color: "text.secondary" }}>
                  {row.label}
                </TableCell>
                <TableCell>
                  <SpecValue value={row.value} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
