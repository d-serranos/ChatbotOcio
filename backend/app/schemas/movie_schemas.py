"""Movie Request/Response Schemas"""
from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict


class MovieCreate(BaseModel):
    """Movie creation schema"""
    productora: str = Field(..., max_length=200)
    titulo: str = Field(..., max_length=200)
    genero: str = Field(..., max_length=100)
    plataforma: str = Field(..., max_length=100)
    anio_lanzamiento: int = Field(..., ge=1888, le=date.today().year + 5)
    calificacion: Optional[Decimal] = Field(None, ge=0.0, le=10.0)
    director: str = Field(..., max_length=200)
    actores: Optional[str] = None
    duracion_minutos: int = Field(..., ge=1, le=1000)
    clasificacion: str = Field(..., max_length=10)
    
    @field_validator('actores')
    @classmethod
    def validate_actores(cls, v):
        """Validate maximum 10 comma-separated actor names"""
        if v and len(v.split(',')) > 10:
            raise ValueError('Maximum 10 comma-separated actor names allowed')
        return v


class MovieUpdate(BaseModel):
    """Movie update schema"""
    productora: Optional[str] = Field(None, max_length=200)
    titulo: Optional[str] = Field(None, max_length=200)
    genero: Optional[str] = Field(None, max_length=100)
    plataforma: Optional[str] = Field(None, max_length=100)
    anio_lanzamiento: Optional[int] = Field(None, ge=1888, le=date.today().year + 5)
    calificacion: Optional[Decimal] = Field(None, ge=0.0, le=10.0)
    director: Optional[str] = Field(None, max_length=200)
    actores: Optional[str] = None
    duracion_minutos: Optional[int] = Field(None, ge=1, le=1000)
    clasificacion: Optional[str] = Field(None, max_length=10)


class MovieResponse(BaseModel):
    """Movie response schema"""
    id_pelicula: int
    titulo: str
    genero: str
    plataforma: Optional[str]
    anio_lanzamiento: int
    director: str
    duracion_minutos: int
    calificacion: Optional[Decimal]
    actores: Optional[str]
    clasificacion: Optional[str]
    productora: Optional[str]
    fecha_registro: datetime
    
    model_config = ConfigDict(from_attributes=True)
