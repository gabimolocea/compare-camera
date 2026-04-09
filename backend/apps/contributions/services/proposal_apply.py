from django.utils import timezone
from django.db import transaction
from apps.contributions.models import CameraEditProposal, ContributionLog
from apps.catalog.models import Camera
from apps.specs.models import SensorSpec, VideoSpec, BodySpec, AutofocusSpec, ConnectivitySpec

SECTION_MODEL_MAP = {
    "camera": Camera,
    "sensor": SensorSpec,
    "video": VideoSpec,
    "body": BodySpec,
    "autofocus": AutofocusSpec,
    "connectivity": ConnectivitySpec,
}

REPUTATION_POINTS = {
    "approved": 15,
    "rejected": 0,
}


@transaction.atomic
def apply_proposal(proposal: CameraEditProposal, moderator, approved: bool, notes: str = "") -> None:
    """Apply or reject a camera edit proposal and update reputation."""
    proposal.reviewed_at = timezone.now()
    proposal.reviewed_by = moderator
    proposal.moderator_notes = notes

    if approved:
        proposal.status = CameraEditProposal.Status.APPROVED
        _apply_field_change(proposal)
        points = REPUTATION_POINTS["approved"]
        _award_points(proposal.proposer, proposal.camera, "edit_proposal", points)
    else:
        proposal.status = CameraEditProposal.Status.REJECTED

    proposal.save(update_fields=["status", "reviewed_at", "reviewed_by", "moderator_notes"])


def _apply_field_change(proposal: CameraEditProposal) -> None:
    model_class = SECTION_MODEL_MAP.get(proposal.section)
    if model_class is None:
        return
    if model_class == Camera:
        obj = proposal.camera
    else:
        obj, _ = model_class.objects.get_or_create(camera=proposal.camera)

    field = obj.__class__._meta.get_field(proposal.field_name)
    value = _coerce_value(field, proposal.proposed_value)
    setattr(obj, proposal.field_name, value)
    obj.save(update_fields=[proposal.field_name])


def _coerce_value(field, raw_value: str):
    from django.db.models import BooleanField, IntegerField, FloatField, DecimalField
    if isinstance(field, BooleanField):
        return raw_value.lower() in ("true", "1", "yes")
    if isinstance(field, (IntegerField,)):
        return int(raw_value)
    if isinstance(field, (FloatField, DecimalField)):
        return float(raw_value)
    return raw_value


def _award_points(user, camera, contribution_type: str, points: int) -> None:
    if points > 0:
        user.reputation_score += points
        user.save(update_fields=["reputation_score"])
    ContributionLog.objects.create(
        user=user,
        camera=camera,
        type=contribution_type,
        points_awarded=points,
    )
