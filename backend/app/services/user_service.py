from app.models.user import User

async def get_user_by_id(user_id: str):
    return await User.get(user_id)

async def get_all_users():
    return await User.find_all().to_list()