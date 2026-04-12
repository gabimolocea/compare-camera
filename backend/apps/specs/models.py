from django.db import models
from apps.catalog.models import Camera


class SensorSpec(models.Model):
    camera = models.OneToOneField(Camera, on_delete=models.CASCADE, related_name="sensor_spec")
    sensor_type = models.CharField(max_length=100, blank=True)
    sensor_format = models.CharField(max_length=100, blank=True)
    sensor_width_mm = models.FloatField(blank=True, null=True)
    sensor_height_mm = models.FloatField(blank=True, null=True)
    effective_mp = models.FloatField(blank=True, null=True)
    max_photo_resolution = models.CharField(max_length=100, blank=True)
    native_iso_min = models.IntegerField(blank=True, null=True)
    native_iso_max = models.IntegerField(blank=True, null=True)
    extended_iso_min = models.IntegerField(blank=True, null=True)
    extended_iso_max = models.IntegerField(blank=True, null=True)
    ibis = models.BooleanField(default=False)
    ibis_stops = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"Sensor specs for {self.camera}"


class VideoSpec(models.Model):
    camera = models.OneToOneField(Camera, on_delete=models.CASCADE, related_name="video_spec")
    max_video_resolution = models.CharField(max_length=100, blank=True)
    max_4k_fps = models.IntegerField(blank=True, null=True)
    max_fhd_fps = models.IntegerField(blank=True, null=True)
    high_speed_video_fps = models.IntegerField(blank=True, null=True)
    raw_video = models.BooleanField(default=False)
    internal_10bit = models.BooleanField(default=False)
    unlimited_recording = models.BooleanField(default=False)
    digital_is = models.BooleanField(default=False)
    lens_breathing_correction = models.BooleanField(default=False)
    log_profiles = models.CharField(max_length=200, blank=True)
    recording_limit_min = models.IntegerField(blank=True, null=True)
    overheating_notes = models.TextField(blank=True)
    mic_in = models.BooleanField(default=False)
    headphone_out = models.BooleanField(default=False)
    hdmi_type = models.CharField(max_length=50, blank=True)
    usb_streaming = models.BooleanField(default=False)

    def __str__(self):
        return f"Video specs for {self.camera}"


class BodySpec(models.Model):
    camera = models.OneToOneField(Camera, on_delete=models.CASCADE, related_name="body_spec")
    weight_g = models.IntegerField(blank=True, null=True)
    width_mm = models.FloatField(blank=True, null=True)
    height_mm = models.FloatField(blank=True, null=True)
    depth_mm = models.FloatField(blank=True, null=True)
    weather_sealed = models.BooleanField(default=False)
    battery_shots_cipa = models.IntegerField(blank=True, null=True)
    articulating_screen = models.BooleanField(default=False)
    touchscreen = models.BooleanField(default=False)
    screen_size_inches = models.FloatField(blank=True, null=True)
    screen_resolution_kdots = models.IntegerField(blank=True, null=True)
    evf = models.BooleanField(default=False)
    evf_resolution = models.CharField(max_length=100, blank=True)
    evf_coverage_pct = models.FloatField(blank=True, null=True)
    evf_magnification = models.FloatField(blank=True, null=True)
    dual_card_slots = models.BooleanField(default=False)
    built_in_flash = models.BooleanField(default=False)
    max_shutter_mech = models.CharField(max_length=50, blank=True)
    max_shutter_electronic = models.CharField(max_length=50, blank=True)
    max_flash_sync = models.CharField(max_length=50, blank=True)
    metering_multi_segment = models.BooleanField(default=False)
    metering_spot = models.BooleanField(default=False)
    metering_center_weighted = models.BooleanField(default=False)
    metering_partial = models.BooleanField(default=False)
    ae_bracketing = models.BooleanField(default=False)
    wb_bracketing = models.BooleanField(default=False)
    timelapse = models.BooleanField(default=False)
    gps = models.BooleanField(default=False)

    def __str__(self):
        return f"Body specs for {self.camera}"


class AutofocusSpec(models.Model):
    camera = models.OneToOneField(Camera, on_delete=models.CASCADE, related_name="autofocus_spec")
    phase_detect = models.BooleanField(default=False)
    af_contrast_detect = models.BooleanField(default=False)
    af_touch = models.BooleanField(default=False)
    af_points = models.IntegerField(blank=True, null=True)
    af_coverage_pct = models.FloatField(blank=True, null=True)
    eye_af_human = models.BooleanField(default=False)
    face_detection = models.BooleanField(default=False)
    eye_af_animal = models.BooleanField(default=False)
    subject_tracking = models.BooleanField(default=False)
    vehicle_tracking = models.BooleanField(default=False)
    insect_tracking = models.BooleanField(default=False)
    min_focus_ev = models.FloatField(blank=True, null=True)
    burst_fps_mech = models.FloatField(blank=True, null=True)
    burst_fps_electronic = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"AF specs for {self.camera}"


class ConnectivitySpec(models.Model):
    camera = models.OneToOneField(Camera, on_delete=models.CASCADE, related_name="connectivity_spec")
    wifi = models.BooleanField(default=False)
    bluetooth = models.BooleanField(default=False)
    usb_c = models.BooleanField(default=False)
    usb_charging = models.BooleanField(default=False)
    webcam_mode = models.BooleanField(default=False)
    ethernet = models.BooleanField(default=False)
    flash_sync_port = models.BooleanField(default=False)
    full_size_hdmi = models.BooleanField(default=False)

    def __str__(self):
        return f"Connectivity specs for {self.camera}"


class SpecFieldSource(models.Model):
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name="spec_sources")
    section = models.CharField(max_length=100)
    field_name = models.CharField(max_length=100)
    source_name = models.CharField(max_length=200)
    source_url = models.URLField(blank=True)
    imported_at = models.DateTimeField(auto_now_add=True)
    confidence_score = models.FloatField(default=1.0)
    is_verified = models.BooleanField(default=False)

    class Meta:
        unique_together = ("camera", "section", "field_name")

    def __str__(self):
        return f"{self.camera} / {self.section}.{self.field_name}"
