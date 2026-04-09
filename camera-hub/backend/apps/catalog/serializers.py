from rest_framework import serializers
from .models import Brand, Camera, CameraGalleryImage


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name", "slug", "country", "official_website", "logo")


class CameraGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CameraGalleryImage
        fields = ("id", "image", "alt_text", "order")


class CameraListSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)

    class Meta:
        model = Camera
        fields = (
            "id", "brand", "model_name", "full_name", "slug", "category",
            "mount", "release_date", "status", "msrp", "current_price_estimate",
            "short_summary", "hero_image",
        )


class CameraDetailSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    gallery_images = CameraGalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = Camera
        fields = "__all__"
