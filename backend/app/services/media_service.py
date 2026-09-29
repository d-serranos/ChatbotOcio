"""Media CRUD Service"""
from datetime import datetime
from typing import List, Optional, Tuple
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.database import Pelicula, Videojuego
from app.schemas.movie_schemas import MovieCreate, MovieUpdate
from app.schemas.videogame_schemas import VideogameCreate, VideogameUpdate


class MediaService:
    """Handles CRUD operations for movies and videogames"""
    
    def __init__(self, db: Session):
        self.db = db
    
    # Movie operations
    def create_movie(self, movie_data: MovieCreate, user_id: int) -> Pelicula:
        """Create new movie record"""
        movie = Pelicula(
            **movie_data.model_dump(),
            id_usuario=user_id,
            fecha_registro=datetime.utcnow(),
            activo=1
        )
        self.db.add(movie)
        self.db.commit()
        self.db.refresh(movie)
        return movie
    
    def get_movies(
        self, 
        genero: Optional[str] = None,
        plataforma: Optional[str] = None,
        anio_lanzamiento: Optional[int] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Pelicula], int]:
        """Get all active movies with optional filtering and pagination"""
        query = self.db.query(Pelicula).filter(Pelicula.activo == 1)
        
        if genero:
            query = query.filter(Pelicula.genero == genero)
        if plataforma:
            query = query.filter(Pelicula.plataforma == plataforma)
        if anio_lanzamiento:
            query = query.filter(Pelicula.anio_lanzamiento == anio_lanzamiento)
        
        total = query.count()
        movies = query.offset((page - 1) * page_size).limit(page_size).all()
        
        return movies, total
    
    def get_movie_by_id(self, movie_id: int) -> Pelicula:
        """Get movie by ID"""
        movie = self.db.query(Pelicula).filter(
            Pelicula.id_pelicula == movie_id,
            Pelicula.activo == 1
        ).first()
        
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        return movie
    
    def update_movie(self, movie_id: int, movie_data: MovieUpdate, user_id: int) -> Pelicula:
        """Update existing movie"""
        movie = self.get_movie_by_id(movie_id)
        
        update_data = movie_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(movie, field, value)
        
        movie.id_usuario = user_id
        self.db.commit()
        self.db.refresh(movie)
        return movie
    
    def delete_movie(self, movie_id: int) -> None:
        """Soft delete movie"""
        movie = self.get_movie_by_id(movie_id)
        movie.activo = 0
        self.db.commit()
    
    # Videogame operations
    def create_videogame(self, videogame_data: VideogameCreate, user_id: int) -> Videojuego:
        """Create new videogame record"""
        videogame = Videojuego(
            **videogame_data.model_dump(),
            id_usuario=user_id,
            fecha_registro=datetime.utcnow(),
            activo=1
        )
        self.db.add(videogame)
        self.db.commit()
        self.db.refresh(videogame)
        return videogame
    
    def get_videogames(
        self,
        genero: Optional[str] = None,
        plataforma: Optional[str] = None,
        anio_lanzamiento: Optional[int] = None,
        calificacion: Optional[float] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Videojuego], int]:
        """Get all active videogames with optional filtering and pagination"""
        query = self.db.query(Videojuego).filter(Videojuego.activo == 1)
        
        if genero:
            # Support comma-separated values
            generos = [g.strip() for g in genero.split(',')]
            query = query.filter(Videojuego.genero.in_(generos))
        
        if plataforma:
            plataformas = [p.strip() for p in plataforma.split(',')]
            query = query.filter(Videojuego.plataforma.in_(plataformas))
        
        if anio_lanzamiento:
            query = query.filter(Videojuego.anio_lanzamiento == anio_lanzamiento)
        
        if calificacion is not None:
            query = query.filter(Videojuego.calificacion >= calificacion)
        
        total = query.count()
        videogames = query.offset((page - 1) * page_size).limit(page_size).all()
        
        return videogames, total
    
    def get_videogame_by_id(self, videogame_id: int) -> Videojuego:
        """Get videogame by ID"""
        videogame = self.db.query(Videojuego).filter(
            Videojuego.id_videojuego == videogame_id,
            Videojuego.activo == 1
        ).first()
        
        if not videogame:
            raise HTTPException(status_code=404, detail="Videogame not found")
        
        return videogame
    
    def update_videogame(self, videogame_id: int, videogame_data: VideogameUpdate, user_id: int) -> Videojuego:
        """Update existing videogame"""
        videogame = self.get_videogame_by_id(videogame_id)
        
        update_data = videogame_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(videogame, field, value)
        
        videogame.id_usuario = user_id
        self.db.commit()
        self.db.refresh(videogame)
        return videogame
    
    def delete_videogame(self, videogame_id: int) -> None:
        """Soft delete videogame"""
        videogame = self.get_videogame_by_id(videogame_id)
        videogame.activo = 0
        self.db.commit()