"""
RoadGuard AI — Complaints API Routes
"""
from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.models import (
    Complaint,
    Department,
    ComplaintStatusHistory,
    ComplaintStatus,
    PriorityLevel,
    SeverityLevel,
)
from ..schemas.schemas import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintDetailResponse,
    ComplaintStatusUpdate,
    ComplaintDuplicateCheck,
)
from ..services.complaint_service import complaint_service
from ..services.authority_service import authority_service
from ..services.notification_service import notification_service

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])


@router.post("/check-duplicate", response_model=dict)
def check_duplicate(
    check_req: ComplaintDuplicateCheck,
    db: Session = Depends(get_db),
):
    """
    Check if an active or recent complaint already exists within 50m and 30 days.
    Prevents duplicate submissions and displays existing tracking IDs.
    """
    dup_result = complaint_service.check_duplicate(
        db=db,
        latitude=check_req.latitude,
        longitude=check_req.longitude,
        defect_type=check_req.defect_type,
        threshold_meters=check_req.threshold_meters or 50.0,
    )
    return dup_result


@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(
    complaint_in: ComplaintCreate,
    allow_duplicate: bool = Query(False),
    db: Session = Depends(get_db),
):
    """
    Register a new road damage complaint.
    Generates a unique tracking ID (RD-YYYY-XXXXXX), auto-matches the road authority,
    records the initial status history, and generates notifications.
    """
    # Duplicate check
    dup_result = complaint_service.check_duplicate(
        db=db,
        latitude=complaint_in.latitude,
        longitude=complaint_in.longitude,
        defect_type=complaint_in.defect_type,
    )
    if dup_result["is_duplicate"] and not allow_duplicate:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "message": "A similar road damage complaint was recently registered near this location.",
                "duplicates": dup_result["existing_complaints"],
            },
        )

    # Authority Resolution
    auth_match = authority_service.resolve_authority(
        road_name=complaint_in.road_name,
        latitude=complaint_in.latitude,
        longitude=complaint_in.longitude,
    )
    dept = db.query(Department).filter(Department.name == auth_match["department_name"]).first()
    dept_id = dept.id if dept else None

    # Priority assessment
    priority = complaint_in.priority
    if not priority:
        if complaint_in.severity == SeverityLevel.CRITICAL.value:
            priority = PriorityLevel.P1_CRITICAL.value
        elif complaint_in.severity == SeverityLevel.HIGH.value:
            priority = PriorityLevel.P2_HIGH.value
        else:
            priority = PriorityLevel.P3_NORMAL.value

    tracking_id = complaint_service.generate_tracking_id()

    # Target resolution deadline based on SLA
    sla_hours = dept.sla_hours if dept else 72
    target_res = datetime.utcnow() + timedelta(hours=sla_hours)

    complaint = Complaint(
        public_tracking_id=tracking_id,
        source_type=complaint_in.source_type or "citizen_report",
        detection_id=complaint_in.detection_id,
        defect_type=complaint_in.defect_type,
        description=complaint_in.description,
        latitude=complaint_in.latitude,
        longitude=complaint_in.longitude,
        road_name=complaint_in.road_name,
        severity=complaint_in.severity or SeverityLevel.MEDIUM.value,
        priority=priority,
        responsible_department_id=dept_id,
        current_status=ComplaintStatus.SUBMITTED.value,
        reporter_name=complaint_in.reporter_name,
        reporter_contact=complaint_in.reporter_contact,
        evidence_path=complaint_in.evidence_path,
        target_resolution_at=target_res,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(complaint)
    db.flush()

    # Record initial status in history
    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        previous_status=None,
        new_status=ComplaintStatus.SUBMITTED.value,
        changed_by=complaint_in.reporter_name or "Citizen Reporter",
        notes=f"Complaint registered. Assigned to {auth_match['department_name']} ({auth_match['authority_tier']}).",
        changed_at=datetime.utcnow(),
    )
    db.add(history)
    db.commit()
    db.refresh(complaint)

    # Dispatch notification
    notification_service.create_notification(
        db=db,
        complaint_id=complaint.id,
        message=f"Complaint {complaint.public_tracking_id} lodged for {complaint.defect_type} on {complaint.road_name}.",
    )

    return complaint


