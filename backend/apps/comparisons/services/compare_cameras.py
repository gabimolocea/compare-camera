from apps.catalog.models import Camera
from apps.specs.models import SensorSpec, VideoSpec, BodySpec, AutofocusSpec, ConnectivitySpec

MAX_CAMERAS = 4

# direction: "higher" | "lower" | "boolean" | "none"
SPEC_SECTIONS = {
    "sensor": {
        "model": SensorSpec,
        "fields": [
            ("sensor_type", "Sensor Type", "none"),
            ("sensor_format", "Sensor Format", "none"),
            ("effective_mp", "Megapixels", "higher"),
            ("max_photo_resolution", "Max Resolution", "none"),
            ("native_iso_min", "Native ISO (Min)", "lower"),
            ("native_iso_max", "Native ISO (Max)", "higher"),
            ("extended_iso_max", "Boosted ISO (Max)", "higher"),
            ("ibis", "Image Stabilization (IBIS)", "boolean"),
            ("ibis_stops", "IS Effectiveness (stops)", "higher"),
        ],
    },
    "screen": {
        "model": BodySpec,
        "fields": [
            ("screen_size_inches", 'LCD Screen Size (")', "none"),
            ("screen_resolution_kdots", "LCD Resolution (k dots)", "higher"),
            ("touchscreen", "Touch Screen", "boolean"),
            ("articulating_screen", "Adjustable / Articulating Screen", "boolean"),
            ("evf", "Electronic Viewfinder", "boolean"),
            ("evf_resolution", "EVF Resolution", "none"),
            ("evf_coverage_pct", "EVF Coverage (%)", "higher"),
            ("evf_magnification", "EVF Magnification", "higher"),
        ],
    },
    "autofocus": {
        "model": AutofocusSpec,
        "fields": [
            ("phase_detect", "Phase Detection AF", "boolean"),
            ("af_contrast_detect", "Contrast Detection AF", "boolean"),
            ("af_touch", "AF Touch", "boolean"),
            ("af_points", "Number of AF Points", "higher"),
            ("af_coverage_pct", "AF Coverage (%)", "higher"),
            ("eye_af_human", "Eye AF (Human)", "boolean"),
            ("face_detection", "Face Detection Focus", "boolean"),
            ("eye_af_animal", "Eye AF (Animal)", "boolean"),
            ("subject_tracking", "Subject Tracking", "boolean"),
            ("vehicle_tracking", "Vehicle Tracking Focus", "boolean"),
            ("insect_tracking", "Insect Tracking Focus", "boolean"),
            ("min_focus_ev", "Min Focus Sensitivity (EV)", "lower"),
            ("burst_fps_mech", "Continuous Shooting — Mechanical (fps)", "higher"),
            ("burst_fps_electronic", "Continuous Shooting — Electronic (fps)", "higher"),
        ],
    },
    "shooting": {
        "model": BodySpec,
        "fields": [
            ("max_shutter_mech", "Max Mechanical Shutter", "none"),
            ("max_shutter_electronic", "Max Electronic Shutter", "none"),
            ("max_flash_sync", "Max Flash Sync Speed", "none"),
            ("metering_multi_segment", "Multi-Segment Metering", "boolean"),
            ("metering_spot", "Spot Metering", "boolean"),
            ("metering_center_weighted", "Center-Weighted Metering", "boolean"),
            ("metering_partial", "Partial Metering", "boolean"),
            ("ae_bracketing", "AE Bracketing", "boolean"),
            ("wb_bracketing", "WB Bracketing", "boolean"),
            ("built_in_flash", "Built-in Flash", "boolean"),
            ("timelapse", "Timelapse Recording", "boolean"),
            ("gps", "GPS", "boolean"),
        ],
    },
    "video": {
        "model": VideoSpec,
        "fields": [
            ("max_video_resolution", "Max Video Resolution", "none"),
            ("max_4k_fps", "Max 4K FPS", "higher"),
            ("max_fhd_fps", "Max FHD FPS", "higher"),
            ("high_speed_video_fps", "High-Speed Video (fps)", "higher"),
            ("raw_video", "RAW Video Output", "boolean"),
            ("internal_10bit", "10-bit Internal Recording", "boolean"),
            ("unlimited_recording", "Unlimited Recording", "boolean"),
            ("digital_is", "Digital Video Stabilization", "boolean"),
            ("lens_breathing_correction", "Lens Breathing Correction", "boolean"),
            ("log_profiles", "Log Profiles", "none"),
            ("hdmi_type", "HDMI Type", "none"),
            ("mic_in", "Microphone Port", "boolean"),
            ("headphone_out", "Headphone Port", "boolean"),
            ("usb_streaming", "USB Streaming", "boolean"),
        ],
    },
    "connectivity": {
        "model": ConnectivitySpec,
        "fields": [
            ("wifi", "Wi-Fi", "boolean"),
            ("bluetooth", "Bluetooth", "boolean"),
            ("usb_c", "USB-C", "boolean"),
            ("usb_charging", "USB Charging", "boolean"),
            ("webcam_mode", "Webcam Mode", "boolean"),
            ("ethernet", "Ethernet Port", "boolean"),
            ("flash_sync_port", "Flash Sync Port", "boolean"),
            ("full_size_hdmi", "Full-Size HDMI", "boolean"),
        ],
    },
    "physical": {
        "model": BodySpec,
        "fields": [
            ("weight_g", "Weight (g)", "lower"),
            ("width_mm", "Width (mm)", "none"),
            ("height_mm", "Height (mm)", "none"),
            ("depth_mm", "Depth / Thickness (mm)", "lower"),
            ("weather_sealed", "Environmental Sealing", "boolean"),
            ("battery_shots_cipa", "Battery Life (CIPA shots)", "higher"),
            ("dual_card_slots", "Dual Card Slots", "boolean"),
        ],
    },
}


