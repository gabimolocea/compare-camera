from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Brand, Camera
from .serializers import BrandSerializer, CameraListSerializer, CameraDetailSerializer
from .filters import CameraFilter
from .selectors import get_similar_cameras


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class CameraViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Camera.objects.filter(is_published=True).select_related("brand")
    lookup_field = "slug"
    filterset_class = CameraFilter
    search_fields = ["model_name", "full_name", "brand__name"]
    ordering_fields = ["release_date", "msrp", "full_name"]
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CameraDetailSerializer
        return CameraListSerializer

    @action(detail=True, methods=["get"])
    def similar(self, request, slug=None):
        camera = self.get_object()
        similar = get_similar_cameras(camera)
        serializer = CameraListSerializer(similar, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def reviews(self, request, slug=None):
        camera = self.get_object()
        from apps.reviews.serializers import ReviewSerializer
        from apps.reviews.models import Review
        reviews = Review.objects.filter(camera=camera, is_published=True).select_related("author")
        serializer = ReviewSerializer(reviews, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def comments(self, request, slug=None):
        camera = self.get_object()
        from apps.comments.serializers import CommentSerializer
        from apps.comments.models import Comment
        from django.contrib.contenttypes.models import ContentType
        ct = ContentType.objects.get_for_model(camera)
        comments = Comment.objects.filter(
            content_type=ct, object_id=camera.pk, parent=None, is_published=True
        ).select_related("user")
        serializer = CommentSerializer(comments, many=True, context={"request": request})
        return Response(serializer.data)
