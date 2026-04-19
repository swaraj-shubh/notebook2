from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/me")
async def get_me(user: User = Depends(get_current_user)):
    return user


@router.get("/")
async def get_all_users(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")

    return await User.find_all().to_list()