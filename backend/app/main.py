import time
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import logger, setup_logging
from app.db import database
from app.db.init_db import bootstrap_users

setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.init_indexes()
    await bootstrap_users()
    logger.info("Notebook API started (env=%s)", settings.ENVIRONMENT)
    yield
    await database.close()


app = FastAPI(
    title="Notebook API",
    version="2.0",
    description="Notes with image/video attachments, JWT auth and an admin panel.",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENABLE_DOCS else None,
    redoc_url=None,
    openapi_url="/openapi.json" if settings.ENABLE_DOCS else None,
)

register_exception_handlers(app)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def request_context(request: Request, call_next):
    """Request id + access log + basic security headers."""
    request_id = request.headers.get("x-request-id", uuid.uuid4().hex[:12])
    start = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    logger.info(
        "%s %s %s %.0fms rid=%s",
        request.method,
        request.url.path,
        response.status_code,
        (time.perf_counter() - start) * 1000,
        request_id,
    )
    return response


@app.get("/health", tags=["Health"])
async def health_check():
    if not await database.ping():
        return JSONResponse(status_code=503, content={"status": "unhealthy", "database": "unreachable"})
    return {"status": "healthy", "database": "connected"}


@app.get("/", tags=["Health"])
async def root():
    return {"message": "Notebook API", "docs": "/docs"}


app.include_router(api_router, prefix="/api/v1")
