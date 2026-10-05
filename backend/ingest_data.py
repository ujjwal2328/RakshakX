import os
import glob
import pandas as pd
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from app.models import Base, Document, Entity, Topic, DocumentTopic
from app.config import settings
from datetime import datetime, timezone
import uuid

# Connect to database
engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

def normalize_mine_name(name: str) -> str:
    if not isinstance(name, str):
        return str(name)
    n = name.upper().strip()
    if 'GEVRA' in n: return 'GEVRA'
    if 'KUSMUNDA' in n: return 'KUSMUNDA'
    if 'DIPKA' in n: return 'DIPKA'
    if 'KORBA' in n: return 'KORBA'
    if 'MANIKPUR' in n: return 'MANIKPUR'
    return name.title()

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

async def ingest_documents():
    data_dir = r"f:\RakshakX\Master Plan KORBA CF\Master Plan KORBA CF"
    
    docs_to_insert = []
    
    async with async_session() as session:
        # Ingest .doc files
        doc_files = glob.glob(f"{data_dir}\\**\\*.doc", recursive=True)
        for filepath in doc_files:
            filename = os.path.basename(filepath)
            size = os.path.getsize(filepath)
            
            # Simple heuristic classification
            doc_type = "Geological Report" if "geo" in filename.lower() else "Project Report"
            if "environ" in filename.lower(): doc_type = "Environmental Report"
            if "safety" in filename.lower(): doc_type = "Safety Report"
            
            doc = Document(
                id=f"DOC-{uuid.uuid4().hex[:8].upper()}",
                name=filename,
                document_type=doc_type,
                subsidiary="SECL",
                department="Planning",
                year=2011,
                reporting_period="Master Plan",
                source="Digital",
                status="Indexed",
                file_size=f"{size / 1024 / 1024:.2f} MB",
                uploaded_by_id="system",
                extracted_text=f"Extracted content from {filename}...", # Placeholder for real extraction
                metadata_json={"source_path": filepath}
            )
            session.add(doc)
            docs_to_insert.append(doc)
            
        # Ingest .xls files (Production, Land, Manpower)
        xls_files = glob.glob(f"{data_dir}\\**\\*.xls", recursive=True)
        for filepath in xls_files:
            filename = os.path.basename(filepath)
            size = os.path.getsize(filepath)
            
            doc_type = "Production Report" if "prod" in filename.lower() else "Data Table"
            if "land" in filename.lower(): doc_type = "Land Report"
            if "manpower" in filename.lower(): doc_type = "Manpower Report"
            
            doc = Document(
                id=f"DOC-{uuid.uuid4().hex[:8].upper()}",
                name=filename,
                document_type=doc_type,
                subsidiary="SECL",
                department="Planning",
                year=2011,
                reporting_period="Master Plan",
                source="Digital",
                status="Indexed",
                file_size=f"{size / 1024 / 1024:.2f} MB",
                uploaded_by_id="system",
                metadata_json={"source_path": filepath}
            )
            session.add(doc)
            docs_to_insert.append(doc)
            
            # Optionally extract entities from production data
            if "prod" in filename.lower():
                try:
                    df = pd.read_excel(filepath, nrows=20)
                    for _, row in df.iterrows():
                        # basic entity extraction logic for demo
                        val = str(row.iloc[0]).strip()
                        if val and len(val) > 3 and val.lower() != 'nan':
                            entity = Entity(
                                document_id=doc.id,
                                entity_type="Mine",
                                name=normalize_mine_name(val),
                                confidence=0.95
                            )
                            session.add(entity)
                except Exception as e:
                    print(f"Error reading excel {filename}: {e}")
                    
        await session.commit()
        print(f"Ingested {len(docs_to_insert)} documents from Master Plan Korba CF.")

async def main():
    print("Initializing Database...")
    await init_db()
    print("Ingesting Real Data...")
    await ingest_documents()
    print("Data Ingestion Complete.")

if __name__ == "__main__":
    asyncio.run(main())
