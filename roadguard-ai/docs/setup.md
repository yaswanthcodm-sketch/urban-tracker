# RoadGuard AI — Setup & Quickstart Guide

This guide provides step-by-step instructions for running RoadGuard AI locally.

---

## 1. Prerequisites

- Python 3.10+ (tested with Python 3.10 to 3.14)
- Pip and virtualenv
- Standard web browser (Chrome, Edge, Firefox, Safari)
- Optional: MySQL 8.0+ (SQLite is provided and works immediately out-of-the-box)

---

## 2. Installation

1. Navigate to the project directory:
   ```bash
   cd roadguard-ai
   ```

2. (Optional) Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate    # On Windows: venv\Scripts\activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

---

## 3. Configuration

Review or copy the default environment configuration:
```bash
cp .env.example .env
```

Default settings in `.env`:
- `DATABASE_URL=sqlite:///./roadguard.db` (Default SQLite database created automatically)
- `DEMO_MODE=True`
- `SECRET_KEY=roadguard-ai-secret-key-super-secure-change-in-production`

To use MySQL instead of SQLite:
1. Ensure MySQL server is running and create a database:
   ```sql
   CREATE DATABASE roadguard_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. In `.env`, change:
   ```ini
   DATABASE_URL=mysql+pymysql://root:password@localhost:3306/roadguard_ai
   ```

---

## 4. Database Initialization & Demo Data

Populate the database with realistic road authorities (NHAI, PWD, Municipalities), configured CCTV stations, active complaints, inspections, and verified repairs:

```bash
python3 database/seed_demo_data.py
```

---

## 5. Starting the Application

Launch the FastAPI web server from the `roadguard-ai` folder:

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 6. Accessing the Platform

Open your browser and navigate to:

- **Landing Page**: [http://localhost:8000/static/index.html](http://localhost:8000/static/index.html)
- **Live Analytics Dashboard**: [http://localhost:8000/static/dashboard.html](http://localhost:8000/static/dashboard.html)
- **AI Defect Detection**: [http://localhost:8000/static/detect.html](http://localhost:8000/static/detect.html)
- **CCTV Highway Feeds**: [http://localhost:8000/static/cameras.html](http://localhost:8000/static/cameras.html)
- **Satellite Corridor Screening**: [http://localhost:8000/static/satellite.html](http://localhost:8000/static/satellite.html)
- **Interactive Damage Map**: [http://localhost:8000/static/map.html](http://localhost:8000/static/map.html)
- **Citizen Report Portal**: [http://localhost:8000/static/report.html](http://localhost:8000/static/report.html)
- **Complaint Tracking**: [http://localhost:8000/static/track.html](http://localhost:8000/static/track.html)
- **Officer & Inspector Portal**: [http://localhost:8000/static/admin.html](http://localhost:8000/static/admin.html)
- **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 7. Default Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@roadguard.ai` | `AdminPass123!` | System configuration, reports, all actions |
| **Senior Inspector** | `inspector.sharma@pwd.gov.in` | `InspectorPass123!` | Field surveys, AI review, repair verification |
| **Citizen Reporter** | `rajesh.patel@gmail.com` | `CitizenPass123!` | Report submission, public tracking |
