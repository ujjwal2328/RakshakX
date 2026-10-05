'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, XCircle, FileText, ArrowRight, RefreshCw, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

function severityIcon(severity: string) {
  switch (severity) {
    case 'danger': return <XCircle size={16} style={{ color: 'var(--color-danger)' }} />;
    case 'warning': return <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />;
    default: return <ShieldCheck size={16} style={{ color: 'var(--color-primary-500)' }} />;
  }
}

function severityLabel(severity: string) {
  switch (severity) {
    case 'danger': return { bg: 'var(--color-danger-light)', color: 'var(--color-danger-700)', text: 'Critical' };
    case 'warning': return { bg: 'var(--color-warning-light)', color: 'var(--color-warning-700)', text: 'Warning' };
    default: return { bg: 'var(--color-info-light)', color: 'var(--color-primary-700)', text: 'Info' };
  }
}

export default function ValidationPage() {
  const { accessToken: token } = useAuth();
  const [validations, setValidations] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/validation/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch validations');
        const data = await res.json();
        setValidations(data.validations);
        setSummary(data.summary);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) fetchData();
  }, [token]);

  if (isLoading) return <div style={{ padding: 'var(--space-10)', textAlign: 'center' }}><RefreshCw className="animate-spin" /> Loading validations...</div>;
  if (error) return <div style={{ padding: 'var(--space-10)', color: 'var(--color-danger)', textAlign: 'center' }}><AlertCircleIcon /> {error}</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Data Verification</h1>
          <p className="page-subtitle">
            Data consistency checks, numerical validation, and cross-document conflict resolution
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="kpi-card">
          <div className="kpi-label">Open Issues</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)' }}>{summary.open_issues}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Critical</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-danger)' }}>{summary.critical}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Warnings</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-warning)' }}>{summary.warnings}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Resolved (This Month)</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-xl)', color: 'var(--color-success)' }}>{summary.resolved_month}</div>
        </div>
      </div>

      {/* Validation Items */}
      {validations.map((val) => {
        const sev = severityLabel(val.severity);
        return (
          <div className="card" key={val.id} style={{ marginBottom: 'var(--space-3)' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <div style={{ marginTop: '2px' }}>{severityIcon(val.severity)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-1)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-neutral-900)' }}>
                      {val.title}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', borderRadius: '12px', background: sev.bg, color: sev.color, fontWeight: 500 }}>
                        {sev.text}
                      </span>
                      <span className="status-badge warning">{val.status}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-3)' }}>
                    {val.description}
                  </div>

                  {/* Conflict Sources */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <div style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--border-radius)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginBottom: '4px' }}>Source A</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-neutral-800)', marginBottom: 'var(--space-2)' }}>
                        "{val.sourceA.value}"
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <FileText size={12} /> {val.sourceA.document} (Page {val.sourceA.page})
                      </div>
                    </div>

                    {val.sourceB ? (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ padding: '4px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: '50%' }}>
                          <XCircle size={16} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-neutral-300)' }}>
                        <ArrowRight size={20} />
                      </div>
                    )}

                    {val.sourceB ? (
                      <div style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--border-radius)' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginBottom: '4px' }}>Source B</div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-neutral-800)', marginBottom: 'var(--space-2)' }}>
                          "{val.sourceB.value}"
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <FileText size={12} /> {val.sourceB.document} (Page {val.sourceB.page})
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: 'var(--space-3)', border: '1px dashed var(--color-neutral-300)', borderRadius: 'var(--border-radius)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-neutral-400)', fontSize: 'var(--text-sm)' }}>
                        No cross-reference found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer" style={{ justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <button className="btn btn-ghost btn-sm">Dismiss</button>
              <button className="btn btn-secondary btn-sm">Send for Review</button>
              <button className="btn btn-primary btn-sm">Resolve Conflict</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
