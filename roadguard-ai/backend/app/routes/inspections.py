"""
RoadGuard AI — Field Inspections API Routes
"""
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.models import Complaint, Inspection, ComplaintStatusHistory, ComplaintStatus
from ..schemas.schemas import InspectionCreate, InspectionResponse
from ..services.notification_service import notification_service

router = APIRouter(prefix="/api/complaints/{complaint_id}/inspections", tags=["Inspections"])


@router.get("", response_model=List[InspectionResponse])
def get_inspections(complaint_id: int, db: Session = Depends(get_db)):
    """List all inspections conducted for this complaint."""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint.inspections


@router.post("", response_model=InspectionResponse, status_code=status.HTTP_201_CREATED)
def create_inspection(
    complaint_id: int,
    insp_in: InspectionCreate,
    db: Session = Depends(get_db),
):
    """
    Schedule or log a completed field inspection.
    Transitions complaint status to 'Inspection Scheduled' or records on-site survey results.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    inspection = Inspection(
        complaint_id=complaint.id,
        inspector_id=insp_in.inspector_id,
        inspector_name=insp_in.inspector_name,
        scheduled_at=insp_in.scheduled_at or datetime.utcnow(),
        inspected_at=datetime.utcnow(),
        findings=insp_in.findings,
        result=insp_in.result,
    )
    db.add(inspection)

    # Transition status to Inspection Scheduled if not already past that
    old_status = complaint.current_status
    if complaint.current_status in [ComplaintStatus.SUBMITTED.value, ComplaintStatus.ACKNOWLEDGED.value]:
        complaint.current_status = ComplaintStatus.INSPECTION_SCHEDULED.value
        complaint.updated_at = datetime.utcnow()

        history = ComplaintStatusHistory(
            complaint_id=complaint.id,
            previous_status=old_status,
            new_status=ComplaintStatus.INSPECTION_SCHEDULED.value,
            changed_by=insp_in.inspector_name,
            notes=f"Inspection logged: {insp_in.findings} (Result: {insp_in.result})",
            changed_at=datetime.utcnow(),
        )
        db.add(history)

    db.commit()
    db.refresh(inspection)

    notification_service.create_notification(
        db=db,
        complaint_id=complaint.id,
        message=f"Inspection logged for {complaint.public_tracking_id} by {insp_in.inspector_name}: {insp_in.result}.",
    )

    return inspection
