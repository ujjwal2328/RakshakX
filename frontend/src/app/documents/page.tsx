'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload, Filter, Search, FileText, Download, Eye, MoreHorizontal,
  X, CloudUpload, ChevronDown,
} from 'lucide-react';
import type { Document, DocumentStatus } from '@/types';
import { SUBSIDIARIES } from '@/types';


const DOC_TYPES = ['All Types', 'Geological Report', 'Production Report', 'Exploration Report', 'Environmental Report', 'Safety Report', 'Administrative Report', 'Project Report'];
const DEPARTMENTS = ['All Departments', 'Geology', 'Production', 'Exploration', 'Environment', 'Safety', 'Administration', 'Projects', 'Planning'];
const STATUSES = ['All Statuses', 'Uploaded', 'Processing', 'Indexed', 'Validation Required', 'Ready', 'Failed'];
const YEARS = ['All Years', '2025', '2024', '2023', '2022', '2021', '2020'];

function statusClass(status: string): string {
  if (!status) return 'unknown';
  return status.toLowerCase().replace(/\s+/g, '-');
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [subsidiary, setSubsidiary] = useState('All Subsidiaries');
  const [docType, setDocType] = useState('All Types');
  const [department, setDepartment] = useState('All Departments');
  const [status, setStatus] = useState('All Statuses');
  const [year, setYear] = useState('All Years');
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    subsidiary: 'CIL',
    document_type: 'Geological Report',
    department: 'Planning',
    reporting_period: ''
  });

  useEffect(() => {
    fetchDocuments();
  }, [searchQuery, subsidiary, docType, department, status, year]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (subsidiary !== 'All Subsidiaries') params.append('subsidiary', subsidiary);
      if (docType !== 'All Types') params.append('document_type', docType);
      if (department !== 'All Departments') params.append('department', department);
      if (status !== 'All Statuses') params.append('status', status);
      if (year !== 'All Years') params.append('year', year);
      
      const authData = JSON.parse(localStorage.getItem('cirs_auth') || '{}');
      const token = authData.accessToken || '';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/documents?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">
            {total} documents · {documents.filter(d => d.indexed).length} indexed
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
            <Upload size={14} /> Upload Document
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="topbar-search" style={{ flex: 'unset', maxWidth: 'unset' }}>
          <Search size={14} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: 'var(--space-8)', height: '32px' }}
          />
        </div>
        <select className="form-select" value={subsidiary} onChange={(e) => setSubsidiary(e.target.value)}>
          <option>All Subsidiaries</option>
          {SUBSIDIARIES.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
        </select>
        <select className="form-select" value={docType} onChange={(e) => setDocType(e.target.value)}>
          {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
          {YEARS.map((y) => <option key={y}>{y}</option>)}
        </select>
      </div>

      {/* Document Table */}
      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Subsidiary</th>
                <th>Department</th>
                <th>Year</th>
                <th>Period</th>
                <th>Source</th>
                <th>Pages</th>
                <th>Size</th>
                <th>Status</th>
                <th>Uploaded By</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13}>
                     <div className="empty-state">
                       <div className="empty-state-title">Loading documents...</div>
                     </div>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={13}>
                    <div className="empty-state">
                      <FileText size={32} />
                      <div className="empty-state-title">No documents found</div>
                      <div className="empty-state-text">
                        No documents match the current filter criteria. Adjust filters or upload a new document.
                      </div>
                      <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                        <Upload size={14} /> Upload Document
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', maxWidth: '320px' }}>
                        <FileText size={14} style={{ color: 'var(--color-neutral-400)', flexShrink: 0 }} />
                        <span style={{ fontWeight: 500, color: 'var(--color-neutral-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</span>
                      </div>
                    </td>
                    <td>{doc.document_type}</td>
                    <td><span style={{ fontWeight: 500 }}>{doc.subsidiary}</span></td>
                    <td>{doc.department}</td>
                    <td>{doc.year}</td>
                    <td>{doc.reporting_period}</td>
                    <td>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        padding: '1px 6px',
                        background: doc.source === 'Scanned' ? 'var(--color-warning-light)' : 'var(--color-info-light)',
                        borderRadius: '3px',
                        color: doc.source === 'Scanned' ? 'var(--color-warning-700)' : 'var(--color-primary-700)',
                      }}>
                        {doc.source}
                      </span>
                    </td>
                    <td>{doc.pages || '—'}</td>
                    <td>{doc.file_size || '—'}</td>
                    <td>
                      <span className={`status-badge ${statusClass(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)' }}>{doc.uploaded_by}</td>
                    <td style={{ fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>{doc.last_updated}</td>
                    <td>
                      <Link href={`/documents/${doc.id}`} className="btn btn-ghost btn-sm" title="View document">
                        <Eye size={13} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && documents.length > 0 && (
          <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>
            <span>Showing {documents.length} of {total} documents</span>
            <span>Page 1 of 1</span>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Upload Document</h2>
              <button className="modal-close" onClick={() => setShowUpload(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="upload-dropzone">
                <CloudUpload size={32} />
                <div className="upload-dropzone-text">
                  <input type="file" id="file-upload" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', color: 'var(--color-primary-600)', textDecoration: 'underline' }}>Click to browse</label> or drag and drop files here
                </div>
                <div className="upload-dropzone-hint">
                  {file ? <span style={{color: 'var(--color-success)', fontWeight: 500}}>Selected: {file.name}</span> : 'Supported: PDF, DOCX, XLSX, CSV, Images (JPEG, PNG, TIFF) · Max 100 MB'}
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Subsidiary</label>
                  <select className="form-select" value={uploadData.subsidiary} onChange={e => setUploadData({...uploadData, subsidiary: e.target.value})}>
                    <option value="">Select subsidiary...</option>
                    {SUBSIDIARIES.map((s) => <option key={s.code} value={s.code}>{s.name} — {s.full_name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Document Type</label>
                  <select className="form-select" value={uploadData.document_type} onChange={e => setUploadData({...uploadData, document_type: e.target.value})}>
                    <option value="">Select type...</option>
                    {DOC_TYPES.filter(t => t !== 'All Types').map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select" value={uploadData.department} onChange={e => setUploadData({...uploadData, department: e.target.value})}>
                    <option value="">Select department...</option>
                    {DEPARTMENTS.filter(d => d !== 'All Departments').map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Reporting Period</label>
                  <input className="form-input" type="text" placeholder="e.g., FY 2024-25, Q1 2025-26, July 2025" value={uploadData.reporting_period} onChange={e => setUploadData({...uploadData, reporting_period: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!file || isUploading} onClick={async () => {
                if (!file) return;
                setIsUploading(true);
                const formData = new FormData();
                formData.append('file', file);
                formData.append('subsidiary', uploadData.subsidiary);
                formData.append('document_type', uploadData.document_type);
                formData.append('department', uploadData.department);
                formData.append('reporting_period', uploadData.reporting_period);
                
                try {
                  const authData = JSON.parse(localStorage.getItem('cirs_auth') || '{}');
                  const token = authData.accessToken || '';
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/documents/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                  });
                  if (res.ok) {
                    const result = await res.json();
                    setShowUpload(false);
                    setFile(null);
                    fetchDocuments();
                    const goToReports = confirm(
                      `✅ Document uploaded and processed!\n\n${result.message}\n\nWould you like to view the generated report?`
                    );
                    if (goToReports) {
                      router.push('/reports');
                    }
                  } else {
                    try {
                      const errorData = await res.json();
                      alert('Upload failed: ' + (errorData.detail || errorData.message || res.statusText));
                    } catch(err) {
                      alert('Upload failed: ' + res.statusText);
                    }
                  }
                } catch (e) {
                  alert('Error uploading: ' + String(e));
                } finally {
                  setIsUploading(false);
                }
              }}>
                <Upload size={14} /> {isUploading ? 'Processing...' : 'Upload & Process'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
