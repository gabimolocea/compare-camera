from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_display_name = serializers.CharField(source="author.display_name", read_only=True)
    author_reputation = serializers.IntegerField(source="author.reputation_score", read_only=True)
    has_voted = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = (
            "id", "camera", "author", "author_username", "author_display_name",
            "author_reputation", "title", "body", "rating_overall", "rating_photo",
            "rating_video", "rating_value", "usage_type", "experience_level",
            "ownership_status", "pros", "cons", "is_published", "is_featured",
            "helpful_votes_count", "has_voted", "created_at", "updated_at",
        )
        read_only_fields = ("author", "helpful_votes_count", "is_published", "is_featured",
                           "author_username", "author_display_name", "author_reputation", "has_voted")

    @extend_schema_field(serializers.BooleanField())
    def get_has_voted(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.votes.filter(user=request.user).exists()
        return False

    def validate_body(self, value):
        if len(value) < 200:
            raise serializers.ValidationError("Review body must be at least 200 characters.")
        return value

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)
