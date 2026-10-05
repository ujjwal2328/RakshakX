'use client';

import React from 'react';
import { ScrollText, Search, Filter } from 'lucide-react';

const AUDIT_ENTRIES = [
  { id: 'AUD-001', timestamp: '2025-08-20 10:30:12', user: 'Dr. Priya Sharma', action: 'Document Upload', object: 'Annual Geological Report FY2024-25 — SECL', result: 'Success' },
  { id: 'AUD-002', timestamp: '2025-08-20 10:31:45', user: 'System', action: 'Document Processing', object: 'Annual Geological Report FY2024-25 — SECL', result: 'Success' },
  { id: 'AUD-003', timestamp: '2025-08-20 10:45:22', user: 'System', action: 'Entity Extraction', object: '142 entities extracted from DOC-001', result: 'Success' },
  { id: 'AUD-004', timestamp: '2025-08-20 10:46:05', user: 'System', action: 'Document Indexing', object: 'DOC-001 indexed to vector store', result: 'Success' },
  { id: 'AUD-005', timestamp: '2025-08-19 14:15:33', user: 'Verification Service', action: 'Conflict Detected', object: 'NCL Production — July 2025: 12.4 MT vs 11.9 MT', result: 'Warning' },
  { id: 'AUD-006', timestamp: '2025-08-19 11:20:00', user: 'Smt. Kavita Nair', action: 'Information Search', object: 'Query: "SECL production trend FY2020-25"', result: 'Success' },
  { id: 'AUD-007', timestamp: '2025-08-18 16:45:10', user: 'System', action: 'Report Generation', object: 'Monthly Production Report — July 2025 — SECL', result: 'Success' },
  { id: 'AUD-008', timestamp: '2025-08-18 09:00:15', user: 'Sh. Vikram Singh', action: 'Document Upload', object: 'Safety Audit Report — Kusmunda OCP', result: 'Success' },
  { id: 'AUD-009', timestamp: '2025-08-17 16:45:30', user: 'System', action: 'Extraction Failed', object: 'Geological Mapping — Singrauli Coalfield: Table extraction error', result: 'Error' },
  { id: 'AUD-010', timestamp: '2025-08-15 10:10:42', user: 'Sh. Suresh Reddy', action: 'Report Approved', object: 'Environmental Compliance Report — MCL', result: 'Success' },
  { id: 'AUD-011', timestamp: '2025-08-12 08:30:00', user: 'Dr. Rajesh Kumar', action: 'User Login', object: 'Session started from 10.0.1.45', result: 'Success' },
  { id: 'AUD-012', timestamp: '2025-08-10 15:22:18', user: 'Sh. Suresh Reddy', action: 'Changes Requested', object: 'Safety Audit Report — Kusmunda OCP: Section 3.2 needs updates', result: 'Success' },
];

function resultStyle(result: string) {
  switch (result) {
    case 'Success': return { bg: 'var(--color-success-light)', color: 'var(--color-success-700)' };
    case 'Warning': return { bg: 'var(--color-warning-light)', color: 'var(--color-warning-700)' };
    case 'Error': return { bg: 'var(--color-danger-light)', color: 'var(--color-danger-700)' };
    default: return { bg: 'var(--color-neutral-100)', color: 'var(--color-neutral-600)' };
  }
}

export default function AuditPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Audit Trail</h1>
          <p className="page-subtitle">
            Complete action log — document access, information searches, approvals, and system events

          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <div className="topbar-search" style={{ flex: 'unset', maxWidth: 'unset' }}>
          <Search size={14} />
          <input type="text" placeholder="Search audit entries..." className="form-input" style={{ paddingLeft: 'var(--space-8)', height: '32px' }} />
        </div>
        <select className="form-select">
          <option>All Actions</option>
          <option>Document Upload</option>
          <option>Document Processing</option>
          <option>Information Search</option>
          <option>Report Generation</option>
          <option>Report Approved</option>
          <option>User Login</option>
          <option>Conflict Detected</option>
        </select>
        <select className="form-select">
          <option>All Users</option>
          <option>System</option>
          <option>System</option>
          <option>Dr. Priya Sharma</option>
          <option>Sh. Vikram Singh</option>
          <option>Smt. Kavita Nair</option>
        </select>
        <select className="form-select">
          <option>All Results</option>
          <option>Success</option>
          <option>Warning</option>
          <option>Error</option>
        </select>
      </div>

      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Object</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_ENTRIES.map((entry) => {
                const rs = resultStyle(entry.result);
                return (
                  <tr key={entry.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap', color: 'var(--color-neutral-500)' }}>
                      {entry.timestamp}
                    </td>
                    <td style={{ fontWeight: 500 }}>{entry.user}</td>
                    <td>{entry.action}</td>
                    <td style={{ maxWidth: '400px' }}>
                      <span style={{ color: 'var(--color-neutral-700)' }}>{entry.object}</span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        padding: '1px 6px',
                        borderRadius: '3px',
                        background: rs.bg,
                        color: rs.color,
                        fontWeight: 500,
                      }}>
                        {entry.result}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card-footer" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Showing {AUDIT_ENTRIES.length} entries</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
