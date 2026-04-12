import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Divider, Link } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

interface Props {
  pros: string;
  cons: string;
  cameraName: string;
  reportUrl?: string;
}

export default function CameraProsCons({ pros, cons, cameraName, reportUrl }: Props) {
  const prosItems = pros.split("\n").map((s) => s.trim()).filter(Boolean);
  const consItems = cons.split("\n").map((s) => s.trim()).filter(Boolean);
  const rowCount = Math.max(prosItems.length, consItems.length);

  if (rowCount === 0) return null;

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={2}
                sx={{
                  fontWeight: 700, fontSize: "1.15rem",
                  bgcolor: "grey.100", borderBottom: "1px solid", borderColor: "divider",
                  py: 1.5,
                }}
              >
                Pros &amp; Cons
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  width: "50%", fontWeight: 700, fontSize: "0.95rem",
                  bgcolor: "grey.100", borderBottom: "2px solid", borderColor: "divider",
                  borderRight: "1px solid", borderRightColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "success.dark" }}>
                  <CheckCircleOutlineIcon fontSize="small" />
                  Pros
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  width: "50%", fontWeight: 700, fontSize: "0.95rem",
                  bgcolor: "grey.100", borderBottom: "2px solid", borderColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: "error.dark" }}>
                  <CancelOutlinedIcon fontSize="small" />
                  Cons
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                <TableCell
                  sx={{
                    verticalAlign: "top",
                    borderRight: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {prosItems[i] && (
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <CheckCircleOutlineIcon fontSize="small" color="success" sx={{ mt: "2px", flexShrink: 0 }} />
                      <Typography variant="body2">{prosItems[i]}</Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ verticalAlign: "top" }}>
                  {consItems[i] && (
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <CancelOutlinedIcon fontSize="small" color="error" sx={{ mt: "2px", flexShrink: 0 }} />
                      <Typography variant="body2">{consItems[i]}</Typography>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
        <ReportProblemOutlinedIcon fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary">
          Found inaccurate information about {cameraName}?{" "}
          {reportUrl ? (
            <Link href={reportUrl} target="_blank" rel="noopener noreferrer">
              Report a correction
            </Link>
          ) : (
            <Button
              size="small"
              variant="text"
              sx={{ p: 0, minWidth: 0, fontSize: "inherit", verticalAlign: "baseline" }}
              onClick={() => { /* no-op placeholder */ }}
            >
              Report a correction
            </Button>
          )}
        </Typography>
      </Box>
    </Box>
  );
}
