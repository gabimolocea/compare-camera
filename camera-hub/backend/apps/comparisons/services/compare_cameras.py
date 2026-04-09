from apps.catalog.models import Camera
from apps.specs.models import SensorSpec, VideoSpec, BodySpec, AutofocusSpec, ConnectivitySpec


SPEC_SECTIONS = {
    "sensor": {
        "model": SensorSpec,
        "fields": [
            ("effective_mp", "Effective MP", "higher"),
            ("native_iso_min", "Native ISO Min", "lower"),
            ("native_iso_max", "Native ISO Max", "higher"),
            ("ibis", "IBIS", "boolean"),
        ],
    },
    "video": {
        "model": VideoSpec,
        "fields": [
            ("max_4k_fps", "Max 4K FPS", "higher"),
            ("max_fhd_fps", "Max FHD FPS", "higher"),
            ("raw_video", "RAW Video", "boolean"),
            ("internal_10bit", "10-bit Internal", "boolean"),
        ],
    },
    "body": {
        "model": BodySpec,
        "fields": [
            ("weight_g", "Weight (g)", "lower"),
            ("weather_sealed", "Weather Sealed", "boolean"),
            ("battery_shots_cipa", "Battery (CIPA)", "higher"),
            ("dual_card_slots", "Dual Card Slots", "boolean"),
            ("articulating_screen", "Articulating Screen", "boolean"),
        ],
    },
    "autofocus": {
        "model": AutofocusSpec,
        "fields": [
            ("af_points", "AF Points", "higher"),
            ("eye_af_human", "Eye AF (Human)", "boolean"),
            ("eye_af_animal", "Eye AF (Animal)", "boolean"),
            ("burst_fps_mech", "Burst FPS (Mech)", "higher"),
            ("burst_fps_electronic", "Burst FPS (Electronic)", "higher"),
        ],
    },
    "connectivity": {
        "model": ConnectivitySpec,
        "fields": [
            ("wifi", "WiFi", "boolean"),
            ("bluetooth", "Bluetooth", "boolean"),
            ("usb_c", "USB-C", "boolean"),
            ("usb_charging", "USB Charging", "boolean"),
        ],
    },
}


def _get_winner(left_val, right_val, direction: str):
    """Determine which side wins for a field comparison."""
    if left_val is None and right_val is None:
        return "tie"
    if left_val is None:
        return "right"
    if right_val is None:
        return "left"
    if direction == "boolean":
        if left_val == right_val:
            return "tie"
        return "left" if left_val else "right"
    if direction == "higher":
        if left_val > right_val:
            return "left"
        if right_val > left_val:
            return "right"
        return "tie"
    if direction == "lower":
        if left_val < right_val:
            return "left"
        if right_val < left_val:
            return "right"
        return "tie"
    return "tie"


def compare_cameras(left: Camera, right: Camera) -> dict:
    """Build a full comparison payload between two cameras."""
    field_diffs = []
    section_scores = {section: {"left": 0, "right": 0} for section in SPEC_SECTIONS}

    for section_name, section_config in SPEC_SECTIONS.items():
        model_class = section_config["model"]
        try:
            left_spec = model_class.objects.get(camera=left)
        except model_class.DoesNotExist:
            left_spec = None
        try:
            right_spec = model_class.objects.get(camera=right)
        except model_class.DoesNotExist:
            right_spec = None

        for field_name, label, direction in section_config["fields"]:
            left_val = getattr(left_spec, field_name, None) if left_spec else None
            right_val = getattr(right_spec, field_name, None) if right_spec else None
            winner = _get_winner(left_val, right_val, direction)
            if winner == "left":
                section_scores[section_name]["left"] += 1
            elif winner == "right":
                section_scores[section_name]["right"] += 1

            field_diffs.append({
                "section": section_name,
                "field": field_name,
                "label": label,
                "left": str(left_val) if left_val is not None else "—",
                "right": str(right_val) if right_val is not None else "—",
                "winner": winner,
            })

    winner_by_section = {}
    for section, scores in section_scores.items():
        if scores["left"] > scores["right"]:
            winner_by_section[section] = "left"
        elif scores["right"] > scores["left"]:
            winner_by_section[section] = "right"
        else:
            winner_by_section[section] = "tie"

    return {
        "overview": {
            "left": {"id": left.pk, "name": left.full_name, "slug": left.slug, "hero_image": left.hero_image.url if left.hero_image else None},
            "right": {"id": right.pk, "name": right.full_name, "slug": right.slug, "hero_image": right.hero_image.url if right.hero_image else None},
        },
        "winner_by_section": winner_by_section,
        "field_diffs": field_diffs,
    }
