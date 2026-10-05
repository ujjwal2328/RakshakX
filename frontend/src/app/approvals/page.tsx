'use client';

import React from 'react';
import { CheckCircle2, XCircle, Clock, MessageSquare, FileText, User } from 'lucide-react';

const APPROVALS = [
  {
    id: 'APR-001', title: 'Monthly Production Report — July 2025 — SECL',
    type: 'Production Report', submitted_by: 'System', submitted_at: '2025-08-18',
    status: 'Awaiting Review', reviewer: 'Sh. Suresh Reddy', priority: 'Normal',
  },
  {
    id: 'APR-002', title: 'Geological Report FY2024-25 — NCL',
    type: 'Geological Report', submitted_by: 'Dr. Priya Sharma', submitted_at: '2025-08-15',
    status: 'Awaiting Review', reviewer: 'Sh. Suresh Reddy', priority: 'High',
  },
  {
    id: 'APR-003', title: 'Exploration Progress Report — Block IV — ECL',
    type: 'Exploration Report', submitted_by: 'Dr. Priya Sharma', submitted_at: '2025-08-12',
    status: 'Awaiting Review', reviewer: 'Sh. Deepak Verma', priority: 'Normal',
  },
  {
    id: 'APR-004', title: 'Environmental Compliance Report — MCL',
    type: 'Environmental Report', submitted_by: 'Smt. Meera Iyer', submitted_at: '2025-08-05',
    status: 'Approved', reviewer: 'Sh. Suresh Reddy', priority: 'Normal',
    reviewed_at: '2025-08-12', comment: 'Reviewed and approved. All compliance metrics are within acceptable range.',
  },
  {
    id: 'APR-005', title: 'Safety Audit Report — Kusmunda OCP',
    type: 'Safety Report', submitted_by: 'Sh. Vikram Singh', submitted_at: '2025-07-28',
    status: 'Changes Requested', reviewer: 'Sh. Suresh Reddy', priority: 'High',
    reviewed_at: '2025-08-02', comment: 'Section 3.2 needs updated incident data. Table 4.1 has arithmetic errors.',
  },
];

function statusIcon(s: string) {
  switch (s) {
    case 'Approved': return <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />;
    case 'Rejected': return <XCircle size={16} style={{ color: 'var(--color-danger)' }} />;
    case 'Changes Requested': return <MessageSquare size={16} style={{ color: 'var(--color-warning)' }} />;
    default: return <Clock size={16} style={{ color: 'var(--color-primary-500)' }} />;
  }
}

function statusClass(s: string) {
  const map: Record<string, string> = {
    'Awaiting Review': 'pending',
    'Approved': 'approved',
    'Rejected': 'rejected',
    'Changes Requested': 'warning',
  };
  return map[s] || 'pending';
}

export default function ApprovalsPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Review & Approval</h1>
          <p className="page-subtitle">
            Review & Approval review workflow — approve, reject, or request changes

          </p>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="kpi-card">
          <div className="kpi-label">Awaiting Review</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)' }}>{APPROVALS.filter(a => a.status === 'Awaiting Review').length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Approved (This Month)</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-success)' }}>5</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Changes Requested</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-warning)' }}>1</div>
        </div>
      </div>

      {/* Approval Items */}
      {APPROVALS.map((approval) => (
        <div className="card" key={approval.id} style={{ marginBottom: 'var(--space-3)' }}>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
              {statusIcon(approval.status)}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>{approval.title}</span>
                  <span className={`status-badge ${statusClass(approval.status)}`}>{approval.status}</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-1)' }}>
                  <span>Type: {approval.type}</span>
                  <span>Submitted by: {approval.submitted_by}</span>
                  <span>Date: {approval.submitted_at}</span>
                  <span>Reviewer: {approval.reviewer}</span>
                </div>
                {(approval as any).comment && (
                  <div style={{
                    marginTop: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'var(--color-neutral-50)',
                    borderRadius: 'var(--border-radius)',
                    borderLeft: '3px solid var(--color-primary-300)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-neutral-700)',
                  }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginBottom: '2px' }}>
                      Reviewer comment — {(approval as any).reviewed_at}
                    </div>
                    {(approval as any).comment}
                  </div>
                )}
              </div>
              {approval.status === 'Awaiting Review' && (
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                  <button className="btn btn-success btn-sm"><CheckCircle2 size={12} /> Approve</button>
                  <button className="btn btn-secondary btn-sm"><MessageSquare size={12} /> Request Changes</button>
                  <button className="btn btn-danger btn-sm"><XCircle size={12} /> Reject</button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
