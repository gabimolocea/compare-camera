from django.contrib import admin
from .models import Review, ReviewVote


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("camera", "author", "rating_overall", "is_published", "is_featured", "created_at")
    list_filter = ("is_published", "is_featured", "usage_type", "experience_level")
    search_fields = ("title", "author__email", "camera__full_name")
    readonly_fields = ("created_at", "updated_at", "helpful_votes_count")
    actions = ["publish_reviews", "unpublish_reviews"]

    @admin.action(description="Publish selected reviews")
    def publish_reviews(self, request, queryset):
        queryset.update(is_published=True)

    @admin.action(description="Unpublish selected reviews")
    def unpublish_reviews(self, request, queryset):
        queryset.update(is_published=False)
