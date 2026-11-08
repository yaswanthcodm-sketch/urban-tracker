"""
RoadGuard AI — Detections API Routes
"""
import os
import uuid
import json
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..config import settings
from ..models.models import (
    Detection,
    Complaint,
    Department,
    ComplaintStatusHistory,
    SeverityLevel,
    PriorityLevel,
    ComplaintStatus,
)
from ..schemas.schemas import DetectionResponse, DetectionReview
from ..services.ai_detection import ai_detection_service
from ..services.complaint_service import complaint_service
from ..services.authority_service import authority_service
from ..services.notification_service import notification_service

router = APIRouter(prefix="/api/detections", tags=["Detections"])


@router.post("/upload", response_model=dict)
async def upload_and_detect_image(
    file: UploadFile = File(...),
    latitude: float = Form(17.7015),
    longitude: float = Form(80.8845),
    location_source: str = Form("Manual / Map Pin"),
    location_accuracy: float = Form(5.0),
    camera_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
):
    """
    Upload an image (photo or frame), run the AI damage detection engine,
    generate bounding boxes, calculate severity, and persist the detection record.
    """
    valid_extensions = {".jpg", ".jpeg", ".png", ".webp"}
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    if file_ext not in valid_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file_ext}'. Allowed formats: {', '.join(valid_extensions)}",
        )

    # Save original image
    raw_filename = f"raw_{uuid.uuid4().hex[:12]}{file_ext}"
    raw_path = os.path.join(settings.EVIDENCE_DIR, raw_filename)
    content = await file.read()
    with open(raw_path, "wb") as f:
        f.write(content)

    # Run AI detection
    annotated_filename = f"annotated_{uuid.uuid4().hex[:12]}.jpg"
    annotated_path = os.path.join(settings.EVIDENCE_DIR, annotated_filename)

    ai_result = ai_detection_service.detect_image(
        image_path=raw_path,
        save_annotated_path=annotated_path,
    )

    primary_type = ai_result.get("primary_defect_type", "Other visible road damage")
    avg_conf = ai_result.get("confidence", 0.85)
    severity = ai_result.get("estimated_severity", SeverityLevel.MEDIUM.value)
    boxes = ai_result.get("boxes", [])

    # Record in database
    db_detection = Detection(
        defect_type=primary_type,
        confidence=avg_conf,
        estimated_severity=severity,
        latitude=latitude,
        longitude=longitude,
        location_source=location_source,
        location_accuracy=location_accuracy,
        evidence_path=f"/uploads/evidence/{raw_filename}",
        annotated_path=f"/uploads/evidence/{annotated_filename}",
        bounding_box=json.dumps(boxes),
        camera_id=camera_id,
        detected_at=datetime.utcnow(),
        review_status="pending",
    )
    db.add(db_detection)
    db.commit()
    db.refresh(db_detection)

    return {
        "status": "success",
        "detection": {
            "id": db_detection.id,
            "defect_type": db_detection.defect_type,
            "confidence": round(db_detection.confidence, 4),
            "estimated_severity": db_detection.estimated_severity,
            "latitude": db_detection.latitude,
            "longitude": db_detection.longitude,
            "location_source": db_detection.location_source,
            "location_accuracy": db_detection.location_accuracy,
            "evidence_path": db_detection.evidence_path,
            "annotated_path": db_detection.annotated_path,
            "bounding_boxes": boxes,
            "detected_at": db_detection.detected_at.isoformat(),
            "review_status": db_detection.review_status,
        },
    }


@router.post("/video", response_model=dict)
async def upload_and_detect_video(
    file: UploadFile = File(...),
    latitude: float = Form(17.7015),
    longitude: float = Form(80.8845),
    sample_rate: int = Form(15),
    db: Session = Depends(get_db),
):
    """
    Upload a road survey video or CCTV video clip, extract sample frames,
    run damage detection across frames, and return consolidated detections.
    """
    valid_exts = {".mp4", ".avi", ".mov", ".mkv"}
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    if file_ext not in valid_exts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported video format '{file_ext}'. Allowed: {', '.join(valid_exts)}",
        )

    video_filename = f"video_{uuid.uuid4().hex[:12]}{file_ext}"
    video_path = os.path.join(settings.EVIDENCE_DIR, video_filename)
    content = await file.read()
    with open(video_path, "wb") as f:
        f.write(content)

    video_results = ai_detection_service.process_video(
        video_path=video_path,
        output_dir=settings.EVIDENCE_DIR,
        sample_rate=max(5, min(sample_rate, 60)),
    )

    created_detections = []
    for res in video_results:
        # Create a detection entry for each significant frame detection
        db_det = Detection(
            defect_type=res.get("primary_defect_type", "Pothole"),
            confidence=res.get("confidence", 0.85),
            estimated_severity=res.get("estimated_severity", SeverityLevel.MEDIUM.value),
            latitude=latitude,
            longitude=longitude,
            location_source="Video Frame Sampling",
            location_accuracy=10.0,
            evidence_path=f"/uploads/evidence/{os.path.basename(res['frame_path'])}",
            annotated_path=f"/uploads/evidence/{os.path.basename(res['annotated_path'])}"
            if res.get("annotated_path")
            else None,
            bounding_box=json.dumps(res.get("boxes", [])),
            detected_at=datetime.utcnow(),
            review_status="pending",
        )
        db.add(db_det)
        db.commit()
        db.refresh(db_det)
        created_detections.append(
            {
                "id": db_det.id,
                "frame_number": res.get("frame_number"),
                "defect_type": db_det.defect_type,
                "confidence": round(db_det.confidence, 3),
                "severity": db_det.estimated_severity,
                "evidence_path": db_det.evidence_path,
                "annotated_path": db_det.annotated_path,
            }
        )

    return {
        "status": "success",
        "video_processed": file.filename,
        "total_detections_found": len(created_detections),
        "detections": created_detections,
    }


