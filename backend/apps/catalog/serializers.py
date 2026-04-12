from rest_framework import serializers
from .models import Brand, Camera, CameraGalleryImage, Lens, SamplePhoto
from apps.specs.serializers import (
    SensorSpecSerializer, VideoSpecSerializer, BodySpecSerializer,
    AutofocusSpecSerializer, ConnectivitySpecSerializer,
)


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name", "slug", "country", "official_website", "logo")


class CameraGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CameraGalleryImage
        fields = ("id", "image", "alt_text", "order")


class LensSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lens
        fields = ("id", "name", "mount", "focal_length", "max_aperture", "lens_type", "official_url")


class SamplePhotoSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.CharField(source="uploaded_by.username", read_only=True, default=None)
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = SamplePhoto
        fields = (
            "id", "camera", "image", "title", "description",
            "taken_by", "lens_name", "focal_length", "shutter_speed", "aperture", "iso",
            "width_px", "height_px", "uploaded_by", "uploaded_by_username",
            "likes_count", "is_published", "created_at",
        )
        read_only_fields = ("id", "likes_count", "is_published", "created_at", "uploaded_by")


class SamplePhotoUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = SamplePhoto
        fields = (
            "camera", "image", "title", "description",
            "taken_by", "lens_name", "focal_length", "shutter_speed", "aperture", "iso",
            "width_px", "height_px",
        )


class CameraListSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    overall_score = serializers.SerializerMethodField()

    class Meta:
        model = Camera
        fields = (
            "id", "brand", "model_name", "full_name", "slug", "category",
            "mount", "release_date", "status", "msrp", "current_price_estimate",
            "short_summary", "hero_image", "overall_score",
        )

    def get_overall_score(self, obj):
        s = getattr(obj, "sensor_spec", None)
        v = getattr(obj, "video_spec", None)
        b = getattr(obj, "body_spec", None)
        af = getattr(obj, "autofocus_spec", None)

        imaging = 40
        if s:
            if s.sensor_format == "Full Frame": imaging += 25
            elif s.sensor_format == "APS-C": imaging += 15
            elif s.sensor_format == "Micro Four Thirds": imaging += 8
            if s.effective_mp and s.effective_mp >= 24: imaging += 8
            if s.effective_mp and s.effective_mp >= 45: imaging += 7
            if s.ibis: imaging += 8
            if s.native_iso_max and s.native_iso_max >= 51200: imaging += 7
        if af and af.eye_af_human: imaging += 5

        features = 40
        if s and s.ibis: features += 10
        if b:
            if b.weather_sealed: features += 10
            if b.dual_card_slots: features += 8
            if b.evf: features += 8
            if b.articulating_screen: features += 8
            if getattr(b, "gps", False): features += 5
            if getattr(b, "timelapse", False): features += 3
            if getattr(b, "ae_bracketing", False): features += 4
            if getattr(b, "touchscreen", False): features += 4

        video = 30
        if v:
            if v.max_4k_fps and v.max_4k_fps >= 30: video += 15
            if v.max_4k_fps and v.max_4k_fps >= 60: video += 10
            if v.max_4k_fps and v.max_4k_fps >= 120: video += 10
            if v.internal_10bit: video += 10
            if getattr(v, "raw_video", False): video += 10
            if getattr(v, "unlimited_recording", False): video += 5
            if getattr(v, "mic_in", False): video += 5
            if getattr(v, "headphone_out", False): video += 5

        size = 55
        if b and b.weight_g:
            if b.weight_g < 400: size += 30
            elif b.weight_g < 600: size += 18
            elif b.weight_g < 800: size += 8
            else: size -= 5
        if b and not b.evf: size += 5
        if b and not b.dual_card_slots: size += 3

        def clamp(x): return max(0, min(100, x))
        return round((clamp(imaging) + clamp(features) + clamp(video) + clamp(size)) / 4)


class CameraDetailSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    gallery_images = CameraGalleryImageSerializer(many=True, read_only=True)
    sensor_spec = SensorSpecSerializer(read_only=True, default=None)
    video_spec = VideoSpecSerializer(read_only=True, default=None)
    body_spec = BodySpecSerializer(read_only=True, default=None)
    autofocus_spec = AutofocusSpecSerializer(read_only=True, default=None)
    connectivity_spec = ConnectivitySpecSerializer(read_only=True, default=None)
    series_cameras = serializers.SerializerMethodField()
    popular_lenses = serializers.SerializerMethodField()

    class Meta:
        model = Camera
        fields = "__all__"

    def get_series_cameras(self, obj):
        if not obj.series:
            return []
        qs = Camera.objects.filter(
            series=obj.series, is_published=True
        ).exclude(pk=obj.pk).select_related("brand").order_by("release_date")
        return CameraListSerializer(qs, many=True, context=self.context).data

    def get_popular_lenses(self, obj):
        if not obj.mount or obj.mount == "Fixed Lens":
            return []
        qs = Lens.objects.filter(mount=obj.mount, is_popular=True)
        return LensSerializer(qs, many=True).data
