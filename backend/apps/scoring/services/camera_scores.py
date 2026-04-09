from apps.catalog.models import Camera
from apps.reviews.models import Review
from django.db.models import Avg


def compute_camera_score(camera: Camera) -> dict:
    """Compute aggregated scores for a camera from published reviews."""
    reviews = Review.objects.filter(camera=camera, is_published=True)
    aggregates = reviews.aggregate(
        avg_overall=Avg("rating_overall"),
        avg_photo=Avg("rating_photo"),
        avg_video=Avg("rating_video"),
        avg_value=Avg("rating_value"),
    )
    review_count = reviews.count()
    return {
        "overall": round(aggregates["avg_overall"] or 0, 1),
        "photo": round(aggregates["avg_photo"] or 0, 1),
        "video": round(aggregates["avg_video"] or 0, 1),
        "value": round(aggregates["avg_value"] or 0, 1),
        "review_count": review_count,
    }
