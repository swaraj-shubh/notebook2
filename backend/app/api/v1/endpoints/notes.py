from fastapi import APIRouter, Depends, Query, Response

from app.api.deps import get_current_user
from app.schemas.note import NoteCreate, NoteResponse, NoteUpdate
from app.services import note_service

router = APIRouter()


@router.post("", response_model=NoteResponse, status_code=201)
async def create(data: NoteCreate, user=Depends(get_current_user)):
    return await note_service.create_note(user["_id"], data)


@router.get("", response_model=list[NoteResponse])
async def list_notes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    user=Depends(get_current_user),
):
    return await note_service.get_notes(user["_id"], skip, limit)


@router.put("/{note_id}", response_model=NoteResponse)
async def update(note_id: str, data: NoteUpdate, user=Depends(get_current_user)):
    return await note_service.update_note(note_id, user["_id"], data)


@router.delete("/{note_id}", status_code=204)
async def delete(note_id: str, user=Depends(get_current_user)):
    await note_service.delete_note(note_id, user["_id"])
    return Response(status_code=204)
