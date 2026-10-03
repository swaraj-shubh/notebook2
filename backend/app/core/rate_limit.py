import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

from app.core.config import settings

_hits: dict[tuple[str, str], deque] = defaultdict(deque)


def rate_limit(max_calls: int, per_seconds: int):
    """Dependency: allow `max_calls` per client IP per `per_seconds` window.

    ponytail: in-process memory, correct for a single worker only; use Redis
    (or slowapi + Redis) when running multiple workers/instances.
    """

    async def dependency(request: Request):
        if not settings.RATE_LIMIT_ENABLED:
            return
        key = (request.scope.get("path", ""), request.client.host if request.client else "unknown")
        now = time.monotonic()
        hits = _hits[key]
        while hits and now - hits[0] > per_seconds:
            hits.popleft()
        if len(hits) >= max_calls:
            raise HTTPException(status_code=429, detail="Too many requests, slow down")
        hits.append(now)

    return dependency


def reset_rate_limits() -> None:
    _hits.clear()
