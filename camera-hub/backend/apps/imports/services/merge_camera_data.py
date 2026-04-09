import logging
from django.utils.text import slugify
from apps.catalog.models import Brand, Camera

logger = logging.getLogger(__name__)


def merge_camera_record(record: dict) -> Camera:
    """Upsert a camera from an import record dict."""
    brand_name = record.get("brand", "")
    brand, _ = Brand.objects.get_or_create(
        name__iexact=brand_name,
        defaults={"name": brand_name, "slug": slugify(brand_name)},
    )

    model_name = record.get("model_name", "")
    full_name = record.get("full_name") or f"{brand.name} {model_name}"
    slug = slugify(full_name)

    camera, created = Camera.objects.update_or_create(
        slug=slug,
        defaults={
            "brand": brand,
            "model_name": model_name,
            "full_name": full_name,
            "category": record.get("category", "mirrorless"),
            "mount": record.get("mount", ""),
            "release_date": record.get("release_date"),
            "msrp": record.get("msrp"),
            "short_summary": record.get("short_summary", ""),
            "official_url": record.get("official_url", ""),
        },
    )
    logger.info("%s camera: %s", "Created" if created else "Updated", camera)
    return camera
