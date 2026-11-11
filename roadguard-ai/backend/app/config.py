"""
RoadGuard AI — Application Configuration
"""
import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

# Base directory of the roadguard-ai project
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# Redirect Ultralytics settings & caches to the project workspace
os.environ["YOLO_CONFIG_DIR"] = str(PROJECT_ROOT / "ml" / ".ultralytics")
os.makedirs(PROJECT_ROOT / "ml" / ".ultralytics", exist_ok=True)


class Settings(BaseSettings):
    APP_NAME: str = "RoadGuard AI — Smart Road Intelligence & Repair Tracking System"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Security
    SECRET_KEY: str = "roadguard-ai-secret-key-super-secure-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Database: Default SQLite at PROJECT_ROOT; easily switched to MySQL in .env
    DATABASE_URL: str = f"sqlite:///{PROJECT_ROOT / 'roadguard.db'}"

    # Storage paths
    UPLOAD_DIR: str = str(PROJECT_ROOT / "uploads")
    MAX_UPLOAD_SIZE_MB: int = 25

    # AI Detection & Gemini Intelligence
    YOLO_MODEL_PATH: str = str(PROJECT_ROOT / "ml" / "weights" / "best.pt")
    YOLO_API_KEY: str = ""
    ULTRALYTICS_API_KEY: str = ""
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    CONFIDENCE_THRESHOLD: float = 0.35
    IOU_THRESHOLD: float = 0.45
    AI_FALLBACK_MODE: bool = True

    # Duplicate Thresholds
    DUPLICATE_DISTANCE_METERS: float = 50.0
    DUPLICATE_TIME_DAYS: int = 30

    # Modes & Integrations
    DEMO_MODE: bool = True
    OPENSTREETMAP_NOMINATIM_URL: str = "https://nominatim.openstreetmap.org/reverse"
    COPERNICUS_API_ENDPOINT: str = "https://dataspace.copernicus.eu/resto/api"
    COPERNICUS_CLIENT_ID: str = ""
    COPERNICUS_CLIENT_SECRET: str = ""
    PGPORTAL_INTEGRATION_MODE: str = "demo_simulation"
    PGPORTAL_API_KEY: str = ""

    # Urban Tracker MailBot — Transactional Email Service
    MAILBOT_PROVIDER: str = "resend"  # "resend", "brevo", or "smtp"
    RESEND_API_KEY: str = ""
    BREVO_API_KEY: str = ""
    MAILBOT_FROM_EMAIL: str = "Urban Tracker MailBot <onboarding@resend.dev>"
    MAILBOT_REPLY_TO: str = "no-reply@urban-tracker.io"
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_FROM_NUMBER: str = ""

    CORS_ORIGINS: List[str] = ["*"]

    @property
    def BASE_DIR(self) -> str:
        return str(PROJECT_ROOT)

    @property
    def ENVIRONMENT(self) -> str:
        return self.APP_ENV

    @property
    def EVIDENCE_DIR(self) -> str:
        return os.path.join(self.UPLOAD_DIR, "evidence")

    @property
    def REPAIRS_DIR(self) -> str:
        return os.path.join(self.UPLOAD_DIR, "repairs")

    @property
    def CCTV_FRAMES_DIR(self) -> str:
        return os.path.join(self.UPLOAD_DIR, "cctv_frames")

    class Config:
        env_file = (str(PROJECT_ROOT.parent / ".env"), str(PROJECT_ROOT / ".env"))
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()

# Ensure uploads directories exist
os.makedirs(os.path.join(settings.UPLOAD_DIR, "evidence"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "repairs"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "cctv_frames"), exist_ok=True)
