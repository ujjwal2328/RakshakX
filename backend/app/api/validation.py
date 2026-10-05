"""Validation API — Data consistency checking (Phase 5)."""
from fastapi import APIRouter, Depends
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/")
async def list_validations(user: dict = Depends(get_current_user)):
    """List data consistency validations and conflicts."""
    return {
        "validations": [
            {
                "id": "VAL-001", "type": "Numerical Conflict", "severity": "warning",
                "title": "Production value differs across two sources",
                "description": "NCL Monthly Production — July 2025",
                "sourceA": {"document": "Monthly Production Report — July 2025 — NCL", "value": "12.4 MT", "page": 8},
                "sourceB": {"document": "Quarterly Production Summary — Q1 2025-26 — NCL", "value": "11.9 MT", "page": 12},
                "status": "Open",
            },
            {
                "id": "VAL-002", "type": "Numerical Conflict", "severity": "warning",
                "title": "Overburden removal figures inconsistent",
                "description": "SECL Gevra OCP — FY 2024-25",
                "sourceA": {"document": "Annual Geological Report FY2024-25 — SECL", "value": "245.8 MCuM", "page": 34},
                "sourceB": {"document": "Mine Performance Report — Gevra OCP", "value": "248.2 MCuM", "page": 6},
                "status": "Open",
            },
            {
                "id": "VAL-003", "type": "Missing Citation", "severity": "info",
                "title": "AI-generated section lacks source reference",
                "description": "Draft Production Report — July 2025 — SECL, Section 4.2",
                "sourceA": {"document": "Draft Production Report", "value": "Section 4.2: Coal dispatch analysis", "page": 15},
                "sourceB": None,
                "status": "Open",
            },
            {
                "id": "VAL-004", "type": "Extraction Error", "severity": "danger",
                "title": "Table extraction failed — scanned document",
                "description": "Geological Mapping — Singrauli Coalfield, pages 45-67",
                "sourceA": {"document": "Geological Mapping — Singrauli Coalfield", "value": "Tables could not be extracted from scanned pages", "page": 45},
                "sourceB": None,
                "status": "Manual Review Required",
            },
        ],
        "summary": {
            "open_issues": 4,
            "critical": 1,
            "warnings": 2,
            "resolved_month": 12
        }
    }
