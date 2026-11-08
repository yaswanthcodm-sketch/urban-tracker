"""
RoadGuard AI — Google Gemini AI Deep Search & Multimodal Vision Service
Uses the official Gemini API key for deep geospatial search, road damage diagnosis, and citizen intelligence.
"""

import os
import json
import time
import asyncio
from typing import Optional, Dict, Any
from ..config import settings

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


def get_gemini_api_key() -> str:
    return (
        os.getenv("GEMINI_API_KEY")
        or settings.GEMINI_API_KEY
        or ""
    )


async def call_gemini_api(model: str, payload: dict, timeout: int = 60) -> dict:
    """
    Executes Gemini API call using system curl for bulletproof SSL & HTTP/2 on macOS.
    """
    api_key = get_gemini_api_key()
    url = f"{GEMINI_API_BASE}/{model}:generateContent?key={api_key}"
    payload_str = json.dumps(payload)

    proc = await asyncio.create_subprocess_exec(
        "curl",
        "-s",
        "-X", "POST",
        url,
        "-H", "Content-Type: application/json",
        "-d", payload_str,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    try:
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
        if stdout:
            return json.loads(stdout.decode("utf-8"))
    except Exception as exc:
        return {"error": {"message": str(exc)}}
    return {"error": {"message": "Empty response from Gemini API"}}


async def gemini_deep_search(
    query: str,
    location: str = "",
    context: Optional[Dict[str, Any]] = None,
    language: str = "en"
) -> Dict[str, Any]:
    """
    Performs Gemini Deep Geospatial Search & Infrastructure Analysis.
    """
    api_key = get_gemini_api_key()
    if not api_key:
        return {
            "success": False,
            "error": "GEMINI_API_KEY is not configured.",
            "query": query
        }

    model = getattr(settings, "GEMINI_MODEL", "gemini-3.5-flash-lite")
    prompt = f"""You are the RoadGuard AI & Urban Tracker Deep Intelligence Analyst.
Analyze the user's geospatial / infrastructure search query:
Query: "{query}"
Locality / Focus: "{location or 'India / Global'}"
Language requested: "{language}"
Additional Context: {json.dumps(context or {})}

Provide a comprehensive, authoritative intelligence brief with:
1. Executive Summary & Geographic Location
2. Road / Infrastructure Classification (Cement CC, Village Track, City Road, Arterial Main Road, National Highway)
3. Responsible Civic Authority (Municipal Corporation, Gram Panchayat PR&RD, State PWD/R&B, or NHAI)
4. Known Road Distress or Safety Factors
5. Recommended Inspection & Redressal Protocol
Keep it clear, professional, and directly actionable."""

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 1024
        }
    }

    start_time = time.time()
    data = await call_gemini_api(model, payload)
    elapsed_ms = int((time.time() - start_time) * 1000)

    # If model is 404/unavailable, fallback to gemini-flash-latest
    if "error" in data:
        data = await call_gemini_api("gemini-flash-latest", payload)
        model = "gemini-flash-latest"

    candidates = data.get("candidates", [])
    if candidates:
        parts = candidates[0].get("content", {}).get("parts", [])
        reply_text = "".join(p.get("text", "") for p in parts if "text" in p)
        return {
            "success": True,
            "query": query,
            "location": location,
            "result": reply_text.strip(),
            "model": data.get("modelVersion", model),
            "latency_ms": elapsed_ms,
            "usage": data.get("usageMetadata", {})
        }

    err_msg = data.get("error", {}).get("message", "Unknown error")
    return {
        "success": False,
        "error": err_msg,
        "query": query
    }


async def gemini_analyze_damage(
    image_base64: str,
    mime_type: str = "image/jpeg",
    road_context: str = ""
) -> Dict[str, Any]:
    """
    Multimodal visual inspection of road surface damage using Gemini Vision.
    """
    api_key = get_gemini_api_key()
    if not api_key:
        return {"success": False, "error": "GEMINI_API_KEY is not configured."}

    model = getattr(settings, "GEMINI_MODEL", "gemini-3.5-flash-lite")
    prompt = f"""You are an expert civil & pavement infrastructure engineer.
Examine this photographic evidence of road surface distress.
Context: {road_context or 'Urban / Village Road Pavement in India'}

Provide a structured assessment:
- Defect Type (e.g. Deep Pothole, Spalling, Alligator Cracks, Surface Rutting, Garbage Debris, Waterlogging)
- Severity Level (Low, Medium, High / Critical)
- Approximate Distress Depth / Dimension
- Safety Risk to vehicles (2-wheelers, cars, heavy trucks)
- Recommended Engineering Repair Method (e.g., Cold Mix Asphalt, M30 Rapid Concrete, Full-depth Reclamation)
- Estimated Repair Urgency (Hours / Days)"""

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {
                        "inlineData": {
                            "mimeType": mime_type,
                            "data": image_base64
                        }
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 800
        }
    }

    data = await call_gemini_api(model, payload)
    candidates = data.get("candidates", [])
    if candidates:
        parts = candidates[0].get("content", {}).get("parts", [])
        reply_text = "".join(p.get("text", "") for p in parts if "text" in p)
        return {
            "success": True,
            "analysis": reply_text.strip(),
            "model": data.get("modelVersion", model)
        }

    err_msg = data.get("error", {}).get("message", "Unknown error")
    return {"success": False, "error": err_msg}


async def gemini_text_to_speech(
    text: str,
    voice_name: str = "Kore",
    language: str = "te"
) -> Dict[str, Any]:
    """
    Generates realistic speech audio using Gemini TTS (Flash-Lite / 3.1 / 3.8).
    Returns audio/wav base64 string for direct browser playback.
    """
    api_key = get_gemini_api_key()
    if not api_key:
        return {"success": False, "error": "GEMINI_API_KEY is not configured."}

    models_to_try = ["gemini-3.8-flash-lite-tts", "gemini-3.1-flash-tts-preview", "gemini-3.8-flash-tts"]
    payload = {
        "contents": [
            {
                "parts": [{"text": text}]
            }
        ],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {
                        "voiceName": voice_name or "Kore"
                    }
                }
            }
        }
    }

    last_error = "Failed to synthesize speech audio from Gemini"
    start_time = time.time()

    for model in models_to_try:
        try:
            data = await call_gemini_api(model, payload, timeout=15)
            candidates = data.get("candidates", [])
            if candidates and len(candidates) > 0:
                parts = candidates[0].get("content", {}).get("parts", [])
                for p in parts:
                    inline_data = p.get("inlineData", {})
                    if inline_data.get("data"):
                        elapsed_ms = int((time.time() - start_time) * 1000)
                        return {
                            "success": True,
                            "mime_type": inline_data.get("mimeType", "audio/wav"),
                            "audio_base64": inline_data["data"],
                            "model": model,
                            "voice": voice_name,
                            "text": text,
                            "language": language,
                            "elapsed_ms": elapsed_ms
                        }
            last_error = data.get("error", {}).get("message") or last_error
        except Exception as e:
            last_error = str(e)

    return {
        "success": False,
        "error": last_error
    }

