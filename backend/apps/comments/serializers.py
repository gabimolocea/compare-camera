from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    user_display_name = serializers.CharField(source="user.display_name", read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = (
            "id", "user", "user_username", "user_display_name",
            "content_type", "object_id", "body", "parent",
            "replies", "is_published", "created_at", "updated_at",
        )
        read_only_fields = ("user", "is_published", "user_username", "user_display_name")

    @extend_schema_field(serializers.ListSerializer(child=serializers.DictField()))
    def get_replies(self, obj):
        if obj.parent is not None:
            return []
        replies = obj.replies.filter(is_published=True)
        return CommentSerializer(replies, many=True, context=self.context).data

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
