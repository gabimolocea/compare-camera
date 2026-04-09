from rest_framework import serializers
from .models import Report
from apps.contributions.models import CameraEditProposal
from apps.contributions.serializers import CameraEditProposalSerializer


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = "__all__"
        read_only_fields = ("reporter", "status", "resolved_at", "resolved_by")
