from django.contrib import admin
from .models import Brand, Camera, CameraAlias, CameraGalleryImage, Lens, SamplePhoto
from apps.specs.models import SensorSpec, VideoSpec, BodySpec, AutofocusSpec, ConnectivitySpec


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "country", "official_website")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


class CameraAliasInline(admin.TabularInline):
    model = CameraAlias
    extra = 1


class CameraGalleryImageInline(admin.TabularInline):
    model = CameraGalleryImage
    extra = 1


class SensorSpecInline(admin.StackedInline):
    model = SensorSpec
    extra = 0
    can_delete = False


class VideoSpecInline(admin.StackedInline):
    model = VideoSpec
    extra = 0
    can_delete = False


class BodySpecInline(admin.StackedInline):
    model = BodySpec
    extra = 0
    can_delete = False


class AutofocusSpecInline(admin.StackedInline):
    model = AutofocusSpec
    extra = 0
    can_delete = False


class ConnectivitySpecInline(admin.StackedInline):
    model = ConnectivitySpec
    extra = 0
    can_delete = False


@admin.register(Camera)
class CameraAdmin(admin.ModelAdmin):
    list_display = ("full_name", "brand", "category", "series", "status", "release_date", "is_published")
    list_filter = ("brand", "category", "status", "is_published")
    search_fields = ("model_name", "full_name", "slug", "series")
    prepopulated_fields = {"slug": ("full_name",)}
    inlines = [
        CameraAliasInline,
        CameraGalleryImageInline,
        SensorSpecInline,
        VideoSpecInline,
        BodySpecInline,
        AutofocusSpecInline,
        ConnectivitySpecInline,
    ]
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("brand", "model_name", "full_name", "slug", "series", "category", "mount", "status", "is_published")}),
        ("Dates & Pricing", {"fields": ("announcement_date", "release_date", "msrp", "current_price_estimate")}),
        ("Content", {"fields": ("short_summary", "pros", "cons", "hero_image", "official_url")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(Lens)
class LensAdmin(admin.ModelAdmin):
    list_display = ("name", "mount", "focal_length", "max_aperture", "lens_type", "is_popular")
    list_filter = ("mount", "lens_type", "is_popular")
    search_fields = ("name", "mount")


@admin.register(SamplePhoto)
class SamplePhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "camera", "taken_by", "lens_name", "focal_length", "aperture", "iso", "is_published", "created_at")
    list_filter = ("is_published", "camera__brand")
    search_fields = ("camera__full_name", "taken_by", "lens_name")
    list_editable = ("is_published",)
    readonly_fields = ("created_at", "uploaded_by")
