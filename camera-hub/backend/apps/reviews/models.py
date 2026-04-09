from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.catalog.models import Camera


class Review(models.Model):
    class UsageType(models.TextChoices):
        TRAVEL = "travel", "Travel"
        WEDDING = "wedding", "Wedding"
        STUDIO = "studio", "Studio"
        WILDLIFE = "wildlife", "Wildlife"
        VLOGGING = "vlogging", "Vlogging"
        CINEMA = "cinema", "Cinema"
        GENERAL = "general", "General"

    class ExperienceLevel(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        ENTHUSIAST = "enthusiast", "Enthusiast"
        PRO = "pro", "Pro"

    class OwnershipStatus(models.TextChoices):
        OWNED = "owned", "Owned"
        TESTED = "tested", "Tested"
        RENTED = "rented", "Rented"

    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name="reviews")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    title = models.CharField(max_length=300)
    body = models.TextField()
    rating_overall = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    rating_photo = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    rating_video = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    rating_value = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    usage_type = models.CharField(max_length=20, choices=UsageType.choices, default=UsageType.GENERAL)
    experience_level = models.CharField(max_length=20, choices=ExperienceLevel.choices, default=ExperienceLevel.ENTHUSIAST)
    ownership_status = models.CharField(max_length=20, choices=OwnershipStatus.choices, default=OwnershipStatus.OWNED)
    pros = models.TextField()
    cons = models.TextField()
    is_verified_owner = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    helpful_votes_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("camera", "author")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author} review of {self.camera}"


class ReviewVote(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name="votes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="review_votes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("review", "user")

    def __str__(self):
        return f"{self.user} helpful vote on {self.review}"
