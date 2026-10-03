from app.core.config import settings
from app.core.logging import logger
from app.core.security import hash_password, verify_password
from app.db.database import user_collection


async def _ensure_user(email: str, password: str, role: str) -> None:
    await user_collection.update_one(
        {"email": email},
        {
            "$set": {"role": role},
            "$setOnInsert": {"password": hash_password(password)},
        },
        upsert=True,
    )


async def bootstrap_users() -> None:
    # Normalise legacy mixed-case emails so lookups (always lowercase) keep working.
    async for u in user_collection.find({}):
        lower = u["email"].lower()
        if u["email"] != lower and not await user_collection.find_one({"email": lower}):
            await user_collection.update_one({"_id": u["_id"]}, {"$set": {"email": lower}})

    if settings.ADMIN_EMAIL and settings.ADMIN_PASSWORD:
        await _ensure_user(settings.ADMIN_EMAIL, settings.ADMIN_PASSWORD, "admin")
    await _ensure_user(settings.GUEST_EMAIL, settings.GUEST_PASSWORD, "guest")

    # The old repo versions seeded a public default admin; flag it loudly if it still works.
    legacy = await user_collection.find_one({"email": "admin@example.com"})
    if legacy and verify_password("Admin123", legacy["password"])[0]:
        logger.warning("SECURITY: default admin@example.com / Admin123 is still active. Change or delete it.")
