# RoadGuard AI — Smart Road Intelligence & Repair Tracking System

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python)](https://python.org)
[![OpenCV](https://img.shields.io/badge/Vision-OpenCV%20%2B%20YOLO-green.svg?logo=opencv)](https://opencv.org)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet.js-brightgreen.svg?logo=leaflet)](https://leafletjs.com)
[![Tests](https://img.shields.io/badge/Tests-Pytest%20Passing-success.svg)](https://docs.pytest.org)
[![Mode](https://img.shields.io/badge/Mode-Academic%20Demonstration-orange.svg)](#)

> **Detect Road Damage. Track Repairs. Build Safer Roads.**
> A complete, functional full-stack web application designed for students, researchers, municipal authorities, and hackathon demonstrations.

---

## 1. Project Overview

RoadGuard AI is a centralized platform that bridges the gap between road users, automated inspection vehicles, and public works authorities. 

Key capabilities:
1. **Multi-Source Detection**: Detects potholes, cracks (longitudinal, transverse, alligator), and road shoulder damage from user photographs, video surveys, highway CCTV feeds, and satellite screening.
2. **Geospatial Precision & Duplicate Prevention**: Captures verified coordinates, performs reverse geocoding, and alerts users if a similar unresolved complaint exists within 50 meters.
3. **Structured Complaint Lifecycle**: Generates unique tracking IDs (`RD-YYYY-XXXXXX`) and maps jurisdictions to the responsible entity (NHAI, State PWD, Urban Municipal Corporation).
4. **Independent Repair Verification**: Employs before-and-after computer vision texture analysis to evaluate asphalt restoration before complaints are certified as `Resolved`.
5. **Interactive Mapping & Analytics**: Provides a responsive Leaflet GIS damage map, live Chart.js analytics dashboard, and automated SLA escalation alerts.

---

## 2. Technology Stack

- **Frontend**: HTML5, CSS3 (Modern public infrastructure theme), ES6 JavaScript, Leaflet.js, Chart.js.
- **Backend**: Python 3, FastAPI, SQLAlchemy ORM, Pydantic v2, RESTful architecture.
- **Database**: SQLite (default instant-run local fallback) and MySQL 8.0+ ready.
- **AI & Computer Vision**: OpenCV contour and morphology vision analyzer (active out-of-the-box fallback) + Ultralytics YOLO model adapter.
- **Geospatial Services**: Leaflet.js, OpenStreetMap tiles, Haversine proximity calculation.

---

## 3. Web Pages & Functional Workflows

| Page | URL | Purpose |
|---|---|---|
| **1. Landing Page** | `/static/index.html` | Hero overview, live metric badges, 4-step governance workflow, technology stack. |
| **2. Main Dashboard** | `/static/dashboard.html` | 8 database-backed KPI counters, severity breakdown donut, monthly trends, department performance table. |
| **3. AI Detection** | `/static/detect.html` | Photo/video upload, canvas bounding boxes, confidence score, severity classifier, inspector review & complaint promotion. |
| **4. CCTV Monitoring** | `/static/cameras.html` | Highway toll camera list, heartbeat indicators, frame capture, live distress detection, credentials masked. |
| **5. Satellite Screening** | `/static/satellite.html` | Interactive Area of Interest (AOI) selection, multi-spectral reflectance screening, corridor anomaly marking. |
| **6. Damage Map** | `/static/map.html` | Leaflet interactive GIS map, color-coded severity markers, popups, filters, and inspection drawer. |
| **7. Citizen Portal** | `/static/report.html` | Citizen complaint intake with photo upload, draggable map pin, GPS geolocation, and 50m duplicate detection alert. |
| **8. Track Complaint** | `/static/track.html` | Public complaint lookup by ID (`RD-YYYY-XXXXXX`), lifecycle audit trail, before/after repair verification viewer. |
| **9. Officer Portal** | `/static/admin.html` | Authority operations: acknowledge complaints, schedule field surveys, record contractor repairs, and approve verification. |
| **Swagger API Docs** | `/docs` | Interactive OpenAPI documentation for all backend REST endpoints. |

---

## 4. Quickstart (Under 2 Minutes)

### 1. Install Dependencies
```bash
cd roadguard-ai
pip install -r backend/requirements.txt
```

### 2. Seed Demo Database
Populate realistic departments (NHAI, PWD, GHMC), configured highway CCTV stations, initial complaints, and repairs:
```bash
python3 database/seed_demo_data.py
```

### 3. Start Server
```bash
cd backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Open [http://localhost:8000/static/index.html](http://localhost:8000/static/index.html) in your browser!

---

## 5. Automated Tests

Run the full pytest suite:
```bash
cd backend
PYTHONPATH=. pytest app/tests/ -v
```

All 7 test suites verify authentication, duplicate detection, AI vision contours, complaint lifecycle, repair verification, and database analytics.

---

## 6. Project Architecture & Documentation

- [System Architecture](file:///Users/yaswanth/Downloads/gods-eye-view-0.1.1/roadguard-ai/docs/architecture.md)
- [API & Integrations](file:///Users/yaswanth/Downloads/gods-eye-view-0.1.1/roadguard-ai/docs/api-integrations.md)
- [Setup & Quickstart](file:///Users/yaswanth/Downloads/gods-eye-view-0.1.1/roadguard-ai/docs/setup.md)
- [Testing Guide](file:///Users/yaswanth/Downloads/gods-eye-view-0.1.1/roadguard-ai/docs/testing.md)
- [ML Pipeline & YOLO Training](file:///Users/yaswanth/Downloads/gods-eye-view-0.1.1/roadguard-ai/ml/README.md)

---

## 7. Academic & Demonstration Notice

RoadGuard AI explicitly distinguishes between demonstration mode and production government integrations. In demo mode (`DEMO_MODE=True`), external municipal submissions generate standardized mock JSON payloads without modifying external government servers, ensuring high educational demonstration value and security.
