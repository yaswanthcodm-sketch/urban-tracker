# RoadGuard AI — API & External System Integrations

---

## 1. REST API Specification

### Authentication
- `POST /api/auth/register`: Create user account (`name`, `email`, `password`, `role`).
- `POST /api/auth/login`: Authenticate and receive JWT bearer token.
- `GET /api/auth/me`: Get profile of logged-in user.

### AI Detection Engine
- `POST /api/detections/upload`: Upload image (`multipart/form-data`), run vision detection, return bounding boxes, severity, and annotated image path.
- `POST /api/detections/video`: Upload video file, sample keyframes at interval, extract defects.
- `GET /api/detections`: List detection events with optional `review_status` or `defect_type` query filters.
- `GET /api/detections/{id}`: Single detection detail.
- `PUT /api/detections/{id}/review`: Quality review (`confirmed`, `corrected`, `rejected`).
- `POST /api/detections/{id}/generate-complaint`: Convert detection into an official complaint with tracking ID.

### Complaints Management
- `POST /api/complaints/check-duplicate`: Check if active complaint exists within 50m and 30 days.
- `POST /api/complaints`: Lodge new complaint (with optional `allow_duplicate=true`).
- `GET /api/complaints`: Query registered complaints with status, severity, department, search, and pagination.
- `GET /api/complaints/{id}`: Full complaint dossier with history, inspections, repairs, verifications.
- `GET /api/complaints/track/{tracking_id}`: Public tracking endpoint by ID (e.g., `RD-2026-A109F2`).
- `PUT /api/complaints/{id}/status`: Advance status with state validation and history logging.
- `POST /api/complaints/{id}/dispatch-simulation`: Generate outward municipal dispatch payload.

### CCTV Highway Surveillance
- `GET /api/cameras`: List registered surveillance stations with credentials masked.
- `POST /api/cameras`: Add new camera (RTSP, HTTP, or demo stream).
- `POST /api/cameras/{id}/test-connection`: Non-blocking connectivity ping.
- `POST /api/cameras/{id}/capture-and-detect`: Capture frame and run immediate AI distress detection.

### Field Inspections, Contractor Repairs & Verification
- `POST /api/complaints/{id}/inspections`: Log on-site physical inspection.
- `POST /api/complaints/{id}/repairs`: Log paving crew progress and upload completion photo.
- `POST /api/complaints/{id}/verifications`: Execute before-and-after texture comparison and approve/reject repair.

### Geospatial & Satellite Screening
- `POST /api/satellite/analyze-aoi`: Screen regional Area of Interest for macroscopic surface washouts.

### Analytics & Reports
- `GET /api/analytics/overview`: Aggregate statistics, SLA compliance, severity breakdown, and monthly velocity.
- `GET /api/analytics/export-csv`: Download standard CSV audit register.
- `POST /api/notifications/scan-escalations`: Trigger automatic SLA breach check.

---

## 2. Official Grievance Portals (Simulation vs. Production)

In accordance with responsible engineering practices, RoadGuard AI clearly demarcates demonstration modes:

- **Academic Demonstration Mode (`DEMO_MODE=True`)**:
  - Outward submissions generate mock payloads adhering to CPGRAMS / State PWD data schemas.
  - Return simulated tracking references (e.g. `SIM-GOV-XXXXXX`).
  - No external production government databases are modified.
- **Production Mode (`DEMO_MODE=False`)**:
  - Connects to authorized department endpoints using secure backend API keys defined in `.env`.
