"""
Update analysis_stats.json with objects updated since the last model retrain.

Uses the Met Museum Collection API:
GET /public/collection/v1/objects?metadataDate=YYYY-MM-DD

Env vars:
  LAST_RETRAIN_DATE (required): ISO date (e.g., 2025-10-19)
  MET_API_BASE (optional): override API base for testing/mocking
  OUTPUT_PATHS (optional): comma-separated paths to analysis_stats.json files
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Iterable

import requests


def get_env(name: str, default: str | None = None) -> str:
    value = os.getenv(name, default)
    if value is None or value.strip() == "":
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def fetch_updated_count(api_base: str, metadata_date: str) -> int:
    url = f"{api_base}/public/collection/v1/objects"
    resp = requests.get(url, params={"metadataDate": metadata_date}, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    # Prefer 'total'; fall back to list length if provided
    if "total" in data:
        return int(data["total"])
    object_ids = data.get("objectIDs") or []
    return len(object_ids)


def update_analysis_files(
    paths: Iterable[Path], updated_count: int, last_retrain_date: str
) -> None:
    for path in paths:
        if not path.exists():
            print(f"Skipping missing file: {path}")
            continue
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)

        total_items = data.get("total_items") or data.get("total") or 0
        percentage = round((updated_count / total_items) * 100, 3) if total_items else 0.0

        data["updated_since_retrain"] = {
            "count": updated_count,
            "percentage": percentage,
            "last_retrain_date": last_retrain_date,
        }

        with path.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            f.write("\n")
        print(f"Updated {path} with count={updated_count}, pct={percentage}%")


def main() -> int:
    last_retrain_date = get_env("LAST_RETRAIN_DATE")
    api_base = os.getenv("MET_API_BASE", "https://collectionapi.metmuseum.org")

    output_paths_env = os.getenv("OUTPUT_PATHS")
    if output_paths_env:
        paths = [Path(p.strip()) for p in output_paths_env.split(",") if p.strip()]
    else:
        # Default to the site’s data copies
        paths = [
            Path("static/analysis_stats.json"),
            Path("public/analysis_stats.json"),
        ]

    print(f"Fetching updated objects since {last_retrain_date} from {api_base} ...")
    updated_count = fetch_updated_count(api_base, last_retrain_date)
    print(f"Found {updated_count} updated objects since last retrain")

    update_analysis_files(paths, updated_count, last_retrain_date)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # noqa: BLE001
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(1)
