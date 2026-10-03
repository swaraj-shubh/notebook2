from fastapi import APIRouter, Depends, HTTPException, Query, Response

from app.api.deps import require_admin, to_object_id
from app.core.logging import logger
from app.db.database import note_collection, user_collection
from app.schemas.note import NoteResponse
from app.schemas.user import UserResponse
from app.services.cloudinary_service import delete_assets

# Every route here requires an admin.
router = APIRouter(dependencies=[Depends(require_admin)])


def _out(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


@router.get("/stats")
async def get_stats():
    return {
        "total_users": await user_collection.count_documents({}),
        "total_notes": await note_collection.count_documents({}),
    }


@router.get("/users", response_model=list[UserResponse])
async def get_all_users(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=200)):
    cursor = user_collection.find({}, {"password": 0}).sort("_id", -1).skip(skip).limit(limit)
    return [_out(u) async for u in cursor]


@router.get("/notes", response_model=list[NoteResponse])
async def get_all_notes(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=200)):
    cursor = note_collection.find({}).sort("_id", -1).skip(skip).limit(limit)
    return [_out(n) async for n in cursor]


@router.delete("/user/{user_id}", status_code=204)
async def delete_user(user_id: str, admin=Depends(require_admin)):
    oid = to_object_id(user_id)
    if user_id == admin["_id"]:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")

    target = await user_collection.find_one({"_id": oid})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if target["role"] == "admin" and await user_collection.count_documents({"role": "admin"}) <= 1:
        raise HTTPException(status_code=400, detail="Cannot delete the last admin")

    await user_collection.delete_one({"_id": oid})
    async for note in note_collection.find({"owner_id": user_id}):
        await delete_assets(note.get("images", []) + note.get("videos", []))
    await note_collection.delete_many({"owner_id": user_id})
    logger.info("admin %s deleted user %s", admin["_id"], user_id)
    return Response(status_code=204)


@router.delete("/note/{note_id}", status_code=204)
async def delete_note(note_id: str, admin=Depends(require_admin)):
    note = await note_collection.find_one_and_delete({"_id": to_object_id(note_id)})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    await delete_assets(note.get("images", []) + note.get("videos", []))
    logger.info("admin %s deleted note %s", admin["_id"], note_id)
    return Response(status_code=204)
