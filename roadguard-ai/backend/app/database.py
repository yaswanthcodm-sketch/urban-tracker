"""
RoadGuard AI — Database Setup & Session Management
Supports MySQL for production and SQLite for local demonstration fallback.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings, PROJECT_ROOT

# Resolve SQLite database URL relative to project root regardless of CWD
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite:///."):
    # Handle sqlite:///./roadguard.db
    clean_rel = db_url.replace("sqlite:///./", "").replace("sqlite:///", "")
    db_url = f"sqlite:///{PROJECT_ROOT / clean_rel}"

# Handle database engine connect args
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=settings.DEBUG and not db_url.startswith("sqlite"),
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes tables in the database."""
    from .models import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
