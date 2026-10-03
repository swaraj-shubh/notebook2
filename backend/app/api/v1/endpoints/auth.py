from fastapi import APIRouter, Depends

from app.core.rate_limit import rate_limit
from app.schemas.auth import LoginSchema, RegisterSchema, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import login_user, register_user

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
    dependencies=[Depends(rate_limit(10, 3600))],
)
async def register(data: RegisterSchema):
    return await register_user(data.email, data.password)


@router.post(
    "/login",
    response_model=TokenResponse,
    dependencies=[Depends(rate_limit(10, 60))],
)
async def login(data: LoginSchema):
    return TokenResponse(access_token=await login_user(data.email, data.password))
