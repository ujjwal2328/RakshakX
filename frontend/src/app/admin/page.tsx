'use client';

import React, { useState } from 'react';
import { Settings, Users, Shield, Database, Server, Key } from 'lucide-react';

const DEMO_USERS = [
  { id: 'USR-001', name: 'Dr. Rajesh Kumar', email: 'admin@cmpdi.co.in', role: 'System Administrator', org: 'CMPDI', status: 'Active' },
  { id: 'USR-002', name: 'Dr. Priya Sharma', email: 'priya.sharma@cmpdi.co.in', role: 'Senior Geologist', org: 'CMPDI', status: 'Active' },
  { id: 'USR-003', name: 'Sh. Vikram Singh', email: 'vikram.singh@secl.co.in', role: 'Mining Engineer', org: 'SECL', status: 'Active' },
  { id: 'USR-004', name: 'Sh. Anil Patel', email: 'anil.patel@ncl.co.in', role: 'Technical Officer', org: 'NCL', status: 'Active' },
  { id: 'USR-005', name: 'Smt. Meera Iyer', email: 'meera.iyer@cmpdi.co.in', role: 'Data Analyst', org: 'CMPDI', status: 'Active' },
  { id: 'USR-006', name: 'Sh. Suresh Reddy', email: 'suresh.reddy@cmpdi.co.in', role: 'Report Reviewer', org: 'CMPDI', status: 'Active' },
  { id: 'USR-007', name: 'Sh. Deepak Verma', email: 'deepak.verma@cil.co.in', role: 'Director (Technical)', org: 'CIL', status: 'Active' },
  { id: 'USR-008', name: 'Smt. Kavita Nair', email: 'kavita.nair@coal.gov.in', role: 'Administrative Officer', org: 'Ministry of Coal', status: 'Active' },
];

const ROLES = [
  { name: 'System Administrator', users: 1, permissions: 'Full system access' },
  { name: 'Geologist', users: 1, permissions: 'Documents, Information Repository, GIS, Information Search, Reports' },
  { name: 'Mining Engineer', users: 1, permissions: 'Documents, Information Repository, GIS, Information Search, Reports' },
  { name: 'Technical Officer', users: 1, permissions: 'Documents, Information Repository, Validation, Information Search' },
  { name: 'Data Analyst', users: 1, permissions: 'Documents, Information Repository, Analytics, Information Search, Topics' },
  { name: 'Report Reviewer', users: 1, permissions: 'Documents, Reports, Validation, Approvals, Analytics' },
  { name: 'Management', users: 1, permissions: 'Dashboard, Reports, Analytics, Approvals, Information Search' },
  { name: 'Administrative Officer', users: 1, permissions: 'Queries, Reports, Approvals, Audit' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'system'>('users');

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Administration</h1>
          <p className="page-subtitle">
            User management, role configuration, and system settings
          </p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <Users size={14} style={{ marginRight: '6px' }} /> Users ({DEMO_USERS.length})
        </button>
        <button className={`tab ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')}>
          <Shield size={14} style={{ marginRight: '6px' }} /> Roles ({ROLES.length})
        </button>
        <button className={`tab ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
          <Server size={14} style={{ marginRight: '6px' }} /> System
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Organization</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_USERS.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{u.id}</td>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ fontSize: 'var(--text-xs)' }}>{u.email}</td>
                    <td>{u.role}</td>
                    <td style={{ fontWeight: 500 }}>{u.org}</td>
                    <td><span className="status-badge success">{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Users</th>
                  <th>Module Permissions</th>
                </tr>
              </thead>
              <tbody>
                {ROLES.map((r) => (
                  <tr key={r.name}>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td>{r.users}</td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-600)' }}>{r.permissions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="section-grid">
          <div className="card">
            <div className="card-header">
              <div className="card-title">System Information</div>
            </div>
            <div className="card-body">
              <table style={{ fontSize: 'var(--text-sm)', width: '100%' }}>
                <tbody>
                  {[
                    ['Application', 'Coal Intelligence & Reporting System v1.0.0'],
                    ['Environment', 'Prototype / Demo'],
                    ['Frontend', 'Next.js 14 + TypeScript'],
                    ['Backend', 'FastAPI (Python 3.11)'],
                    ['Database', 'PostgreSQL + pgvector + PostGIS'],
                    ['Queue', 'Redis + Celery'],
                    ['Information Relationships', 'Neo4j (Planned)'],
                    ['Object Storage', 'MinIO (S3-compatible)'],
                    ['Model Provider', 'Configurable (Gemini/OpenAI/Claude/Local)'],
                  ].map(([key, val]) => (
                    <tr key={key}>
                      <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 500, color: 'var(--color-neutral-700)', width: '200px' }}>{key}</td>
                      <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--color-neutral-600)' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Security Configuration</div>
            </div>
            <div className="card-body">
              <table style={{ fontSize: 'var(--text-sm)', width: '100%' }}>
                <tbody>
                  {[
                    ['Authentication', 'JWT (HS256)'],
                    ['Authorization', 'Role-Based Access Control (RBAC)'],
                    ['Token Expiry', '8 hours (access) / 7 days (refresh)'],
                    ['Password Hashing', 'bcrypt'],
                    ['CORS', 'Restricted to frontend origin'],
                    ['Audit Logging', 'Enabled'],
                    ['API Rate Limiting', 'Planned — Phase 9'],
                    ['Encryption at Rest', 'Planned — Phase 9'],
                  ].map(([key, val]) => (
                    <tr key={key}>
                      <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 500, color: 'var(--color-neutral-700)', width: '200px' }}>{key}</td>
                      <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--color-neutral-600)' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
