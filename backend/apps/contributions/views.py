from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import CameraEditProposal, CameraBulkProposal
from .serializers import CameraEditProposalSerializer, CameraBulkProposalSerializer


class CameraEditProposalViewSet(viewsets.ModelViewSet):
    serializer_class = CameraEditProposalSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = CameraEditProposal.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return CameraEditProposal.objects.none()
        return CameraEditProposal.objects.filter(
            proposer=self.request.user
        ).select_related("camera", "proposer")


class CameraBulkProposalViewSet(viewsets.ModelViewSet):
    serializer_class = CameraBulkProposalSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = CameraBulkProposal.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return CameraBulkProposal.objects.none()
        return CameraBulkProposal.objects.filter(
            proposer=self.request.user
        ).select_related("camera", "proposer")
