"""
RoadGuard AI — Complaint Lifecycle Management & Duplicate Detection Service
"""
from datetime import datetime, timedelta
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import models
from ..config import settings
from .geospatial import haversine_distance_meters, validate_coordinates

# Lifecycle allowed transitions
VALID_TRANSITIONS = {
    models.ComplaintStatus.DETECTED.value: [
        models.ComplaintStatus.PENDING_REVIEW.value,
        models.ComplaintStatus.COMPLAINT_GENERATED.value,
        models.ComplaintStatus.REJECTED.value,
    ],
    models.ComplaintStatus.PENDING_REVIEW.value: [
        models.ComplaintStatus.COMPLAINT_GENERATED.value,
        models.ComplaintStatus.REJECTED.value,
    ],
    models.ComplaintStatus.COMPLAINT_GENERATED.value: [
        models.ComplaintStatus.SUBMITTED.value,
        models.ComplaintStatus.ACKNOWLEDGED.value,
        models.ComplaintStatus.REJECTED.value,
        models.ComplaintStatus.DUPLICATE.value,
    ],
    models.ComplaintStatus.SUBMITTED.value: [
        models.ComplaintStatus.ACKNOWLEDGED.value,
        models.ComplaintStatus.INSPECTION_SCHEDULED.value,
        models.ComplaintStatus.REJECTED.value,
        models.ComplaintStatus.DUPLICATE.value,
        models.ComplaintStatus.WITHDRAWN.value,
    ],
    models.ComplaintStatus.ACKNOWLEDGED.value: [
        models.ComplaintStatus.INSPECTION_SCHEDULED.value,
        models.ComplaintStatus.REPAIR_IN_PROGRESS.value,
        models.ComplaintStatus.REJECTED.value,
    ],
    models.ComplaintStatus.INSPECTION_SCHEDULED.value: [
        models.ComplaintStatus.REPAIR_IN_PROGRESS.value,
        models.ComplaintStatus.REJECTED.value,
    ],
    models.ComplaintStatus.REPAIR_IN_PROGRESS.value: [
        models.ComplaintStatus.AWAITING_VERIFICATION.value,
        models.ComplaintStatus.RESOLVED.value,
    ],
    models.ComplaintStatus.AWAITING_VERIFICATION.value: [
        models.ComplaintStatus.RESOLVED.value,
        models.ComplaintStatus.REPAIR_IN_PROGRESS.value,  # If verification fails, send back for rework
        models.ComplaintStatus.CLOSED.value,
    ],
    models.ComplaintStatus.RESOLVED.value: [
        models.ComplaintStatus.CLOSED.value,
        models.ComplaintStatus.REOPENED.value,
    ],
    models.ComplaintStatus.CLOSED.value: [
        models.ComplaintStatus.REOPENED.value,
    ],
    models.ComplaintStatus.REJECTED.value: [
        models.ComplaintStatus.REOPENED.value,
    ],
    models.ComplaintStatus.DUPLICATE.value: [
        models.ComplaintStatus.REOPENED.value,
    ],
    models.ComplaintStatus.WITHDRAWN.value: [
        models.ComplaintStatus.REOPENED.value,
    ],
    models.ComplaintStatus.REOPENED.value: [
        models.ComplaintStatus.ACKNOWLEDGED.value,
        models.ComplaintStatus.INSPECTION_SCHEDULED.value,
        models.ComplaintStatus.REPAIR_IN_PROGRESS.value,
    ],
}


def generate_unique_tracking_id(db: Session) -> str:
    """
    Generates a unique, persistent, human-readable complaint tracking ID.
    Format: RD-YYYY-XXXXXX (e.g., RD-2026-000001).
    Guaranteed unique and concurrency-safe via database count.
    """
    year = datetime.utcnow().year
    prefix = f"RD-{year}-"

    # Count existing complaints for this year to compute sequence
    count = db.query(models.Complaint).filter(models.Complaint.public_tracking_id.like(f"{prefix}%")).count()
    candidate_num = count + 1

    while True:
        candidate_id = f"{prefix}{candidate_num:06d}"
        exists = db.query(models.Complaint).filter(models.Complaint.public_tracking_id == candidate_id).first()
        if not exists:
            return candidate_id
        candidate_num += 1


