import jwt
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token
from app.db.database import user_collection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def to_object_id(value: str) -> ObjectId:
    """Path ids from clients: malformed ones are a 404, not a 500."""
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=404, detail="Not found") from None


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    unauthorized = HTTPException(
        status_code=401, detail="Invalid or expired token", headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        user_id = decode_access_token(token)["sub"]
        oid = ObjectId(user_id)
    except (jwt.PyJWTError, KeyError, InvalidId, TypeError):
        raise unauthorized from None

    user = await user_collection.find_one({"_id": oid}, {"password": 0})
    if not user:
        raise unauthorized
    user["_id"] = str(user["_id"])
    return user


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user


async def require_not_guest(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] == "guest":
        raise HTTPException(status_code=403, detail="Guests cannot upload files. Please register.")
    return user
