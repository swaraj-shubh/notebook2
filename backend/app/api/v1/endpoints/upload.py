from fastapi import APIRouter, Depends, File, UploadFile

from app.api.deps import require_not_guest
from app.core.rate_limit import rate_limit
from app.services.cloudinary_service import upload_media

router = APIRouter(dependencies=[Depends(rate_limit(30, 3600))])


@router.post("/image")
async def upload_image_api(file: UploadFile = File(...), user=Depends(require_not_guest)):
    return {"url": await upload_media(file, "image", user["_id"])}


@router.post("/video")
async def upload_video_api(file: UploadFile = File(...), user=Depends(require_not_guest)):
    return {"url": await upload_media(file, "video", user["_id"])}
