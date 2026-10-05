"""Search API — Global search across all entities."""
from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.api.auth import get_current_user
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Document, Entity, Report

router = APIRouter()


@router.get("/")
async def global_search(
    q: str = Query(..., min_length=1),
    entity_type: Optional[str] = None,
    subsidiary: Optional[str] = None,
    year: Optional[int] = None,
    page: int = Query(1, ge=1),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Search across documents, reports, entities, mines, projects, boreholes, topics."""
    results = []
    
    # 1. Search Documents
    if not entity_type or entity_type == 'document':
        doc_query = select(Document).where(Document.name.ilike(f"%{q}%"))
        if subsidiary: doc_query = doc_query.where(Document.subsidiary == subsidiary)
        if year: doc_query = doc_query.where(Document.year == year)
        
        doc_result = await db.execute(doc_query.limit(5))
        docs = doc_result.scalars().all()
        for d in docs:
            results.append({
                "type": "document", "id": d.id, "title": d.name,
                "snippet": d.extracted_text[:100] + "..." if d.extracted_text else f"Document: {d.document_type}",
                "relevance": 0.90
            })
            
    # 2. Search Entities
    if not entity_type or entity_type == 'entity':
        ent_query = select(Entity).where(Entity.name.ilike(f"%{q}%"))
        ent_result = await db.execute(ent_query.limit(5))
        entities = ent_result.scalars().all()
        for e in entities:
            results.append({
                "type": "entity", "id": e.id, "title": e.name,
                "snippet": f"Entity type: {e.entity_type}, found in {e.document_id}",
                "relevance": 0.85
            })
            
    # 3. Search Reports
    if not entity_type or entity_type == 'report':
        rpt_query = select(Report).where(Report.title.ilike(f"%{q}%"))
        if subsidiary: rpt_query = rpt_query.where(Report.subsidiary == subsidiary)
        
        rpt_result = await db.execute(rpt_query.limit(5))
        reports = rpt_result.scalars().all()
        for r in reports:
            results.append({
                "type": "report", "id": r.id, "title": r.title,
                "snippet": r.content[:100] + "..." if r.content else f"Template: {r.template_id}",
                "relevance": 0.95
            })
            
    return {
        "query": q,
        "results": results,
        "total": len(results),
        "page": page,
    }
