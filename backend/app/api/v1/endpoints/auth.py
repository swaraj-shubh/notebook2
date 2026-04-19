from fastapi import APIRouter, HTTPException
from app.schemas.auth import RegisterSchema, LoginSchema
from app.services.auth_service import register_user, login_user

router = APIRouter()

@router.post("/register")
async def register(data: RegisterSchema):
    try:
        return await register_user(data.email, data.password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(data: LoginSchema):
    try:
        token = await login_user(data.email, data.password)
        return {"access_token": token}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))