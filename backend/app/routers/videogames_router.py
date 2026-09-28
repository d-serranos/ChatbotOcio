"""Videogames Router"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth_dependencies import require_admin
from app.dependencies.database_dependencies import get_db
from app.models.database import Usuario
from app.schemas.videogame_schemas import VideogameCreate, VideogameUpdate, VideogameResponse
from app.services.media_service import MediaService


router = APIRouter(prefix="/videogames", tags=["Videogames"])


@router.post("/", response_model=VideogameResponse, status_code=201)
async def create_videogame(
    videogame_data: VideogameCreate,
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create new videogame (admin only)"""
    service = MediaService(db)
    videogame = service.create_videogame(videogame_data, current_user.id_usuario)
    return videogame


@router.get("/", response_model=List[VideogameResponse])
async def get_videogames(
    genero: Optional[str] = None,
    plataforma: Optional[str] = None,
    anio_lanzamiento: Optional[int] = None,
    clasificacion: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all videogames with optional filtering (admin only)"""
    service = MediaService(db)
    videogames, total = service.get_videogames(
        genero, plataforma, anio_lanzamiento, clasificacion, page, page_size
    )
    return videogames


@router.get("/{videogame_id}", response_model=VideogameResponse)
async def get_videogame(
    videogame_id: int,
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get videogame by ID (admin only)"""
    service = MediaService(db)
    return service.get_videogame_by_id(videogame_id)


@router.put("/{videogame_id}", response_model=VideogameResponse)
async def update_videogame(
    videogame_id: int,
    videogame_data: VideogameUpdate,
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update videogame (admin only)"""
    service = MediaService(db)
    return service.update_videogame(videogame_id, videogame_data, current_user.id_usuario)


@router.delete("/{videogame_id}", status_code=204)
async def delete_videogame(
    videogame_id: int,
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete videogame (admin only)"""
    service = MediaService(db)
    service.delete_videogame(videogame_id)
    return None
