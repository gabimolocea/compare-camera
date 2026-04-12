import type { CameraDetail } from "../../../types/api";

export function getWeatherSealingInsight(camera: CameraDetail): string | null {
  const b = camera.body_spec;
  if (!b) return null;
  if (b.weather_sealed) {
    return `${camera.full_name} features environmental sealing on its body, providing resistance against water splashes and dust ingress. It is an excellent choice for outdoor, travel, and adventure photography in challenging conditions.`;
  }
  return `${camera.full_name} does not feature official weather sealing. Extra care should be taken when shooting in rain, snow, or dusty environments.`;
}

export function getIBISInsight(camera: CameraDetail): string | null {
  const s = camera.sensor_spec;
  if (!s) return null;
  if (s.ibis) {
    const stops = s.ibis_stops ? ` up to ${s.ibis_stops} stops of compensation` : "";
    return `${camera.full_name} includes In-Body Image Stabilization (IBIS),${stops}. This allows for sharp handheld shots at slower shutter speeds and smoother video without a gimbal.`;
  }
  return `${camera.full_name} does not have In-Body Image Stabilization (IBIS). Stabilization must come from the lens (OIS/IS/VR) or an external gimbal.`;
}

export function getEVFInsight(camera: CameraDetail): string | null {
  const b = camera.body_spec;
  if (!b) return null;
  if (b.evf) {
    const res = b.evf_resolution ? ` (${b.evf_resolution})` : "";
    return `${camera.full_name} includes an Electronic Viewfinder (EVF)${res}, providing a bright, precise framing experience with real-time exposure and white balance preview even in direct sunlight.`;
  }
  return `${camera.full_name} does not have an Electronic Viewfinder. Composition relies entirely on the rear LCD screen.`;
}

export function getSensorInsight(camera: CameraDetail): string | null {
  const s = camera.sensor_spec;
  if (!s) return null;
  const parts: string[] = [];
  if (s.sensor_format) parts.push(s.sensor_format);
  if (s.effective_mp) parts.push(`${s.effective_mp}MP`);
  const resolution = parts.length ? parts.join(" ") : "sensor";
  const isoNote =
    s.native_iso_max && s.native_iso_max >= 51200
      ? ` Its high native ISO range up to ${s.native_iso_max.toLocaleString()} delivers impressive low-light performance.`
      : "";
  return `${camera.full_name} is equipped with a ${resolution} sensor${s.sensor_type ? ` (${s.sensor_type})` : ""}.${isoNote}`.trim();
}

export function getAutofocusInsight(camera: CameraDetail): string | null {
  const af = camera.autofocus_spec;
  if (!af) return null;
  const system = af.phase_detect ? "phase-detect" : "contrast-detect";
  const points = af.af_points ? `${af.af_points} AF points` : null;
  const tracking = af.subject_tracking ? "subject tracking (people, animals, vehicles)" : null;
  const coverage = af.af_coverage_pct ? `${af.af_coverage_pct}% frame coverage` : null;
  const details = [points, coverage, tracking].filter(Boolean).join(", ");
  const eyeNote = af.eye_af_human
    ? " Eye Detection AF ensures tack-sharp focus on subjects in portraits and street photography."
    : "";
  return `${camera.full_name} uses a ${system} autofocus system${details ? ` with ${details}` : ""}.${eyeNote}`.trim();
}

export function getVideoInsight(camera: CameraDetail): string | null {
  const v = camera.video_spec;
  if (!v) return null;
  const res = v.max_video_resolution || "4K";
  const fps = v.max_4k_fps ? ` at up to ${v.max_4k_fps}fps` : "";
  const log = v.log_profiles ? ` Log profiles (${v.log_profiles}) are available for color grading in post.` : "";
  const hdmi = v.hdmi_type
    ? ` Clean ${v.hdmi_type} HDMI output supports external recorders for higher bitrate capture.`
    : "";
  return `${camera.full_name} records ${res} video${fps}.${log}${hdmi}`.trim();
}
