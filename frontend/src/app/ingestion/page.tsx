'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Clock, AlertTriangle, RefreshCw, XCircle, ChevronRight, Server } from 'lucide-react';

const QUEUE_ITEMS = [
  { id: 'ING-001', filename: 'Annual_Geological_Report_SECL.pdf', size: '18.4 MB', status: 'Completed', progress: 100, step: 'Completed', time: '10 mins ago', type: 'Geological Report' },
  { id: 'ING-002', filename: 'Production_Summary_NCL_July.pdf', size: '4.2 MB', status: 'Processing', progress: 65, step: 'Extracting Information', time: 'Just now', type: 'Production Report' },
  { id: 'ING-003', filename: 'Safety_Audit_Kusmunda.docx', size: '6.3 MB', status: 'Processing', progress: 30, step: 'Text & Data Extraction', time: '2 mins ago', type: 'Safety Report' },
  { id: 'ING-004', filename: 'Scanned_Borehole_Logs_Block4.pdf', size: '45.6 MB', status: 'Failed', progress: 15, step: 'Text & Data Extraction', time: '1 hour ago', type: 'Exploration Report', error: 'Unreadable scanned pages (Pages 12-45)' },
  { id: 'ING-005', filename: 'Environmental_Clearance_MCL.pdf', size: '8.7 MB', status: 'Queued', progress: 0, step: 'Pending', time: '5 mins ago', type: 'Environmental Report' },
];

function statusIcon(s: string) {
  switch (s) {
    case 'Completed': return <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />;
    case 'Processing': return <RefreshCw size={16} style={{ color: 'var(--color-primary-500)' }} className="animate-spin" />;
    case 'Queued': return <Clock size={16} style={{ color: 'var(--color-neutral-400)' }} />;
    case 'Failed': return <XCircle size={16} style={{ color: 'var(--color-danger)' }} />;
    default: return <Clock size={16} />;
  }
}

export default function DocumentProcessingPage() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Document Processing</h1>
          <p className="page-subtitle">Track document processing, text extraction, data extraction and indexing.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Server size={14} /> Processing Status</button>
          <button className="btn btn-primary" onClick={() => setIsUploading(true)}><Upload size={14} /> New Upload</button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="kpi-card">
          <div className="kpi-label">IN PROGRESS</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-primary-600)' }}>2</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Queued</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)' }}>1</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Processed Today</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-success)' }}>18</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Failed</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-danger)' }}>1</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Document Processing Queue</div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {QUEUE_ITEMS.map((item) => (
            <div key={item.id} style={{ 
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)', 
              padding: 'var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)',
              background: item.status === 'Failed' ? 'var(--color-danger-50)' : 'transparent'
            }}>
              <div style={{ flexShrink: 0 }}>
                {statusIcon(item.status)}
              </div>
              
              <div style={{ width: '250px' }}>
                <div style={{ fontWeight: 500, color: 'var(--color-neutral-900)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.filename}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                  {item.size} • {item.type}
                </div>
              </div>

              <div style={{ flex: 1, padding: '0 var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: 'var(--text-xs)' }}>
                  <span style={{ fontWeight: 500, color: item.status === 'Failed' ? 'var(--color-danger-700)' : 'var(--color-neutral-700)' }}>
                    {item.step}
                  </span>
                  <span style={{ color: 'var(--color-neutral-500)' }}>{item.progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--color-neutral-200)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${item.progress}%`, 
                    background: item.status === 'Failed' ? 'var(--color-danger)' : item.status === 'Completed' ? 'var(--color-success)' : 'var(--color-primary)',
                    transition: 'width 0.5s ease-out'
                  }}></div>
                </div>
                {item.error && (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger-700)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={12} /> {item.error}
                  </div>
                )}
              </div>

              <div style={{ width: '100px', textAlign: 'right', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>
                {item.time}
              </div>

              <div style={{ flexShrink: 0 }}>
                <button className="btn btn-ghost btn-sm">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
