from pydantic import BaseModel
from typing import List

class Note(BaseModel):
    title: str
    content: str
    images: List[str] = []
    videos: List[str] = []
    owner_id: str