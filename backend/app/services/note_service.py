from datetime import UTC, datetime

from fastapi import HTTPException
from pymongo import ReturnDocument

from app.api.deps import to_object_id
from app.db.database import note_collection
from app.services.cloudinary_service import delete_assets

MAX_NOTES_PER_USER = 500


def _out(note: dict) -> dict:
    note["_id"] = str(note["_id"])
    return note


async def create_note(user_id: str, data) -> dict:
    if await note_collection.count_documents({"owner_id": user_id}) >= MAX_NOTES_PER_USER:
        raise HTTPException(status_code=400, detail=f"Note limit reached ({MAX_NOTES_PER_USER})")

    now = datetime.now(UTC)
    note = {**data.model_dump(), "owner_id": user_id, "created_at": now, "updated_at": now}
    result = await note_collection.insert_one(note)
    note["_id"] = result.inserted_id
    return _out(note)


async def get_notes(user_id: str, skip: int, limit: int) -> list[dict]:
    cursor = note_collection.find({"owner_id": user_id}).sort("_id", -1).skip(skip).limit(limit)
    return [_out(n) async for n in cursor]


async def update_note(note_id: str, user_id: str, data) -> dict:
    changes = {**data.model_dump(exclude_unset=True), "updated_at": datetime.now(UTC)}
    # One atomic query scoped to the owner (no read-then-write race).
    old = await note_collection.find_one_and_update(
        {"_id": to_object_id(note_id), "owner_id": user_id},
        {"$set": changes},
        return_document=ReturnDocument.BEFORE,
    )
    if not old:
        raise HTTPException(status_code=404, detail="Note not found")

    removed = set(old.get("images", []) + old.get("videos", [])) - set(
        changes.get("images", old.get("images", [])) + changes.get("videos", old.get("videos", []))
    )
    await delete_assets(list(removed))
    return _out({**old, **changes})


async def delete_note(note_id: str, user_id: str) -> None:
    note = await note_collection.find_one_and_delete({"_id": to_object_id(note_id), "owner_id": user_id})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    await delete_assets(note.get("images", []) + note.get("videos", []))
