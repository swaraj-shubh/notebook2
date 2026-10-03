from datetime import datetime
from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

MEDIA_HOST = "res.cloudinary.com"


def _check_urls(urls: list[str] | None) -> list[str] | None:
    for u in urls or []:
        p = urlparse(u)
        if p.scheme != "https" or p.hostname != MEDIA_HOST:
            raise ValueError(f"Media must be uploaded through the app (https://{MEDIA_HOST}/...)")
    return urls


class NoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(max_length=20_000)
    images: list[str] = Field(default_factory=list, max_length=20)
    videos: list[str] = Field(default_factory=list, max_length=5)

    _urls = field_validator("images", "videos")(_check_urls)


class NoteUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    content: str | None = Field(default=None, max_length=20_000)
    images: list[str] | None = Field(default=None, max_length=20)
    videos: list[str] | None = Field(default=None, max_length=5)

    _urls = field_validator("images", "videos")(_check_urls)

    @model_validator(mode="after")
    def at_least_one_real_field(self):
        sent = {f: getattr(self, f) for f in self.model_fields_set}
        if not sent:
            raise ValueError("No fields to update")
        if any(v is None for v in sent.values()):
            raise ValueError("Fields cannot be null")
        return self


class NoteResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    title: str
    content: str
    images: list[str] = []
    videos: list[str] = []
    owner_id: str
    created_at: datetime | None = None
    updated_at: datetime | None = None
