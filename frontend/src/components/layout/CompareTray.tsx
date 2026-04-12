import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Button,
  Tooltip,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useNavigate } from "react-router-dom";
import { useCompareTray } from "../../context/useCompareTray";

export default function CompareTray() {
  const { cameras, remove, clear, slugs } = useCompareTray();
  const navigate = useNavigate();

  if (cameras.length === 0) return null;

  const handleCompare = () => {
    navigate(`/compare?slugs=${slugs.join(",")}`);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        px: 3,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        bgcolor: "background.paper",
        borderTop: "2px solid",
        borderColor: "primary.main",
      }}
    >
      <Badge badgeContent={cameras.length} color="primary">
        <CompareArrowsIcon color="primary" />
      </Badge>

      <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
        Compare ({cameras.length}/4)
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, flex: 1, overflowX: "auto", py: 0.5 }}>
        {cameras.map((cam) => (
          <Box
            key={cam.slug}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "grey.100",
              borderRadius: 2,
              px: 1,
              py: 0.5,
              minWidth: 130,
              maxWidth: 200,
              flexShrink: 0,
            }}
          >
            <Avatar
              src={cam.image ?? "/placeholder-camera.svg"}
              variant="rounded"
              sx={{ width: 36, height: 36, flexShrink: 0 }}
            />
            <Typography variant="caption" sx={{ flex: 1 }} noWrap>
              {cam.name}
            </Typography>
            <Tooltip title="Remove">
              <IconButton
                size="small"
                onClick={() => remove(cam.slug)}
                sx={{ p: 0.25, flexShrink: 0 }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1, ml: "auto", flexShrink: 0 }}>
        <Button variant="text" size="small" onClick={clear} color="inherit">
          Clear all
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleCompare}
          disabled={cameras.length < 2}
          startIcon={<CompareArrowsIcon />}
        >
          Compare
        </Button>
      </Box>
    </Paper>
  );
}
