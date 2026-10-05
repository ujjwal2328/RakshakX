"""Notifications API — User notifications."""
from fastapi import APIRouter, Depends
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/")
async def list_notifications(user: dict = Depends(get_current_user)):
    """List user notifications."""
    return {
        "notifications": [
            {"id": "NTF-001", "type": "info", "title": "Document processing complete", "message": "Annual Geological Report FY2024-25 has been indexed successfully.", "read": False, "timestamp": "2025-08-20T10:30:00Z"},
            {"id": "NTF-002", "type": "warning", "title": "Validation conflict detected", "message": "Production values differ across two sources for NCL — July 2025.", "read": False, "timestamp": "2025-08-19T14:15:00Z"},
            {"id": "NTF-003", "type": "action", "title": "Report awaiting review", "message": "Monthly Production Report — July 2025 is ready for technical review.", "read": True, "timestamp": "2025-08-18T09:00:00Z"},
            {"id": "NTF-004", "type": "error", "title": "Extraction failed", "message": "Geological Mapping — Singrauli Coalfield: Unable to extract tabular content from scanned pages 45-67.", "read": True, "timestamp": "2025-08-17T16:45:00Z"},
        ],
        "unread_count": 2,
    }
