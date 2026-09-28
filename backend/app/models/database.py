"""SQLAlchemy Database Models"""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, func
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    """Base class for all models"""
    pass


class Usuario(Base):
    """Usuario model"""
    __tablename__ = "usuario"
    
    id_usuario: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    rol: Mapped[str] = mapped_column(String(50), nullable=False)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    correo: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    clave: Mapped[str] = mapped_column(String(255), nullable=False)
    fecha_registro: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    
    # Relationships
    peliculas: Mapped[List["Pelicula"]] = relationship(back_populates="usuario", cascade="all, delete-orphan")
    videojuegos: Mapped[List["Videojuego"]] = relationship(back_populates="usuario", cascade="all, delete-orphan")
    conversaciones: Mapped[List["Conversacion"]] = relationship(back_populates="usuario", cascade="all, delete-orphan")


class Pelicula(Base):
    """Pelicula model"""
    __tablename__ = "pelicula"
    
    id_pelicula: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_usuario: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id_usuario"), nullable=False)
    productora: Mapped[str] = mapped_column(String(200), nullable=False)
    titulo: Mapped[str] = mapped_column(String(200), nullable=False)
    genero: Mapped[str] = mapped_column(String(100), nullable=False)
    plataforma: Mapped[str] = mapped_column(String(100), nullable=False)
    anio_lanzamiento: Mapped[int] = mapped_column(Integer, nullable=False)
    calificacion: Mapped[Optional[Decimal]] = mapped_column(Numeric(2, 1), nullable=True)
    director: Mapped[str] = mapped_column(String(200), nullable=False)
    actores: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    duracion_minutos: Mapped[int] = mapped_column(Integer, nullable=False)
    clasificacion: Mapped[str] = mapped_column(String(10), nullable=False)
    fecha_registro: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    
    # Relationships
    usuario: Mapped["Usuario"] = relationship(back_populates="peliculas")


class Videojuego(Base):
    """Videojuego model"""
    __tablename__ = "videojuego"
    
    id_videojuego: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_usuario: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id_usuario"), nullable=False)
    titulo: Mapped[str] = mapped_column(String(200), nullable=False)
    genero: Mapped[str] = mapped_column(String(100), nullable=False)
    plataforma: Mapped[str] = mapped_column(String(100), nullable=False)
    anio_lanzamiento: Mapped[int] = mapped_column(Integer, nullable=False)
    clasificacion: Mapped[str] = mapped_column(String(10), nullable=False)
    desarrollador: Mapped[str] = mapped_column(String(200), nullable=False)
    jugadores: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    fecha_registro: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    
    # Relationships
    usuario: Mapped["Usuario"] = relationship(back_populates="videojuegos")


class Conversacion(Base):
    """Conversacion model"""
    __tablename__ = "conversacion"
    
    id_conversacion: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_usuario: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id_usuario"), nullable=False)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    
    # Relationships
    usuario: Mapped["Usuario"] = relationship(back_populates="conversaciones")
    mensajes: Mapped[List["Mensaje"]] = relationship(back_populates="conversacion", cascade="all, delete-orphan")


class Mensaje(Base):
    """Mensaje model"""
    __tablename__ = "mensajes"
    
    id_mensaje: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_conversacion: Mapped[int] = mapped_column(Integer, ForeignKey("conversacion.id_conversacion"), nullable=False)
    rol: Mapped[str] = mapped_column(String(20), nullable=False)
    contenido: Mapped[str] = mapped_column(Text, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    
    # Relationships
    conversacion: Mapped["Conversacion"] = relationship(back_populates="mensajes")
    consumo_tokens: Mapped[List["ConsumoToken"]] = relationship(back_populates="mensaje", cascade="all, delete-orphan")


class ConsumoToken(Base):
    """ConsumoToken model"""
    __tablename__ = "consumo_tokens"
    
    id_consumo: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_mensaje: Mapped[int] = mapped_column(Integer, ForeignKey("mensajes.id_mensaje"), nullable=False)
    categoria: Mapped[str] = mapped_column(String(50), nullable=False)
    tokens: Mapped[int] = mapped_column(Integer, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    
    # Relationships
    mensaje: Mapped["Mensaje"] = relationship(back_populates="consumo_tokens")
