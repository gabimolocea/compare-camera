from django.contrib import admin
from .models import Brand, Camera, CameraAlias, CameraGalleryImage


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


@admin.register(Camera)
class CameraAdmin(admin.ModelAdmin):
    list_display = ("full_name", "brand", "category", "status", "release_date", "is_published")
    list_filter = ("brand", "category", "status", "is_published")
    search_fields = ("model_name", "full_name", "slug")
    prepopulated_fields = {"slug": ("full_name",)}
    inlines = [CameraAliasInline, CameraGalleryImageInline]
    readonly_fields = ("created_at", "updated_at")
