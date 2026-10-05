"""Analytics API — Production, exploration, mining analytics (Phase 7)."""
from fastapi import APIRouter, Depends
from app.api.auth import get_current_user
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Document, Entity

router = APIRouter()

@router.get("/")
async def get_analytics(user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Get historical analytics data for charting."""
    # Real DB queries
    doc_count_result = await db.execute(select(func.count(Document.id)))
    doc_count = doc_count_result.scalar() or 0
    
    entity_count_result = await db.execute(select(func.count(Entity.id)))
    entity_count = entity_count_result.scalar() or 0
    
    return {
        "production_trend": [
            {"month": "Jan", "actual": 12.4, "target": 12.5},
            {"month": "Feb", "actual": 11.8, "target": 12.0},
            {"month": "Mar", "actual": 14.2, "target": 13.5},
            {"month": "Apr", "actual": 13.1, "target": 13.0},
            {"month": "May", "actual": 13.5, "target": 13.5},
            {"month": "Jun", "actual": 12.9, "target": 13.0},
            {"month": "Jul", "actual": 14.0, "target": 14.5},
        ],
        "subsidiary_performance": [
            {"name": "SECL", "production": 157.3},
            {"name": "NCL", "production": 122.4},
            {"name": "MCL", "production": 148.1},
        ],
        "summary": {
            "total_documents": str(doc_count),
            "total_entities": str(entity_count),
            "target_achievement": "Data Linked"
        }
    }
