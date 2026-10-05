import asyncio
import os
import glob
import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from app.models import Base, Document, Entity, Report
from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

def generate_report_content(title):
    title_lower = title.lower()
    if "mining strategy" in title_lower:
        return """# Mining Strategy for Korba Coalfields

## 1. Executive Summary
The mining strategy for the Korba Coalfields (KCF) focuses on maximizing extraction from existing mega opencast projects (OCPs) such as Gevra, Kusmunda, and Dipka, while systematically transitioning deep-seated reserves to underground (UG) mining.

## 2. Opencast Mining (OCP)
The master plan envisions the integration of state-of-the-art dispatch systems, higher capacity Heavy Earth Moving Machinery (HEMM) including 42-cum shovels and 240-Ton dumpers.
* **Gevra OCP:** Targeted expansion to 70 MTPA.
* **Kusmunda OCP:** Targeted expansion to 50 MTPA.
* **Dipka OCP:** Targeted expansion to 40 MTPA.

## 3. Underground Mining
For reserves beyond the techno-economic stripping ratio, mechanised underground mining (Continuous Miners / Longwall) is proposed.

## 4. Land & Rehabilitation
Minimizing land acquisition delays by implementing proactive R&R strategies and maximizing backfilling of exhausted quarries to reclaim land concurrently.
"""
    elif "environment" in title_lower:
        return """# Environment & Ecology Action Plan

## 1. Overview
Sustainable mining in the Korba Coalfields requires a robust Environmental Management Plan (EMP). This section outlines the mitigation measures for air, water, and noise pollution.

## 2. Air Quality Management
* Deployment of continuous ambient air quality monitoring stations (CAAQMS).
* Use of surface miners to eliminate drilling and blasting emissions.
* Extensive plantation along haul roads and external OB dumps.

## 3. Water Management
* Zero Liquid Discharge (ZLD) systems implemented across all mega projects.
* Sump water treatment for use in dust suppression and domestic supply.
* Artificial groundwater recharge in surrounding villages.

## 4. Afforestation
Concurrent biological reclamation of OB dumps. Target: 50,000 saplings per year.
"""
    elif "safety" in title_lower:
        return """# Comprehensive Safety Plan

## 1. Risk Assessment
Hazard Identification and Risk Assessment (HIRA) has been conducted for all active mining zones, workshops, and CHP areas.

## 2. Slope Stability
Continuous monitoring of highwall slopes in Gevra and Kusmunda using Slope Stability Radar (SSR) technology to prevent failures.

## 3. Machinery Safety
* Installation of Proximity Warning systems and Rear-view cameras on all dumpers.
* Regular brake testing and preventive maintenance schedules.

## 4. Training
Mandatory simulator-based training for all HEMM operators before deployment.
"""
    else:
        return f"""# Summary Analysis: {title}

## 1. Introduction
This report contains an auto-generated summary based on the ingested document for {title}.

## 2. Key Findings
* The document outlines the critical operational parameters.
* Extracted data aligns with the SECL master plan objectives for Korba Coalfields.

## 3. Recommendations
* Review the detailed tables in the original document.
* Update the central database with the latest figures before the end of the quarter.
"""


async def insert_mock_data():
    data_dir = r"f:\RakshakX\Master Plan KORBA CF\Master Plan KORBA CF\FINAL TEXT"
    doc_files = glob.glob(f"{data_dir}\\*.doc")
    
    async with async_session() as session:
        # First check if documents exist, if not, ingest them
        res = await session.execute(text("SELECT count(id) FROM documents"))
        count = res.scalar()
        
        # We will just append the Reports
        print("Generating mock reports for Master Plan Korba chapters...")
        reports_added = 0
        
        # User to attribute to
        res_user = await session.execute(text("SELECT id FROM users LIMIT 1"))
        user_id = res_user.scalar() or "system"
        
        for filepath in doc_files:
            filename = os.path.basename(filepath)
            title_clean = filename.replace(".doc", "").replace("-", " ").title()
            
            # Check if report already exists for this title
            existing = await session.execute(text("SELECT id FROM reports WHERE title LIKE :title"), {"title": f"%{title_clean}%"})
            if existing.scalar():
                continue
                
            report_status = "Approved" if "Strategy" in title_clean or "Environment" in title_clean else "Draft Generated"
            template_id = "TPL-006"
            if "Environment" in title_clean: template_id = "TPL-004"
            if "Safety" in title_clean: template_id = "TPL-005"
            
            rpt = Report(
                id=f"RPT-{uuid.uuid4().hex[:8].upper()}",
                title=f"Analysis: {title_clean}",
                template_id=template_id,
                subsidiary="SECL",
                period="FY2025",
                status=report_status,
                content=generate_report_content(title_clean),
                created_at=datetime.now(timezone.utc) - timedelta(days=reports_added % 5),
                created_by_id=user_id
            )
            session.add(rpt)
            reports_added += 1
            
        await session.commit()
        print(f"Successfully added {reports_added} mock reports based on Master Plan Korba CF.")

if __name__ == "__main__":
    asyncio.run(insert_mock_data())
