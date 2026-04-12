import {
  Box, Grid, LinearProgress, Paper, Typography, Chip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import type { CameraDetail } from "../../../types/api";

interface ScoreCategory {
  label: string;
  score: number;
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function computeScores(camera: CameraDetail): ScoreCategory[] {
  const s = camera.sensor_spec;
  const v = camera.video_spec;
  const b = camera.body_spec;
  const af = camera.autofocus_spec;
  const c = camera.connectivity_spec;

  // Build quality
  let buildScore = 55;
  if (b?.weather_sealed) buildScore += 25;
  if (b?.dual_card_slots) buildScore += 10;
  if (b?.weight_g && b.weight_g < 700) buildScore += 5;
  if (!b?.built_in_flash) buildScore += 5; // pro bodies typically skip built-in flash

  // Ergonomics & handling
  let ergoScore = 55;
  if (b?.touchscreen) ergoScore += 10;
  if (b?.articulating_screen) ergoScore += 10;
  if (b?.evf) ergoScore += 10;
  if (b?.evf_coverage_pct && b.evf_coverage_pct >= 100) ergoScore += 5;
  if (b?.battery_shots_cipa && b.battery_shots_cipa > 400) ergoScore += 5;
  if (b?.screen_size_inches && b.screen_size_inches >= 3.2) ergoScore += 5;

  // Features
  let featuresScore = 40;
  if (s?.ibis) featuresScore += 15;
  if (b?.gps) featuresScore += 5;
  if (b?.timelapse) featuresScore += 5;
  if (b?.ae_bracketing) featuresScore += 5;
  if (b?.wb_bracketing) featuresScore += 5;
  if (b?.dual_card_slots) featuresScore += 5;
  if (b?.built_in_flash) featuresScore += 5;
  if (v?.usb_streaming) featuresScore += 5;
  if (v?.lens_breathing_correction) featuresScore += 5;
  if (b?.metering_spot) featuresScore += 5;

  // Metering & focus accuracy
  let meteringScore = 40;
  if (af?.phase_detect) meteringScore += 15;
  if (af?.eye_af_human) meteringScore += 10;
  if (af?.face_detection) meteringScore += 5;
  if (af?.eye_af_animal) meteringScore += 5;
  if (af?.subject_tracking) meteringScore += 5;
  if (af?.vehicle_tracking) meteringScore += 5;
  if (af?.insect_tracking) meteringScore += 5;
  if (af?.af_coverage_pct && af.af_coverage_pct >= 90) meteringScore += 5;
  if (af?.af_points && af.af_points > 200) meteringScore += 5;

  // Image quality (raw)
  let iqRawScore = 40;
  if (s?.sensor_format === "Full Frame") iqRawScore += 25;
  else if (s?.sensor_format === "APS-C") iqRawScore += 15;
  else if (s?.sensor_format === "Micro Four Thirds") iqRawScore += 8;
  if (s?.effective_mp && s.effective_mp >= 24) iqRawScore += 10;
  if (s?.effective_mp && s.effective_mp >= 45) iqRawScore += 10;
  if (s?.ibis) iqRawScore += 5;
  if (s?.native_iso_max && s.native_iso_max >= 51200) iqRawScore += 5;
  if (s?.ibis_stops && s.ibis_stops >= 5) iqRawScore += 5;

  // Image quality (jpeg)
  let iqJpegScore = iqRawScore - 5;
  if (b?.metering_multi_segment) iqJpegScore += 5;
  if (b?.metering_spot) iqJpegScore += 2;

  // Low light
  let lowLightScore = 40;
  if (s?.native_iso_max && s.native_iso_max >= 51200) lowLightScore += 15;
  if (s?.native_iso_max && s.native_iso_max >= 102400) lowLightScore += 10;
  if (s?.sensor_format === "Full Frame") lowLightScore += 15;
  else if (s?.sensor_format === "APS-C") lowLightScore += 8;
  if (s?.ibis) lowLightScore += 10;
  if (af?.phase_detect) lowLightScore += 5;
  if (af?.min_focus_ev !== null && af?.min_focus_ev !== undefined && af.min_focus_ev <= -4) lowLightScore += 5;

  // Viewfinder / screen rating
  let vfScore = 40;
  if (b?.evf) vfScore += 15;
  if (b?.evf_resolution && parseInt(b.evf_resolution) >= 3690) vfScore += 10;
  if (b?.evf_coverage_pct && b.evf_coverage_pct >= 100) vfScore += 5;
  if (b?.touchscreen) vfScore += 10;
  if (b?.articulating_screen) vfScore += 10;
  if (b?.screen_resolution_kdots && b.screen_resolution_kdots >= 1620) vfScore += 5;
  if (b?.screen_size_inches && b.screen_size_inches >= 3.2) vfScore += 5;

  // Performance
  let perfScore = 40;
  const burstFps = Math.max(af?.burst_fps_electronic ?? 0, af?.burst_fps_mech ?? 0);
  if (burstFps >= 20) perfScore += 20;
  else if (burstFps >= 10) perfScore += 12;
  else if (burstFps >= 6) perfScore += 6;
  if (af?.phase_detect) perfScore += 10;
  if (b?.evf) perfScore += 5;
  if (s?.ibis) perfScore += 5;
  if (burstFps >= 30) perfScore += 10;
  if (burstFps >= 60) perfScore += 10;

  // Video
  let videoScore = 30;
  if (v?.max_4k_fps && v.max_4k_fps >= 30) videoScore += 15;
  if (v?.max_4k_fps && v.max_4k_fps >= 60) videoScore += 10;
  if (v?.max_4k_fps && v.max_4k_fps >= 120) videoScore += 10;
  if (v?.internal_10bit) videoScore += 10;
  if (v?.raw_video) videoScore += 10;
  if (v?.unlimited_recording) videoScore += 5;
  if (v?.log_profiles && v.log_profiles.trim().length > 1) videoScore += 5;
  if (v?.mic_in) videoScore += 5;
  if (v?.headphone_out) videoScore += 5;
  if (v?.digital_is) videoScore += 3;
  if (v?.usb_streaming) videoScore += 2;

  // Connectivity
  let connScore = 30;
  if (c?.wifi) connScore += 15;
  if (c?.bluetooth) connScore += 10;
  if (c?.usb_c) connScore += 10;
  if (c?.usb_charging) connScore += 10;
  if (c?.webcam_mode) connScore += 10;
  if (c?.ethernet) connScore += 5;
  if (c?.flash_sync_port) connScore += 5;
  if (c?.full_size_hdmi) connScore += 5;

  // Value
  let valueScore = 55;
  const price = parseFloat(camera.msrp ?? "0");
  if (price > 0 && price < 1500) valueScore += 25;
  else if (price > 0 && price < 2500) valueScore += 15;
  else if (price > 0 && price < 4000) valueScore += 5;
  else if (price > 4000) valueScore -= 10;
  if (s?.sensor_format === "Full Frame" && price < 2500) valueScore += 10;

  return [
    { label: "Build quality", score: clamp(buildScore) },
    { label: "Ergonomics & handling", score: clamp(ergoScore) },
    { label: "Features", score: clamp(featuresScore) },
    { label: "Metering & focus accuracy", score: clamp(meteringScore) },
    { label: "Image quality (raw)", score: clamp(iqRawScore) },
    { label: "Image quality (jpeg)", score: clamp(iqJpegScore) },
    { label: "Low light / high ISO", score: clamp(lowLightScore) },
    { label: "Viewfinder / screen rating", score: clamp(vfScore) },
    { label: "Performance", score: clamp(perfScore) },
    { label: "Movie / video mode", score: clamp(videoScore) },
    { label: "Connectivity", score: clamp(connScore) },
    { label: "Value", score: clamp(valueScore) },
  ];
}

function scoreColor(score: number) {
  if (score >= 80) return "success";
  if (score >= 60) return "primary";
  if (score >= 40) return "warning";
  return "error";
}

interface Props {
  camera: CameraDetail;
}

export default function CameraReviewScoring({ camera }: Props) {
  const scores = computeScores(camera);
  const overall = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);

  const goodFor = camera.pros
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 4);

  const notGoodFor = camera.cons
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <Box sx={{ bgcolor: "grey.50", px: 3, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Our Review &amp; Scoring
        </Typography>
      </Box>

      <Grid container>
        {/* Left: review text */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3, borderRight: { md: "1px solid" }, borderColor: { md: "divider" } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
            Our Review
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
            {camera.short_summary || "No review available yet."}
          </Typography>

          {goodFor.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
                <ThumbUpIcon fontSize="small" color="success" />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Good for
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {goodFor.map((item) => (
                  <Chip key={item} label={item} size="small" color="success" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}

          {notGoodFor.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
                <ThumbDownIcon fontSize="small" color="error" />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Not so good for
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {notGoodFor.map((item) => (
                  <Chip key={item} label={item} size="small" color="error" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}

          {/* Overall score badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: overall >= 75 ? "warning.light" : overall >= 55 ? "primary.light" : "grey.200",
              color: overall >= 75 ? "warning.contrastText" : "primary.contrastText",
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <EmojiEventsIcon />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {overall}%
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {overall >= 85 ? "Gold Award" : overall >= 70 ? "Silver Award" : overall >= 55 ? "Recommended" : "Neutral"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right: scoring bars */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
            Scoring
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {scores.map(({ label, score }) => (
              <Box key={label}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} color={`${scoreColor(score)}.main`}>
                    {score}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={score}
                  color={scoreColor(score)}
                  sx={{ height: 7, borderRadius: 1 }}
                />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
