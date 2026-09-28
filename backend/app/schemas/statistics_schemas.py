"""Statistics Request/Response Schemas"""
from datetime import date
from typing import List
from pydantic import BaseModel


class TokenStats(BaseModel):
    """Daily token statistics"""
    date: date
    total_tokens: int
    message_count: int


class UserTokenStats(BaseModel):
    """User token statistics"""
    user_id: int
    user_name: str
    total_tokens: int
    message_count: int


class StatisticsResponse(BaseModel):
    """Statistics response schema"""
    daily_stats: List[TokenStats]
    user_stats: List[UserTokenStats]
    date_range: dict
