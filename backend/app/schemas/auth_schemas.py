"""Authentication Request/Response Schemas"""
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    """User registration schema"""
    nombre: str = Field(..., max_length=100)
    correo: EmailStr = Field(..., max_length=255)
    clave: str = Field(..., min_length=8)
    rol: Optional[str] = Field(default="user", pattern="^(user|admin)$")


class UserLogin(BaseModel):
    """User login schema"""
    correo: EmailStr
    clave: str


class TokenResponse(BaseModel):
    """JWT token response schema"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
