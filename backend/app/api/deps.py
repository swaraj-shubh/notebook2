from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from bson import ObjectId
from app.core.config import settings
from app.db.database import user_collection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload["sub"]

        user = await user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise Exception()

        user["_id"] = str(user["_id"])
        return user

    except:
        raise HTTPException(status_code=401, detail="Invalid token")