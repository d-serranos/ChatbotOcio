"""Statistics Router"""
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth_dependencies import require_admin
from app.dependencies.database_dependencies import get_db
from app.models.database import Usuario
from app.schemas.statistics_schemas import StatisticsResponse
from app.services.statistics_service import StatisticsService


router = APIRouter(prefix="/statistics", tags=["Statistics"])


@router.get("", response_model=StatisticsResponse)
async def get_statistics(
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    current_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get token consumption statistics (admin only)"""
    service = StatisticsService(db)
    return service.get_statistics(start_date, end_date)
