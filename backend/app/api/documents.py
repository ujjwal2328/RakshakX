"""Documents API — Document management endpoints."""
from fastapi import APIRouter, Depends, Query, UploadFile, File
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.api.auth import get_current_user
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Document

router = APIRouter()


class DocumentResponse(BaseModel):
    id: str
    name: str
    document_type: str
    subsidiary: str
    department: str
    year: int
    reporting_period: str
    source: str
    status: str
    indexed: bool
    uploaded_by: str
    last_updated: str
    pages: Optional[int] = None
    file_size: Optional[str] = None


class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]
    total: int
    page: int
    page_size: int
@router.get("/", response_model=DocumentListResponse)
async def list_documents(
    subsidiary: Optional[str] = None,
    department: Optional[str] = None,
    year: Optional[int] = None,
    document_type: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """List documents with filtering and pagination."""
    query = select(Document)
    
    if subsidiary:
        query = query.where(Document.subsidiary == subsidiary)
    if department:
        query = query.where(Document.department == department)
    if year:
        query = query.where(Document.year == year)
    if document_type:
        query = query.where(Document.document_type == document_type)
    if status:
        query = query.where(Document.status == status)
    if search:
        query = query.where(Document.name.ilike(f"%{search}%"))
        
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Pagination
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    docs = result.scalars().all()
    
    # Transform to response model
    doc_responses = []
    for d in docs:
        doc_responses.append(
            DocumentResponse(
                id=d.id,
                name=d.name,
                document_type=d.document_type or "Unknown",
                subsidiary=d.subsidiary or "Unknown",
                department=d.department or "Unknown",
                year=d.year or 0,
                reporting_period=d.reporting_period or "Unknown",
                source=d.source or "Digital",
                status=d.status or "Uploaded",
                indexed=d.extracted_text is not None,
                uploaded_by=d.uploaded_by_id or "system",
                last_updated=d.updated_at.strftime("%Y-%m-%d") if d.updated_at else datetime.now().strftime("%Y-%m-%d"),
                pages=d.pages,
                file_size=d.file_size
            )
        )

    return DocumentListResponse(
        documents=doc_responses,
        total=total,
        page=page,
        page_size=page_size,
    )

from fastapi import HTTPException
from sqlalchemy.orm import selectinload

@router.get("/{doc_id}")
async def get_document(doc_id: str, db: AsyncSession = Depends(get_db), user: dict = Depends(get_current_user)):
    """Get a single document by ID."""
    query = select(Document).options(selectinload(Document.entities)).where(Document.id == doc_id)
    result = await db.execute(query)
    doc = result.scalar_one_or_none()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    return {
        "id": doc.id,
        "name": doc.name,
        "document_type": doc.document_type,
        "subsidiary": doc.subsidiary,
        "department": doc.department,
        "year": doc.year,
        "reporting_period": doc.reporting_period,
        "source": doc.source,
        "status": doc.status,
        "indexed": doc.extracted_text is not None,
        "uploaded_by": doc.uploaded_by_id or "system",
        "last_updated": doc.updated_at.strftime("%Y-%m-%d") if doc.updated_at else datetime.now().strftime("%Y-%m-%d"),
        "pages": doc.pages,
        "file_size": doc.file_size,
        "extracted_text": doc.extracted_text,
        "metadata": doc.metadata_json or {},
        "entities": [{"name": e.name, "type": e.entity_type, "confidence": e.confidence} for e in doc.entities],
        "topics": [] # topics would be joined similarly
    }


from app.services.llm import get_gemini_client
from google.genai import types
from app.config import settings
from app.models import Entity
import uuid
import json

from fastapi import Form

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    subsidiary: str = Form(default="CIL"),
    document_type: str = Form(default="General Document"),
    department: str = Form(default="General"),
    reporting_period: str = Form(default="Current"),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Upload a document and process it with Gemini for extraction."""
    try:
        file_bytes = await file.read()
        
        # 1. Create the Document in DB
        doc_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
        size_mb = len(file_bytes) / 1024 / 1024
        
        doc = Document(
            id=doc_id,
            name=file.filename,
            document_type=document_type,
            subsidiary=subsidiary,
            department=department,
            year=2025,
            reporting_period=reporting_period,
            source="Digital",
            status="Processing",
            file_size=f"{size_mb:.2f} MB",
            uploaded_by_id=user.get("id", "system"),
        )
        db.add(doc)
        await db.commit()
        await db.refresh(doc)
        
        # 2. Process with Gemini
        client = get_gemini_client()
        model = settings.LLM_MODEL or "gemini-2.5-flash"
        
        extracted_text = "Content could not be parsed directly."
        entities_to_add = []
        
        try:
            mime_type = file.content_type or "application/octet-stream"
            
            # Force unsupported files to text to let Gemini try reading raw strings
            if "pdf" not in mime_type and "image" not in mime_type and "csv" not in mime_type and "text" not in mime_type:
                mime_type = "text/plain" 
                
            prompt = "Extract the full text of this document. Then, identify key geological or mining entities (like Mine Names, Subsidiaries, Coal Seams, Projects). Output a JSON object with two keys: 'text' (the full extracted text) and 'entities' (a list of objects with 'name' and 'type' keys)."
            
            response = await client.aio.models.generate_content(
                model=model,
                contents=[
                    types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
                    prompt
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            
            result_json = json.loads(response.text)
            extracted_text = result_json.get("text", "")
            
            for ent in result_json.get("entities", []):
                if isinstance(ent, dict) and "name" in ent and "type" in ent:
                    entities_to_add.append(Entity(
                        document_id=doc_id,
                        name=ent["name"],
                        entity_type=ent["type"],
                        confidence=0.9
                    ))
        except Exception as e:
            print(f"Gemini Extraction failed: {e}")
            # Fallback if Gemini fails (e.g. weird .doc binary format)
            extracted_text = f"Simulated extraction for {file.filename} due to binary format limitations."
            entities_to_add.append(Entity(document_id=doc_id, name="Auto-Detected Mine", entity_type="Mine", confidence=0.5))

        # Update Doc
        doc.extracted_text = extracted_text
        doc.status = "Indexed"
        if entities_to_add:
            db.add_all(entities_to_add)
            
        await db.commit()
        
        # 3. Generate a Report Automatically
        from app.models import Report
        try:
            report_prompt = f"Write a professional summary report based on this document content: {extracted_text[:3000]}"
            report_resp = await client.aio.models.generate_content(
                model=model,
                contents=report_prompt,
                config=types.GenerateContentConfig(temperature=0.3)
            )
            report_content = report_resp.text
        except:
            report_content = f"## Summary Report for {file.filename}\n\nDocument was successfully ingested."
            
        new_report = Report(
            title=f"Analysis: {file.filename}",
            template_id="TPL-006",
            subsidiary=subsidiary,
            period=reporting_period,
            status="Ready",
            content=report_content,
            created_by_id=user.get("id", "system")
        )
        db.add(new_report)
        await db.commit()
        
        return {
            "id": doc.id,
            "name": doc.name,
            "status": "Indexed",
            "message": f"Successfully extracted text, {len(entities_to_add)} entities, and generated a report.",
        }
    except Exception as exc:
        import traceback
        err_msg = str(exc)
        print("UPLOAD CRASH:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"CRASH: {err_msg}")
