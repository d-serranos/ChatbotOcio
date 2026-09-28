"""Movies Router"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth_dependencies import require_admin
from app.dependencies.database_dependencies import get_db
from app.models.database import Usuario
from app.schemas.movie_schemas import MovieCreate, MovieUpdate, MovieResponse
from app.services.media_service import MediaService


router = APIRouter(prefix="/movies", tags=["Movies"])


@router.post("/", response_model=MovieResponse, status_code=201)
async def create_movie(
    movie_data: MovieCreate,
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create new movie (admin only)"""
    service = MediaService(db)
    movie = service.create_movie(movie_data, current_user.id_usuario)
    return movie


@router.get("/", response_model=List[MovieResponse])
async def get_movies(
    genero: Optional[str] = None,
    plataforma: Optional[str] = None,
    anio_lanzamiento: Optional[int] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all movies with optional filtering (admin only)"""
    service = MediaService(db)
    movies, total = service.get_movies(genero, plataforma, anio_lanzamiento, page, page_size)
    return movies


@router.get("/{movie_id}", response_model=MovieResponse)
async def get_movie(
    movie_id: int,
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get movie by ID (admin only)"""
    service = MediaService(db)
    return service.get_movie_by_id(movie_id)


@router.put("/{movie_id}", response_model=MovieResponse)
async def update_movie(
    movie_id: int,
    movie_data: MovieUpdate,
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update movie (admin only)"""
    service = MediaService(db)
    return service.update_movie(movie_id, movie_data, current_user.id_usuario)


@router.delete("/{movie_id}", status_code=204)
async def delete_movie(
    movie_id: int,
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete movie (admin only)"""
    service = MediaService(db)
    service.delete_movie(movie_id)
    return None
