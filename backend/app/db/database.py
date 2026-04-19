from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DB_NAME]
print("✅ Connected to MongoDB successfully")
# show mongo uri in console
# print(f"MongoDB URI: {settings.MONGO_URI}")

# Collections
user_collection = db["users"]
note_collection = db["notes"]
print("✅ Collections initialized successfully")