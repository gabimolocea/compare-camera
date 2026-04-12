import {
  Box, Typography, Button, Stack, List, ListItem, ListItemText,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import EditIcon from "@mui/icons-material/Edit";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import type { CameraDetail } from "../../../types/api";
import { useCompareTray } from "../../../context/useCompareTray";
import CameraScorePanel from "./CameraScorePanel";

interface Props {
  camera: CameraDetail;
  onWriteReview?: () => void;
}

function buildMainFeatures(camera: CameraDetail): string[] {
  const features: string[] = [];
  const s = camera.sensor_spec;
  const v = camera.video_spec;
  const b = camera.body_spec;
  const af = camera.autofocus_spec;
  const c = camera.connectivity_spec;

  if (s) {
    if (s.effective_mp && s.sensor_format && s.sensor_type)
      features.push(`${s.effective_mp}MP - ${s.sensor_format} ${s.sensor_type} Sensor`);
    else if (s.effective_mp)
      features.push(`${s.effective_mp}MP Sensor`);
    if (s.native_iso_min !== null && s.native_iso_max !== null) {
      let isoStr = `ISO ${s.native_iso_min} - ${s.native_iso_max}`;
      if (s.extended_iso_min !== null && s.extended_iso_max !== null)
        isoStr += ` (expands to ${s.extended_iso_min} - ${s.extended_iso_max})`;
      features.push(isoStr);
    }
    if (s.ibis) {
      const axes = s.ibis_stops ? `${s.ibis_stops}-stop ` : "";
      features.push(`${axes}In-Body Image Stabilization (IBIS)`);
    }
  }

  if (b) {
    if (b.screen_size_inches) {
      const type = b.articulating_screen ? "Fully articulated" : b.touchscreen ? "Touchscreen" : "Fixed";
      features.push(`${b.screen_size_inches}" ${type} Screen`);
    }
    if (b.evf) {
      const res = b.evf_resolution ? `${b.evf_resolution}k dot ` : "";
      features.push(`${res}Electronic Viewfinder`);
    }
  }

  if (af) {
    const fps = Math.max(af.burst_fps_electronic ?? 0, af.burst_fps_mech ?? 0);
    if (fps > 0) features.push(`${fps}fps Continuous Shooting`);
    if (af.eye_af_human || af.subject_tracking)
      features.push("AI Subject / Eye Autofocus");
  }

  if (v) {
    if (v.max_4k_fps && v.max_fhd_fps)
      features.push(`4K at ${v.max_4k_fps}fps and FHD at ${v.max_fhd_fps}fps Video Recording`);
    else if (v.max_4k_fps)
      features.push(`4K at ${v.max_4k_fps}fps Video`);
    if (v.internal_10bit) features.push("10-bit Internal Recording");
    if (v.raw_video) features.push("RAW Video Output");
  }

  if (c) {
    if (c.wifi || c.bluetooth) features.push("Built-in Wireless");
  }

  if (b) {
    const dims: string[] = [];
    if (b.weight_g) dims.push(`${b.weight_g}g`);
    if (b.width_mm && b.height_mm && b.depth_mm)
      dims.push(`${b.width_mm} x ${b.height_mm} x ${b.depth_mm} mm`);
    if (dims.length) features.push(dims.join(". "));
    if (b.weather_sealed) features.push("Weather-sealed Body");
    if (b.dual_card_slots) features.push("Dual Card Slots");
  }

  return features;
}

export default function CameraHeader({ camera, onWriteReview }: Props) {
  const features = buildMainFeatures(camera);
  const { toggle, isSelected, isFull } = useCompareTray();
  const inTray = isSelected(camera.slug);

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", md: "nowrap" }, mb: 3 }}>
      {/* Score panel + image — 100% on mobile, 50% on desktop */}
      <Box sx={{
        position: "relative",
        width: { xs: "100%", md: "40%" },
        maxWidth: { md: 420 },
        flexShrink: 0,
        minWidth: 0,
      }}>
        {/* Score panel overlaid vertically centered on the left of the image */}
        <Box sx={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", zIndex: 2 }}>
          <CameraScorePanel camera={camera} direction="column" />
        </Box>
        <Box
          component="img"
          src={camera.hero_image ?? "/placeholder-camera.svg"}
          alt={camera.full_name}
          sx={{
            display: "block",
            width: "100%",
            height: "auto",
            aspectRatio: "16/9",
            objectFit: "contain",
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Info column — 100% on mobile, 60% on desktop */}
      <Box sx={{ width: { xs: "100%", md: "60%" }, minWidth: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>{camera.full_name}</Typography>

        {/* Main Features */}
        {features.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}>
              Main Features
            </Typography>
            <List dense disablePadding>
              {features.map((f) => (
                <ListItem key={f} disableGutters sx={{ py: 0, alignItems: "flex-start" }}>
                  <FiberManualRecordIcon sx={{ fontSize: 8, mt: "5px", mr: 1, color: "text.secondary", flexShrink: 0 }} />
                  <ListItemText primary={f} slotProps={{ primary: { variant: "body2" } }} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Price referral links — larger buttons */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            href={`https://www.amazon.com/s?k=${encodeURIComponent(camera.full_name)}&tag=comparecam-20`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            sx={{ bgcolor: "#FF9900", color: "#111", whiteSpace: "nowrap", "&:hover": { bgcolor: "#e68a00" } }}
          >
            Buy on Amazon
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            href={`https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(camera.full_name)}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            sx={{ bgcolor: "#003087", color: "#fff", whiteSpace: "nowrap", "&:hover": { bgcolor: "#00256e" } }}
          >
            Buy on B&H
          </Button>
        </Stack>

        {/* Action buttons — below price links */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            variant={inTray ? "contained" : "outlined"}
            color={inTray ? "error" : "primary"}
            size="medium"
            disabled={!inTray && isFull}
            startIcon={<CompareArrowsIcon />}
            onClick={() => toggle({ slug: camera.slug, name: camera.full_name, image: camera.hero_image })}
            sx={{ whiteSpace: "nowrap" }}
          >
            {inTray ? "In Compare" : isFull ? "Tray Full" : "Compare"}
          </Button>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<BookmarkBorderIcon />}
            sx={{ whiteSpace: "nowrap" }}
          >
            Save
          </Button>
          {onWriteReview && (
            <Button
              variant="outlined"
              size="medium"
              startIcon={<EditIcon />}
              onClick={onWriteReview}
              sx={{ whiteSpace: "nowrap" }}
            >
              Add review
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
