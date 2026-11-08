"""
RoadGuard AI — Notifications & Escalation Alerts API Routes
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.models import Notification
from ..schemas.schemas import NotificationResponse
from ..services.notification_service import notification_service

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    unread_only: bool = Query(False),
    limit: int = Query(30, le=100),
    db: Session = Depends(get_db),
):
    """Retrieve in-app notifications and grievance alert logs."""
    query = db.query(Notification).order_by(Notification.created_at.desc())
    if unread_only:
        query = query.filter(Notification.is_read == False)
    return query.limit(limit).all()


@router.put("/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    """Mark a notification as read."""
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"status": "success", "notification_id": notif.id, "is_read": True}


@router.post("/scan-escalations")
def trigger_escalation_scan(db: Session = Depends(get_db)):
    """
    Scan all active complaints against department SLA targets.
    Generates automated escalation alerts for overdue repairs.
    """
    escalated = notification_service.scan_and_escalate_overdue_complaints(db)
    return {
        "status": "success",
        "total_escalations_triggered": len(escalated),
        "escalated_complaints": escalated,
    }
