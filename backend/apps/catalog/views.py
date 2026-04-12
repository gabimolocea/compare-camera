from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Brand, Camera, SamplePhoto
from .serializers import (
    BrandSerializer, CameraListSerializer, CameraDetailSerializer,
    SamplePhotoSerializer, SamplePhotoUploadSerializer,
)
from .filters import CameraFilter
from .selectors import get_similar_cameras


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class CameraViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Camera.objects.filter(is_published=True).select_related(
        "brand", "sensor_spec", "video_spec", "body_spec", "autofocus_spec", "connectivity_spec",
    )
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

    @action(detail=True, methods=["get"], url_path="sample-photos")
    def sample_photos(self, request, slug=None):
        camera = self.get_object()
        qs = SamplePhoto.objects.filter(camera=camera, is_published=True).select_related("uploaded_by")
        # Filter params
        lens = request.query_params.get("lens")
        focal_length = request.query_params.get("focal_length")
        shutter_speed = request.query_params.get("shutter_speed")
        aperture = request.query_params.get("aperture")
        iso = request.query_params.get("iso")
        if lens:
            qs = qs.filter(lens_name__icontains=lens)
        if focal_length:
            qs = qs.filter(focal_length=focal_length)
        if shutter_speed:
            qs = qs.filter(shutter_speed=shutter_speed)
        if aperture:
            qs = qs.filter(aperture=aperture)
        if iso:
            qs = qs.filter(iso=iso)
        serializer = SamplePhotoSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


class SamplePhotoViewSet(viewsets.ModelViewSet):
    """Allows authenticated users to submit sample photos."""
    queryset = SamplePhoto.objects.filter(is_published=True).select_related("camera", "uploaded_by")
    serializer_class = SamplePhotoSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return SamplePhotoUploadSerializer
        return SamplePhotoSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # Submitted photos start unpublished; admins approve via Django admin
        serializer.save(uploaded_by=self.request.user, is_published=False)
