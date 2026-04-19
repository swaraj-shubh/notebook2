from fastapi import APIRouter
from app.api.v1.endpoints import auth, notes, users, admin
from app.api.v1.endpoints import upload

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(notes.router, prefix="/notes", tags=["Notes"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(upload.router, prefix="/upload", tags=["Upload"])
