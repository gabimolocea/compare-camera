from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from django.shortcuts import get_object_or_404
from apps.catalog.models import Camera
from .services.compare_cameras import compare_cameras


class CompareView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter("left", OpenApiTypes.STR, description="Slug of the left camera"),
            OpenApiParameter("right", OpenApiTypes.STR, description="Slug of the right camera"),
        ],
        responses={200: dict},
    )
    def get(self, request):
        left_slug = request.query_params.get("left")
        right_slug = request.query_params.get("right")
        if not left_slug or not right_slug:
            return Response(
                {"detail": "Both 'left' and 'right' query params are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        left = get_object_or_404(Camera, slug=left_slug, is_published=True)
        right = get_object_or_404(Camera, slug=right_slug, is_published=True)
        result = compare_cameras(left, right)
        return Response(result)
