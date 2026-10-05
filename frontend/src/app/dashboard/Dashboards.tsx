'use client';
import React, { useState, useEffect } from 'react';
import { Clock, FileText, CheckCircle2, AlertTriangle, AlertCircle, Pickaxe, BookOpen, Send, Upload, FileOutput, Search, ShieldCheck } from 'lucide-react';

export function MineAuthorityDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics') // Assuming proxy or next config handles this, otherwise we use process.env.NEXT_PUBLIC_API_URL
      .then(res => res.json())
      .catch(() => null)
      .then(setData);
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Mining Operations & Reporting</h1>
          <p className="page-subtitle">Track production, reports, and pending verifications</p>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Reports Awaiting Review</div>
          <div className="kpi-value" style={{color: 'var(--color-warning)'}}>0</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Documents</div>
          <div className="kpi-value">{data?.summary?.total_documents || '0'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Extracted Entities</div>
          <div className="kpi-value" style={{color: 'var(--color-success)'}}>{data?.summary?.total_entities || '0'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pending Queries</div>
          <div className="kpi-value" style={{color: 'var(--color-danger)'}}>0</div>
        </div>
      </div>
      <div className="section-grid" style={{marginTop: 'var(--space-6)'}}>
        <div className="card">
          <div className="card-header"><div className="card-title">Quick Actions</div></div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <button className="btn btn-secondary"><Upload size={14}/> Upload Document</button>
            <button className="btn btn-secondary"><FileOutput size={14}/> Prepare Report</button>
            <button className="btn btn-secondary"><Search size={14}/> Search Records</button>
            <button className="btn btn-secondary"><ShieldCheck size={14}/> Verify Data</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Pending Actions</div></div>
          <ul className="attention-list">
            {data?.summary?.total_documents === '0' && (
              <li className="attention-item"><AlertTriangle size={16} className="attention-icon warning"/><div className="attention-content"><div className="attention-title">No documents ingested. Please run data ingestion.</div></div></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ParliamentaryDashboard() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Parliamentary & Administrative Query Management</h1>
          <p className="page-subtitle">Track and prepare evidence-backed responses</p>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Open Questions</div>
          <div className="kpi-value">0</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Due Soon</div>
          <div className="kpi-value" style={{color: 'var(--color-danger)'}}>0</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Drafts Under Review</div>
          <div className="kpi-value" style={{color: 'var(--color-warning)'}}>0</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Verified Information Records</div>
          <div className="kpi-value" style={{color: 'var(--color-success)'}}>0</div>
        </div>
      </div>
    </div>
  );
}

export function GeologistDashboard() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Geological Information & Operations</h1>
          <p className="page-subtitle">Exploration, boreholes, and geological records</p>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Exploration Reports</div>
          <div className="kpi-value">0</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Boreholes Mapped</div>
          <div className="kpi-value">0</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Geological Records</div>
          <div className="kpi-value">0</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Reports Under Preparation</div>
          <div className="kpi-value" style={{color: 'var(--color-primary)'}}>0</div>
        </div>
      </div>
    </div>
  );
}

export function ManagementDashboard() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Management Overview</h1>
          <p className="page-subtitle">Operational overview and high-level trends</p>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Operational Overview</div>
          <div className="kpi-value">Stable</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Reporting Status</div>
          <div className="kpi-value" style={{color: 'var(--color-success)'}}>On Track</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">High-Priority Queries</div>
          <div className="kpi-value" style={{color: 'var(--color-danger)'}}>0</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pending Approvals</div>
          <div className="kpi-value" style={{color: 'var(--color-warning)'}}>0</div>
        </div>
      </div>
    </div>
  );
}
