'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileOutput, Plus, FileText, Clock, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';

function statusIcon(status: string) {
  switch (status) {
    case 'Approved': return <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />;
    case 'Under Review': return <Clock size={14} style={{ color: 'var(--color-primary-500)' }} />;
    case 'Draft': return <FileText size={14} style={{ color: 'var(--color-neutral-400)' }} />;
    default: return <AlertTriangle size={14} style={{ color: 'var(--color-warning)' }} />;
  }
}

function statusClass(status: string): string {
  if (!status) return 'unknown';
  return status.toLowerCase().replace(/\s+/g, '-');
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'templates'>('reports');
  const [showCreate, setShowCreate] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const authData = JSON.parse(localStorage.getItem('cirs_auth') || '{}');
      const token = authData.accessToken || '';
      
      const resReports = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resReports.ok) {
        const data = await resReports.json();
        setReports(data.reports || []);
      }
      
      const resTemplates = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reports/templates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resTemplates.ok) {
        const data = await resTemplates.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Report Preparation</h1>
          <p className="page-subtitle">
            Prepare, verify, and manage reports
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> Create Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
          Reports ({reports.length})
        </button>
        <button className={`tab ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
          Templates ({templates.length})
        </button>
      </div>

      {activeTab === 'reports' && (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report Title</th>
                  <th>Template</th>
                  <th>Subsidiary</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <div className="empty-state-title">Loading reports...</div>
                      </div>
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <FileText size={32} />
                        <div className="empty-state-title">No reports found</div>
                        <div className="empty-state-text">
                          You haven't generated any reports yet.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map((rpt) => (
                    <tr key={rpt.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          {statusIcon(rpt.status)}
                          <span style={{ fontWeight: 500, color: 'var(--color-neutral-800)' }}>{rpt.title}</span>
                        </div>
                      </td>
                      <td>{rpt.template}</td>
                      <td style={{ fontWeight: 500 }}>{rpt.subsidiary}</td>
                      <td>{rpt.period}</td>
                      <td><span className={`status-badge ${statusClass(rpt.status)}`}>{rpt.status}</span></td>
                      <td style={{ fontSize: 'var(--text-xs)' }}>{rpt.created_at}</td>
                      <td>
                        <Link href={`/reports/${rpt.id}`} className="btn btn-ghost btn-sm">
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
          {templates.map((tpl) => (
            <div className="card" key={tpl.id} style={{ cursor: 'pointer' }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <FileOutput size={20} style={{ color: 'var(--color-primary-400)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-neutral-800)', marginBottom: '2px' }}>{tpl.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>{tpl.sections} sections</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
