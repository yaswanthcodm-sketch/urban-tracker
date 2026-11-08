"""
RoadGuard AI — SQLAlchemy Database Models
"""
import enum
from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Text,
    ForeignKey,
    Boolean,
    Enum,
    Index,
)
from sqlalchemy.orm import relationship
from ..database import Base


class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    INSPECTOR = "inspector"
    DEPARTMENT_OFFICER = "department_officer"
    ADMIN = "admin"


class DefectType(str, enum.Enum):
    POTHOLE = "Pothole"
    ROAD_CRACK = "Road crack"
    LONGITUDINAL_CRACK = "Longitudinal crack"
    TRANSVERSE_CRACK = "Transverse crack"
    ALLIGATOR_CRACKING = "Alligator cracking"
    DAMAGED_ROAD_EDGE = "Damaged road edge"
    OTHER = "Other visible road damage"


class SeverityLevel(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class PriorityLevel(str, enum.Enum):
    P1_CRITICAL = "P1-Critical"
    P2_HIGH = "P2-High"
    P3_NORMAL = "P3-Normal"
    P4_LOW = "P4-Low"


class ComplaintStatus(str, enum.Enum):
    DETECTED = "Detected"
    PENDING_REVIEW = "Pending Review"
    COMPLAINT_GENERATED = "Complaint Generated"
    SUBMITTED = "Submitted"
    ACKNOWLEDGED = "Acknowledged"
    INSPECTION_SCHEDULED = "Inspection Scheduled"
    REPAIR_IN_PROGRESS = "Repair In Progress"
    AWAITING_VERIFICATION = "Awaiting Verification"
    RESOLVED = "Resolved"
    CLOSED = "Closed"
    REJECTED = "Rejected"
    DUPLICATE = "Duplicate"
    WITHDRAWN = "Withdrawn"
    REOPENED = "Reopened"


class VerificationResult(str, enum.Enum):
    APPROVED = "Approved"
    REJECTED = "Rejected"
    REQUIRES_REWORK = "Requires Rework"


class NotificationChannel(str, enum.Enum):
    IN_APP = "in_app"
    EMAIL = "email"
    SMS = "sms"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), default=UserRole.CITIZEN.value, nullable=False)
    account_status = Column(String(30), default="active", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    inspections = relationship("Inspection", back_populates="inspector")
    verifications = relationship("Verification", back_populates="reviewer")
    notifications = relationship("Notification", back_populates="user")


class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    stream_configuration_reference = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    road_segment_id = Column(String(100), nullable=True)
    connection_status = Column(String(40), default="online", nullable=False)
    last_seen_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    feed_type = Column(String(30), default="stream", nullable=False)

    detections = relationship("Detection", back_populates="camera")


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, nullable=False)
    jurisdiction_reference = Column(String(120), nullable=False)  # e.g., National Highway, State PWD, Urban Municipal
    contact_configuration = Column(String(255), nullable=True)  # email, portal endpoint
    integration_status = Column(String(50), default="Demo Simulation Mode", nullable=False)
    sla_hours = Column(Integer, default=72, nullable=False)  # Expected resolution SLA
    escalation_rules = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    complaints = relationship("Complaint", back_populates="department")


class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    defect_type = Column(String(60), nullable=False)
    confidence = Column(Float, nullable=False)
    estimated_severity = Column(String(30), default=SeverityLevel.MEDIUM.value, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_source = Column(String(60), default="GPS Exif / Confirmed Pin", nullable=False)
    location_accuracy = Column(Float, default=5.0, nullable=True)  # in meters
    evidence_path = Column(String(255), nullable=False)
    annotated_path = Column(String(255), nullable=True)
    bounding_box = Column(Text, nullable=True)  # JSON [x, y, w, h] or list of boxes
    camera_id = Column(Integer, ForeignKey("cameras.id"), nullable=True)
    detected_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    review_status = Column(String(40), default="pending", nullable=False)  # pending, confirmed, rejected

    camera = relationship("Camera", back_populates="detections")
    complaints = relationship("Complaint", back_populates="detection")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    public_tracking_id = Column(String(40), unique=True, index=True, nullable=False)
    source_type = Column(String(50), default="citizen_report", nullable=False)  # citizen_report, ai_cctv, ai_upload, satellite_scan
    detection_id = Column(Integer, ForeignKey("detections.id"), nullable=True)
    defect_type = Column(String(60), nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    road_name = Column(String(180), nullable=False)
    severity = Column(String(30), default=SeverityLevel.MEDIUM.value, nullable=False)
    priority = Column(String(30), default=PriorityLevel.P3_NORMAL.value, nullable=False)
    responsible_department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    current_status = Column(String(50), default=ComplaintStatus.SUBMITTED.value, nullable=False)
    reporter_name = Column(String(120), nullable=True)
    reporter_contact = Column(String(120), nullable=True)
    evidence_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    target_resolution_at = Column(DateTime, nullable=True)
    external_reference_id = Column(String(80), nullable=True)
    duplicate_of_id = Column(Integer, ForeignKey("complaints.id"), nullable=True)

    detection = relationship("Detection", back_populates="complaints")
    department = relationship("Department", back_populates="complaints")
    status_history = relationship("ComplaintStatusHistory", back_populates="complaint", cascade="all, delete-orphan")
    inspections = relationship("Inspection", back_populates="complaint")
    repairs = relationship("Repair", back_populates="complaint")
    verifications = relationship("Verification", back_populates="complaint")
    notifications = relationship("Notification", back_populates="complaint")

    __table_args__ = (
        Index("idx_complaint_location", "latitude", "longitude"),
        Index("idx_complaint_status", "current_status"),
    )


class ComplaintStatusHistory(Base):
    __tablename__ = "complaint_status_history"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    previous_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=False)
    changed_by = Column(String(120), default="System", nullable=False)
    notes = Column(Text, nullable=True)
    changed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    complaint = relationship("Complaint", back_populates="status_history")


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    inspector_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    inspector_name = Column(String(120), nullable=True)
    scheduled_at = Column(DateTime, nullable=True)
    inspected_at = Column(DateTime, nullable=True)
    findings = Column(Text, nullable=True)
    result = Column(String(60), nullable=True)  # Verified Pothole, Edge Erosion, False Alarm, etc.

    complaint = relationship("Complaint", back_populates="inspections")
    inspector = relationship("User", back_populates="inspections")


class Repair(Base):
    __tablename__ = "repairs"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    assigned_team = Column(String(120), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    repair_notes = Column(Text, nullable=True)
    repair_evidence_path = Column(String(255), nullable=True)

    complaint = relationship("Complaint", back_populates="repairs")


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewer_name = Column(String(120), nullable=True)
    result = Column(String(50), default=VerificationResult.APPROVED.value, nullable=False)
    before_evidence_reference = Column(String(255), nullable=True)
    after_evidence_reference = Column(String(255), nullable=True)
    verification_notes = Column(Text, nullable=True)
    similarity_score = Column(Float, nullable=True)  # Visual verification metric
    verified_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    complaint = relationship("Complaint", back_populates="verifications")
    reviewer = relationship("User", back_populates="verifications")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=True)
    channel = Column(String(30), default=NotificationChannel.IN_APP.value, nullable=False)
    message = Column(Text, nullable=False)
    delivery_status = Column(String(40), default="delivered", nullable=False)  # delivered, pending, failed
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    complaint = relationship("Complaint", back_populates="notifications")
    user = relationship("User", back_populates="notifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(String(80), default="system", nullable=False)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(60), nullable=False)
    entity_id = Column(String(80), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
