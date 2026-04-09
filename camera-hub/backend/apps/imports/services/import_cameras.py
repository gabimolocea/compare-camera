import logging
from .merge_camera_data import merge_camera_record

logger = logging.getLogger(__name__)


def run_import():
    """Entry point for the camera import pipeline."""
    logger.info("Starting camera import run")
    # Placeholder: extend with real data sources
    records = _fetch_records()
    for record in records:
        try:
            merge_camera_record(record)
        except Exception as exc:
            logger.warning("Failed to merge record %s: %s", record, exc)
    logger.info("Camera import run completed")


def _fetch_records():
    """Return a list of camera data dicts to import. Extend with real clients."""
    return []
