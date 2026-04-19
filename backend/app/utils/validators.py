import re
from fastapi import HTTPException

def validate_password(password: str):
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password too short")

    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Must contain uppercase")

    if not re.search(r"[0-9]", password):
        raise HTTPException(status_code=400, detail="Must contain number")

    return password