from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.db.database import user_collection, note_collection
from bson import ObjectId

router = APIRouter()


def admin_required(user):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user


# 📊 Stats
@router.get("/stats")
async def get_stats(user=Depends(get_current_user)):
    admin_required(user)

    total_users = await user_collection.count_documents({})
    total_notes = await note_collection.count_documents({})

    return {
        "total_users": total_users,
        "total_notes": total_notes
    }


# 👤 Get all users
@router.get("/users")
async def get_all_users(user=Depends(get_current_user)):
    admin_required(user)

    users = []
    cursor = user_collection.find({})

    async for u in cursor:
        u["_id"] = str(u["_id"])
        u.pop("password", None)  # 🔐 never expose password
        users.append(u)

    return users


# 📝 Get all notes
@router.get("/notes")
async def get_all_notes(user=Depends(get_current_user)):
    admin_required(user)

    notes = []
    cursor = note_collection.find({})

    async for note in cursor:
        note["_id"] = str(note["_id"])
        notes.append(note)

    return notes


# ❌ Delete any user
@router.delete("/user/{user_id}")
async def delete_user(user_id: str, user=Depends(get_current_user)):
    admin_required(user)

    result = await user_collection.delete_one({"_id": ObjectId(user_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # also delete their notes (optional but good)
    await note_collection.delete_many({"owner_id": user_id})

    return {"message": "User deleted"}


# ❌ Delete any note
@router.delete("/note/{note_id}")
async def delete_note(note_id: str, user=Depends(get_current_user)):
    admin_required(user)

    result = await note_collection.delete_one({"_id": ObjectId(note_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")

    return {"message": "Note deleted"}