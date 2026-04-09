from django.db import models
from django.conf import settings
from apps.catalog.models import Camera


class CameraEditProposal(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        NEEDS_INFO = "needs_info", "Needs Info"

    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name="edit_proposals")
    proposer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="proposals")
    section = models.CharField(max_length=100)
    field_name = models.CharField(max_length=100)
    current_value = models.TextField(blank=True)
    proposed_value = models.TextField()
    reason = models.TextField()
    evidence_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    moderator_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="reviewed_proposals"
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Proposal: {self.camera} / {self.section}.{self.field_name}"


class CameraBulkProposal(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name="bulk_proposals")
    proposer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bulk_proposals")
    payload_json = models.JSONField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    moderator_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="reviewed_bulk_proposals"
    )

    def __str__(self):
        return f"Bulk proposal for {self.camera} by {self.proposer}"


class ContributionLog(models.Model):
    class ContributionType(models.TextChoices):
        EDIT_PROPOSAL = "edit_proposal", "Edit Proposal"
        REVIEW = "review", "Review"
        COMMENT = "comment", "Comment"
        DATA_IMPORT_FIX = "data_import_fix", "Data Import Fix"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="contribution_logs")
    camera = models.ForeignKey(Camera, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=30, choices=ContributionType.choices)
    points_awarded = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.type} (+{self.points_awarded})"
