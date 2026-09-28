"""Authentication Service"""
from datetime import datetime, timedelta
from typing import Dict
from fastapi import HTTPException
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config.settings import Settings
from app.models.database import Usuario
from app.schemas.auth_schemas import UserRegister, UserLogin


class AuthService:
    """Handles user authentication and JWT token management"""
    
    def __init__(self, db: Session, config: Settings):
        self.db = db
        self.config = config
        self.pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        # Bcrypt has a 72-character limit
        if len(password) > 72:
            password = password[:72]
        return self.pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def create_jwt_token(self, user_id: int, role: str) -> Dict:
        """Generate JWT token with expiration"""
        expiration = datetime.utcnow() + timedelta(minutes=self.config.jwt_expiration_minutes)
        payload = {
            "sub": str(user_id),
            "role": role,
            "exp": expiration,
            "iat": datetime.utcnow()
        }
        token = jwt.encode(payload, self.config.jwt_secret_key, algorithm=self.config.jwt_algorithm)
        return {
            "access_token": token,
            "token_type": "bearer",
            "expires_in": self.config.jwt_expiration_minutes * 60
        }
    
    def register_user(self, user_data: UserRegister) -> Usuario:
        """Register new user with hashed password"""
        # Check if email exists
        existing = self.db.query(Usuario).filter(Usuario.correo == user_data.correo).first()
        if existing:
            raise HTTPException(status_code=409, detail="Email already registered")
        
        # Create user with hashed password
        user = Usuario(
            nombre=user_data.nombre,
            correo=user_data.correo,
            clave=self.hash_password(user_data.clave),
            rol=user_data.rol or "user",
            fecha_registro=datetime.utcnow()
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def login_user(self, login_data: UserLogin) -> Dict:
        """Authenticate user and return JWT token"""
        user = self.db.query(Usuario).filter(Usuario.correo == login_data.correo).first()
        
        if not user or not self.verify_password(login_data.clave, user.clave):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        return self.create_jwt_token(user.id_usuario, user.rol)
