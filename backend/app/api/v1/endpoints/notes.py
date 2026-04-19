# api/v1/endpoints/notes.py
from fastapi import APIRouter, Depends
from app.schemas.note import NoteCreate, NoteUpdate
from app.services.note_service import *
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/")
async def create(data: NoteCreate, user=Depends(get_current_user)):
    return await create_note(str(user["_id"]), data)

@router.get("/")
async def get(user=Depends(get_current_user)):
    return await get_notes(str(user["_id"]))

@router.put("/{note_id}")
async def update(note_id: str, data: NoteUpdate, user=Depends(get_current_user)):
    return await update_note(note_id, str(user["_id"]), data)

@router.delete("/{note_id}")
async def delete(note_id: str, user=Depends(get_current_user)):
    return await delete_note(note_id, str(user["_id"]))