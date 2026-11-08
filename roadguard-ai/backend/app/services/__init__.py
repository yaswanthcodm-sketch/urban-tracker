"""
RoadGuard AI — Services package
"""
from .geospatial import haversine_distance_meters, validate_coordinates, reverse_geocode
from .complaint_service import generate_unique_tracking_id, check_for_duplicate_complaint, transition_complaint_status
from .ai_detection import ai_service
from .authority_service import match_department_by_road, submit_complaint_to_authority
from .notification_service import create_notification, notify_complaint_event, check_and_escalate_overdue_complaints
from .verification_service import compare_before_after_images

__all__ = [
    "haversine_distance_meters",
    "validate_coordinates",
    "reverse_geocode",
    "generate_unique_tracking_id",
    "check_for_duplicate_complaint",
    "transition_complaint_status",
    "ai_service",
    "match_department_by_road",
    "submit_complaint_to_authority",
    "create_notification",
    "notify_complaint_event",
    "check_and_escalate_overdue_complaints",
    "compare_before_after_images",
]
