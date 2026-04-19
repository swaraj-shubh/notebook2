from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.logging import setup_logging
from app.db.init_db import create_admin

setup_logging()

app = FastAPI(title="Notebook API", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

print("\n ✅ API initialized successfully")
print(" ✅ API is running at : http://localhost:8000")
print(" ✅ API documentation available at : http://localhost:8000/docs\n")

@app.on_event("startup")
async def startup():
    await create_admin()
   
@app.get("/")
async def root():
    return {"message": "API Running"}

app.include_router(api_router, prefix="/api/v1")