"""Approvals API — Review and approval workflows."""
from fastapi import APIRouter, Depends
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/")
async def list_approvals(user: dict = Depends(get_current_user)):
    """List pending approvals."""
    return {"approvals": [], "total": 0, "message": "Review & Approvals — Phase 5"}
