from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Comment, CommentVote
from .serializers import CommentSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.filter(is_published=True, parent=None).select_related("user")
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.action in ("create", "vote"):
            return [permissions.IsAuthenticated()]
        if self.action in ("partial_update", "update", "destroy"):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_destroy(self, instance):
        if instance.user != self.request.user and not self.request.user.is_moderator:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied()
        instance.is_published = False
        instance.save(update_fields=["is_published"])

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk=None):
        comment = self.get_object()
        value = request.data.get("value")
        if value not in ("up", "down"):
            return Response({"detail": "Value must be 'up' or 'down'."}, status=status.HTTP_400_BAD_REQUEST)
        vote, created = CommentVote.objects.get_or_create(
            comment=comment, user=request.user, defaults={"value": value}
        )
        if not created:
            if vote.value == value:
                vote.delete()
                return Response({"voted": False})
            vote.value = value
            vote.save(update_fields=["value"])
        return Response({"voted": True, "value": value})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def report(self, request, pk=None):
        comment = self.get_object()
        from apps.moderation.models import Report
        from django.contrib.contenttypes.models import ContentType
        Report.objects.create(
            reporter=request.user,
            target_type=ContentType.objects.get_for_model(comment),
            target_id=comment.pk,
            reason_type=request.data.get("reason_type", "other"),
            details=request.data.get("details", ""),
        )
        return Response({"detail": "Report submitted."}, status=status.HTTP_201_CREATED)
