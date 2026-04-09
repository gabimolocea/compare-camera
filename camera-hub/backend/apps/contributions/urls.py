from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CameraEditProposalViewSet, CameraBulkProposalViewSet

router = DefaultRouter()
router.register("proposals/field-edit", CameraEditProposalViewSet, basename="field-proposal")
router.register("proposals/bulk-edit", CameraBulkProposalViewSet, basename="bulk-proposal")

urlpatterns = [
    path("my/", include(router.urls)),
]
