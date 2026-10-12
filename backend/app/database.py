import logging
from typing import AsyncGenerator, List
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text

logger = logging.getLogger(__name__)


#FALLBACKS 
class Settings(BaseSettings):
    PROJECT_NAME: str = "Employee Directory Search System"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    DATABASE_URL: str = "sqlite+aiosqlite:///./employees.db" #fallback for local db (Added intentionally)

    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 3600

    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()

class Base(DeclarativeBase):
    pass


is_sqlite = settings.DATABASE_URL.startswith("sqlite")

engine_kwargs = {
    "echo": settings.ENVIRONMENT == "development",
    "future": True,
}

if is_sqlite:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs.update(
        {
            "pool_size": settings.DB_POOL_SIZE,
            "max_overflow": settings.DB_MAX_OVERFLOW,
            "pool_timeout": settings.DB_POOL_TIMEOUT,
            "pool_recycle": settings.DB_POOL_RECYCLE,
            "pool_pre_ping": True,
        }
    )

engine = create_async_engine(settings.DATABASE_URL, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency yielding an async DB session per request with automated cleanup"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def check_db_connection() -> bool:
    """Verifies database connectivity for health check endpoints"""
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.error(f"Database connection ping failed: {exc}")
        return False
