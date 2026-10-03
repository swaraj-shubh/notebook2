from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.logging import logger


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def validation_handler(request: Request, exc: RequestValidationError):
        # Flatten to a readable string: the frontend shows `detail` directly in a toast.
        err = exc.errors()[0]
        field = ".".join(str(p) for p in err["loc"] if p not in ("body", "query", "path"))
        msg = err["msg"].removeprefix("Value error, ")
        return JSONResponse(status_code=422, content={"detail": f"{field}: {msg}" if field else msg})

    @app.exception_handler(Exception)
    async def unhandled_handler(request: Request, exc: Exception):
        logger.exception("Unhandled error on %s %s", request.method, request.url.path)
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})
