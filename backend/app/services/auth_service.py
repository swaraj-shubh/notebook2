from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError

from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.db.database import user_collection


async def register_user(email: str, password: str) -> dict:
    if email == settings.GUEST_EMAIL:
        raise HTTPException(status_code=409, detail="This email is reserved")

    user = {"email": email, "password": hash_password(password), "role": "user"}
    try:
        result = await user_collection.insert_one(user)
    except DuplicateKeyError:  # unique index makes this race-free
        raise HTTPException(status_code=409, detail="User already exists") from None
    return {"_id": str(result.inserted_id), "email": email, "role": "user"}


async def login_user(email: str, password: str) -> str:
    user = await user_collection.find_one({"email": email})
    ok, new_hash = verify_password(password, user["password"] if user else None)
    if not user or not ok:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if new_hash:  # transparently upgrade legacy pbkdf2 hashes to argon2
        await user_collection.update_one({"_id": user["_id"]}, {"$set": {"password": new_hash}})

    return create_access_token(str(user["_id"]), user["role"])