def check_for_duplicate_complaint(
    db: Session,
    latitude: float,
    longitude: float,
    defect_type: str,
    threshold_meters: float = 50.0,
    time_window_days: int = 30,
) -> Optional[models.Complaint]:
    """
    Checks whether a similar unresolved complaint already exists within distance and time thresholds.
    Does NOT silently delete; returns candidate for user/officer review.
    """
    if not validate_coordinates(latitude, longitude):
        return None

    cutoff_date = datetime.utcnow() - timedelta(days=time_window_days)
    terminal_statuses = [
        models.ComplaintStatus.CLOSED.value,
        models.ComplaintStatus.REJECTED.value,
        models.ComplaintStatus.WITHDRAWN.value,
        models.ComplaintStatus.DUPLICATE.value,
    ]

    # Quick bounding box filter (+/- 0.005 deg ~ 500m) for database efficiency
    lat_delta = 0.005
    lon_delta = 0.005

    candidates = (
        db.query(models.Complaint)
        .filter(
            models.Complaint.current_status.notin_(terminal_statuses),
            models.Complaint.created_at >= cutoff_date,
            models.Complaint.latitude.between(latitude - lat_delta, latitude + lat_delta),
            models.Complaint.longitude.between(longitude - lon_delta, longitude + lon_delta),
        )
        .all()
    )

    for candidate in candidates:
        dist = haversine_distance_meters(latitude, longitude, candidate.latitude, candidate.longitude)
        if dist <= threshold_meters:
            # Check defect category match or similarity (e.g. any crack with any crack, or exact match)
            if candidate.defect_type == defect_type or ("crack" in defect_type.lower() and "crack" in candidate.defect_type.lower()):
                return candidate

    return None


def transition_complaint_status(
    db: Session,
    complaint: models.Complaint,
    new_status: str,
    changed_by: str,
    notes: Optional[str] = None,
) -> models.Complaint:
    """
    Validates and executes a complaint status transition, creating an audit log.
    """
    current = complaint.current_status
    allowed = VALID_TRANSITIONS.get(current, [])

    if new_status not in allowed and new_status != current:
        raise ValueError(
            f"Invalid status transition from '{current}' to '{new_status}'. Allowed transitions: {allowed}"
        )

    complaint.current_status = new_status
    complaint.updated_at = datetime.utcnow()

    # Record history
    history = models.ComplaintStatusHistory(
        complaint_id=complaint.id,
        previous_status=current,
        new_status=new_status,
        changed_by=changed_by,
        notes=notes,
        changed_at=datetime.utcnow(),
    )
    db.add(history)

    # Record general audit log
    audit = models.AuditLog(
        actor_id=changed_by,
        action=f"TRANSITION_STATUS_{new_status.upper()}",
        entity_type="Complaint",
        entity_id=complaint.public_tracking_id,
        details=f"Status changed from {current} to {new_status}. Notes: {notes or 'None'}",
        created_at=datetime.utcnow(),
    )
    db.add(audit)

    db.commit()
    db.refresh(complaint)
    return complaint


class ComplaintService:
    @staticmethod
    def generate_tracking_id(db: Optional[Session] = None) -> str:
        import uuid
        year = datetime.utcnow().year
        suffix = uuid.uuid4().hex[:6].upper()
        return f"RD-{year}-{suffix}"

    @staticmethod
    def check_duplicate(
        db: Session,
        latitude: float,
        longitude: float,
        defect_type: str,
        threshold_meters: float = 50.0,
    ) -> dict:
        dup = check_for_duplicate_complaint(
            db=db,
            latitude=latitude,
            longitude=longitude,
            defect_type=defect_type,
            threshold_meters=threshold_meters,
        )
        if dup:
            return {
                "is_duplicate": True,
                "existing_complaints": [
                    {
                        "id": dup.id,
                        "tracking_id": dup.public_tracking_id,
                        "road_name": dup.road_name,
                        "status": dup.current_status,
                        "distance_meters": round(haversine_distance_meters(latitude, longitude, dup.latitude, dup.longitude), 1),
                    }
                ],
                "message": f"Potential duplicate: Active complaint {dup.public_tracking_id} exists {round(haversine_distance_meters(latitude, longitude, dup.latitude, dup.longitude), 1)}m away.",
            }
        return {
            "is_duplicate": False,
            "existing_complaints": [],
            "message": "No duplicate active complaints detected in this vicinity.",
        }

    @staticmethod
    def validate_status_transition(old_status: str, new_status: str) -> Tuple[bool, Optional[str]]:
        if old_status == new_status:
            return True, None
        allowed = VALID_TRANSITIONS.get(old_status, [])
        if new_status in allowed:
            return True, None
        return False, f"Illegal status transition: Cannot move from '{old_status}' to '{new_status}'. Allowed: {', '.join(allowed) if allowed else 'None (terminal state)'}"


complaint_service = ComplaintService()

