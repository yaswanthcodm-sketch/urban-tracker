"""
RoadGuard AI — Repair Work Tracking API Routes
"""
import os
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..config import settings
from ..models.models import Complaint, Repair, ComplaintStatusHistory, ComplaintStatus
from ..schemas.schemas import RepairResponse
from ..services.notification_service import notification_service

router = APIRouter(prefix="/api/complaints/{complaint_id}/repairs", tags=["Repairs"])


@router.get("", response_model=List[RepairResponse])
def get_repairs(complaint_id: int, db: Session = Depends(get_db)):
    """List repair logs and contractor work progress for this complaint."""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint.repairs


@router.post("", response_model=RepairResponse, status_code=status.HTTP_201_CREATED)
async def log_repair_work(
    complaint_id: int,
    assigned_team: str = Form(...),
    repair_notes: str = Form(...),
    is_completed: bool = Form(False),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """
    Log repair crew dispatch, asphalt patching work, or completion evidence.
    Transitions status to 'Repair In Progress' or 'Awaiting Verification'.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    evidence_url = None
    if file:
        file_ext = os.path.splitext(file.filename or "")[1].lower()
        if not file_ext:
            file_ext = ".jpg"
        repair_filename = f"repair_{complaint.id}_{uuid.uuid4().hex[:8]}{file_ext}"
        repair_filepath = os.path.join(settings.REPAIRS_DIR, repair_filename)
        content = await file.read()
        with open(repair_filepath, "wb") as f:
            f.write(content)
        evidence_url = f"/uploads/repairs/{repair_filename}"

    now = datetime.utcnow()
    repair = Repair(
        complaint_id=complaint.id,
        assigned_team=assigned_team,
        started_at=now,
        completed_at=now if is_completed else None,
        repair_notes=repair_notes,
        repair_evidence_path=evidence_url,
    )
    db.add(repair)

    old_status = complaint.current_status
    new_status = ComplaintStatus.AWAITING_VERIFICATION.value if is_completed else ComplaintStatus.REPAIR_IN_PROGRESS.value
    complaint.current_status = new_status
    complaint.updated_at = now

    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        previous_status=old_status,
        new_status=new_status,
        changed_by=f"Contractor ({assigned_team})",
        notes=f"Repair update: {repair_notes}" + (" [Completed - Awaiting Verification]" if is_completed else ""),
        changed_at=now,
    )
    db.add(history)
    db.commit()
    db.refresh(repair)

    notification_service.create_notification(
        db=db,
        complaint_id=complaint.id,
        message=f"Repair crew update on {complaint.public_tracking_id}: Status changed to {new_status}.",
    )

    return repair
