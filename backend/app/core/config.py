from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ENVIRONMENT: str = "development"

    MONGO_URI: str
    DB_NAME: str
    SECRET_KEY: str = Field(min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # comma separated list
    CORS_ORIGINS: str = (
        "http://localhost:3000,http://127.0.0.1:3000,"
        "https://notebook2-ebon.vercel.app,https://notebook2-fgqc.vercel.app,"
        "https://notebook2.shubhh.xyz"
    )

    # Bootstrap admin: only created when both are set. No default credentials.
    ADMIN_EMAIL: str | None = None
    ADMIN_PASSWORD: str | None = None

    # Shared public "global notebook" account (read/write notes, no uploads).
    GUEST_EMAIL: str = "unknown@unknown.com"
    GUEST_PASSWORD: str = "123456"

    MAX_IMAGE_MB: int = 10
    MAX_VIDEO_MB: int = 100
    RATE_LIMIT_ENABLED: bool = True
    ENABLE_DOCS: bool = True

    @field_validator("ADMIN_EMAIL", "GUEST_EMAIL")
    @classmethod
    def _lower(cls, v):
        return v.strip().lower() if v else v

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
