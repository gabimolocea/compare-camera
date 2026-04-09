from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def import_cameras_task(self):
    """Celery task: import/update cameras from external sources."""
    try:
        from .services.import_cameras import run_import
        run_import()
    except Exception as exc:
        logger.error("Camera import failed: %s", exc)
        raise self.retry(exc=exc, countdown=60)
