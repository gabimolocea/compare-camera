from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.contributions.models import CameraEditProposal
from apps.contributions.serializers import CameraEditProposalSerializer
from apps.contributions.services.proposal_apply import apply_proposal
from .models import Report
from .serializers import ReportSerializer


class IsModerator(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_moderator


class ProposalModerationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CameraEditProposal.objects.all().select_related("camera", "proposer")
    serializer_class = CameraEditProposalSerializer
    permission_classes = [IsModerator]

    def get_queryset(self):
        qs = super().get_queryset()
        status_filter = self.request.query_params.get("status", "pending")
        return qs.filter(status=status_filter)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        proposal = self.get_object()
        apply_proposal(proposal, request.user, approved=True, notes=request.data.get("notes", ""))
        return Response({"detail": "Proposal approved and applied."})

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        proposal = self.get_object()
        apply_proposal(proposal, request.user, approved=False, notes=request.data.get("notes", ""))
        return Response({"detail": "Proposal rejected."})


class ReportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Report.objects.filter(status="open").select_related("reporter")
    serializer_class = ReportSerializer
    permission_classes = [IsModerator]
