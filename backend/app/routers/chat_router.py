"""Chat Router"""
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.settings import Settings, get_settings
from app.dependencies.auth_dependencies import get_optional_user
from app.dependencies.database_dependencies import get_db
from app.models.database import Usuario
from app.schemas.chat_schemas import ChatRequest, ChatResponse
from app.services.chat_service import ChatService


router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse)
async def chat(
    chat_data: ChatRequest,
    user: Optional[Usuario] = Depends(get_optional_user),
    db: Session = Depends(get_db),
    config: Settings = Depends(get_settings)
):
    """Send message to chatbot (public endpoint)"""
    service = ChatService(db, config)
    return await service.process_chat(chat_data.message, user)
