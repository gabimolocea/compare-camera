from rest_framework import serializers
from .models import CameraEditProposal, CameraBulkProposal


class CameraEditProposalSerializer(serializers.ModelSerializer):
    proposer_username = serializers.CharField(source="proposer.username", read_only=True)

    class Meta:
        model = CameraEditProposal
        fields = (
            "id", "camera", "proposer", "proposer_username", "section", "field_name",
            "current_value", "proposed_value", "reason", "evidence_url",
            "status", "moderator_notes", "created_at", "reviewed_at",
        )
        read_only_fields = ("proposer", "status", "moderator_notes", "reviewed_at",
                           "proposer_username")

    def create(self, validated_data):
        validated_data["proposer"] = self.context["request"].user
        return super().create(validated_data)


class CameraBulkProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CameraBulkProposal
        fields = ("id", "camera", "proposer", "payload_json", "reason", "status",
                  "moderator_notes", "created_at")
        read_only_fields = ("proposer", "status", "moderator_notes")

    def create(self, validated_data):
        validated_data["proposer"] = self.context["request"].user
        return super().create(validated_data)
