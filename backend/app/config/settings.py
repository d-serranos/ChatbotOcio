"""Environment Configuration Settings"""
import sys
from typing import Optional
from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import logging

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database configuration
    db_host: str
    db_port: int = 5432
    db_name: str
    db_user: str
    db_password: str
    
    # JWT configuration
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = Field(default=1440, ge=1, le=10080)
    
    # Colab API configuration
    colab_api_url: str
    
    # Application configuration
    app_name: str = "FastAPI Chatbot Backend"
    debug: bool = False
    
    @property
    def database_url(self) -> str:
        """Construct PostgreSQL connection URL"""
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
    
    @model_validator(mode='after')
    def validate_jwt_expiration(self):
        """Validate JWT expiration is within acceptable range"""
        if not 1 <= self.jwt_expiration_minutes <= 10080:
            raise ValueError("JWT_EXPIRATION_MINUTES must be between 1 and 10080")
        return self
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )


# Singleton instance
_settings: Optional[Settings] = None


def get_settings() -> Settings:
    """Get settings singleton"""
    global _settings
    if _settings is None:
        try:
            _settings = Settings()
        except Exception as e:
            logger.error(f"Configuration error: {e}")
            sys.exit(1)
    return _settings
