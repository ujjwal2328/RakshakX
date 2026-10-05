"""Reports API — Report generation and management (Phase 4)."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.api.auth import get_current_user
from app.services.llm import get_gemini_client
from google.genai import types
from app.config import settings
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Document, Report
import uuid

router = APIRouter()

class ReportGenerateRequest(BaseModel):
    template_id: str
    title: str
    subsidiary: str
    period: str
    instructions: Optional[str] = None

class ReportGenerateResponse(BaseModel):
    report_id: str
    title: str
    status: str
    content: str
    sections: List[Dict[str, str]]

@router.get("/")
async def list_reports(user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """List generated reports."""
    query = select(Report).order_by(Report.created_at.desc())
    result = await db.execute(query)
    reports = result.scalars().all()
    
    return {
        "reports": [
            {
                "id": r.id,
                "title": r.title,
                "template": r.template_id,
                "subsidiary": r.subsidiary,
                "period": r.period,
                "status": r.status,
                "created_at": r.created_at.strftime("%Y-%m-%d") if r.created_at else None
            } for r in reports
        ],
        "total": len(reports),
        "message": "Report Factory — Real Data"
    }


@router.get("/templates")
async def list_templates(user: dict = Depends(get_current_user)):
    """List available report templates."""
    return {
        "templates": [
            {"id": "TPL-001", "name": "Geological Report", "sections": 8},
            {"id": "TPL-002", "name": "Production Report", "sections": 6},
            {"id": "TPL-003", "name": "Exploration Report", "sections": 7},
            {"id": "TPL-004", "name": "Environmental Report", "sections": 9},
            {"id": "TPL-005", "name": "Safety Report", "sections": 5},
            {"id": "TPL-006", "name": "Monthly Report", "sections": 4},
            {"id": "TPL-007", "name": "Annual Report", "sections": 12},
            {"id": "TPL-008", "name": "Parliamentary Response", "sections": 3},
            {"id": "TPL-009", "name": "Executive Brief", "sections": 3},
        ]
    }


@router.get("/{report_id}")
async def get_report(report_id: str, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Get a single report by ID."""
    query = select(Report).where(Report.id == report_id)
    result = await db.execute(query)
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return {
        "id": report.id,
        "title": report.title,
        "template": report.template_id,
        "subsidiary": report.subsidiary,
        "period": report.period,
        "status": report.status,
        "content": report.content,
        "created_at": report.created_at.strftime("%Y-%m-%d") if report.created_at else None,
    }


@router.post("/generate", response_model=ReportGenerateResponse)
async def generate_report(request: ReportGenerateRequest, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Generate an AI-assisted report draft based on a template and contextual data.
    """
    client = get_gemini_client()
    
    # Retrieve data from DB based on request
    query = select(Document).where(Document.subsidiary == request.subsidiary)
    result = await db.execute(query.limit(5))
    docs = result.scalars().all()
    
    doc_summaries = "\n".join([f"- {d.name} ({d.document_type}): {d.extracted_text[:100] if d.extracted_text else 'No text'}" for d in docs])
    
    data_context = f"""
    Subsidiary: {request.subsidiary}
    Period: {request.period}
    Relevant Documents Available:
    {doc_summaries if docs else 'No relevant documents found for this subsidiary in the database.'}
    """
    
    prompt = f"""
    You are an expert report writer for Coal India Limited.
    Please generate a professional report draft for the following request:
    
    Report Title: {request.title}
    Template Type: {request.template_id}
    Additional Instructions: {request.instructions or 'None'}
    
    Context Data available:
    {data_context}
    
    Format the report with clear Markdown headings (e.g., ## 1. Executive Summary, ## 2. Operations, etc.).
    """
    
    model = settings.LLM_MODEL or "gemini-2.5-flash"
    
    try:
        response = await client.aio.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
            )
        )
        content = response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")
        
    report = Report(
        title=request.title,
        template_id=request.template_id,
        subsidiary=request.subsidiary,
        period=request.period,
        content=content,
        created_by_id=user.get("id") if user else None
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
        
    return ReportGenerateResponse(
        report_id=report.id,
        title=report.title,
        status=report.status,
        content=content,
        sections=[{"title": "Full Report", "content": content}]
    )
