import { Box, Typography } from "@mui/material";
import type { CameraDetail } from "../../../types/api";

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

interface ScoreEntry {
  label: string;
  score: number;
  color: string;
}

function computeSummaryScores(camera: CameraDetail): ScoreEntry[] {
  const s = camera.sensor_spec;
  const v = camera.video_spec;
  const b = camera.body_spec;
  const af = camera.autofocus_spec;

  // Imaging — sensor quality, resolution, ISO, stabilisation
  let imagingScore = 40;
  if (s?.sensor_format === "Full Frame") imagingScore += 25;
  else if (s?.sensor_format === "APS-C") imagingScore += 15;
  else if (s?.sensor_format === "Micro Four Thirds") imagingScore += 8;
  if (s?.effective_mp && s.effective_mp >= 24) imagingScore += 8;
  if (s?.effective_mp && s.effective_mp >= 45) imagingScore += 7;
  if (s?.ibis) imagingScore += 8;
  if (s?.native_iso_max && s.native_iso_max >= 51200) imagingScore += 7;
  if (af?.eye_af_human) imagingScore += 5;

  // Features — body capabilities
  let featuresScore = 40;
  if (s?.ibis) featuresScore += 10;
  if (b?.weather_sealed) featuresScore += 10;
  if (b?.dual_card_slots) featuresScore += 8;
  if (b?.evf) featuresScore += 8;
  if (b?.articulating_screen) featuresScore += 8;
  if (b?.gps) featuresScore += 5;
  if (b?.timelapse) featuresScore += 3;
  if (b?.ae_bracketing) featuresScore += 4;
  if (b?.touchscreen) featuresScore += 4;

  // Video
  let videoScore = 30;
  if (v?.max_4k_fps && v.max_4k_fps >= 30) videoScore += 15;
  if (v?.max_4k_fps && v.max_4k_fps >= 60) videoScore += 10;
  if (v?.max_4k_fps && v.max_4k_fps >= 120) videoScore += 10;
  if (v?.internal_10bit) videoScore += 10;
  if (v?.raw_video) videoScore += 10;
  if (v?.unlimited_recording) videoScore += 5;
  if (v?.mic_in) videoScore += 5;
  if (v?.headphone_out) videoScore += 5;

  // Size — compactness / portability (higher = more compact)
  let sizeScore = 55;
  if (b?.weight_g) {
    if (b.weight_g < 400) sizeScore += 30;
    else if (b.weight_g < 600) sizeScore += 18;
    else if (b.weight_g < 800) sizeScore += 8;
    else sizeScore -= 5;
  }
  if (!b?.evf) sizeScore += 5;
  if (!b?.dual_card_slots) sizeScore += 3;

  const img = clamp(imagingScore);
  const feat = clamp(featuresScore);
  const vid = clamp(videoScore);
  const size = clamp(sizeScore);
  const overall = Math.round((img + feat + vid + size) / 4);

  return [
    { label: "Overall",  score: overall, color: "#e57373" },
    { label: "Imaging",  score: img,     color: "#ffb74d" },
    { label: "Features", score: feat,    color: "#81c784" },
    { label: "Video",    score: vid,     color: "#64b5f6" },
    { label: "Size",     score: size,    color: "#4db6ac" },
  ];
}

interface Props {
  camera: CameraDetail;
  /** 'column' = vertical stack (default). 'row' = horizontal strip. 'responsive' = row on xs, column on sm+. */
  direction?: "column" | "row" | "responsive";
}

export default function CameraScorePanel({ camera, direction = "column" }: Props) {
  const scores = computeSummaryScores(camera);

  const isRow = direction === "row";
  const flexDir = direction === "responsive"
    ? { xs: "row", sm: "column" } as const
    : direction;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: flexDir,
        flexShrink: 0,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {scores.map(({ label, score, color }) => (
        <Box
          key={label}
          sx={{
            bgcolor: color,
            color: "#fff",
            textAlign: "center",
            px: isRow ? 2.5 : 2,
            py: isRow ? 1.5 : 1.25,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: isRow ? 64 : 72,
            ...(direction === "responsive" && {
              // xs: row-mode sizing
              "@media (max-width: 599px)": { px: 2.5, py: 1.5, minWidth: 64 },
              // sm+: column-mode sizing
              "@media (min-width: 600px)": { px: 2, py: 1.25, minWidth: 72 },
            }),
          }}
        >
          <Typography
            sx={{ fontSize: "0.6rem", fontWeight: 600, textDecoration: "underline", lineHeight: 1.3, color: "inherit" }}
          >
            {label}
          </Typography>
          <Typography sx={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.1, color: "inherit" }}>
            {score}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
