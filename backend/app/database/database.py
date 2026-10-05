from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config.settings import get_settings

settings = get_settings()

database_url = settings.get_database_url

# Configure connection pooling arguments
engine_kwargs = {
    "echo": settings.APP_DEBUG,
    "pool_pre_ping": True,  # Checks connection health before using from pool
}

# Add pool sizing for MySQL (not supported on sqlite)
if database_url.startswith("mysql"):
    engine_kwargs.update({
        "pool_size": 10,
        "max_overflow": 20,
        "pool_recycle": 3600,  # Recycle connection every hour to prevent MySQL wait_timeout drops
    })
elif database_url.startswith("sqlite"):
    engine_kwargs.update({
        "connect_args": {"check_same_thread": False}
    })

# Create SQLAlchemy Database Engine
engine = create_engine(database_url, **engine_kwargs)

# Create SessionLocal factory for request scoped DB sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a transactional database session per request.
    Automatically ensures the database session is closed after the request finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
