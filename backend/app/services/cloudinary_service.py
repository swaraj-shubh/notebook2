import re

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile
from starlette.concurrency import run_in_threadpool

from app.core.config import settings
from app.core.logging import logger

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

ALLOWED = {
    "image": ({"image/jpeg", "image/png", "image/webp", "image/gif"}, settings.MAX_IMAGE_MB),
    "video": ({"video/mp4", "video/webm", "video/quicktime"}, settings.MAX_VIDEO_MB),
}


async def upload_media(file: UploadFile, kind: str, user_id: str) -> str:
    types, max_mb = ALLOWED[kind]
    if file.content_type not in types:
        raise HTTPException(status_code=415, detail=f"Unsupported {kind} type: {file.content_type}")

    # Read at most limit+1 bytes so an oversized upload is rejected without buffering all of it.
    contents = await file.read(max_mb * 1024 * 1024 + 1)
    if len(contents) > max_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"{kind.capitalize()} too large (max {max_mb} MB)")

    try:
        # The SDK is blocking; keep it off the event loop.
        result = await run_in_threadpool(
            cloudinary.uploader.upload, contents, resource_type=kind, folder=f"notebook/{user_id}"
        )
        return result["secure_url"]
    except Exception:
        logger.exception("Cloudinary %s upload failed", kind)
        raise HTTPException(status_code=502, detail=f"{kind.capitalize()} upload failed") from None


_URL = re.compile(r"/(image|video)/upload/(?:v\d+/)?(.+?)(?:\.[A-Za-z0-9]+)?$")


async def delete_assets(urls: list[str]) -> None:
    """Best-effort cleanup of orphaned media; never raises."""
    for url in urls:
        m = _URL.search(url)
        if not m:
            continue
        kind, public_id = m.groups()
        try:
            await run_in_threadpool(cloudinary.uploader.destroy, public_id, resource_type=kind)
        except Exception:
            logger.warning("Could not delete Cloudinary asset %s", public_id, exc_info=True)