@router.get("", response_model=List[ComplaintResponse])
def get_complaints(
    status_filter: Optional[str] = Query(None, alias="status"),
    severity: Optional[str] = Query(None),
    department_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    offset: int = Query(0),
    db: Session = Depends(get_db),
):
    """List complaints with filtering and search options."""
    query = db.query(Complaint).order_by(Complaint.created_at.desc())

    if status_filter:
        query = query.filter(Complaint.current_status == status_filter)
    if severity:
        query = query.filter(Complaint.severity == severity)
    if department_id:
        query = query.filter(Complaint.responsible_department_id == department_id)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Complaint.public_tracking_id.ilike(search_fmt))
            | (Complaint.road_name.ilike(search_fmt))
            | (Complaint.defect_type.ilike(search_fmt))
        )

    return query.offset(offset).limit(limit).all()


@router.get("/track/{tracking_id}", response_model=ComplaintDetailResponse)
def track_complaint(tracking_id: str, db: Session = Depends(get_db)):
    """
    Public tracking endpoint: Look up full status timeline, inspections,
    repairs, and verification by tracking ID (e.g. RD-2026-A1B2C3).
    """
    clean_id = tracking_id.strip().upper()
    complaint = db.query(Complaint).filter(Complaint.public_tracking_id == clean_id).first()
    if not complaint:
        raise HTTPException(
            status_code=404,
            detail=f"No complaint found matching tracking ID '{clean_id}'. Please check the format.",
        )
    return complaint


@router.get("/{complaint_id}", response_model=ComplaintDetailResponse)
def get_complaint_by_id(complaint_id: int, db: Session = Depends(get_db)):
    """Fetch complaint by primary ID with associated relations."""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint


@router.put("/{complaint_id}/status")
def update_complaint_status(
    complaint_id: int,
    status_update: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
):
    """
    Update complaint lifecycle status with strict state validation.
    Appends audit log into complaint_status_history.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    old_status = complaint.current_status
    new_status = status_update.status

    is_valid, err_msg = complaint_service.validate_status_transition(old_status, new_status)
    if not is_valid:
        raise HTTPException(status_code=400, detail=err_msg)

    complaint.current_status = new_status
    complaint.updated_at = datetime.utcnow()

    if status_update.responsible_department_id:
        complaint.responsible_department_id = status_update.responsible_department_id

    # Add to history
    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        previous_status=old_status,
        new_status=new_status,
        changed_by=status_update.changed_by or "Authorized Officer",
        notes=status_update.notes or f"Status transitioned from {old_status} to {new_status}.",
        changed_at=datetime.utcnow(),
    )
    db.add(history)
    db.commit()
    db.refresh(complaint)

    # Send notification
    notification_service.create_notification(
        db=db,
        complaint_id=complaint.id,
        message=f"Complaint {complaint.public_tracking_id} updated to '{new_status}'.",
    )

    return {
        "status": "success",
        "complaint_id": complaint.id,
        "public_tracking_id": complaint.public_tracking_id,
        "previous_status": old_status,
        "new_status": new_status,
        "updated_at": complaint.updated_at.isoformat(),
    }


@router.post("/{complaint_id}/dispatch-simulation")
def trigger_dispatch_simulation(complaint_id: int, db: Session = Depends(get_db)):
    """
    Simulate outward dispatch to an official government municipal/NHAI portal.
    Demonstrates payload creation without touching live external government systems.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    dept_name = complaint.department.name if complaint.department else "State PWD"
    dispatch_result = authority_service.simulate_official_submission(
        complaint_dict={
            "tracking_id": complaint.public_tracking_id,
            "defect_type": complaint.defect_type,
            "severity": complaint.severity,
            "latitude": complaint.latitude,
            "longitude": complaint.longitude,
            "road_name": complaint.road_name,
            "description": complaint.description,
            "evidence_url": complaint.evidence_path,
        },
        department_name=dept_name,
    )

    complaint.external_reference_id = dispatch_result.get("external_reference_id")
    db.commit()

    return dispatch_result
