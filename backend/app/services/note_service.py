# app/services/note_service.py
from app.db.database import note_collection
from fastapi import HTTPException
from bson import ObjectId

async def create_note(user_id: str, data):
    note = {
        "title": data.title,
        "content": data.content,
        "images": data.images,   # ✅ added
        "videos": data.videos,   # ✅ added
        "owner_id": user_id
    }

    result = await note_collection.insert_one(note)
    note["_id"] = str(result.inserted_id)

    return note

async def get_notes(user_id: str):
    notes = []
    cursor = note_collection.find({"owner_id": user_id})

    async for note in cursor:
        note["_id"] = str(note["_id"])
        notes.append(note)

    return notes


async def update_note(note_id: str, user_id: str, data):
    note = await note_collection.find_one({"_id": ObjectId(note_id)})

    if not note or note["owner_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    update_data = data.dict(exclude_unset=True)

    await note_collection.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": update_data}
    )

    return {"message": "Updated"}

async def delete_note(note_id: str, user_id: str):
    note = await note_collection.find_one({"_id": ObjectId(note_id)})

    if not note or note["owner_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    await note_collection.delete_one({"_id": ObjectId(note_id)})

    return {"message": "Deleted"}