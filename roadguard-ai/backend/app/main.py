"""
RoadGuard AI — Smart Road Intelligence & Repair Tracking System
FastAPI Main Application Entrypoint
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .config import settings
from .database import init_db
from .routes import (
    auth,
    detections,
    complaints,
    cameras,
    departments,
    inspections,
    repairs,
    verifications,
    analytics,
    satellite,
    notifications,
    gemini,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is initialized
    init_db()
    # Ensure upload directories exist
    os.makedirs(settings.EVIDENCE_DIR, exist_ok=True)
    os.makedirs(settings.REPAIRS_DIR, exist_ok=True)
    os.makedirs(settings.CCTV_FRAMES_DIR, exist_ok=True)
    yield


app = FastAPI(
    title="RoadGuard AI — Smart Road Intelligence & Repair Tracking Platform",
    description="Automated AI-powered road distress detection, complaint lifecycle management, and repair verification platform.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Alias Middleware: maps /api/roadguard/* transparently to /api/*
from fastapi import Request
@app.middleware("http")
async def alias_roadguard_prefix(request: Request, call_next):
    if request.url.path.startswith("/api/roadguard/"):
        new_path = "/api/" + request.url.path[len("/api/roadguard/"):]
        request.scope["path"] = new_path
    return await call_next(request)

# Mount uploads static folder
uploads_path = os.path.join(settings.BASE_DIR, "uploads")
os.makedirs(uploads_path, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

# Unified Full-Stack Static Assets: Mount all build outputs from dist
from pathlib import Path
MAIN_WORKSPACE_DIR = Path(__file__).resolve().parent.parent.parent.parent
dist_dir = MAIN_WORKSPACE_DIR / "dist"

# Mount each static directory from dist if available
static_subdirs = ["assets", "cesium", "css", "js", "audio", "models", "presentation_assets"]
for subdir in static_subdirs:
    target_path = dist_dir / subdir
    if target_path.exists():
        app.mount(f"/{subdir}", StaticFiles(directory=str(target_path)), name=f"dist-{subdir}")

# Mount frontend static directory if exists
frontend_dir = os.path.join(settings.BASE_DIR, "frontend")
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

# Include all API Routers
app.include_router(auth.router)
app.include_router(detections.router)
app.include_router(complaints.router)
app.include_router(cameras.router)
app.include_router(departments.router)
app.include_router(inspections.router)
app.include_router(repairs.router)
app.include_router(verifications.router)
app.include_router(analytics.router)
app.include_router(satellite.router)
app.include_router(notifications.router)
app.include_router(gemini.router)


@app.get("/")
def serve_index():
    """Serve the Unified Full-Stack Urban Tracker 3D Console."""
    prod_index = MAIN_WORKSPACE_DIR / "dist" / "index.html"
    if prod_index.exists():
        return FileResponse(str(prod_index))
    dev_index = MAIN_WORKSPACE_DIR / "index.html"
    if dev_index.exists():
        return FileResponse(str(dev_index))
    return {"message": "RoadGuard AI Backend API is live. Access docs at /docs"}


@app.get("/login")
@app.get("/login.html")
def serve_login():
    """Serve Citizen Login & OTP Authentication Portal."""
    login_file = MAIN_WORKSPACE_DIR / "login.html"
    if login_file.exists():
        return FileResponse(str(login_file))
    return {"error": "login.html not found"}


@app.get("/track")
@app.get("/track.html")
def serve_track():
    """Serve Road Repair Complaint Tracking Portal."""
    track_file = MAIN_WORKSPACE_DIR / "track.html"
    if track_file.exists():
        return FileResponse(str(track_file))
    return {"error": "track.html not found"}


@app.get("/ACTIVE_ALL_LINKS.html")
def serve_active_links():
    """Serve Master Active Links Dashboard."""
    links_file = MAIN_WORKSPACE_DIR / "ACTIVE_ALL_LINKS.html"
    if links_file.exists():
        return FileResponse(str(links_file))
    return {"error": "ACTIVE_ALL_LINKS.html not found"}


@app.get("/logo.svg")
def serve_logo():
    """Serve Application Brand Logo."""
    logo_file = MAIN_WORKSPACE_DIR / "public" / "logo.svg"
    if logo_file.exists():
        return FileResponse(str(logo_file), media_type="image/svg+xml")
    return {"error": "logo.svg not found"}


@app.get("/api/health")
def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "RoadGuard AI Platform",
        "environment": settings.ENVIRONMENT,
        "database": settings.DATABASE_URL.split("://")[0],
        "storage": "Local / Uploads Ready",
    }


@app.get("/api/setup/status")
def get_setup_status():
    """Return provider API keys connection status from .env and os.environ."""
    from dotenv import dotenv_values
    env_vals = {}
    env_file = MAIN_WORKSPACE_DIR / ".env"
    if env_file.exists():
        try:
            env_vals = dotenv_values(str(env_file))
        except Exception:
            pass
    merged = {**os.environ, **env_vals}

    registry = [
        {"id": "google-maps", "title": "GOOGLE MAPS", "unlocks": "The photorealistic 3D planet + place search", "getUrl": "https://developers.google.com/maps/documentation/tile/get-api-key", "envVars": ["GOOGLE_MAPS_API_KEY"], "tier": "metered", "clientExposed": True},
        {"id": "openai", "title": "OPENAI", "unlocks": "Voice control — talk to the planet", "getUrl": "https://platform.openai.com/api-keys", "envVars": ["OPENAI_API_KEY"], "tier": "metered", "clientExposed": False},
        {"id": "gemini", "title": "GEMINI AI", "unlocks": "Deep geospatial search & multimodal road intelligence", "getUrl": "https://aistudio.google.com/app/apikey", "envVars": ["GEMINI_API_KEY"], "tier": "free", "clientExposed": False},
        {"id": "aisstream", "title": "AISSTREAM", "unlocks": "Live ships, worldwide", "getUrl": "https://aisstream.io", "envVars": ["AISSTREAM_API_KEY"], "tier": "free", "clientExposed": False},
        {"id": "firms", "title": "NASA FIRMS", "unlocks": "Live active-fire detections", "getUrl": "https://firms.modaps.eosdis.nasa.gov/api/map_key/", "envVars": ["FIRMS_MAP_KEY"], "tier": "free", "clientExposed": False},
        {"id": "tomtom", "title": "TOMTOM", "unlocks": "Real live traffic (keyless runs a simulation)", "getUrl": "https://developer.tomtom.com", "envVars": ["TOMTOM_API_KEY"], "tier": "free", "clientExposed": False},
        {"id": "cesium-ion", "title": "CESIUM ION", "unlocks": "Bing imagery map stacks + world terrain", "getUrl": "https://ion.cesium.com/tokens", "envVars": ["CESIUM_ION_TOKEN"], "tier": "free", "clientExposed": True},
        {"id": "opensky", "title": "OPENSKY", "unlocks": "More flight-polling credits (anonymous works without)", "getUrl": "https://opensky-network.org", "envVars": ["OPENSKY_CLIENT_ID", "OPENSKY_CLIENT_SECRET"], "tier": "free", "clientExposed": False},
        {"id": "launch-library", "title": "LAUNCH LIBRARY", "unlocks": "Higher space-missions request allowance", "getUrl": "https://thespacedevs.com", "envVars": ["LL2_API_TOKEN"], "tier": "free", "clientExposed": False}
    ]

    keys = []
    for entry in registry:
        vals = [str(merged.get(v, "") or "").strip() for v in entry["envVars"]]
        is_set = all(len(v) > 0 for v in vals)
        keys.append({**entry, "set": is_set, "managed": "file" if is_set else None})

    set_count = sum(1 for k in keys if k["set"])
    return {
        "keys": keys,
        "setCount": set_count,
        "total": len(keys),
        "store": "env-file"
    }


@app.post("/api/setup/keys")
async def save_setup_keys(request: Request):
    """Save or update API keys in .env."""
    from dotenv import dotenv_values
    data = await request.json()
    if not isinstance(data, dict):
        return {"ok": False, "error": "Invalid JSON"}

    env_path = MAIN_WORKSPACE_DIR / ".env"
    existing_lines = []
    if env_path.exists():
        existing_lines = env_path.read_text(encoding="utf-8").splitlines()

    updated_keys = set()
    new_lines = []
    for line in existing_lines:
        if "=" in line and not line.strip().startswith("#"):
            k = line.split("=")[0].strip()
            if k in data:
                v = data[k]
                if v is None:
                    continue  # remove
                new_lines.append(f'{k}="{v}"' if " " in str(v) else f"{k}={v}")
                updated_keys.add(k)
                continue
        new_lines.append(line)

    for k, v in data.items():
        if k not in updated_keys and v is not None:
            new_lines.append(f'{k}="{v}"' if " " in str(v) else f"{k}={v}")

    env_path.write_text("\n".join(new_lines) + "\n", encoding="utf-8")
    return {"ok": True, "saved": list(data.keys())}
