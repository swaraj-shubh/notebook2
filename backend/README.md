# Notebook Backend API

## Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload

# Backend
```
notebook-backend/
│
├── app/
│   ├── api/                  # Route layer
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   ├── notes.py
│   │   │   │   └── admin.py
│   │   │   └── router.py
│   │   └── deps.py           # Dependencies (auth, db, etc.)
│   │
│   ├── core/                 # Core configs
│   │   ├── config.py
│   │   ├── security.py
│   │   └── logging.py
│   │
│   ├── db/
│   │   ├── database.py
│   │   └── init_db.py
│   │
│   ├── models/               # DB models (Beanie)
│   │   ├── user.py
│   │   └── note.py
│   │
│   ├── schemas/              # Request/Response schemas
│   │   ├── auth.py
│   │   ├── user.py
│   │   └── note.py
│   │
│   ├── services/             # Business logic layer
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   └── note_service.py
│   │
│   ├── utils/                # Helpers
│   │   ├── token.py
│   │   └── validators.py
│   │
│   └── main.py               # Entry point
│
├── tests/
│   ├── test_auth.py
│   └── test_notes.py
│
├── .env
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```