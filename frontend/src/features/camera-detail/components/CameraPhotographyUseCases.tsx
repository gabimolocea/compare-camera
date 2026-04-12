import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableRow, TableHead, Paper, Chip,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import type { CameraDetail } from "../../../types/api";

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

interface UseCase {
  label: string;
  score: number;
  verdict: string;
  pros: string[];
  cons: string[];
}

function computeUseCases(camera: CameraDetail): UseCase[] {
  const s = camera.sensor_spec;
  const b = camera.body_spec;
  const af = camera.autofocus_spec;
  const v = camera.video_spec;
  const c = camera.connectivity_spec;

  // Portrait Photography
  let portrait = 40;
  const portraitPros: string[] = [];
  const portraitCons: string[] = [];
  if (s?.sensor_format === "Full Frame") { portrait += 20; portraitPros.push(`Full Frame ${s.sensor_width_mm ? `(${s.sensor_width_mm} x ${s.sensor_height_mm} mm)` : ""} sensor`); }
  else if (s?.sensor_format === "APS-C") { portrait += 10; portraitPros.push("APS-C sensor"); }
  if (s?.effective_mp && s.effective_mp >= 24) { portrait += 10; portraitPros.push(`High Resolution Sensor: ${s.effective_mp}MP`); }
  if (s?.ibis) { portrait += 10; portraitPros.push("Image Stabilization"); }
  if (b?.evf) { portrait += 8; portraitPros.push("Electronic Built-in Viewfinder"); }
  if (af?.eye_af_human) { portrait += 10; portraitPros.push("Eye / Face Autofocus"); }
  if (b?.articulating_screen) { portrait += 5; portraitPros.push("Fully articulated screen"); }
  if (!b?.evf) portraitCons.push("No Electronic Viewfinder");
  if (!af?.eye_af_human) portraitCons.push("No Eye AF");

  // Street Photography
  let street = 35;
  const streetPros: string[] = [];
  const streetCons: string[] = [];
  if (b?.evf) { street += 8; streetPros.push("Electronic Built-in Viewfinder"); }
  if (b?.articulating_screen) { street += 10; streetPros.push("Fully articulated LCD Screen"); }
  if (b?.touchscreen) { street += 5; streetPros.push("Touchscreen"); }
  if (af?.face_detection) { street += 8; streetPros.push("Face-Detection Focusing"); }
  if (s?.ibis) { street += 10; streetPros.push("Image Stabilization"); }
  if (s?.sensor_format === "Full Frame") { street += 10; streetPros.push(`Full Frame ${s.sensor_width_mm ? `(${s.sensor_width_mm} x ${s.sensor_height_mm} mm)` : ""} sensor`); }
  if (b?.weight_g && b.weight_g < 600) { street += 8; streetPros.push("Compact / lightweight body"); }
  else if (b?.weight_g && b.weight_g > 800) streetCons.push("Relatively heavy body");

  // Sports / Action
  let sports = 30;
  const sportsPros: string[] = [];
  const sportsCons: string[] = [];
  const maxFps = Math.max(af?.burst_fps_electronic ?? 0, af?.burst_fps_mech ?? 0);
  if (maxFps >= 20) { sports += 20; sportsPros.push(`${maxFps}fps burst shooting`); }
  else if (maxFps >= 10) { sports += 10; sportsPros.push(`${maxFps}fps burst shooting`); }
  else sportsCons.push("Slow burst rate");
  if (af?.subject_tracking) { sports += 15; sportsPros.push("Subject / animal tracking"); }
  if (af?.eye_af_animal) { sports += 8; sportsPros.push("Animal Eye AF"); }
  if (b?.weather_sealed) { sports += 10; sportsPros.push("Weather-sealed body"); }
  if (b?.dual_card_slots) { sports += 5; sportsPros.push("Dual card slots"); }
  if (!af?.subject_tracking) sportsCons.push("No subject tracking AF");

  // Landscape Photography
  let landscape = 45;
  const landscapePros: string[] = [];
  const landscapeCons: string[] = [];
  if (s?.effective_mp && s.effective_mp >= 36) { landscape += 20; landscapePros.push(`Very high resolution: ${s.effective_mp}MP`); }
  else if (s?.effective_mp && s.effective_mp >= 24) { landscape += 10; landscapePros.push(`High resolution: ${s.effective_mp}MP`); }
  if (b?.weather_sealed) { landscape += 12; landscapePros.push("Weather-sealed body"); }
  if (s?.sensor_format === "Full Frame") { landscape += 10; landscapePros.push("Full Frame sensor"); }
  if (s?.ibis) { landscape += 8; landscapePros.push("In-body image stabilization"); }
  if (b?.dual_card_slots) { landscape += 5; landscapePros.push("Dual card slots"); }
  if (!b?.weather_sealed) landscapeCons.push("No weather sealing");

  // Video / Vlogging
  let video = 25;
  const videoPros: string[] = [];
  const videoCons: string[] = [];
  if (v?.max_4k_fps && v.max_4k_fps >= 30) { video += 15; videoPros.push(`4K at ${v.max_4k_fps}fps`); }
  if (v?.internal_10bit) { video += 12; videoPros.push("10-bit internal recording"); }
  if (v?.raw_video) { video += 10; videoPros.push("RAW video output"); }
  if (b?.articulating_screen) { video += 10; videoPros.push("Fully articulated screen"); }
  if (v?.mic_in) { video += 8; videoPros.push("Microphone input"); }
  if (v?.headphone_out) { video += 5; videoPros.push("Headphone monitoring"); }
  if (s?.ibis) { video += 8; videoPros.push("In-body image stabilization"); }
  if (c?.webcam_mode) { video += 5; videoPros.push("USB / webcam streaming"); }
  if (!v?.mic_in) videoCons.push("No microphone port");
  if (!b?.articulating_screen) videoCons.push("No articulating screen");

  const useCases: Array<{ label: string; raw: number; pros: string[]; cons: string[] }> = [
    { label: "Portrait Photography", raw: clamp(portrait), pros: portraitPros, cons: portraitCons },
    { label: "Street Photography", raw: clamp(street), pros: streetPros, cons: streetCons },
    { label: "Sports & Action", raw: clamp(sports), pros: sportsPros, cons: sportsCons },
    { label: "Landscape Photography", raw: clamp(landscape), pros: landscapePros, cons: landscapeCons },
    { label: "Video / Vlogging", raw: clamp(video), pros: videoPros, cons: videoCons },
  ];

  return useCases.map(({ label, raw, pros, cons }) => {
    let verdict = "GOOD";
    if (raw >= 80) verdict = "EXCELLENT";
    else if (raw >= 65) verdict = "VERY GOOD";
    else if (raw < 45) verdict = "AVERAGE";
    return { label, score: raw, verdict, pros, cons };
  });
}

