from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProposalModerationViewSet, ReportViewSet

router = DefaultRouter()
router.register("proposals", ProposalModerationViewSet, basename="mod-proposal")
router.register("reports", ReportViewSet, basename="mod-report")

urlpatterns = [
    path("", include(router.urls)),
]
