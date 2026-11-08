"""
RoadGuard AI — Pydantic Schemas for Validation and Serialization
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field


# ── Auth & Users ──
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = "citizen"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    account_status: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# ── Detections ──
class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float
    confidence: float
    class_name: str
    severity: str


class DetectionResponse(BaseModel):
    id: int
    defect_type: str
    confidence: float
    estimated_severity: str
    latitude: float
    longitude: float
    location_source: str
    location_accuracy: Optional[float] = 5.0
    evidence_path: str
    annotated_path: Optional[str] = None
    bounding_box: Optional[str] = None
    camera_id: Optional[int] = None
    detected_at: datetime
    review_status: str

    class Config:
        from_attributes = True


class DetectionReview(BaseModel):
    review_status: str  # confirmed, corrected, rejected
    corrected_defect_type: Optional[str] = None
    corrected_severity: Optional[str] = None
    notes: Optional[str] = None


# ── Status History ──
class ComplaintStatusHistoryResponse(BaseModel):
    id: int
    complaint_id: int
    previous_status: Optional[str] = None
    new_status: str
    changed_by: str
    notes: Optional[str] = None
    changed_at: datetime

    class Config:
        from_attributes = True


# ── Departments ──
class DepartmentBase(BaseModel):
    name: str
    jurisdiction_reference: str
    contact_configuration: Optional[str] = None
    integration_status: Optional[str] = "Demo Simulation Mode"
    sla_hours: Optional[int] = 72
    escalation_rules: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentResponse(DepartmentBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


# ── Inspections, Repairs & Verifications ──
class InspectionCreate(BaseModel):
    inspector_id: Optional[int] = None
    inspector_name: str
    scheduled_at: Optional[datetime] = None
    findings: str
    result: str  # Verified Defect, Requires Structural Survey, False Alarm


class InspectionResponse(BaseModel):
    id: int
    complaint_id: int
    inspector_name: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    inspected_at: Optional[datetime] = None
    findings: Optional[str] = None
    result: Optional[str] = None

    class Config:
        from_attributes = True


class RepairCreate(BaseModel):
    assigned_team: str
    repair_notes: str
    repair_evidence_path: Optional[str] = None


class RepairResponse(BaseModel):
    id: int
    complaint_id: int
    assigned_team: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    repair_notes: Optional[str] = None
    repair_evidence_path: Optional[str] = None

    class Config:
        from_attributes = True


class VerificationCreate(BaseModel):
    reviewer_name: str
    result: str  # Approved, Rejected, Requires Rework
    verification_notes: str
    after_evidence_reference: Optional[str] = None


class VerificationResponse(BaseModel):
    id: int
    complaint_id: int
    reviewer_name: Optional[str] = None
    result: str
    before_evidence_reference: Optional[str] = None
    after_evidence_reference: Optional[str] = None
    verification_notes: Optional[str] = None
    similarity_score: Optional[float] = None
    verified_at: datetime

    class Config:
        from_attributes = True


# ── Complaints ──
class ComplaintCreate(BaseModel):
    defect_type: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    road_name: str
    severity: Optional[str] = "Medium"
    priority: Optional[str] = "P3-Normal"
    reporter_name: Optional[str] = None
    reporter_contact: Optional[str] = None
    evidence_path: Optional[str] = None
    detection_id: Optional[int] = None
    source_type: Optional[str] = "citizen_report"


class ComplaintStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    changed_by: Optional[str] = "Officer"
    responsible_department_id: Optional[int] = None


class ComplaintDuplicateCheck(BaseModel):
    latitude: float
    longitude: float
    defect_type: str
    threshold_meters: Optional[float] = 50.0


class ComplaintResponse(BaseModel):
    id: int
    public_tracking_id: str
    source_type: str
    detection_id: Optional[int] = None
    defect_type: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    road_name: str
    severity: str
    priority: str
    responsible_department_id: Optional[int] = None
    current_status: str
    reporter_name: Optional[str] = None
    evidence_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    target_resolution_at: Optional[datetime] = None
    external_reference_id: Optional[str] = None
    duplicate_of_id: Optional[int] = None

    class Config:
        from_attributes = True


class ComplaintDetailResponse(ComplaintResponse):
    department: Optional[DepartmentResponse] = None
    status_history: List[ComplaintStatusHistoryResponse] = []
    inspections: List[InspectionResponse] = []
    repairs: List[RepairResponse] = []
    verifications: List[VerificationResponse] = []


# ── Cameras ──
class CameraCreate(BaseModel):
    name: str
    stream_configuration_reference: str
    latitude: float
    longitude: float
    road_segment_id: Optional[str] = None
    feed_type: Optional[str] = "stream"


class CameraResponse(BaseModel):
    id: int
    name: str
    stream_configuration_reference: str
    latitude: float
    longitude: float
    road_segment_id: Optional[str] = None
    connection_status: str
    last_seen_at: datetime
    is_active: bool
    feed_type: str

    class Config:
        from_attributes = True


# ── Notifications ──
class NotificationResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    complaint_id: Optional[int] = None
    channel: str
    message: str
    delivery_status: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Analytics ──
class AnalyticsOverviewResponse(BaseModel):
    total_detections: int
    total_complaints: int
    pending_acknowledgment: int
    high_priority_defects: int
    repairs_in_progress: int
    overdue_complaints: int
    awaiting_verification: int
    verified_repairs: int
    severity_distribution: Dict[str, int]
    status_distribution: Dict[str, int]
    department_performance: List[Dict[str, Any]]
    monthly_trends: List[Dict[str, Any]]
    avg_hours_to_acknowledge: float
    avg_hours_to_inspect: float
    avg_hours_to_resolve: float
