from tests.conftest import register_and_login

REG = "/api/v1/auth/register"
LOGIN = "/api/v1/auth/login"


def test_register_does_not_leak_password(client):
    r = client.post(REG, json={"email": "A@Test.com", "password": "Passw0rdX"})
    assert r.status_code == 201
    body = r.json()
    assert body["email"] == "a@test.com"  # normalised
    assert "password" not in body and body["role"] == "user"


def test_duplicate_email_case_insensitive(client):
    client.post(REG, json={"email": "a@test.com", "password": "Passw0rdX"})
    r = client.post(REG, json={"email": "A@TEST.com", "password": "Passw0rdX"})
    assert r.status_code == 409


def test_weak_password_rejected(client):
    for pw in ("short1A", "alllowercase1", "NoNumbersHere"):
        assert client.post(REG, json={"email": "w@test.com", "password": pw}).status_code == 422


def test_login_wrong_password_and_unknown_user_same_error(client):
    client.post(REG, json={"email": "a@test.com", "password": "Passw0rdX"})
    bad_pw = client.post(LOGIN, json={"email": "a@test.com", "password": "wrong"})
    no_user = client.post(LOGIN, json={"email": "nobody@test.com", "password": "wrong"})
    assert bad_pw.status_code == no_user.status_code == 401
    assert bad_pw.json() == no_user.json()


def test_me_requires_valid_token_and_hides_hash(client, auth):
    assert client.get("/api/v1/users/me").status_code == 401
    assert client.get("/api/v1/users/me", headers={"Authorization": "Bearer junk"}).status_code == 401
    me = client.get("/api/v1/users/me", headers=auth).json()
    assert me["email"] == "user@test.com" and "password" not in me


def test_guest_email_is_reserved(client):
    assert client.post(REG, json={"email": "guest@test.com", "password": "Passw0rdX"}).status_code == 409


def test_guest_can_login(client):
    r = client.post(LOGIN, json={"email": "guest@test.com", "password": "guestpass"})
    assert r.status_code == 200


def test_legacy_pbkdf2_hash_still_logs_in_and_is_upgraded(client):
    import asyncio

    from passlib.hash import pbkdf2_sha256

    from app.db.database import user_collection

    asyncio.run(
        user_collection.insert_one(
            {"email": "old@test.com", "password": pbkdf2_sha256.hash("OldPass1"), "role": "user"}
        )
    )
    assert client.post(LOGIN, json={"email": "old@test.com", "password": "OldPass1"}).status_code == 200
    stored = asyncio.run(user_collection.find_one({"email": "old@test.com"}))["password"]
    assert stored.startswith("$argon2")
    assert register_and_login(client)  # sanity: normal flow unaffected
