from django.db.models import Q
from .models import Camera


def get_similar_cameras(camera, limit=6):
    return (
        Camera.objects.filter(
            Q(brand=camera.brand) | Q(category=camera.category),
            is_published=True,
        )
        .exclude(pk=camera.pk)
        .select_related("brand")[:limit]
    )
