"""AI Query API — Evidence-backed question answering (Phase 3)."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.api.auth import get_current_user
from app.services.llm import generate_rag_response
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Document

router = APIRouter()

class QueryRequest(BaseModel):
    question: str
    subsidiary: Optional[str] = None
    year: Optional[int] = None

class Evidence(BaseModel):
    title: str
    page: Optional[int] = None
    content: str
    relevance: float = 0.95

class QueryResponse(BaseModel):
    query_id: str
    question: str
    answer: str
    confidence: str
    sources: List[Evidence]

async def retrieve_context(question: str, db: AsyncSession) -> List[dict]:
    """Retrieve actual documents from the database for context."""
    # Simplified keyword search as fallback for vector search
    keywords = [word for word in question.lower().split() if len(word) > 3]
    
    query = select(Document).where(Document.extracted_text.isnot(None))
    
    if keywords:
        # A basic keyword filter
        for kw in keywords:
            query = query.where(Document.extracted_text.ilike(f"%{kw}%"))
            
    query = query.limit(3)
    result = await db.execute(query)
    docs = result.scalars().all()
    
    if not docs:
        return []
        
    return [
        {
            "title": doc.name,
            "page": 1,
            "content": doc.extracted_text[:1500] if doc.extracted_text else "",
            "relevance": 0.85
        }
        for doc in docs
    ]

@router.post("/", response_model=QueryResponse)
async def submit_query(request: QueryRequest, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Submit a natural language query against the organizational knowledge base.
    Uses RAG (Retrieval-Augmented Generation) to ground the answer in actual documents.
    """
    # 1. Retrieve context
    context_docs = await retrieve_context(request.question, db)
    
    # 2. Generate RAG response via Gemini
    try:
        rag_result = await generate_rag_response(request.question, context_docs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    return QueryResponse(
        query_id="QRY-002",
        question=rag_result["question"],
        answer=rag_result["answer"],
        confidence="High",
        sources=[Evidence(**doc) for doc in context_docs]
    )