def _best_indices(values: list, direction: str) -> list[int]:
    """Return the indices of the best camera(s) for a field. Returns [] if all None or direction=none."""
    if direction == "none":
        return []
    non_none = [(i, v) for i, v in enumerate(values) if v is not None]
    if not non_none:
        return []
    if direction == "boolean":
        winners = [i for i, v in non_none if v]
        return winners if winners else []
    if direction == "higher":
        best_val = max(v for _, v in non_none)
        return [i for i, v in non_none if v == best_val]
    if direction == "lower":
        best_val = min(v for _, v in non_none)
        return [i for i, v in non_none if v == best_val]
    return []


def _fmt(val) -> str:
    if val is None:
        return "—"
    if isinstance(val, bool):
        return "Yes" if val else "No"
    if isinstance(val, float) and val == int(val):
        return str(int(val))
    return str(val)


def compare_cameras(cameras: list[Camera]) -> dict:
    """Build a full comparison payload for 2–4 cameras."""
    n = len(cameras)
    section_scores = {section: [0] * n for section in SPEC_SECTIONS}
    field_diffs = []

    for section_name, section_config in SPEC_SECTIONS.items():
        model_class = section_config["model"]
        specs = []
        for cam in cameras:
            try:
                specs.append(model_class.objects.get(camera=cam))
            except model_class.DoesNotExist:
                specs.append(None)

        for field_name, label, direction in section_config["fields"]:
            values = [getattr(spec, field_name, None) if spec else None for spec in specs]
            best = _best_indices(values, direction)
            if direction != "none":
                for idx in best:
                    section_scores[section_name][idx] += 1

            field_diffs.append({
                "section": section_name,
                "field": field_name,
                "label": label,
                "values": [_fmt(v) for v in values],
                "best_indices": best,
            })

    winner_by_section = {}
    for section, scores in section_scores.items():
        max_score = max(scores)
        leaders = [i for i, s in enumerate(scores) if s == max_score]
        winner_by_section[section] = leaders if len(leaders) < n else []  # [] == all tied

    return {
        "cameras": [
            {
                "id": cam.pk,
                "name": cam.full_name,
                "slug": cam.slug,
                "hero_image": cam.hero_image.url if cam.hero_image else None,
                "msrp": str(cam.msrp) if cam.msrp else None,
            }
            for cam in cameras
        ],
        "winner_by_section": winner_by_section,
        "field_diffs": field_diffs,
    }
