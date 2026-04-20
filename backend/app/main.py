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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://notebook2-fgqc.vercel.app"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("\n ✅ API initialized successfully")
print(" ✅ API is running at : http://localhost:8000")
print(" ✅ API documentation available at : http://localhost:8000/docs\n")

@app.on_event("startup")
async def startup():
    await create_admin()
    
@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}
   
@app.get("/")
async def root():
    return {"message": "API Running"}

app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)