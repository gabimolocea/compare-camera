import logging
import requests

logger = logging.getLogger(__name__)

WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql"


def query_cameras(limit: int = 100) -> list:
    """Query Wikidata for camera models. Returns list of raw dicts."""
    sparql = """
    SELECT ?item ?itemLabel ?brandLabel ?date WHERE {
      ?item wdt:P31 wd:Q196353 .
      OPTIONAL { ?item wdt:P176 ?brand }
      OPTIONAL { ?item wdt:P577 ?date }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    LIMIT %d
    """ % limit

    try:
        resp = requests.get(
            WIKIDATA_SPARQL_URL,
            params={"query": sparql, "format": "json"},
            timeout=30,
            headers={"User-Agent": "CameraHubBot/1.0"},
        )
        resp.raise_for_status()
        bindings = resp.json()["results"]["bindings"]
        return [
            {
                "model_name": b.get("itemLabel", {}).get("value", ""),
                "brand": b.get("brandLabel", {}).get("value", "Unknown"),
                "release_date": b.get("date", {}).get("value", "")[:10] or None,
            }
            for b in bindings
        ]
    except Exception as exc:
        logger.error("Wikidata query failed: %s", exc)
        return []
