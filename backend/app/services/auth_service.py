from app.db.database import user_collection
from app.core.security import hash_password, verify_password
from app.utils.token import create_access_token
from fastapi import HTTPException

async def register_user(email: str, password: str):
    existing = await user_collection.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = {
        "email": email,
        "password": hash_password(password),
        "role": "user"
    }

    result = await user_collection.insert_one(user)
    user["_id"] = str(result.inserted_id)

    return user


async def login_user(email: str, password: str):
    user = await user_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(user["_id"]),
        "role": user["role"]
    })

    return token