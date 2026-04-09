from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BrandViewSet, CameraViewSet

router = DefaultRouter()
router.register("brands", BrandViewSet, basename="brand")
router.register("cameras", CameraViewSet, basename="camera")

urlpatterns = [
    path("", include(router.urls)),
]
