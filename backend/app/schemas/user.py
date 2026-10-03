from pydantic import BaseModel, ConfigDict, Field


class UserResponse(BaseModel):
    """Public view of a user. Never includes the password hash."""

    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")  # serialised as `_id`, which the frontend expects
    email: str
    role: str
