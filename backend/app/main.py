"""FastAPI Application Entry Point"""
import sys
import logging
from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError

from app.config.settings import get_settings
from app.middleware.error_handlers import (
    validation_exception_handler,
    http_exception_handler,
    database_exception_handler,
    generic_exception_handler
)
from app.routers import (
    auth_router,
    movies_router,
    videogames_router,
    chat_router,
    statistics_router
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="Chatbot Backend API",
    description="FastAPI backend for chatbot with media catalog management",
    version="1.0.0"
)

# Register exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(IntegrityError, database_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include routers
app.include_router(auth_router.router)
app.include_router(movies_router.router)
app.include_router(videogames_router.router)
app.include_router(chat_router.router)
app.include_router(statistics_router.router)


@app.on_event("startup")
async def startup_event():
    """Validate configuration on startup"""
    try:
        settings = get_settings()
        if not settings.colab_api_url:
            logger.error("COLAB_API_URL is not configured")
            sys.exit(1)
        logger.info(f"Application started: {settings.app_name}")
        logger.info(f"Database: {settings.db_host}:{settings.db_port}/{settings.db_name}")
        logger.info(f"JWT expiration: {settings.jwt_expiration_minutes} minutes")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        sys.exit(1)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Chatbot Backend API"}