@router.get("", response_model=List[DetectionResponse])
def get_detections(
    review_status: Optional[str] = Query(None),
    defect_type: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db),
):
    """List recent AI detection events with optional filters."""
    query = db.query(Detection).order_by(Detection.detected_at.desc())
    if review_status:
        query = query.filter(Detection.review_status == review_status)
    if defect_type:
        query = query.filter(Detection.defect_type == defect_type)
    return query.limit(limit).all()


@router.get("/{detection_id}", response_model=DetectionResponse)
def get_detection(detection_id: int, db: Session = Depends(get_db)):
    """Fetch single detection record by ID."""
    det = db.query(Detection).filter(Detection.id == detection_id).first()
    if not det:
        raise HTTPException(status_code=404, detail="Detection event not found")
    return det


@router.put("/{detection_id}/review")
def review_detection(
    detection_id: int,
    review_data: DetectionReview,
    db: Session = Depends(get_db),
):
    """Review, confirm, correct, or reject an AI detection."""
    det = db.query(Detection).filter(Detection.id == detection_id).first()
    if not det:
        raise HTTPException(status_code=404, detail="Detection not found")

    det.review_status = review_data.review_status
    if review_data.corrected_defect_type:
        det.defect_type = review_data.corrected_defect_type
    if review_data.corrected_severity:
        det.estimated_severity = review_data.corrected_severity

    db.commit()
    db.refresh(det)

    return {
        "status": "success",
        "message": f"Detection {detection_id} marked as '{review_data.review_status}'",
        "detection_id": det.id,
        "review_status": det.review_status,
        "defect_type": det.defect_type,
        "estimated_severity": det.estimated_severity,
    }


@router.post("/{detection_id}/generate-complaint")
def generate_complaint_from_detection(
    detection_id: int,
    road_name: Optional[str] = None,
    description: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Promote a confirmed AI detection into an official structured complaint.
    Automatically assigns unique tracking ID, matches road authority, and dispatches simulated alerts.
    """
    det = db.query(Detection).filter(Detection.id == detection_id).first()
    if not det:
        raise HTTPException(status_code=404, detail="Detection not found")

    # Determine road name if not supplied
    final_road_name = road_name or "NH-65 Vijayawada - Hyderabad Corridor"

    # Match responsible authority
    authority_match = authority_service.resolve_authority(
        road_name=final_road_name,
        latitude=det.latitude,
        longitude=det.longitude,
    )

    dept = db.query(Department).filter(Department.name == authority_match["department_name"]).first()
    dept_id = dept.id if dept else None

    # Priority mapping
    sev = det.estimated_severity
    if sev == SeverityLevel.CRITICAL.value:
        priority = PriorityLevel.P1_CRITICAL.value
    elif sev == SeverityLevel.HIGH.value:
        priority = PriorityLevel.P2_HIGH.value
    elif sev == SeverityLevel.MEDIUM.value:
        priority = PriorityLevel.P3_NORMAL.value
    else:
        priority = PriorityLevel.P4_LOW.value

    # Generate unique complaint
    tracking_id = complaint_service.generate_tracking_id()
    complaint = Complaint(
        public_tracking_id=tracking_id,
        source_type="ai_cctv" if det.camera_id else "ai_upload",
        detection_id=det.id,
        defect_type=det.defect_type,
        description=description or f"AI detected {det.defect_type} ({det.estimated_severity} severity, {round(det.confidence*100, 1)}% confidence).",
        latitude=det.latitude,
        longitude=det.longitude,
        road_name=final_road_name,
        severity=det.estimated_severity,
        priority=priority,
        responsible_department_id=dept_id,
        current_status=ComplaintStatus.COMPLAINT_GENERATED.value,
        evidence_path=det.annotated_path or det.evidence_path,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(complaint)
    db.flush()

    # Add initial history
    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        previous_status=ComplaintStatus.DETECTED.value,
        new_status=ComplaintStatus.COMPLAINT_GENERATED.value,
        changed_by="AI Pipeline / Inspector Review",
        notes=f"Converted from Detection #{det.id}. Assigned to {authority_match['department_name']} ({authority_match['authority_tier']}).",
        changed_at=datetime.utcnow(),
    )
    db.add(history)

    # Update detection status
    det.review_status = "confirmed"

    db.commit()
    db.refresh(complaint)

    # Send notification alert
    notification_service.create_notification(
        db=db,
        complaint_id=complaint.id,
        message=f"New complaint {complaint.public_tracking_id} generated for {det.defect_type} on {final_road_name}.",
    )

    return {
        "status": "success",
        "message": "Complaint successfully generated from AI detection",
        "complaint_id": complaint.id,
        "public_tracking_id": complaint.public_tracking_id,
        "assigned_department": authority_match["department_name"],
        "authority_tier": authority_match["authority_tier"],
        "status": complaint.current_status,
        "priority": complaint.priority,
    }
