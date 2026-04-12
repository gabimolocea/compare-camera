// Core API types matching Django serializers

export interface User {
  id: number;
  email: string;
  username: string;
  display_name: string;
  avatar: string | null;
  bio: string;
  role: "user" | "moderator" | "admin";
  reputation_score: number;
  created_at: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  country: string;
  official_website: string;
  logo: string | null;
}

export interface Camera {
  id: number;
  brand: Brand;
  model_name: string;
  full_name: string;
  slug: string;
  category: "mirrorless" | "dslr" | "compact" | "cinema" | "action";
  mount: string;
  release_date: string | null;
  status: "active" | "discontinued" | "rumored";
  msrp: string | null;
  current_price_estimate: string | null;
  short_summary: string;
  hero_image: string | null;
  official_url: string;
  overall_score?: number | null;
}

export interface Lens {
  id: number;
  name: string;
  mount: string;
  focal_length: string;
  max_aperture: string;
  lens_type: string;
  official_url: string;
}

export interface CameraDetail extends Camera {
  updated_at: string;
  announcement_date: string | null;
  gallery_images: GalleryImage[];
  sensor_spec: SensorSpec | null;
  video_spec: VideoSpec | null;
  body_spec: BodySpec | null;
  autofocus_spec: AutofocusSpec | null;
  connectivity_spec: ConnectivitySpec | null;
  series: string;
  pros: string;
  cons: string;
  series_cameras: Camera[];
  popular_lenses: Lens[];
}

export interface GalleryImage {
  id: number;
  image: string;
  alt_text: string;
  order: number;
}

export interface SensorSpec {
  sensor_type: string;
  sensor_format: string;
  sensor_width_mm: number | null;
  sensor_height_mm: number | null;
  effective_mp: number | null;
  max_photo_resolution: string;
  native_iso_min: number | null;
  native_iso_max: number | null;
  extended_iso_min: number | null;
  extended_iso_max: number | null;
  ibis: boolean;
  ibis_stops: number | null;
}

export interface VideoSpec {
  max_video_resolution: string;
  max_4k_fps: number | null;
  max_fhd_fps: number | null;
  high_speed_video_fps: number | null;
  raw_video: boolean;
  internal_10bit: boolean;
  unlimited_recording: boolean;
  digital_is: boolean;
  lens_breathing_correction: boolean;
  log_profiles: string;
  recording_limit_min: number | null;
  overheating_notes: string;
  mic_in: boolean;
  headphone_out: boolean;
  hdmi_type: string;
  usb_streaming: boolean;
}

export interface BodySpec {
  weight_g: number | null;
  width_mm: number | null;
  height_mm: number | null;
  depth_mm: number | null;
  weather_sealed: boolean;
  battery_shots_cipa: number | null;
  articulating_screen: boolean;
  touchscreen: boolean;
  screen_size_inches: number | null;
  screen_resolution_kdots: number | null;
  evf: boolean;
  evf_resolution: string;
  evf_coverage_pct: number | null;
  evf_magnification: number | null;
  dual_card_slots: boolean;
  built_in_flash: boolean;
  max_shutter_mech: string;
  max_shutter_electronic: string;
  max_flash_sync: string;
  metering_multi_segment: boolean;
  metering_spot: boolean;
  metering_center_weighted: boolean;
  metering_partial: boolean;
  ae_bracketing: boolean;
  wb_bracketing: boolean;
  timelapse: boolean;
  gps: boolean;
}

export interface AutofocusSpec {
  phase_detect: boolean;
  af_contrast_detect: boolean;
  af_touch: boolean;
  af_points: number | null;
  af_coverage_pct: number | null;
  eye_af_human: boolean;
  face_detection: boolean;
  eye_af_animal: boolean;
  subject_tracking: boolean;
  vehicle_tracking: boolean;
  insect_tracking: boolean;
  min_focus_ev: number | null;
  burst_fps_mech: number | null;
  burst_fps_electronic: number | null;
}

export interface ConnectivitySpec {
  wifi: boolean;
  bluetooth: boolean;
  usb_c: boolean;
  usb_charging: boolean;
  webcam_mode: boolean;
  ethernet: boolean;
  flash_sync_port: boolean;
  full_size_hdmi: boolean;
}

export interface Review {
  id: number;
  camera: number;
  author: number;
  author_username: string;
  author_display_name: string;
  author_reputation: number;
  title: string;
  body: string;
  rating_overall: number;
  rating_photo: number;
  rating_video: number;
  rating_value: number;
  usage_type: string;
  experience_level: string;
  ownership_status: string;
  pros: string;
  cons: string;
  is_featured: boolean;
  helpful_votes_count: number;
  has_voted: boolean;
  created_at: string;
}

export interface Comment {
  id: number;
  user: number;
  user_username: string;
  user_display_name: string;
  content_type: number;
  object_id: number;
  body: string;
  parent: number | null;
  replies: Comment[];
  is_published: boolean;
  created_at: string;
}

export interface EditProposal {
  id: number;
  camera: number;
  proposer: number;
  proposer_username: string;
  section: string;
  field_name: string;
  current_value: string;
  proposed_value: string;
  reason: string;
  evidence_url: string;
  status: "pending" | "approved" | "rejected" | "needs_info";
  moderator_notes: string;
  created_at: string;
}

export interface FieldDiff {
  section: string;
  field: string;
  label: string;
  values: string[];       // one per camera, indexed by position
  best_indices: number[]; // indices of the winning camera(s)
}

export interface CompareResult {
  cameras: { id: number; name: string; slug: string; hero_image: string | null; msrp: string | null }[];
  winner_by_section: Record<string, number[]>; // winning camera indices per section ([] = all tied)
  field_diffs: FieldDiff[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface SamplePhoto {
  id: number;
  camera: number;
  image: string;
  title: string;
  description: string;
  taken_by: string;
  lens_name: string;
  focal_length: string;
  shutter_speed: string;
  aperture: string;
  iso: string;
  width_px: number | null;
  height_px: number | null;
  uploaded_by: number | null;
  uploaded_by_username: string | null;
  likes_count: number;
  is_published: boolean;
  created_at: string;
}
