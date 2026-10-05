'use client';

import React, { useState } from 'react';
import { MessageSquare, Clock, CheckCircle2, AlertTriangle, FileText, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const QUERIES = [
  {
    id: 'PQ-001', type: 'Lok Sabha', number: 'Q.No. 2847', subject: 'Coal production and dispatch data for FY 2024-25',
    department: 'Production', priority: 'Urgent', deadline: '2025-08-25', assigned: 'Smt. Kavita Nair',
    status: 'Under Analysis', similarCount: 3,
  },
  {
    id: 'PQ-002', type: 'Lok Sabha', number: 'Q.No. 2851', subject: 'Status of new coal block allocations in Chhattisgarh',
    department: 'Projects', priority: 'Urgent', deadline: '2025-08-25', assigned: 'Sh. Vikram Singh',
    status: 'Evidence Retrieved', similarCount: 2,
  },
  {
    id: 'PQ-003', type: 'Rajya Sabha', number: 'Q.No. 1423', subject: 'Environmental compliance status of CIL subsidiaries',
    department: 'Environment', priority: 'High', deadline: '2025-08-27', assigned: 'Smt. Meera Iyer',
    status: 'Draft Prepared', similarCount: 5,
  },
  {
    id: 'PQ-004', type: 'Rajya Sabha', number: 'Q.No. 1429', subject: 'Employment generation through coal mining operations',
    department: 'HR', priority: 'Normal', deadline: '2025-08-28', assigned: 'Smt. Kavita Nair',
    status: 'Received', similarCount: 4,
  },
  {
    id: 'PQ-005', type: 'RTI', number: 'RTI/MOC/2025/4821', subject: 'Safety audit reports for Gevra OCP',
    department: 'Safety', priority: 'Normal', deadline: '2025-09-01', assigned: 'Sh. Anil Patel',
    status: 'Under Review', similarCount: 1,
  },
  {
    id: 'PQ-006', type: 'Lok Sabha', number: 'Q.No. 2634', subject: 'Exploration progress and geological reserve estimation',
    department: 'Geology', priority: 'High', deadline: '2025-08-22', assigned: 'Dr. Priya Sharma',
    status: 'Approved', similarCount: 6,
  },
];

const STATUS_ORDER = ['Received', 'Under Analysis', 'Evidence Retrieved', 'Draft Prepared', 'Under Review', 'Approved', 'Submitted'];

function statusClass(s: string) { return s.toLowerCase().replace(/\s+/g, '-'); }
function priorityStyle(p: string) {
  switch (p) {
    case 'Urgent': return { background: 'var(--color-danger-light)', color: 'var(--color-danger-700)' };
    case 'High': return { background: 'var(--color-warning-light)', color: 'var(--color-warning-700)' };
    default: return { background: 'var(--color-neutral-100)', color: 'var(--color-neutral-600)' };
  }
}

export default function ParliamentaryPage() {
  const router = useRouter();
  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Query & Correspondence</h1>
          <p className="page-subtitle">
            Parliamentary questions, RTI requests, and administrative queries

          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="kpi-card">
          <div className="kpi-label">Pending Queries</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)' }}>{QUERIES.filter(q => q.status !== 'Approved' && q.status !== 'Submitted').length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Urgent</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-danger)' }}>{QUERIES.filter(q => q.priority === 'Urgent').length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Approaching Deadline</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-warning)' }}>4</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Completed This Month</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-success)' }}>8</div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Reference</th>
                <th>Subject</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Similar</th>
              </tr>
            </thead>
            <tbody>
              {QUERIES.map((q) => (
                <tr key={q.id} onClick={() => router.push(`/parliamentary/${q.id}`)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 500, fontSize: 'var(--text-xs)' }}>{q.type}</td>
                  <td style={{ fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{q.number}</td>
                  <td style={{ maxWidth: '300px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--color-neutral-800)' }}>{q.subject}</span>
                  </td>
                  <td>{q.department}</td>
                  <td>
                    <span style={{ ...priorityStyle(q.priority), fontSize: 'var(--text-xs)', padding: '1px 6px', borderRadius: '3px', fontWeight: 500 }}>
                      {q.priority}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>{q.deadline}</td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>{q.assigned}</td>
                  <td><span className={`status-badge ${statusClass(q.status)}`}>{q.status}</span></td>
                  <td>
                    {q.similarCount > 0 && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)', cursor: 'pointer' }}>
                        {q.similarCount} found
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
