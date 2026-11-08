"""
RoadGuard AI — Independent Repair Verification API Routes
"""
import os
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..config import settings
from ..models.models import Complaint, Verification, ComplaintStatusHistory, ComplaintStatus, VerificationResult
from ..schemas.schemas import VerificationResponse
from ..services.verification_service import verification_service
from ..services.notification_service import notification_service

router = APIRouter(prefix="/api/complaints/{complaint_id}/verifications", tags=["Verifications"])


@router.get("", response_model=List[VerificationResponse])
def get_verifications(complaint_id: int, db: Session = Depends(get_db)):
    """List all independent verification reviews for this complaint."""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint.verifications


@router.post("", response_model=VerificationResponse, status_code=status.HTTP_201_CREATED)
async def verify_repair(
    complaint_id: int,
    reviewer_name: str = Form(...),
    result: str = Form(...),  # Approved, Rejected, Requires Rework
    verification_notes: str = Form(...),
    after_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """
    Perform independent visual verification of road repair.
    Compares original defect evidence against newly uploaded repair evidence,
    computes structural surface restoration score, creates composite side-by-side evidence,
    and transitions complaint to 'Resolved' or 'Requires Rework'.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    after_url = None
    similarity_score = 0.85
    composite_url = None

    if after_image:
        file_ext = os.path.splitext(after_image.filename or "")[1].lower() or ".jpg"
        after_filename = f"after_{complaint.id}_{uuid.uuid4().hex[:8]}{file_ext}"
        after_filepath = os.path.join(settings.REPAIRS_DIR, after_filename)
        content = await after_image.read()
        with open(after_filepath, "wb") as f:
            f.write(content)
        after_url = f"/uploads/repairs/{after_filename}"

        # Resolve before image path
        before_abs_path = None
        if complaint.evidence_path:
            # Strip leading /uploads/
            rel = complaint.evidence_path.replace("/uploads/", "")
            before_abs_path = os.path.join(settings.BASE_DIR, "uploads", rel)

        if before_abs_path and os.path.exists(before_abs_path):
            composite_filename = f"composite_{complaint.id}_{uuid.uuid4().hex[:8]}.jpg"
            composite_filepath = os.path.join(settings.REPAIRS_DIR, composite_filename)
            v_result = verification_service.verify_repair(
                before_image_path=before_abs_path,
                after_image_path=after_filepath,
                composite_output_path=composite_filepath,
            )
            similarity_score = v_result.get("similarity_score", 0.85)
            if v_result.get("composite_path"):
                composite_url = f"/uploads/repairs/{composite_filename}"

    now = datetime.utcnow()
    verification = Verification(
        complaint_id=complaint.id,
        reviewer_name=reviewer_name,
        result=result,
        before_evidence_reference=complaint.evidence_path,
        after_evidence_reference=composite_url or after_url,
        verification_notes=verification_notes,
        similarity_score=similarity_score,
        verified_at=now,
    )
    db.add(verification)

    old_status = complaint.current_status
    if result.lower() == "approved":
        new_status = ComplaintStatus.RESOLVED.value
    elif result.lower() == "rejected":
        new_status = ComplaintStatus.REOPENED.value
    else:
        new_status = ComplaintStatus.REPAIR_IN_PROGRESS.value

    complaint.current_status = new_status
    complaint.updated_at = now

    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        previous_status=old_status,
        new_status=new_status,
        changed_by=f"Verifier ({reviewer_name})",
        notes=f"Verification verdict: {result}. Notes: {verification_notes} (Similarity: {round(similarity_score, 2)})",
        changed_at=now,
    )
    db.add(history)
    db.commit()
    db.refresh(verification)

    notification_service.create_notification(
        db=db,
        complaint_id=complaint.id,
        message=f"Verification completed for {complaint.public_tracking_id}: {result}. Current status: {new_status}.",
    )

    return verification
