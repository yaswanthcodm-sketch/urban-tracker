"""
RoadGuard AI — Backend Test Suite
Verifies API endpoints, authentication, duplicate detection, AI detection engine, and verification.
"""
import os
import pytest
import numpy as np
import cv2
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.services.ai_detection import ai_detection_service
from app.services.verification_service import verification_service
from app.services.complaint_service import complaint_service

# Test database
TEST_DB_URL = "sqlite:///./test_roadguard.db"
test_engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)
    if os.path.exists("./test_roadguard.db"):
        os.remove("./test_roadguard.db")


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_auth_registration_and_login():
    email = "tester@roadguard.ai"
    reg_payload = {
        "name": "Quality Assurance Engineer",
        "email": email,
        "password": "SecurePassword123!",
        "role": "inspector",
    }
    r = client.post("/api/auth/register", json=reg_payload)
    assert r.status_code == 201
    data = r.json()
    assert data["email"] == email

    # Login
    login_payload = {
        "email": email,
        "password": "SecurePassword123!",
    }
    lr = client.post("/api/auth/login", json=login_payload)
    assert lr.status_code == 200
    token_data = lr.json()
    assert "access_token" in token_data


def test_duplicate_detection_logic():
    # First complaint
    c1_payload = {
        "defect_type": "Pothole",
        "description": "Deep depression at intersection",
        "latitude": 17.385044,
        "longitude": 78.486671,
        "road_name": "Inner Ring Road",
        "severity": "High",
    }
    r1 = client.post("/api/complaints", json=c1_payload)
    assert r1.status_code == 201
    tracking_id = r1.json()["public_tracking_id"]

    # Duplicate check within 20 meters
    dup_check = {
        "latitude": 17.385100,  # ~6-8 meters away
        "longitude": 78.486690,
        "defect_type": "Pothole",
        "threshold_meters": 50.0,
    }
    dr = client.post("/api/complaints/check-duplicate", json=dup_check)
    assert dr.status_code == 200
    res = dr.json()
    assert res["is_duplicate"] is True
    assert len(res["existing_complaints"]) >= 1

    # Far location should NOT be duplicate
    far_check = {
        "latitude": 17.450000,
        "longitude": 78.550000,
        "defect_type": "Pothole",
        "threshold_meters": 50.0,
    }
    far_res = client.post("/api/complaints/check-duplicate", json=far_check).json()
    assert far_res["is_duplicate"] is False


def test_complaint_tracking_and_lifecycle():
    c_payload = {
        "defect_type": "Alligator cracking",
        "description": "Subgrade failure on express lane",
        "latitude": 16.5100,
        "longitude": 80.6400,
        "road_name": "NH-65 Highway Sector",
        "severity": "Medium",
    }
    create_res = client.post("/api/complaints", json=c_payload)
    assert create_res.status_code == 201
    c_data = create_res.json()
    cid = c_data["id"]
    tid = c_data["public_tracking_id"]

    # Public tracking lookup
    track_res = client.get(f"/api/complaints/track/{tid}")
    assert track_res.status_code == 200
    track_data = track_res.json()
    assert track_data["public_tracking_id"] == tid
    assert len(track_data["status_history"]) >= 1

    # Status update: Submitted -> Acknowledged
    stat_up = client.put(f"/api/complaints/{cid}/status", json={"status": "Acknowledged", "notes": "Noted by PWD control room"})
    assert stat_up.status_code == 200
    assert stat_up.json()["new_status"] == "Acknowledged"

    # Invalid status jump should fail
    bad_stat = client.put(f"/api/complaints/{cid}/status", json={"status": "Closed", "notes": "Closing without repair"})
    assert bad_stat.status_code == 400


def test_ai_detection_service_contour_and_severity():
    # Create test synthetic road image with pothole
    h, w = 400, 500
    img = np.ones((h, w, 3), dtype=np.uint8) * 80
    # Add dark pothole ellipse
    cv2.ellipse(img, (250, 200), (60, 40), 0, 0, 360, (25, 25, 25), -1)

    test_img_path = "/tmp/test_pothole_ai.jpg"
    out_annotated_path = "/tmp/test_pothole_annotated.jpg"
    cv2.imwrite(test_img_path, img)

    result = ai_detection_service.detect_image(
        image_path=test_img_path,
        save_annotated_path=out_annotated_path,
    )
    assert "boxes" in result
    assert result["primary_defect_type"] in ["Pothole", "Road crack", "Alligator cracking", "Damaged road edge", "Other visible road damage"]
    assert result["confidence"] > 0.3
    assert result["estimated_severity"] in ["Low", "Medium", "High", "Critical"]
    assert os.path.exists(out_annotated_path)

    # Cleanup
    if os.path.exists(test_img_path):
        os.remove(test_img_path)
    if os.path.exists(out_annotated_path):
        os.remove(out_annotated_path)


def test_verification_service_repair_comparison():
    # Before image: damaged asphalt
    before_img = np.ones((300, 400, 3), dtype=np.uint8) * 80
    cv2.ellipse(before_img, (200, 150), (50, 30), 0, 0, 360, (20, 20, 20), -1)
    before_path = "/tmp/test_before.jpg"
    cv2.imwrite(before_path, before_img)

    # After image: clean restored bitumen
    after_img = np.ones((300, 400, 3), dtype=np.uint8) * 75
    cv2.ellipse(after_img, (200, 150), (55, 35), 0, 0, 360, (40, 40, 40), -1)
    after_path = "/tmp/test_after.jpg"
    cv2.imwrite(after_path, after_img)

    composite_path = "/tmp/test_composite.jpg"
    v_res = verification_service.verify_repair(
        before_image_path=before_path,
        after_image_path=after_path,
        composite_output_path=composite_path,
    )
    assert "similarity_score" in v_res
    assert v_res["similarity_score"] >= 0.0
    assert os.path.exists(composite_path)

    # Cleanup
    for p in [before_path, after_path, composite_path]:
        if os.path.exists(p):
            os.remove(p)


def test_analytics_overview():
    res = client.get("/api/analytics/overview")
    assert res.status_code == 200
    data = res.json()
    assert "total_complaints" in data
    assert "severity_distribution" in data
    assert "department_performance" in data
