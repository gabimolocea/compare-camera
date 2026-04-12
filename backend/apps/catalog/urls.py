from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BrandViewSet, CameraViewSet, SamplePhotoViewSet

router = DefaultRouter()
router.register("brands", BrandViewSet, basename="brand")
router.register("cameras", CameraViewSet, basename="camera")
router.register("sample-photos", SamplePhotoViewSet, basename="sample-photo")

urlpatterns = [
    path("", include(router.urls)),
]
