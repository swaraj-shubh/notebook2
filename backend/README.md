# Notebook API

FastAPI + MongoDB backend for a notes app with image/video attachments, JWT auth, and an admin panel.

![CI](https://github.com/swaraj-shubh/notebook2/actions/workflows/ci.yml/badge.svg)

## Features

- JWT auth (register / login), Argon2 password hashing (legacy PBKDF2 hashes are upgraded on login)
- Per-user notes CRUD with pagination, ownership enforced in the database query
- Image/video uploads to Cloudinary: type + size validation, per-user folders, orphaned media cleaned up
- Admin routes: stats, list/delete users and notes (can't delete yourself or the last admin)
- Shared "global notebook" guest account that can edit notes but cannot upload
- Rate limiting on auth and upload, request-ID access logs, security headers, `/health` that pings the DB

## Quick start

```bash
cp .env.example .env        # fill in the values (SECRET_KEY must be >= 32 chars)
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

Docs: http://localhost:8000/docs

With Docker (includes a local MongoDB):

```bash
docker compose up --build
```

## Configuration

See [`.env.example`](.env.example). Required: `MONGO_URI`, `DB_NAME`, `SECRET_KEY`, `CLOUDINARY_*`.
The app refuses to start if a required value is missing or `SECRET_KEY` is shorter than 32 characters.
There are **no default credentials**: set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to create an admin on startup.

## API overview (`/api/v1`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | - | password: 8+ chars, 1 uppercase, 1 number |
| POST | `/auth/login` | - | returns `access_token` |
| GET | `/users/me` | user | |
| GET/POST | `/notes` | user | `skip`, `limit` (max 200), newest first |
| PUT/DELETE | `/notes/{id}` | owner | 404 if not found or not yours |
| POST | `/upload/image`, `/upload/video` | user (not guest) | 10 MB / 100 MB limits |
| GET | `/admin/stats`, `/admin/users`, `/admin/notes` | admin | paginated |
| DELETE | `/admin/user/{id}`, `/admin/note/{id}` | admin | |
| GET | `/health` | - | 503 if MongoDB is unreachable |

## Project layout

```
app/
  api/         routers (thin) + dependencies (auth, admin guard)
  core/        settings, security (hashing, JWT), rate limit, logging, error handlers
  db/          Mongo client, indexes, startup bootstrap
  schemas/     Pydantic request/response models and validation
  services/    business logic (auth, notes, Cloudinary)
tests/         pytest suite (in-memory Mongo, no network)
```

## Tests and lint

```bash
ruff check .
pytest --cov=app
```

## Design notes

- The unique index on `users.email` makes registration race-free; emails are stored lowercase.
- Rate limiting is in-process memory (correct for a single worker). Use Redis if you scale horizontally.
- Tokens are bearer JWTs (60 min, no refresh/revocation yet). The `role` claim is only a UI hint; the server
  re-reads the role from the database on every request.
- Free-tier hosts sleep when idle, so the first request after a pause is slow (cold start).

## Deploying

`render.yaml` at the repository root deploys the Docker image (`rootDir: backend`). Set the secret env vars
in the Render dashboard.
