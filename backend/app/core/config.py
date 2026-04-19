import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self):
        self.MONGO_URI = self.get_env("MONGO_URI")
        self.DB_NAME = self.get_env("DB_NAME")
        self.SECRET_KEY = self.get_env("SECRET_KEY")

        self.ALGORITHM = os.getenv("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
        )

        # Cloudinary
        self.CLOUDINARY_CLOUD_NAME = self.get_env("CLOUDINARY_CLOUD_NAME")
        self.CLOUDINARY_API_KEY = self.get_env("CLOUDINARY_API_KEY")
        self.CLOUDINARY_API_SECRET = self.get_env("CLOUDINARY_API_SECRET")

    def get_env(self, key: str):
        value = os.getenv(key)
        if not value:
            raise ValueError(f"❌ Missing environment variable: {key}")
        return value


settings = Settings()