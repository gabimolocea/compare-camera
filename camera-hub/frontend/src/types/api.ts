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
}

export interface CameraDetail extends Camera {
  announcement_date: string | null;
  gallery_images: GalleryImage[];
  sensor_spec: SensorSpec | null;
  video_spec: VideoSpec | null;
  body_spec: BodySpec | null;
  autofocus_spec: AutofocusSpec | null;
  connectivity_spec: ConnectivitySpec | null;
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
  ibis: boolean;
}

export interface VideoSpec {
  max_video_resolution: string;
  max_4k_fps: number | null;
  max_fhd_fps: number | null;
  raw_video: boolean;
  internal_10bit: boolean;
  log_profiles: string;
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
  evf: boolean;
  dual_card_slots: boolean;
}

export interface AutofocusSpec {
  phase_detect: boolean;
  af_points: number | null;
  eye_af_human: boolean;
  eye_af_animal: boolean;
  subject_tracking: boolean;
  burst_fps_mech: number | null;
  burst_fps_electronic: number | null;
}

export interface ConnectivitySpec {
  wifi: boolean;
  bluetooth: boolean;
  usb_c: boolean;
  usb_charging: boolean;
  webcam_mode: boolean;
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
  left: string;
  right: string;
  winner: "left" | "right" | "tie";
}

export interface CompareResult {
  overview: {
    left: { id: number; name: string; slug: string; hero_image: string | null };
    right: { id: number; name: string; slug: string; hero_image: string | null };
  };
  winner_by_section: Record<string, "left" | "right" | "tie">;
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
