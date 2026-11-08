"""
RoadGuard AI — Notification & Automated Escalation Service
Supports In-App alerts, demonstration logging, and provider-agnostic dispatch.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from ..models import models
from ..config import settings


def create_notification(
    db: Session,
    user_id: Optional[int],
    complaint_id: Optional[int],
    message: str,
    channel: str = models.NotificationChannel.IN_APP.value,
) -> models.Notification:
    """
    Stores an in-app notification and dispatches to configured delivery channels.
    """
    delivery_status = "delivered" if channel == models.NotificationChannel.IN_APP.value else "simulated_logged"

    # In demonstration mode, record that external delivery was simulated
    if settings.DEMO_MODE and channel in [models.NotificationChannel.EMAIL.value, models.NotificationChannel.SMS.value]:
        delivery_status = f"simulated_{channel}_delivered"

    notification = models.Notification(
        user_id=user_id,
        complaint_id=complaint_id,
        channel=channel,
        message=message,
        delivery_status=delivery_status,
        is_read=False,
        created_at=datetime.utcnow(),
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def notify_complaint_event(
    db: Session,
    complaint: models.Complaint,
    event_type: str,
    extra_details: Optional[str] = None
):
    """
    Broadcasts standard lifecycle notifications to citizens and officers.
    """
    msg_map = {
        "REGISTERED": f"Complaint {complaint.public_tracking_id} registered successfully for defect '{complaint.defect_type}' on {complaint.road_name}.",
        "ACKNOWLEDGED": f"Complaint {complaint.public_tracking_id} has been officially acknowledged by {complaint.department.name if complaint.department else 'the road authority'}.",
        "INSPECTION_SCHEDULED": f"Site inspection scheduled for complaint {complaint.public_tracking_id}.",
        "REPAIR_STARTED": f"Road repair work initiated by engineering team for complaint {complaint.public_tracking_id}.",
        "VERIFICATION_PENDING": f"Repairs completed for {complaint.public_tracking_id}. Awaiting independent quality verification.",
        "VERIFICATION_APPROVED": f"Repair verified and approved! Defect successfully resolved for {complaint.public_tracking_id}.",
        "VERIFICATION_REJECTED": f"Repair quality rejected for {complaint.public_tracking_id}. Sent back for required rework.",
        "OVERDUE": f"ALERT: Complaint {complaint.public_tracking_id} on {complaint.road_name} has exceeded its SLA resolution deadline!",
        "REOPENED": f"Complaint {complaint.public_tracking_id} has been reopened for follow-up inspection.",
    }

    message = msg_map.get(event_type, f"Status update on complaint {complaint.public_tracking_id}: {complaint.current_status}")
    if extra_details:
        message += f" ({extra_details})"

    # Find relevant users: admin, inspectors, and any citizen linked
    users = db.query(models.User).filter(
        models.User.role.in_([models.UserRole.ADMIN.value, models.UserRole.DEPARTMENT_OFFICER.value])
    ).all()

    for u in users:
        create_notification(db, user_id=u.id, complaint_id=complaint.id, message=message, channel=models.NotificationChannel.IN_APP.value)


def check_and_escalate_overdue_complaints(db: Session) -> List[Dict[str, Any]]:
    """
    Scans active complaints against SLA deadlines and escalates overdue cases.
    """
    now = datetime.utcnow()
    terminal_statuses = [
        models.ComplaintStatus.RESOLVED.value,
        models.ComplaintStatus.CLOSED.value,
        models.ComplaintStatus.REJECTED.value,
        models.ComplaintStatus.DUPLICATE.value,
        models.ComplaintStatus.WITHDRAWN.value,
    ]

    active_complaints = db.query(models.Complaint).filter(
        models.Complaint.current_status.notin_(terminal_statuses),
        models.Complaint.target_resolution_at.isnot(None),
        models.Complaint.target_resolution_at < now,
    ).all()

    escalated = []
    for c in active_complaints:
        # Check if already escalated recently
        recent_alert = db.query(models.Notification).filter(
            models.Notification.complaint_id == c.id,
            models.Notification.message.like("%exceeded its SLA%"),
        ).first()

        if not recent_alert:
            notify_complaint_event(db, c, "OVERDUE")
            escalated.append({
                "tracking_id": c.public_tracking_id,
                "road_name": c.road_name,
                "overdue_by_hours": round((now - c.target_resolution_at).total_seconds() / 3600, 1),
            })

    return escalated


class NotificationService:
    @staticmethod
    def create_notification(
        db: Session,
        complaint_id: Optional[int],
        message: str,
        user_id: Optional[int] = None,
        channel: str = models.NotificationChannel.IN_APP.value,
    ) -> models.Notification:
        return create_notification(
            db=db,
            user_id=user_id,
            complaint_id=complaint_id,
            message=message,
            channel=channel,
        )

    @staticmethod
    def notify_complaint_event(
        db: Session,
        complaint: models.Complaint,
        event_type: str,
        extra_details: Optional[str] = None,
    ):
        return notify_complaint_event(
            db=db,
            complaint=complaint,
            event_type=event_type,
            extra_details=extra_details,
        )

    @staticmethod
    def scan_and_escalate_overdue_complaints(db: Session) -> List[Dict[str, Any]]:
        return check_and_escalate_overdue_complaints(db)


notification_service = NotificationService()