function verdictColor(verdict: string): "success" | "primary" | "warning" | "default" {
  if (verdict === "EXCELLENT") return "success";
  if (verdict === "VERY GOOD") return "primary";
  if (verdict === "GOOD") return "warning";
  return "default";
}

interface Props {
  camera: CameraDetail;
}

export default function CameraPhotographyUseCases({ camera }: Props) {
  const useCases = computeUseCases(camera);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        In this section, we review and score <strong>{camera.full_name}</strong> in {useCases.length} different photography areas.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {useCases.map((uc) => (
          <Box key={uc.label}>
            {/* Section heading */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CameraAltIcon fontSize="small" color="error" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "error.main" }}>
                {camera.full_name} for {uc.label}
              </Typography>
            </Box>

            {/* Score blurb */}
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              {camera.full_name} has a score of <strong>{uc.score}</strong> for {uc.label} which makes it{" "}
              {uc.verdict === "EXCELLENT" ? "an" : "a"}{" "}
              <Chip
                label={uc.verdict}
                color={verdictColor(uc.verdict)}
                size="small"
                sx={{ fontWeight: 700, fontSize: "0.75rem" }}
              />{" "}
              candidate for this type of photography.
            </Typography>

            {/* Pros/Cons in a 2-col grid */}
            {(uc.pros.length > 0 || uc.cons.length > 0) && (
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: "success.dark", bgcolor: "success.50", width: "50%", borderBottom: "2px solid", borderColor: "success.light" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <ThumbUpIcon fontSize="inherit" />
                          Advantages
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "error.dark", bgcolor: "error.50", width: "50%", borderBottom: "2px solid", borderColor: "error.light" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <ThumbDownIcon fontSize="inherit" />
                          Disadvantages
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from({ length: Math.max(uc.pros.length, uc.cons.length) }).map((_, i) => (
                      <TableRow key={i} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                        <TableCell sx={{ verticalAlign: "top", borderRight: "1px solid", borderColor: "divider" }}>
                          {uc.pros[i] && (
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75 }}>
                              <ThumbUpIcon fontSize="inherit" color="success" sx={{ mt: "3px", flexShrink: 0 }} />
                              <Typography variant="body2">{uc.pros[i]}</Typography>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top" }}>
                          {uc.cons[i] && (
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75 }}>
                              <ThumbsUpDownIcon fontSize="inherit" color="warning" sx={{ mt: "3px", flexShrink: 0 }} />
                              <Typography variant="body2">{uc.cons[i]}</Typography>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
