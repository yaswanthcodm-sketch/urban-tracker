# RoadGuard AI — Testing & Quality Assurance Suite

---

## 1. Running Automated Tests

RoadGuard AI includes automated test coverage powered by `pytest` and `fastapi.testclient`.

To execute the test suite:

```bash
cd roadguard-ai/backend
PYTHONPATH=. pytest app/tests/ -v
```

---

## 2. Test Coverage Matrix

The automated tests verify:

1. **System Health (`test_health_check`)**:
   - Confirms server responsiveness, database connection, and storage directory availability.
2. **Authentication & JWT (`test_auth_registration_and_login`)**:
   - Verifies user registration, bcrypt password hashing, and token issuance.
3. **Duplicate Detection Engine (`test_duplicate_detection_logic`)**:
   - Validates Haversine spatial proximity matching:
     - Complaints within 50 meters and 30 days trigger duplicate detection.
     - Complaints farther away (>50m) are recognized as distinct locations.
4. **Complaint Lifecycle (`test_complaint_tracking_and_lifecycle`)**:
   - Tests unique tracking ID assignment (`RD-YYYY-XXXXXX`).
   - Verifies public tracking lookup.
   - Enforces valid status transitions (`Submitted` &rarr; `Acknowledged`) and rejects invalid state jumps (`Submitted` &rarr; `Closed`).
5. **Computer Vision & Severity (`test_ai_detection_service_contour_and_severity`)**:
   - Runs morphological contour detection on synthetic asphalt defect images.
   - Confirms bounding box generation, defect classification, and severity scoring.
6. **Repair Verification Engine (`test_verification_service_repair_comparison`)**:
   - Computes structural surface restoration metric between damaged and restored asphalt.
   - Confirms creation of composite side-by-side evidence images.
7. **Analytics Overview (`test_analytics_overview`)**:
   - Confirms database-backed metric calculation, severity breakdowns, and department performance aggregations.

---

## 3. Frontend & Integration Testing

The frontend pages can be tested directly in the browser:
1. Open `http://localhost:8000/static/index.html`.
2. Navigate to **AI Detection** (`/static/detect.html`), upload an asphalt image, and verify bounding box rendering.
3. Promote the detection to an official complaint and follow the link to **Track Complaint** (`/static/track.html`).
4. In **Officer Portal** (`/static/admin.html`), schedule an inspection, record a repair with evidence, and approve verification.
5. In **Damage Map** (`/static/map.html`), verify that the marker changes from Critical/Amber to Green (Resolved).
