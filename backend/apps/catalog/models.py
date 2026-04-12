from django.db import models
from django.conf import settings
from django.utils.text import slugify
from .choices import MountType, LensType


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    country = models.CharField(max_length=100, blank=True)
    official_website = models.URLField(blank=True)
    logo = models.ImageField(upload_to="brands/logos/", blank=True, null=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Camera(models.Model):
    class Category(models.TextChoices):
        MIRRORLESS = "mirrorless", "Mirrorless"
        DSLR = "dslr", "DSLR"
        COMPACT = "compact", "Compact"
        CINEMA = "cinema", "Cinema"
        ACTION = "action", "Action"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        DISCONTINUED = "discontinued", "Discontinued"
        RUMORED = "rumored", "Rumored"

    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="cameras")
    model_name = models.CharField(max_length=200)
    full_name = models.CharField(max_length=300, blank=True)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.MIRRORLESS)
    mount = models.CharField(
        max_length=100, blank=True,
        choices=MountType.choices,
        help_text="Interchangeable-lens mount or 'Fixed Lens' for compact cameras.",
    )
    announcement_date = models.DateField(blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    msrp = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    current_price_estimate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    short_summary = models.TextField(blank=True)
    hero_image = models.ImageField(upload_to="cameras/hero/", blank=True, null=True)
    official_url = models.URLField(blank=True)
    series = models.CharField(max_length=200, blank=True, help_text="e.g. 'EOS R', 'A7', 'X-T' — used to group related models")
    pros = models.TextField(blank=True, help_text="Newline-separated strengths, e.g. 'Excellent autofocus\nGreat dynamic range'")
    cons = models.TextField(blank=True, help_text="Newline-separated weaknesses")
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-release_date", "full_name"]

    def save(self, *args, **kwargs):
        if not self.full_name:
            self.full_name = f"{self.brand.name} {self.model_name}"
        if not self.slug:
            self.slug = slugify(self.full_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name


class CameraAlias(models.Model):
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name="aliases")
    alias = models.CharField(max_length=300)
    region = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.alias} ({self.camera})"


class Lens(models.Model):
    mount = models.CharField(
        max_length=100, db_index=True,
        choices=MountType.choices,
    )
    name = models.CharField(max_length=200)
    focal_length = models.CharField(max_length=100, blank=True)
    max_aperture = models.CharField(max_length=20, blank=True)
    lens_type = models.CharField(max_length=50, blank=True, choices=LensType.choices)
    is_popular = models.BooleanField(default=True)
    official_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-is_popular", "name"]

    def __str__(self):
        return f"{self.name} ({self.mount})"


class CameraGalleryImage(models.Model):
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="cameras/gallery/")
    alt_text = models.CharField(max_length=300, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Image {self.order} for {self.camera}"


class SamplePhoto(models.Model):
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name="sample_photos")
    image = models.ImageField(upload_to="cameras/samples/")
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    # Photographer / attribution
    taken_by = models.CharField(max_length=200, blank=True)
    # EXIF metadata
    lens_name = models.CharField(max_length=200, blank=True)
    focal_length = models.CharField(max_length=50, blank=True)   # e.g. "50 mm"
    shutter_speed = models.CharField(max_length=50, blank=True)  # e.g. "1/1000 sec"
    aperture = models.CharField(max_length=20, blank=True)       # e.g. "f/2"
    iso = models.CharField(max_length=20, blank=True)            # e.g. "ISO 100"
    width_px = models.PositiveIntegerField(null=True, blank=True)
    height_px = models.PositiveIntegerField(null=True, blank=True)
    # Uploader (null = anonymous / staff)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="sample_photos",
    )
    likes_count = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Sample for {self.camera} by {self.taken_by or 'unknown'}"
