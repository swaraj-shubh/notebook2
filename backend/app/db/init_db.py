from app.db.database import user_collection
from app.core.security import hash_password

async def create_admin():
    admin = await user_collection.find_one({"email": "admin@example.com"})

    if not admin:
        await user_collection.insert_one({
            "email": "admin@example.com",
            "password": hash_password("Admin123"),
            "role": "admin"
        })