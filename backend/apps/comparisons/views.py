from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from django.shortcuts import get_object_or_404
from apps.catalog.models import Camera
from .services.compare_cameras import compare_cameras, MAX_CAMERAS


class CompareView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                "slugs",
                OpenApiTypes.STR,
                description="Comma-separated camera slugs (2–4). E.g. sony-a7-iv,canon-eos-r6-mark-ii",
            ),
        ],
        responses={200: dict},
    )
    def get(self, request):
        raw = request.query_params.get("slugs", "")
        slugs = [s.strip() for s in raw.split(",") if s.strip()]

        if len(slugs) < 2:
            return Response(
                {"detail": "Provide at least 2 comma-separated camera slugs in 'slugs' param."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(slugs) > MAX_CAMERAS:
            return Response(
                {"detail": f"You can compare at most {MAX_CAMERAS} cameras at once."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(slugs) != len(set(slugs)):
            return Response(
                {"detail": "Duplicate slugs are not allowed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cameras = [get_object_or_404(Camera, slug=slug, is_published=True) for slug in slugs]
        result = compare_cameras(cameras)
        return Response(result)
