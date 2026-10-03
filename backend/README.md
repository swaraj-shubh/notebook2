# Notebook · Backend API

An async **FastAPI + MongoDB** service for notes with media attachments, JWT authentication and an admin panel, built like a production service: layered code, validated input, rate limits, tests, CI and Docker.

![CI](https://github.com/swaraj-shubh/notebook2/actions/workflows/ci.yml/badge.svg)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Tests](https://img.shields.io/badge/tests-25_passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-92%25-brightgreen)

## Why this backend is better

| Choice | What you get |
|---|---|
| **Async end to end** (FastAPI + PyMongo async) | One worker serves many concurrent requests; blocking SDK calls (Cloudinary) are pushed to a thread pool so they never stall the event loop. |
| **Pydantic v2 validation at the edge** | Bad input is rejected with a clear 422 before any logic runs. Response models guarantee secrets (password hashes) can never leak. |
| **Layered architecture** | Routers stay thin, rules live in `services/`, so logic is unit-testable without HTTP and easy to find. |
| **Security by default** | Argon2 hashing, uniform login errors, rate limits, upload validation, strict CORS, security headers, and no default credentials anywhere. |
| **Ownership enforced in the query** | Note updates and deletes filter by `owner_id` inside one atomic Mongo operation, so there is no read-then-write race and no way to touch someone else's data. |
| **Tested and automated** | 25 tests (92% coverage) run against an in-memory Mongo, with `ruff` and `pytest` enforced by CI on every push. |
| **Reproducible deploys** | Slim, non-root Docker image with a health check, plus one-command local setup with `docker compose`. |

## Tech stack

| Area | Tools |
|---|---|
| Framework | **FastAPI**, **Uvicorn** |
| Database | **MongoDB** via **PyMongo async** (`AsyncMongoClient`) |
| Validation and config | **Pydantic v2**, **pydantic-settings**, `email-validator` |
| Auth and crypto | **PyJWT**, **Passlib + Argon2** (legacy PBKDF2 hashes auto-upgrade on login) |
| Media | **Cloudinary** (type/size checks, per-user folders, orphan cleanup) |
| Testing | **pytest**, `pytest-cov`, `httpx`/`TestClient`, `mongomock-motor` (in-memory Mongo) |
| Quality | **Ruff** (lint), GitHub Actions CI |
| Delivery | **Docker** (slim, non-root, `HEALTHCHECK`), `docker compose`, **Render** blueprint |

## Architecture

```
Request ─▶ Middleware ─▶ Router ─▶ Dependencies ─▶ Service ─▶ MongoDB / Cloudinary
          (request id,    (thin)    (JWT user,       (business
           logging,                  admin guard,     rules)
           security hdrs)            rate limit)
```

```
app/
├── api/
│   ├── deps.py            current user, admin guard, guest guard, ObjectId parsing
│   └── v1/endpoints/      auth, notes, users, admin, upload
├── core/                  settings, security (hash + JWT), rate limit, logging, error handlers
├── db/                    Mongo client, indexes, startup bootstrap
├── schemas/               request/response models and validation rules
├── services/              auth, notes, Cloudinary
└── main.py                app factory: lifespan, CORS, middleware, health
tests/                     25 tests, no network needed
```

## API

Base path `/api/v1` · interactive docs at `/docs` (disabled in production).

| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/auth/register` | public | 8+ chars, 1 uppercase, 1 number · 10/hour |
| POST | `/auth/login` | public | returns a JWT · 10/minute |
| GET | `/users/me` | user | |
| GET, POST | `/notes` | user | `skip`, `limit` (max 200), newest first |
| PUT, DELETE | `/notes/{id}` | owner | 404 if missing or not yours |
| POST | `/upload/image`, `/upload/video` | user (not guest) | 10 MB / 100 MB, type-checked |
| GET | `/admin/stats`, `/admin/users`, `/admin/notes` | admin | paginated |
| DELETE | `/admin/user/{id}`, `/admin/note/{id}` | admin | cannot delete yourself or the last admin |
| GET | `/health` | public | pings MongoDB, 503 if unreachable |

## Security

| Area | What's done |
|---|---|
| Passwords | Argon2; old PBKDF2 hashes verify and are upgraded transparently |
| Login | Same 401 message and similar timing for wrong password and unknown email |
| Secrets | Required env vars, `SECRET_KEY` must be 32+ chars, `.env` never enters the Docker image, **no default admin** |
| Authorization | Role read from the database on every request; the token's `role` is only a UI hint |
| Input | Length limits, Cloudinary-only media URLs, upload type and size checks, malformed ids return 404 |
| Abuse | Per-IP rate limits on auth and upload, note quota per user |
| Transport | Explicit CORS origins, `nosniff` / `X-Frame-Options` / `Referrer-Policy` headers |
| Data | Unique lowercase email index (race-free sign-up); deleting a user or note also deletes its media |

## Data model

| Collection | Fields | Indexes |
|---|---|---|
| `users` | `email`, `password` (hash), `role` (`user` / `admin` / `guest`) | unique `email` |
| `notes` | `title`, `content`, `images[]`, `videos[]`, `owner_id`, `created_at`, `updated_at` | `(owner_id, _id desc)` |

## Getting started

```bash
cp .env.example .env                       # fill in values, see below
pip install -r requirements-dev.txt
uvicorn app.main:app --reload              # http://localhost:8000/docs
```

Or with Docker (includes a local MongoDB):

```bash
docker compose up --build
```

### Configuration

| Variable | Required | Purpose |
|---|:---:|---|
| `MONGO_URI`, `DB_NAME` | ✅ | database connection |
| `SECRET_KEY` | ✅ | JWT signing, 32+ characters |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | ✅ | media storage |
| `CORS_ORIGINS` | | comma-separated allowed browser origins |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | | creates an admin on startup (only if both are set) |
| `GUEST_EMAIL`, `GUEST_PASSWORD` | | shared "global notebook" account (can edit notes, cannot upload) |
| `MAX_IMAGE_MB`, `MAX_VIDEO_MB` | | upload limits |
| `ENABLE_DOCS` | | set to `false` in production |

The app refuses to start if a required value is missing or `SECRET_KEY` is too short.

## Testing and CI

```bash
ruff check .
pytest --cov=app
```

The suite covers: registration rules and case-insensitive duplicates, uniform login errors, hash upgrade, token handling, note CRUD and ownership, pagination, validation, admin guards, upload limits and types, orphaned-media cleanup, health and rate limiting.
GitHub Actions runs lint, tests (coverage gate: 80%) and the frontend build on every push and pull request.

## Deployment

`render.yaml` (repo root) deploys the Docker image with `rootDir: backend` and `/health` as the health check. Set the secret variables in the Render dashboard. Free tiers sleep when idle, so the first request after a pause is slow.

## Design decisions and trade-offs

- **In-memory rate limiter**: correct for a single worker. Behind multiple instances, swap it for Redis.
- **Bearer JWT, 60-minute expiry**: simple and stateless, with no refresh or revocation yet.
- **Guest account**: shared on purpose for the "global notebook", so it is rate-limited, cannot upload and is capped like other users.

## Roadmap

Refresh tokens and revocation · Redis-backed rate limiting · metrics endpoint · integration tests against a real MongoDB in CI.
