import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from app.core.config import settings


# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


async def upload_image(file: UploadFile):
    try:
        contents = await file.read()

        result = cloudinary.uploader.upload(
            contents,
            resource_type="image"
        )

        return result["secure_url"]

    except Exception as e:
        raise HTTPException(status_code=500, detail="Image upload failed")


async def upload_video(file: UploadFile):
    try:
        contents = await file.read()

        result = cloudinary.uploader.upload(
            contents,
            resource_type="video"
        )

        return result["secure_url"]

    except Exception:
        raise HTTPException(status_code=500, detail="Video upload failed")