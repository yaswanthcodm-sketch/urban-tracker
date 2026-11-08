"""
RoadGuard AI — Geospatial & Location Services
"""
import math
from typing import Tuple, Optional, Dict, Any
import httpx
from ..config import settings


def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes great-circle distance between two GPS coordinates in meters.
    """
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


def validate_coordinates(lat: float, lon: float) -> bool:
    """Validates if latitude and longitude are within physical geographic bounds."""
    if not isinstance(lat, (int, float)) or not isinstance(lon, (int, float)):
        return False
    if math.isnan(lat) or math.isnan(lon) or math.isinf(lat) or math.isinf(lon):
        return False
    return -90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0


async def reverse_geocode(lat: float, lon: float) -> Dict[str, Any]:
    """
    Reverse geocodes coordinates to road/city name.
    Respects rate limits; provides reliable fallback if offline or service is unavailable.
    """
    if not validate_coordinates(lat, lon):
        return {"road": "Unknown Road", "city": "Unknown City", "display_name": f"{lat}, {lon}"}

    # If demo mode or test environment without external network
    if settings.DEMO_MODE:
        # Generate clean geographic context
        return {
            "road": f"Sector Road near {abs(lat):.3f}°N, {abs(lon):.3f}°E",
            "city": "Urban District",
            "display_name": f"Road Segment at ({lat:.5f}, {lon:.5f})",
            "source": "Local Spatial Index",
        }

    try:
        headers = {"User-Agent": "RoadGuard-AI-Platform/1.0"}
        params = {"format": "jsonv2", "lat": lat, "lon": lon, "zoom": 17}
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(settings.OPENSTREETMAP_NOMINATIM_URL, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                addr = data.get("address", {})
                road = addr.get("road") or addr.get("pedestrian") or addr.get("suburb") or "Main Road"
                city = addr.get("city") or addr.get("town") or addr.get("state_district") or "Metropolis"
                return {
                    "road": road,
                    "city": city,
                    "display_name": data.get("display_name", f"{road}, {city}"),
                    "source": "OpenStreetMap Nominatim",
                }
    except Exception:
        pass

    return {
        "road": f"Roadway ({lat:.4f}, {lon:.4f})",
        "city": "District Division",
        "display_name": f"Coordinates {lat:.5f}, {lon:.5f}",
        "source": "Geographic Coordinate Fallback",
    }
