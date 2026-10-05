"""GIS API — Spatial data and map features."""
from fastapi import APIRouter, Depends
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/features")
async def get_features(user: dict = Depends(get_current_user)):
    """Get GIS features for map display."""
    return {"features": [], "message": "GIS Explorer — Phase 8"}
