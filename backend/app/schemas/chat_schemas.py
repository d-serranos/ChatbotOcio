"""Chat Request/Response Schemas"""
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Chat request schema"""
    message: str = Field(..., max_length=10000, min_length=1)


class ChatResponse(BaseModel):
    """Chat response schema"""
    response: str
    conversation_id: int
    message_id: int
