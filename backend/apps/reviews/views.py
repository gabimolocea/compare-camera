from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Review, ReviewVote
from .serializers import ReviewSerializer
from .permissions import IsAuthorOrReadOnly


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_published=True).select_related("author")
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ("create",):
            return [permissions.IsAuthenticated()]
        if self.action in ("partial_update", "update", "destroy"):
            return [IsAuthorOrReadOnly()]
        return [permissions.AllowAny()]

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk=None):
        review = self.get_object()
        if review.author == request.user:
            return Response({"detail": "Cannot vote on your own review."}, status=status.HTTP_400_BAD_REQUEST)
        vote, created = ReviewVote.objects.get_or_create(review=review, user=request.user)
        if not created:
            vote.delete()
            review.helpful_votes_count = max(0, review.helpful_votes_count - 1)
            review.save(update_fields=["helpful_votes_count"])
            return Response({"voted": False})
        review.helpful_votes_count += 1
        review.save(update_fields=["helpful_votes_count"])
        return Response({"voted": True})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def report(self, request, pk=None):
        review = self.get_object()
        from apps.moderation.models import Report
        from django.contrib.contenttypes.models import ContentType
        Report.objects.create(
            reporter=request.user,
            target_type=ContentType.objects.get_for_model(review),
            target_id=review.pk,
            reason_type=request.data.get("reason_type", "other"),
            details=request.data.get("details", ""),
        )
        return Response({"detail": "Report submitted."}, status=status.HTTP_201_CREATED)
