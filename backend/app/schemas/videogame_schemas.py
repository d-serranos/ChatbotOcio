"""Videogame Request/Response Schemas"""
import re
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict


class VideogameCreate(BaseModel):
    """Videogame creation schema"""
    titulo: str = Field(..., max_length=200)
    genero: str = Field(..., max_length=100)
    plataforma: str = Field(..., max_length=100)
    anio_lanzamiento: int = Field(..., ge=1958, le=date.today().year + 5)
    clasificacion: str = Field(..., pattern="^(E|E10\\+|T|M|AO|RP)$", max_length=10)
    desarrollador: str = Field(..., max_length=200)
    jugadores: Optional[str] = Field(None, max_length=50)
    
    @field_validator('jugadores')
    @classmethod
    def validate_jugadores(cls, v):
        """Validate jugadores format (integer or range)"""
        if v:
            if not re.match(r'^\d+(-\d+)?(\+)?$', v):
                raise ValueError('Jugadores must be a positive integer or range (e.g., "1-4")')
        return v


class VideogameUpdate(BaseModel):
    """Videogame update schema"""
    titulo: Optional[str] = Field(None, max_length=200)
    genero: Optional[str] = Field(None, max_length=100)
    plataforma: Optional[str] = Field(None, max_length=100)
    anio_lanzamiento: Optional[int] = Field(None, ge=1958, le=date.today().year + 5)
    clasificacion: Optional[str] = Field(None, pattern="^(E|E10\\+|T|M|AO|RP)$", max_length=10)
    desarrollador: Optional[str] = Field(None, max_length=200)
    jugadores: Optional[str] = Field(None, max_length=50)


class VideogameResponse(BaseModel):
    """Videogame response schema"""
    id_videojuego: int
    titulo: str
    genero: str
    plataforma: str
    anio_lanzamiento: int
    clasificacion: str
    desarrollador: str
    jugadores: Optional[str]
    fecha_registro: datetime
    
    model_config = ConfigDict(from_attributes=True)
