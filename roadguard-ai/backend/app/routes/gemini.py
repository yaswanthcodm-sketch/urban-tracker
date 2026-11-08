"""
RoadGuard AI — Gemini Intelligence & Deep Search API Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from ..services.gemini_service import (
    gemini_deep_search,
    gemini_analyze_damage,
    gemini_text_to_speech,
    get_gemini_api_key
)

router = APIRouter(prefix="/api/gemini", tags=["Gemini Deep Search & AI"])


class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "Kore"
    language: Optional[str] = "te"


class DeepSearchRequest(BaseModel):
    query: str
    location: Optional[str] = "India"
    language: Optional[str] = "en"
    context: Optional[Dict[str, Any]] = None


class DamageAnalysisRequest(BaseModel):
    image_base64: str
    mime_type: Optional[str] = "image/jpeg"
    road_context: Optional[str] = ""


@router.post("/deep-search")
async def api_gemini_deep_search(req: DeepSearchRequest):
    """
    Perform deep AI geospatial search and road intelligence analysis.
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    result = await gemini_deep_search(
        query=req.query,
        location=req.location or "India",
        context=req.context,
        language=req.language or "en"
    )
    if not result.get("success"):
        raise HTTPException(status_code=502, detail=result.get("error", "Gemini Deep Search failed"))
    return result


@router.post("/analyze-damage")
async def api_gemini_analyze_damage(req: DamageAnalysisRequest):
    """
    Perform multimodal Gemini vision analysis on road defect images.
    """
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Image base64 data required.")
    
    result = await gemini_analyze_damage(
        image_base64=req.image_base64,
        mime_type=req.mime_type or "image/jpeg",
        road_context=req.road_context or ""
    )
    if not result.get("success"):
        raise HTTPException(status_code=502, detail=result.get("error", "Gemini Vision analysis failed"))
    return result


@router.post("/tts")
async def api_gemini_tts(req: TTSRequest):
    """
    Generate realistic human voice speech using Gemini 3.8 Flash TTS.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    result = await gemini_text_to_speech(
        text=req.text,
        voice_name=req.voice or "Kore",
        language=req.language or "te"
    )
    if not result.get("success"):
        raise HTTPException(status_code=502, detail=result.get("error", "Gemini TTS generation failed"))
    return result


@router.get("/status")
def api_gemini_status():
    """
    Returns active Gemini API configuration status.
    """
    key = get_gemini_api_key()
    configured = bool(key and len(key) > 10)
    masked = (key[:6] + "..." + key[-4:]) if configured else "Not Set"
    return {
        "provider": "Google Gemini AI",
        "configured": configured,
        "masked_key": masked,
        "models": ["gemini-flash-latest", "gemini-pro-latest", "gemini-3.8-flash"]
    }
