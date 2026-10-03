from datetime import UTC, datetime, timedelta

import jwt
from passlib.context import CryptContext

from app.core.config import settings

# Argon2 for new hashes; old pbkdf2 hashes still verify and are upgraded on next login.
pwd_context = CryptContext(schemes=["argon2", "pbkdf2_sha256"], deprecated=["pbkdf2_sha256"])

# Verified against when the email is unknown, so login timing doesn't reveal which emails exist.
_DUMMY_HASH = pwd_context.hash("not-a-real-password")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str | None) -> tuple[bool, str | None]:
    """Return (is_valid, new_hash_if_the_stored_hash_should_be_upgraded)."""
    if not hashed:
        pwd_context.verify(plain, _DUMMY_HASH)
        return False, None
    return pwd_context.verify_and_update(plain, hashed)


def create_access_token(user_id: str, role: str) -> str:
    # `role` is only a UI hint for the frontend; the server always re-reads it from the DB.
    expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": user_id, "role": role, "exp": expire},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_access_token(token: str) -> dict:
    """Raises jwt.PyJWTError on any invalid/expired token."""
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
