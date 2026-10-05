import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON, Float, Integer, Boolean
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    full_name = Column(String)
    role = Column(String)
    organization = Column(String)
    subsidiary = Column(String, nullable=True)
    department = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    documents = relationship("Document", back_populates="uploaded_by")

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, default=lambda: f"DOC-{uuid.uuid4().hex[:8].upper()}")
    name = Column(String, index=True)
    document_type = Column(String)
    subsidiary = Column(String)
    department = Column(String)
    reporting_period = Column(String)
    year = Column(Integer)
    source = Column(String)  # Digital or Scanned
    status = Column(String, default="Uploaded")
    pages = Column(Integer, nullable=True)
    file_size = Column(String, nullable=True)
    object_key = Column(String)  # MinIO path
    uploaded_by_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # NLP & Extraction fields
    extracted_text = Column(Text, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    
    uploaded_by = relationship("User", back_populates="documents")
    entities = relationship("Entity", back_populates="document", cascade="all, delete-orphan")
    tables = relationship("TableExtraction", back_populates="document", cascade="all, delete-orphan")

class Entity(Base):
    __tablename__ = "entities"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"))
    entity_type = Column(String)
    name = Column(String, index=True)
    confidence = Column(Float)
    mentions = Column(Integer, default=1)
    
    document = relationship("Document", back_populates="entities")
    
class TableExtraction(Base):
    __tablename__ = "table_extractions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"))
    page_number = Column(Integer)
    table_index = Column(Integer)
    data_json = Column(JSON)  # Extracted tabular data
    
    document = relationship("Document", back_populates="tables")
    
class Topic(Base):
    __tablename__ = "topics"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)

class DocumentTopic(Base):
    __tablename__ = "document_topics"
    document_id = Column(String, ForeignKey("documents.id"), primary_key=True)
    topic_id = Column(String, ForeignKey("topics.id"), primary_key=True)
    confidence = Column(Float)

class Report(Base):
    __tablename__ = "reports"
    id = Column(String, primary_key=True, default=lambda: f"RPT-{uuid.uuid4().hex[:8].upper()}")
    title = Column(String)
    template_id = Column(String)
    subsidiary = Column(String)
    period = Column(String)
    status = Column(String, default="Draft Generated")
    content = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_by_id = Column(String, ForeignKey("users.id"))
