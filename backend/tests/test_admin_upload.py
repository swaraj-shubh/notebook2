import io

from tests.conftest import register_and_login

A = "/api/v1/admin"


def test_admin_routes_forbidden_for_users_and_guests(client, auth):
    for path in ("/stats", "/users", "/notes"):
        assert client.get(A + path, headers=auth).status_code == 403
        assert client.get(A + path).status_code == 401
    r = client.post("/api/v1/auth/login", json={"email": "guest@test.com", "password": "guestpass"})
    guest = {"Authorization": f"Bearer {r.json()['access_token']}"}
    assert client.get(A + "/users", headers=guest).status_code == 403


def test_admin_lists_hide_password_hashes(client, admin_auth, auth):
    users = client.get(A + "/users", headers=admin_auth).json()
    assert len(users) >= 3 and all("password" not in u for u in users)
    assert client.get(A + "/stats", headers=admin_auth).json()["total_users"] >= 3


def test_admin_cannot_delete_self_or_last_admin(client, admin_auth):
    me = client.get("/api/v1/users/me", headers=admin_auth).json()
    assert client.delete(f"{A}/user/{me['_id']}", headers=admin_auth).status_code == 400
    assert client.delete(f"{A}/user/bad-id", headers=admin_auth).status_code == 404


def test_admin_deletes_user_and_their_notes(client, admin_auth, auth):
    me = client.get("/api/v1/users/me", headers=auth).json()
    client.post("/api/v1/notes", json={"title": "t", "content": "c"}, headers=auth)
    assert client.delete(f"{A}/user/{me['_id']}", headers=admin_auth).status_code == 204
    assert client.get(A + "/notes", headers=admin_auth).json() == []


def _png():
    return {"file": ("a.png", io.BytesIO(b"\x89PNG" + b"0" * 100), "image/png")}


def test_upload_ok_for_user(client, auth):
    r = client.post("/api/v1/upload/image", files=_png(), headers=auth)
    assert r.status_code == 200 and r.json()["url"].startswith("https://res.cloudinary.com/")


def test_upload_forbidden_for_guest_and_anonymous(client):
    assert client.post("/api/v1/upload/image", files=_png()).status_code == 401
    r = client.post("/api/v1/auth/login", json={"email": "guest@test.com", "password": "guestpass"})
    guest = {"Authorization": f"Bearer {r.json()['access_token']}"}
    assert client.post("/api/v1/upload/image", files=_png(), headers=guest).status_code == 403


def test_upload_rejects_wrong_type_and_oversize(client, auth, monkeypatch):
    bad = {"file": ("a.exe", io.BytesIO(b"MZ"), "application/octet-stream")}
    assert client.post("/api/v1/upload/image", files=bad, headers=auth).status_code == 415
    from app.services import cloudinary_service

    monkeypatch.setitem(cloudinary_service.ALLOWED, "image", ({"image/png"}, 0))
    assert client.post("/api/v1/upload/image", files=_png(), headers=auth).status_code == 413


def test_health_and_rate_limit(client, monkeypatch):
    assert client.get("/health").json()["status"] == "healthy"

    from app.core import rate_limit as rl
    from app.core.config import settings

    monkeypatch.setattr(settings, "RATE_LIMIT_ENABLED", True)
    rl.reset_rate_limits()
    codes = [
        client.post("/api/v1/auth/login", json={"email": "x@test.com", "password": "nope"}).status_code
        for _ in range(12)
    ]
    assert codes[:10] == [401] * 10 and codes[10:] == [429, 429]
    rl.reset_rate_limits()


def test_register_login_helper_roundtrip(client):
    assert register_and_login(client, "z@test.com")
