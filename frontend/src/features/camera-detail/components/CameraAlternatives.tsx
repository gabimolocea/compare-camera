import {
  Box, Typography, TableContainer, Table, TableHead, TableBody,
  TableRow, TableCell, Paper, Chip, Link as MuiLink, Button,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import type { Camera, CameraDetail } from "../../../types/api";
import { useCompareTray } from "../../../context/useCompareTray";

interface Props {
  camera: CameraDetail;
  alternatives: Camera[];
}

export default function CameraAlternatives({ camera, alternatives }: Props) {
  const { toggle, isSelected, isFull } = useCompareTray();

  if (alternatives.length === 0) return null;

  const categoryLabel = camera.category.charAt(0).toUpperCase() + camera.category.slice(1);

  const headerCell = { fontWeight: 700, bgcolor: "grey.100", borderBottom: "2px solid", borderColor: "divider" };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        In this section, we analyse how <strong>{camera.full_name}</strong> compares with other{" "}
        {categoryLabel} cameras within a similar price range.
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCell}>Camera</TableCell>
              <TableCell sx={headerCell}>Category</TableCell>
              <TableCell sx={headerCell}>Mount</TableCell>
              <TableCell sx={headerCell} align="center">Compare</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Current camera row highlighted */}
            <TableRow sx={{ bgcolor: "primary.50" }}>
              <TableCell sx={{ fontWeight: 700 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    src={camera.hero_image ?? "/placeholder-camera.svg"}
                    alt={camera.full_name}
                    sx={{ width: 64, aspectRatio: "16/9", objectFit: "contain", flexShrink: 0, bgcolor: "grey.50" }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{camera.full_name}</Typography>
                    <Chip label="This camera" size="small" color="primary" sx={{ fontSize: "0.65rem", height: 18 }} />
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{camera.category}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{camera.mount || "—"}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="caption" color="text.secondary">—</Typography>
              </TableCell>
            </TableRow>

            {alternatives.map((alt) => {
              const selected = isSelected(alt.slug);
              const disabled = !selected && isFull;
              return (
                <TableRow key={alt.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        component="img"
                        src={alt.hero_image ?? "/placeholder-camera.svg"}
                        alt={alt.full_name}
                        sx={{ width: 64, aspectRatio: "16/9", objectFit: "contain", flexShrink: 0, bgcolor: "grey.50" }}
                      />
                      <MuiLink href={`/cameras/${alt.slug}`} underline="hover" color="primary" variant="body2">
                        {alt.full_name}
                      </MuiLink>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{alt.category}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{alt.mount || "—"}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant={selected ? "contained" : "outlined"}
                      color={selected ? "primary" : "inherit"}
                      disabled={disabled}
                      startIcon={<CompareArrowsIcon fontSize="small" />}
                      onClick={() => toggle({ slug: alt.slug, name: alt.full_name, image: alt.hero_image ?? null })}
                      sx={{ whiteSpace: "nowrap", fontSize: "0.7rem", py: 0.25 }}
                    >
                      {selected ? "Added" : "Compare"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
