"""Authorization Dependencies"""
from typing import Optional
from fastapi import Depends, HTTPException, Header
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.config.settings import get_settings, Settings
from app.dependencies.database_dependencies import get_db
from app.models.database import Usuario


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
    config: Settings = Depends(get_settings)
) -> Usuario:
    """Extract and validate JWT token, return current user"""
    try:
        payload = jwt.decode(token, config.jwt_secret_key, algorithms=[config.jwt_algorithm])
        user_id: int = int(payload.get("sub"))
        role: str = payload.get("role")
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token signature")
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Malformed token structure")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token signature")
    
    user = db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


async def require_admin(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    """Ensure current user has admin role"""
    if current_user.rol != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


async def get_optional_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
    config: Settings = Depends(get_settings)
) -> Optional[Usuario]:
    """Extract user from token if present, otherwise return None"""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, config.jwt_secret_key, algorithms=[config.jwt_algorithm])
        user_id: int = int(payload.get("sub"))
        return db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
    except:
        return None
