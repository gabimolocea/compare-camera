import {
  Table, TableBody, TableCell, TableRow, TableContainer, Paper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Fragment } from "react";
import type { ReactNode } from "react";

interface SpecRow {
  label: string;
  value: string | number | boolean | null;
}

export interface TabData {
  label: string;
  anchor?: string;
  description?: string | ReactNode;
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
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableBody>
          {tabs.map((section) => (
            <Fragment key={section.anchor ?? section.label}>
              <TableRow id={section.anchor}>
                <TableCell
                  colSpan={2}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    bgcolor: "grey.100",
                    py: 1.25,
                    borderTop: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  {section.label}
                </TableCell>
              </TableRow>
              {section.description && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{
                      py: 0.75,
                      color: "text.secondary",
                      fontSize: "0.8rem",
                      fontStyle: "italic",
                      bgcolor: "grey.50",
                    }}
                  >
                    {section.description}
                  </TableCell>
                </TableRow>
              )}
              {section.rows.map((row, j) => (
                <TableRow key={j} hover>
                  <TableCell sx={{ fontWeight: 500, width: "45%", color: "text.secondary" }}>
                    {row.label}
                  </TableCell>
                  <TableCell>
                    <SpecValue value={row.value} />
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
