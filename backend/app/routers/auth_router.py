"""Authentication Router"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.settings import Settings, get_settings
from app.dependencies.database_dependencies import get_db
from app.schemas.auth_schemas import UserRegister, UserLogin, TokenResponse
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db),
    config: Settings = Depends(get_settings)
):
    """Register new user and return JWT token"""
    auth_service = AuthService(db, config)
    user = auth_service.register_user(user_data)
    return auth_service.create_jwt_token(user.id_usuario, user.rol)


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db),
    config: Settings = Depends(get_settings)
):
    """Authenticate user and return JWT token"""
    auth_service = AuthService(db, config)
    return auth_service.login_user(login_data)
