"""Pytest Configuration and Fixtures"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.models.database import Base
from app.dependencies.database_dependencies import get_db
from app.config.settings import Settings, get_settings


# Test database URL (use SQLite for tests)
TEST_DATABASE_URL = "sqlite:///./test.db"


@pytest.fixture(scope="function")
def test_db():
    """Create a test database"""
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client"""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    def override_get_settings():
        return Settings(
            db_host="localhost",
            db_port=5432,
            db_name="test",
            db_user="test",
            db_password="test",
            jwt_secret_key="test-secret-key",
            jwt_algorithm="HS256",
            jwt_expiration_minutes=60,
            colab_api_url="http://test-colab-api.com"
        )
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_settings] = override_get_settings
    
    with TestClient(app) as client:
        yield client
    
    app.dependency_overrides.clear()
