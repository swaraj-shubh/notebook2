from fastapi import APIRouter, UploadFile, File, Depends
from app.services.cloudinary_service import upload_image, upload_video
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/image")
async def upload_image_api(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    url = await upload_image(file)
    return {"url": url}


@router.post("/video")
async def upload_video_api(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    url = await upload_video(file)
    return {"url": url}