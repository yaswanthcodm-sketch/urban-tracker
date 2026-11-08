"""
RoadGuard AI — Demo Seed Data Generator
Populates realistic users, departments, cameras, detections, complaints, inspections, and repairs.
"""
import os
import sys
import numpy as np
import cv2
from datetime import datetime, timedelta

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.database import SessionLocal, init_db
from app.config import settings
from app.models.models import (
    User,
    Department,
    Camera,
    Detection,
    Complaint,
    ComplaintStatusHistory,
    Inspection,
    Repair,
    Verification,
    Notification,
    UserRole,
    DefectType,
    SeverityLevel,
    PriorityLevel,
    ComplaintStatus,
)
from app.security.auth import get_password_hash


def create_sample_damage_image(filename: str, defect_type: str) -> str:
    """Generate an authentic road distress visual evidence image for the demo."""
    os.makedirs(settings.EVIDENCE_DIR, exist_ok=True)
    filepath = os.path.join(settings.EVIDENCE_DIR, filename)
    if os.path.exists(filepath):
        return f"/uploads/evidence/{filename}"

    h, w = 480, 640
    img = np.ones((h, w, 3), dtype=np.uint8) * 85
    noise = np.random.randint(-18, 18, (h, w, 3), dtype=np.int16)
    img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    # Lane marking
    cv2.line(img, (w // 2, 0), (w // 2, h), (210, 210, 210), 3)

    if defect_type == "Pothole":
        cv2.ellipse(img, (320, 260), (75, 45), 10, 0, 360, (30, 30, 30), -1)
        cv2.ellipse(img, (320, 260), (75, 45), 10, 0, 360, (55, 55, 55), 3)
    elif defect_type == "Alligator cracking":
        for i in range(5):
            pts = np.array([
                [240 + i * 30, 200 + i * 15],
                [270 + i * 25, 230 + i * 20],
                [310 + i * 20, 260 + i * 15],
                [350 + i * 15, 290 + i * 10],
            ], np.int32)
            cv2.polylines(img, [pts], False, (25, 25, 25), 2)
    elif defect_type == "Damaged road edge":
        cv2.rectangle(img, (0, 0), (90, h), (95, 80, 50), -1)
        pts = np.array([[90, 100], [130, 180], [80, 260], [140, 350], [90, 480]], np.int32)
        cv2.polylines(img, [pts], False, (20, 20, 20), 4)
    else:
        pts = np.array([[180, 100], [240, 220], [310, 320], [420, 460]], np.int32)
        cv2.polylines(img, [pts], False, (20, 20, 20), 3)

    # Overlay metadata bar
    cv2.putText(
        img,
        f"RoadGuard AI Evidence | {defect_type.upper()} | GPS Verified",
        (15, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (0, 230, 255),
        2,
    )
    cv2.imwrite(filepath, img)
    return f"/uploads/evidence/{filename}"


def create_sample_repair_image(filename: str) -> str:
    """Generate a clean newly patched asphalt image for repair verification."""
    os.makedirs(settings.REPAIRS_DIR, exist_ok=True)
    filepath = os.path.join(settings.REPAIRS_DIR, filename)
    if os.path.exists(filepath):
        return f"/uploads/repairs/{filename}"

    h, w = 480, 640
    img = np.ones((h, w, 3), dtype=np.uint8) * 80
    noise = np.random.randint(-10, 10, (h, w, 3), dtype=np.int16)
    img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    # Fresh smooth dark bitumen patch
    cv2.ellipse(img, (320, 260), (85, 55), 10, 0, 360, (38, 38, 38), -1)
    cv2.ellipse(img, (320, 260), (85, 55), 10, 0, 360, (50, 50, 50), 2)
    cv2.line(img, (w // 2, 0), (w // 2, h), (220, 220, 220), 3)

    cv2.putText(
        img,
        "COMPLETED REPAIR EVIDENCE | ASPHALT OVERLAY RESTORED",
        (15, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (50, 255, 100),
        2,
    )
    cv2.imwrite(filepath, img)
    return f"/uploads/repairs/{filename}"


def seed():
    print("Initializing RoadGuard AI database...")
    init_db()
    db = SessionLocal()

    try:
        # 1. Seed Users
        if db.query(User).count() == 0:
            print("Seeding default platform users...")
            users = [
                User(
                    name="System Administrator",
                    email="admin@roadguard.ai",
                    password_hash=get_password_hash("AdminPass123!"),
                    role=UserRole.ADMIN.value,
                    account_status="active",
                ),
                User(
                    name="Er. Sharma (Senior Inspector)",
                    email="inspector.sharma@pwd.gov.in",
                    password_hash=get_password_hash("InspectorPass123!"),
                    role=UserRole.INSPECTOR.value,
                    account_status="active",
                ),
                User(
                    name="Rajesh Patel (Citizen Reporter)",
                    email="rajesh.patel@gmail.com",
                    password_hash=get_password_hash("CitizenPass123!"),
                    role=UserRole.CITIZEN.value,
                    account_status="active",
                ),
            ]
            db.add_all(users)
            db.commit()

        # 2. Seed Departments
        if db.query(Department).count() == 0:
            print("Seeding government road authorities...")
            departments = [
                Department(
                    name="National Highways Authority of India (NHAI)",
                    jurisdiction_reference="National Highway",
                    contact_configuration="regional.officer@nhai.org / API Gateway v2",
                    integration_status="Demo Simulation Mode",
                    sla_hours=48,
                    escalation_rules="Auto-escalate to Chief Project Manager after 36 hours",
                    is_active=True,
                ),
                Department(
                    name="State PWD (Roads & Buildings) - AP & TS",
                    jurisdiction_reference="State Highway",
                    contact_configuration="ee.pwd@state.gov.in",
                    integration_status="Demo Simulation Mode",
                    sla_hours=72,
                    escalation_rules="Auto-escalate to Superintending Engineer after 48 hours",
                    is_active=True,
                ),
                Department(
                    name="Greater Hyderabad Municipal Corporation (GHMC)",
                    jurisdiction_reference="Urban Municipal Corporation",
                    contact_configuration="grievance.roads@ghmc.gov.in",
                    integration_status="Demo Simulation Mode",
                    sla_hours=24,
                    escalation_rules="Auto-escalate to Zonal Commissioner after 20 hours",
                    is_active=True,
                ),
                Department(
                    name="Vijayawada Municipal Corporation (VMC)",
                    jurisdiction_reference="Urban Municipal Corporation",
                    contact_configuration="roads@vmc.gov.in",
                    integration_status="Demo Simulation Mode",
                    sla_hours=36,
                    escalation_rules="Auto-escalate to Deputy Commissioner after 24 hours",
                    is_active=True,
                ),
                Department(
                    name="PMGSY Rural Road Development Agency",
                    jurisdiction_reference="Rural & District Road",
                    contact_configuration="pmgsy.district@nic.in",
                    integration_status="Demo Simulation Mode",
                    sla_hours=120,
                    escalation_rules="Auto-escalate to District Collector after 96 hours",
                    is_active=True,
                ),
            ]
            db.add_all(departments)
            db.commit()

        # 3. Seed Cameras
        if db.query(Camera).count() == 0:
            print("Seeding CCTV monitoring stations...")
            cameras = [
                Camera(
                    name="NH-65 Vijayawada Toll Plaza Highway Cam-01",
                    stream_configuration_reference="rtsp://traffic_admin:SecurePass2026@192.168.10.101:554/h264Preview",
                    latitude=16.5193,
                    longitude=80.6305,
                    road_segment_id="NH65-VJA-KM24",
                    connection_status="online",
                    last_seen_at=datetime.utcnow(),
                    feed_type="stream",
                ),
                Camera(
                    name="Outer Ring Road (ORR) Gachibowli Junction Cam-04",
                    stream_configuration_reference="rtsp://hyd_traffic:LiveStream2026@192.168.12.44:554/live",
                    latitude=17.4401,
                    longitude=78.3489,
                    road_segment_id="ORR-HYD-SEC08",
                    connection_status="online",
                    last_seen_at=datetime.utcnow(),
                    feed_type="stream",
                ),
                Camera(
                    name="SH-42 Nuzvid Town Bypass Cam-02",
                    stream_configuration_reference="rtsp://nuzvid_muni:pwdcam2@192.168.15.22:554/ch1",
                    latitude=16.7925,
                    longitude=80.8465,
                    road_segment_id="SH42-NZV-SEC01",
                    connection_status="online",
                    last_seen_at=datetime.utcnow(),
                    feed_type="demo_loop",
                ),
                Camera(
                    name="MG Road Metro Pillar 128 Urban Cam-03",
                    stream_configuration_reference="https://streams.traffic.gov.in/live/mgroad_p128.m3u8",
                    latitude=16.5062,
                    longitude=80.6480,
                    road_segment_id="VMC-MGR-P128",
                    connection_status="online",
                    last_seen_at=datetime.utcnow(),
                    feed_type="stream",
                ),
                Camera(
                    name="NH-44 Hyderabad - Nagpur Expressway Toll Cam-07",
                    stream_configuration_reference="rtsp://nhai_cr:secure99@192.168.18.99:554/feed",
                    latitude=17.5842,
                    longitude=78.4712,
                    road_segment_id="NH44-MED-KM42",
                    connection_status="online",
                    last_seen_at=datetime.utcnow(),
                    feed_type="stream",
                ),
            ]
            db.add_all(cameras)
            db.commit()

        # 4. Seed Complaints & Status Lifecycle
        if db.query(Complaint).count() == 0:
            print("Seeding complaints and complete lifecycle history...")
            nhai = db.query(Department).filter(Department.name.ilike("%NHAI%")).first()
            pwd = db.query(Department).filter(Department.name.ilike("%PWD%")).first()
            ghmc = db.query(Department).filter(Department.name.ilike("%GHMC%")).first()

            # Evidence images
            ev1 = create_sample_damage_image("pothole_nh65_km24.jpg", "Pothole")
            ev2 = create_sample_damage_image("alligator_orr_hyd.jpg", "Alligator cracking")
            ev3 = create_sample_damage_image("edge_erosion_sh42.jpg", "Damaged road edge")
            ev4 = create_sample_damage_image("transverse_mgroad.jpg", "Transverse crack")
            repair_ev = create_sample_repair_image("repaired_pothole_nh65.jpg")

            complaints_data = [
                {
                    "tracking_id": "RD-2026-A109F2",
                    "source": "ai_cctv",
                    "defect": "Pothole",
                    "severity": SeverityLevel.CRITICAL.value,
                    "priority": PriorityLevel.P1_CRITICAL.value,
                    "road": "NH-65 Vijayawada - Hyderabad Corridor (KM 24.6)",
                    "lat": 16.5195,
                    "lon": 80.6308,
                    "dept": nhai.id if nhai else 1,
                    "status": ComplaintStatus.REPAIR_IN_PROGRESS.value,
                    "evidence": ev1,
                    "desc": "Severe pothole depression detected by highway CCTV Cam-01. Poses immediate rollover risk for two-wheelers.",
                },
                {
                    "tracking_id": "RD-2026-B884C1",
                    "source": "citizen_report",
                    "defect": "Alligator cracking",
                    "severity": SeverityLevel.HIGH.value,
                    "priority": PriorityLevel.P2_HIGH.value,
                    "road": "Gachibowli Outer Ring Road Slip Way",
                    "lat": 17.4410,
                    "lon": 78.3495,
                    "dept": ghmc.id if ghmc else 3,
                    "status": ComplaintStatus.AWAITING_VERIFICATION.value,
                    "evidence": ev2,
                    "desc": "Extensive alligator cracking spanning 14 meters. Base subgrade failure suspected after monsoon rains.",
                },
                {
                    "tracking_id": "RD-2026-C447E9",
                    "source": "ai_upload",
                    "defect": "Damaged road edge",
                    "severity": SeverityLevel.MEDIUM.value,
                    "priority": PriorityLevel.P3_NORMAL.value,
                    "road": "SH-42 Nuzvid - Hanuman Junction Road",
                    "lat": 16.7930,
                    "lon": 80.8470,
                    "dept": pwd.id if pwd else 2,
                    "status": ComplaintStatus.INSPECTION_SCHEDULED.value,
                    "evidence": ev3,
                    "desc": "Road shoulder eroded after heavy runoff. Narrowing usable lane width by 0.6 meters.",
                },
                {
                    "tracking_id": "RD-2026-D912A4",
                    "source": "citizen_report",
                    "defect": "Pothole",
                    "severity": SeverityLevel.HIGH.value,
                    "priority": PriorityLevel.P2_HIGH.value,
                    "road": "MG Road Near Pillar 128, Vijayawada",
                    "lat": 16.5065,
                    "lon": 80.6482,
                    "dept": pwd.id if pwd else 2,
                    "status": ComplaintStatus.RESOLVED.value,
                    "evidence": ev4,
                    "desc": "Deep cavity causing vehicular rim damage and bottleneck traffic during rush hour.",
                },
                {
                    "tracking_id": "RD-2026-E553B8",
                    "source": "satellite_scan",
                    "defect": "Other visible road damage",
                    "severity": SeverityLevel.MEDIUM.value,
                    "priority": PriorityLevel.P3_NORMAL.value,
                    "road": "NH-44 Medchal Industrial Bypass Corridor",
                    "lat": 17.5850,
                    "lon": 78.4720,
                    "dept": nhai.id if nhai else 1,
                    "status": ComplaintStatus.SUBMITTED.value,
                    "evidence": ev1,
                    "desc": "Corridor screening anomaly detected by high-resolution optical reflectance analysis.",
                },
            ]

            now = datetime.utcnow()
            for c_data in complaints_data:
                c = Complaint(
                    public_tracking_id=c_data["tracking_id"],
                    source_type=c_data["source"],
                    defect_type=c_data["defect"],
                    description=c_data["desc"],
                    latitude=c_data["lat"],
                    longitude=c_data["lon"],
                    road_name=c_data["road"],
                    severity=c_data["severity"],
                    priority=c_data["priority"],
                    responsible_department_id=c_data["dept"],
                    current_status=c_data["status"],
                    reporter_name="RoadGuard AI Patrol / Citizen",
                    evidence_path=c_data["evidence"],
                    target_resolution_at=now + timedelta(hours=48),
                    created_at=now - timedelta(days=2),
                    updated_at=now - timedelta(hours=4),
                )
                db.add(c)
                db.flush()

                # Add initial creation status history
                h1 = ComplaintStatusHistory(
                    complaint_id=c.id,
                    previous_status=None,
                    new_status=ComplaintStatus.SUBMITTED.value,
                    changed_by="RoadGuard AI Engine",
                    notes="Damage detected and registered in central repository.",
                    changed_at=c.created_at,
                )
                db.add(h1)

                # Add progression histories according to target status
                if c_data["status"] in [
                    ComplaintStatus.INSPECTION_SCHEDULED.value,
                    ComplaintStatus.REPAIR_IN_PROGRESS.value,
                    ComplaintStatus.AWAITING_VERIFICATION.value,
                    ComplaintStatus.RESOLVED.value,
                ]:
                    insp = Inspection(
                        complaint_id=c.id,
                        inspector_name="Er. Sharma (Senior Inspector)",
                        scheduled_at=c.created_at + timedelta(hours=10),
                        inspected_at=c.created_at + timedelta(hours=12),
                        findings="On-site physical inspection confirmed severe asphalt fatigue. Immediate hot-mix overlay required.",
                        result="Verified Defect",
                    )
                    db.add(insp)

                    h2 = ComplaintStatusHistory(
                        complaint_id=c.id,
                        previous_status=ComplaintStatus.SUBMITTED.value,
                        new_status=ComplaintStatus.INSPECTION_SCHEDULED.value,
                        changed_by="Er. Sharma",
                        notes="On-site survey conducted and approved for rapid maintenance.",
                        changed_at=c.created_at + timedelta(hours=12),
                    )
                    db.add(h2)

                if c_data["status"] in [
                    ComplaintStatus.REPAIR_IN_PROGRESS.value,
                    ComplaintStatus.AWAITING_VERIFICATION.value,
                    ComplaintStatus.RESOLVED.value,
                ]:
                    rep = Repair(
                        complaint_id=c.id,
                        assigned_team="PWD Rapid Patch Squad 04",
                        started_at=c.created_at + timedelta(hours=20),
                        completed_at=c.created_at + timedelta(hours=36) if c_data["status"] != ComplaintStatus.REPAIR_IN_PROGRESS.value else None,
                        repair_notes="Milled surface, applied tack coat, compacted 50mm Bituminous Concrete (BC).",
                        repair_evidence_path=repair_ev,
                    )
                    db.add(rep)

                    h3 = ComplaintStatusHistory(
                        complaint_id=c.id,
                        previous_status=ComplaintStatus.INSPECTION_SCHEDULED.value,
                        new_status=ComplaintStatus.REPAIR_IN_PROGRESS.value,
                        changed_by="Contractor Dispatch",
                        notes="Crew dispatched to site with bitumen emulsion and roller.",
                        changed_at=c.created_at + timedelta(hours=20),
                    )
                    db.add(h3)

                if c_data["status"] in [ComplaintStatus.AWAITING_VERIFICATION.value, ComplaintStatus.RESOLVED.value]:
                    h4 = ComplaintStatusHistory(
                        complaint_id=c.id,
                        previous_status=ComplaintStatus.REPAIR_IN_PROGRESS.value,
                        new_status=ComplaintStatus.AWAITING_VERIFICATION.value,
                        changed_by="PWD Rapid Patch Squad 04",
                        notes="Paving completed. Post-repair photos submitted for verification.",
                        changed_at=c.created_at + timedelta(hours=36),
                    )
                    db.add(h4)

                if c_data["status"] == ComplaintStatus.RESOLVED.value:
                    ver = Verification(
                        complaint_id=c.id,
                        reviewer_name="Quality Auditor K. Verma",
                        result="Approved",
                        before_evidence_reference=c.evidence_path,
                        after_evidence_reference=repair_ev,
                        verification_notes="Surface restoration verified. Texture index 0.91 exceeds minimum standard.",
                        similarity_score=0.91,
                        verified_at=c.created_at + timedelta(hours=40),
                    )
                    db.add(ver)

                    h5 = ComplaintStatusHistory(
                        complaint_id=c.id,
                        previous_status=ComplaintStatus.AWAITING_VERIFICATION.value,
                        new_status=ComplaintStatus.RESOLVED.value,
                        changed_by="Quality Auditor K. Verma",
                        notes="Visual & structural repair successfully verified and closed.",
                        changed_at=c.created_at + timedelta(hours=40),
                    )
                    db.add(h5)

                # Add a notification
                notif = Notification(
                    complaint_id=c.id,
                    channel="in_app",
                    message=f"Complaint {c.public_tracking_id} on {c.road_name} is currently in '{c.current_status}' status.",
                    delivery_status="delivered",
                    is_read=False,
                    created_at=datetime.utcnow() - timedelta(hours=2),
                )
                db.add(notif)

            db.commit()

        print("Seeding completed successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
