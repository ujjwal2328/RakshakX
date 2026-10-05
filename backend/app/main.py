"""
Coal Intelligence & Reporting System — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog

from app.config import settings
from app.api import auth, documents, search, query, reports, topics, analytics, gis, validation, approvals, audit, notifications, admin

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    logger.info("Starting Coal Intelligence & Reporting System", version=settings.APP_VERSION)
    yield
    logger.info("Shutting down Coal Intelligence & Reporting System")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Geological, Mining & Reporting Solution for CMPDI/CIL",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(query.router, prefix="/api/query", tags=["AI Query"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(topics.router, prefix="/api/topics", tags=["Topics"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(gis.router, prefix="/api/gis", tags=["GIS"])
app.include_router(validation.router, prefix="/api/validation", tags=["Validation"])
app.include_router(approvals.router, prefix="/api/approvals", tags=["Approvals"])
app.include_router(audit.router, prefix="/api/audit", tags=["Audit"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(admin.router, prefix="/api/admin", tags=["Administration"])


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }
