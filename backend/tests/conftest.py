import asyncio
import os

# Test environment must be set before the app is imported.
os.environ.update(
    MONGO_URI="mongodb://unused",
    DB_NAME="test",
    SECRET_KEY="x" * 40,
    CLOUDINARY_CLOUD_NAME="test",
    CLOUDINARY_API_KEY="k",
    CLOUDINARY_API_SECRET="s",
    ADMIN_EMAIL="admin@test.com",
    ADMIN_PASSWORD="AdminPass1",
    GUEST_EMAIL="guest@test.com",
    GUEST_PASSWORD="guestpass",
    RATE_LIMIT_ENABLED="false",
)

import pymongo  # noqa: E402
from mongomock_motor import AsyncMongoMockClient  # noqa: E402

pymongo.AsyncMongoClient = lambda *a, **k: AsyncMongoMockClient()  # in-memory Mongo

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.db import database  # noqa: E402
from app.db.init_db import bootstrap_users  # noqa: E402
from app.main import app  # noqa: E402
from app.services import cloudinary_service  # noqa: E402


@pytest.fixture(autouse=True)
def clean_db(monkeypatch):
    async def reset():
        await database.user_collection.delete_many({})
        await database.note_collection.delete_many({})
        await database.init_indexes()
        await bootstrap_users()

    asyncio.run(reset())

    uploaded, destroyed = [], []
    monkeypatch.setattr(
        cloudinary_service.cloudinary.uploader,
        "upload",
        lambda data, **kw: uploaded.append(kw)
        or {"secure_url": "https://res.cloudinary.com/test/image/upload/v1/a.png"},
    )
    monkeypatch.setattr(
        cloudinary_service.cloudinary.uploader, "destroy", lambda pid, **kw: destroyed.append(pid)
    )
    return uploaded, destroyed


@pytest.fixture
def client():
    return TestClient(app)  # no `with`: skips lifespan, the DB is already set up above


def register_and_login(client, email="user@test.com", password="Passw0rdX"):
    client.post("/api/v1/auth/register", json={"email": email, "password": password})
    r = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


@pytest.fixture
def auth(client):
    return register_and_login(client)


@pytest.fixture
def admin_auth(client):
    r = client.post("/api/v1/auth/login", json={"email": "admin@test.com", "password": "AdminPass1"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}
