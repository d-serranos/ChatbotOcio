"""Statistics Service"""
from datetime import date, timedelta
from typing import Optional
from fastapi import HTTPException
from sqlalchemy import func, distinct, desc
from sqlalchemy.orm import Session

from app.models.database import ConsumoToken, Usuario, Conversacion, Mensaje
from app.schemas.statistics_schemas import StatisticsResponse, TokenStats, UserTokenStats


class StatisticsService:
    """Handles token consumption statistics aggregation"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_statistics(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> StatisticsResponse:
        """Get token consumption statistics with optional date range"""
        
        # Default to last 30 days if no range specified
        if not end_date:
            end_date = date.today()
        if not start_date:
            start_date = end_date - timedelta(days=30)
        
        # Validate date range
        if start_date > end_date:
            raise HTTPException(
                status_code=422,
                detail="start_date cannot be after end_date"
            )
        
        # Query daily statistics
        daily_query = self.db.query(
            func.date(ConsumoToken.fecha).label('date'),
            func.sum(ConsumoToken.tokens).label('total_tokens'),
            func.count(distinct(ConsumoToken.id_mensaje)).label('message_count')
        ).filter(
            func.date(ConsumoToken.fecha) >= start_date,
            func.date(ConsumoToken.fecha) <= end_date,
            ConsumoToken.categoria == "total_tokens"  # Only count total, not duplicates
        ).group_by(
            func.date(ConsumoToken.fecha)
        ).order_by(
            desc(func.date(ConsumoToken.fecha))
        ).all()
        
        # Query user statistics
        user_query = self.db.query(
            Usuario.id_usuario,
            Usuario.nombre,
            func.sum(ConsumoToken.tokens).label('total_tokens'),
            func.count(distinct(Mensaje.id_mensaje)).label('message_count')
        ).join(
            Conversacion, Conversacion.id_usuario == Usuario.id_usuario
        ).join(
            Mensaje, Mensaje.id_conversacion == Conversacion.id_conversacion
        ).join(
            ConsumoToken, ConsumoToken.id_mensaje == Mensaje.id_mensaje
        ).filter(
            func.date(ConsumoToken.fecha) >= start_date,
            func.date(ConsumoToken.fecha) <= end_date,
            ConsumoToken.categoria == "total_tokens"
        ).group_by(
            Usuario.id_usuario,
            Usuario.nombre
        ).order_by(
            desc(func.sum(ConsumoToken.tokens))
        ).all()
        
        # Format response
        daily_stats = [
            TokenStats(
                date=row.date,
                total_tokens=row.total_tokens or 0,
                message_count=row.message_count or 0
            )
            for row in daily_query
        ]
        
        user_stats = [
            UserTokenStats(
                user_id=row.id_usuario,
                user_name=row.nombre,
                total_tokens=row.total_tokens or 0,
                message_count=row.message_count or 0
            )
            for row in user_query
        ]
        
        return StatisticsResponse(
            daily_stats=daily_stats,
            user_stats=user_stats,
            date_range={
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat()
            }
        )
