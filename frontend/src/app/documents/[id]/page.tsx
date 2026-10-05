'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, FileText, Download, Share2, MoreVertical, 
  MapPin, Calendar, Clock, Database, CheckCircle,
  Tag, List, Search
} from 'lucide-react';

export default function DocumentDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'extraction'>('content');
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, [params.id]);

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const authData = JSON.parse(localStorage.getItem('cirs_auth') || '{}');
      const token = authData.accessToken || '';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/documents/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDoc(data);
      }
    } catch (error) {
      console.error("Failed to fetch document:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-6)', display: 'flex', justifyContent: 'center' }}>
        Loading document details...
      </div>
    );
  }

  if (!doc) {
    return (
      <div style={{ padding: 'var(--space-6)', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Document not found</h2>
        <Link href="/documents" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Back to Documents</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Top Navigation */}
      <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Link href="/documents" className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
          <ArrowLeft size={16} />
        </Link>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>
          <Link href="/documents" style={{ color: 'inherit', textDecoration: 'none' }}>Documents</Link>
          <span style={{ margin: '0 4px' }}>/</span>
          {doc.id}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-5)', alignItems: 'start' }}>
        {/* Left Column: Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          {/* Header Card */}
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '8px', 
                    background: 'var(--color-primary-50)', color: 'var(--color-primary-600)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                  }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-neutral-900)' }}>{doc.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                      <span className="status-badge success">{doc.status}</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>ID: {doc.id}</span>
                      {doc.indexed && (
                        <span style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-success)' }}>
                          <CheckCircle size={12} /> Indexed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-secondary btn-sm"><Download size={14} /> Download</button>
                  <button className="btn btn-secondary btn-sm"><Share2 size={14} /> Share</button>
                  <button className="btn btn-ghost btn-sm"><MoreVertical size={14} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Document Viewer Area */}
          <div className="card" style={{ flexGrow: 1, minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header" style={{ padding: '0' }}>
              <div className="tabs" style={{ padding: '0 var(--space-4)', borderBottom: 'none' }}>
                <button className={`tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
                  Content View
                </button>
                <button className={`tab ${activeTab === 'extraction' ? 'active' : ''}`} onClick={() => setActiveTab('extraction')}>
                  AI Extraction
                </button>
                <button className={`tab ${activeTab === 'metadata' ? 'active' : ''}`} onClick={() => setActiveTab('metadata')}>
                  Source Metadata
                </button>
              </div>
            </div>
            <div className="card-body" style={{ flexGrow: 1, background: 'var(--color-neutral-50)', padding: '0', position: 'relative' }}>
              
              {activeTab === 'content' && (
                <div style={{ padding: 'var(--space-6)', height: '100%', overflow: 'auto', background: 'white' }}>
                  <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'serif', lineHeight: 1.6, color: 'var(--color-neutral-800)' }}>
                    <h2>{doc.name}</h2>
                    <p>{doc.extracted_text || "No extracted text available for this document."}</p>
                  </div>
                </div>
              )}

              {activeTab === 'extraction' && (
                <div style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                    <div className="card" style={{ flex: 1 }}>
                      <div className="card-body">
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                          <List size={14} /> Extracted Entities
                        </h4>
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Entity</th>
                              <th>Type</th>
                              <th>Confidence</th>
                            </tr>
                          </thead>
                          <tbody>
                            {doc.entities && doc.entities.length > 0 ? doc.entities.map((ent: any, i: number) => (
                              <tr key={i}>
                                <td style={{ fontWeight: 500 }}>{ent.name}</td>
                                <td><span className="status-badge" style={{ background: 'var(--color-neutral-100)' }}>{ent.type}</span></td>
                                <td>{Math.round(ent.confidence * 100)}%</td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={3} style={{ textAlign: 'center', color: 'var(--color-neutral-400)' }}>No entities extracted</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'metadata' && (
                <div style={{ padding: 'var(--space-4)' }}>
                  <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: 'var(--space-4)', borderRadius: '6px', fontSize: 'var(--text-xs)', overflowX: 'auto' }}>
                    {JSON.stringify(doc.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Properties</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <li style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>Type</span>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{doc.document_type}</span>
                </li>
                <li style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>Subsidiary</span>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{doc.subsidiary}</span>
                </li>
                <li style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>Department</span>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{doc.department}</span>
                </li>
                <li style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>Period</span>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{doc.reporting_period} ({doc.year})</span>
                </li>
                <li style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>Source Type</span>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{doc.source}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">File Information</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <li style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>Uploaded By</span>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{doc.uploaded_by}</span>
                </li>
                <li style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>Last Updated</span>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{doc.last_updated}</span>
                </li>
                <li style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>Pages</span>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{doc.pages || 'N/A'}</span>
                </li>
                <li style={{ padding: 'var(--space-3) var(--space-4)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>Size</span>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{doc.file_size || 'Unknown'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
