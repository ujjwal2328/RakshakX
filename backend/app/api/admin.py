"""Administration API — System and user management."""
from fastapi import APIRouter, Depends
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/users")
async def list_users(user: dict = Depends(get_current_user)):
    """List system users (admin only)."""
    if user.get("role") != "system_admin":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return {"users": [], "total": 0, "message": "User management — Phase 9"}
