from tests.conftest import register_and_login

N = "/api/v1/notes"
IMG = "https://res.cloudinary.com/test/image/upload/v1/a.png"


def test_notes_crud(client, auth):
    r = client.post(N, json={"title": "t", "content": "c", "images": [IMG]}, headers=auth)
    assert r.status_code == 201
    note = r.json()
    assert note["_id"] and note["created_at"]

    assert [n["_id"] for n in client.get(N, headers=auth).json()] == [note["_id"]]

    r = client.put(f"{N}/{note['_id']}", json={"title": "new"}, headers=auth)
    assert r.status_code == 200 and r.json()["title"] == "new" and r.json()["content"] == "c"

    assert client.delete(f"{N}/{note['_id']}", headers=auth).status_code == 204
    assert client.get(N, headers=auth).json() == []


def test_notes_require_auth(client):
    assert client.get(N).status_code == 401


def test_cannot_touch_other_users_note(client, auth):
    note = client.post(N, json={"title": "t", "content": "c"}, headers=auth).json()
    other = register_and_login(client, "other@test.com")
    assert client.put(f"{N}/{note['_id']}", json={"title": "x"}, headers=other).status_code == 404
    assert client.delete(f"{N}/{note['_id']}", headers=other).status_code == 404
    assert client.get(N, headers=other).json() == []


def test_invalid_and_missing_ids_are_404_not_500(client, auth):
    assert client.put(f"{N}/not-an-id", json={"title": "x"}, headers=auth).status_code == 404
    assert client.delete(f"{N}/{'0' * 24}", headers=auth).status_code == 404


def test_update_validation(client, auth):
    note = client.post(N, json={"title": "t", "content": "c"}, headers=auth).json()
    url = f"{N}/{note['_id']}"
    assert client.put(url, json={}, headers=auth).status_code == 422
    assert client.put(url, json={"title": None}, headers=auth).status_code == 422
    assert client.put(url, json={"title": ""}, headers=auth).status_code == 422


def test_create_validation(client, auth):
    assert client.post(N, json={"title": "", "content": "c"}, headers=auth).status_code == 422
    assert client.post(N, json={"title": "t", "content": "x" * 20_001}, headers=auth).status_code == 422
    bad = {"title": "t", "content": "c", "images": ["https://evil.example/x.png"]}
    assert client.post(N, json=bad, headers=auth).status_code == 422


def test_pagination(client, auth):
    for i in range(5):
        client.post(N, json={"title": f"n{i}", "content": "c"}, headers=auth)
    page = client.get(f"{N}?skip=1&limit=2", headers=auth).json()
    assert [n["title"] for n in page] == ["n3", "n2"]  # newest first
    assert client.get(f"{N}?limit=0", headers=auth).status_code == 422


def test_removed_media_is_deleted_from_cloudinary(client, auth, clean_db):
    _, destroyed = clean_db
    note = client.post(N, json={"title": "t", "content": "c", "images": [IMG]}, headers=auth).json()
    client.put(f"{N}/{note['_id']}", json={"images": []}, headers=auth)
    assert destroyed == ["a"]
