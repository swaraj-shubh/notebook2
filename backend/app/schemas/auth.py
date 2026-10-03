import re

from pydantic import BaseModel, EmailStr, Field, field_validator


def _normalise(email: str) -> str:
    return email.strip().lower()


class RegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(max_length=128)

    @field_validator("email")
    @classmethod
    def lower_email(cls, v):
        return _normalise(v)

    @field_validator("password")
    @classmethod
    def password_policy(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain an uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain a number")
        return v


class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(max_length=128)

    @field_validator("email")
    @classmethod
    def lower_email(cls, v):
        return _normalise(v)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
