from django.contrib import admin
from .models import SensorSpec, VideoSpec, BodySpec, AutofocusSpec, ConnectivitySpec, SpecFieldSource


@admin.register(SensorSpec)
class SensorSpecAdmin(admin.ModelAdmin):
    list_display = ("camera", "sensor_format", "effective_mp", "ibis")
    search_fields = ("camera__full_name",)


@admin.register(VideoSpec)
class VideoSpecAdmin(admin.ModelAdmin):
    list_display = ("camera", "max_video_resolution", "max_4k_fps", "raw_video", "internal_10bit")
    search_fields = ("camera__full_name",)


@admin.register(BodySpec)
class BodySpecAdmin(admin.ModelAdmin):
    list_display = ("camera", "weight_g", "weather_sealed", "dual_card_slots")
    search_fields = ("camera__full_name",)


@admin.register(AutofocusSpec)
class AutofocusSpecAdmin(admin.ModelAdmin):
    list_display = ("camera", "phase_detect", "af_points", "eye_af_human", "burst_fps_mech")
    search_fields = ("camera__full_name",)


@admin.register(ConnectivitySpec)
class ConnectivitySpecAdmin(admin.ModelAdmin):
    list_display = ("camera", "wifi", "bluetooth", "usb_c", "usb_charging")
    search_fields = ("camera__full_name",)
