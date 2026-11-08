# RoadGuard AI — System Architecture & Design Document

RoadGuard AI is a centralized, full-stack smart road distress detection, automated complaint registration, and repair verification platform designed for academic and public infrastructure evaluation.

---

## 1. High-Level System Architecture

```
[Citizen Upload / Video / CCTV RTSP / Satellite AOI]
                         │
                         ▼
             [FastAPI REST Gateway]
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
[AI Vision Engine]  [GIS Engine]   [Grievance Engine]
  - OpenCV Morphology - Haversine    - Unique Tracking ID (RD-YYYY-XXXXXX)
  - YOLO Adapter       - Reverse Geo - SLA Enforcement & Authority Match
  - Bounding Boxes    - 50m Dup Chk  - Dispatch Simulation (Safe Mock)
      │                  │                  │
      └──────────────────┼──────────────────┘
                         ▼
           [Persistent Storage Layer]
         - SQLite (Default Local Dev)
         - MySQL (Production Ready)
         - Local / S3 Upload Storage
                         │
                         ▼
        [Verification & Redressal Loop]
         - Field Survey / Drone Survey
         - Contractor Asphalt Paving Log
         - Before/After Computer Vision Comparison
         - Independent Quality Certification
```

---

## 2. Key Modules & Functional Separation

### 2.1 AI Defect Detection Pipeline
- **Dual Mode**:
  - `OpenCV Morphological & Contour Analyzer`: Performs grayscale road texture analysis, edge gradient extraction, and depression contour bounding box generation without heavy external model files.
  - `Ultralytics YOLO Adapter`: Configured to load weights from `ml/weights/best.pt` when available.
- **Severity vs. Confidence**: Kept strictly distinct.
  - *Confidence* indicates neural/algorithmic certainty (0.0 to 1.0).
  - *Severity* is evaluated through geometric surface area percentage relative to the road lane (`Low`, `Medium`, `High`, `Critical`).

### 2.2 Geospatial & Duplicate Prevention
- **Haversine Proximity Check**: Every submitted or detected defect is checked against open complaints within a 50-meter radius over the last 30 days.
- **Clear Actionable Warning**: Instead of silently deleting or dropping duplicate reports, the system alerts the citizen and provides a direct link to the existing complaint's live tracking record, with an option to proceed if they believe it is a distinct hazard.

### 2.3 Jurisdiction & Road Ownership Resolution
- Maps road classification patterns to the responsible entity:
  - `National Highway (NH)` &rarr; **National Highways Authority of India (NHAI)** (48h SLA)
  - `State Highway (SH)` &rarr; **State Public Works Department (PWD)** (72h SLA)
  - `Urban Streets / Roads` &rarr; **Municipal Corporation (GHMC / VMC)** (24–36h SLA)
  - `Rural / Gram Roads` &rarr; **PMGSY Rural Agency** (120h SLA)
- **Safe Simulation Demarcation**: Outward submissions to government portals (e.g. CPGRAMS / State grievance gateways) are executed in explicit `Demo Simulation Mode` with mock JSON payloads to ensure system integrity.

### 2.4 Independent Repair Verification
- A repair is not certified merely upon contractor claim.
- The contractor uploads post-repair photographic evidence.
- The `VerificationService` runs a Canny edge and pixel difference algorithm comparing before-and-after texture smoothness, producing a composite side-by-side verification image and restoration index.
- An independent quality auditor reviews the composite image before marking the complaint `Resolved`.

---

## 3. Database Schema Overview

The database utilizes relational entities linked via foreign keys:
- `users`: Authentication, roles (`citizen`, `inspector`, `department_officer`, `admin`).
- `departments`: Authorities, contact endpoints, SLA deadlines, escalation rules.
- `cameras`: CCTV stations, masked stream URLs, geospatial coordinates, heartbeat timestamps.
- `detections`: Vision results, bounding boxes (JSON), severity, annotated evidence paths.
- `complaints`: Public tracking IDs (`RD-YYYY-XXXXXX`), lifecycle states, coordinates, priority.
- `complaint_status_history`: Tamper-evident transition logs with timestamp, actor, and rationale.
- `inspections`: Physical/drone survey logs with inspector findings and results.
- `repairs`: Contractor dispatch, paving specifications, work completion proof.
- `verifications`: Auditor quality approval, before/after evidence references, similarity scores.
- `notifications`: In-app and escalation alerts.
- `audit_logs`: System-wide audit trail.
