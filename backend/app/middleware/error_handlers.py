"""Global Exception Handlers"""
import logging
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError

logger = logging.getLogger(__name__)


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors"""
    return JSONResponse(
        status_code=422,
        content={
            "error": "validation_error",
            "message": "Request validation failed",
            "details": exc.errors()
        }
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with structured format"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": str(exc.status_code),
            "message": exc.detail
        }
    )


async def database_exception_handler(request: Request, exc: IntegrityError):
    """Handle database constraint violations"""
    # Parse constraint name to provide user-friendly message
    constraint_messages = {
        "usuario_correo_key": "Email already registered",
        "fk_usuario": "Invalid user reference",
        "fk_conversacion": "Invalid conversation reference",
        "fk_mensaje": "Invalid message reference"
    }
    
    error_message = "Database constraint violation"
    for constraint, message in constraint_messages.items():
        if constraint in str(exc):
            error_message = message
            break
    
    return JSONResponse(
        status_code=409,
        content={
            "error": "conflict",
            "message": error_message
        }
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors"""
    # Log full error details
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    
    # Return generic message to user
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_error",
            "message": "An internal error occurred"
        }
    )
