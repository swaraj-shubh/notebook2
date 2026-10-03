from pymongo import ASCENDING, AsyncMongoClient
from pymongo.errors import OperationFailure

from app.core.config import settings
from app.core.logging import logger

client = AsyncMongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[settings.DB_NAME]

user_collection = db["users"]
note_collection = db["notes"]


async def init_indexes() -> None:
    """Idempotent. A failed unique index (pre-existing duplicate emails) is logged, not fatal."""
    try:
        await user_collection.create_index([("email", ASCENDING)], unique=True)
    except OperationFailure:
        logger.exception("Could not create unique index on users.email (duplicate emails exist?)")
    await note_collection.create_index([("owner_id", ASCENDING), ("_id", -1)])


async def ping() -> bool:
    try:
        await client.admin.command("ping")
        return True
    except Exception:
        logger.exception("MongoDB ping failed")
        return False


async def close() -> None:
    await client.close()
