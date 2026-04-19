from pydantic import BaseModel
from typing import List, Optional

class NoteCreate(BaseModel):
    title: str
    content: str
    images: List[str] = []
    videos: List[str] = []

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    images: Optional[List[str]] = None
    videos: Optional[List[str]] = None