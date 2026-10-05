'use client';

import React from 'react';
import { FileText, Clock, CheckCircle2, AlertTriangle, ArrowLeft, Search, FileOutput, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function QueryDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="page-header" style={{ marginBottom: 'var(--space-2)' }}>
        <div className="page-header-left">
          <Link href="/parliamentary" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '8px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to Query Register
          </Link>
          <h1 className="page-title">Query ID: {params.id || 'PQ-2025-084'}</h1>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary"><ShieldCheck size={14}/> Verify Source</button>
          <button className="btn btn-primary"><FileOutput size={14}/> Export Final Response</button>
        </div>
      </div>
      
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
          <div><div style={{fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)'}}>Subject</div><div style={{fontWeight: 500}}>SECL Production Steps</div></div>
          <div><div style={{fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)'}}>Received Date</div><div style={{fontWeight: 500}}>Aug 12, 2025</div></div>
          <div><div style={{fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)'}}>Due Date</div><div style={{fontWeight: 500, color: 'var(--color-danger)'}}>Aug 25, 2025 (3 days)</div></div>
          <div><div style={{fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)'}}>Priority</div><div style={{fontWeight: 500, color: 'var(--color-danger)'}}>Urgent</div></div>
          <div><div style={{fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)'}}>Department</div><div style={{fontWeight: 500}}>Production</div></div>
          <div><div style={{fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)'}}>Assigned Officer</div><div style={{fontWeight: 500}}>Smt. Kavita Nair</div></div>
          <div><div style={{fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)'}}>Status</div><div style={{fontWeight: 500}}><span className="status-badge warning">Draft Prepared</span></div></div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', borderBottom: '1px solid var(--color-neutral-200)', paddingBottom: 'var(--space-4)' }}>
        <span>Question Received</span><CheckCircle2 size={12} color="var(--color-success)"/> <span style={{margin:'0 4px'}}>→</span>
        <span>Relevant Records Identified</span><CheckCircle2 size={12} color="var(--color-success)"/> <span style={{margin:'0 4px'}}>→</span>
        <span>Historical Responses Retrieved</span><CheckCircle2 size={12} color="var(--color-success)"/> <span style={{margin:'0 4px'}}>→</span>
        <span>Data Verified</span><CheckCircle2 size={12} color="var(--color-success)"/> <span style={{margin:'0 4px'}}>→</span>
        <span style={{color: 'var(--color-primary-700)', fontWeight: 500}}>Draft Response Prepared</span> <span style={{margin:'0 4px'}}>→</span>
        <span>Officer Review</span> <span style={{margin:'0 4px'}}>→</span>
        <span>Technical Verification</span> <span style={{margin:'0 4px'}}>→</span>
        <span>Approval</span>
      </div>

      <div className="section-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div>
          {/* Section 1 */}
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="card-header"><div className="card-title">Section 1: Question / Request</div></div>
            <div className="card-body" style={{ fontStyle: 'italic', fontSize: 'var(--text-md)', color: 'var(--color-neutral-800)' }}>
              "What steps have been taken to improve coal production in the concerned subsidiary, and what was the total production outcome for the fiscal year?"
            </div>
          </div>

          {/* Section 4 */}
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="card-header"><div className="card-title">Section 4: Verified Information</div></div>
            <div className="card-body">
              <table className="table" style={{width: '100%'}}>
                <thead><tr><th>Value</th><th>Source Document</th><th>Page</th><th>Reporting Period</th></tr></thead>
                <tbody>
                  <tr><td>45.2 MT</td><td>Annual Production Report</td><td>Page 42</td><td>FY 2024-25</td></tr>
                  <tr><td>3 New OCPs Opened</td><td>Project Progress Review</td><td>Page 12</td><td>FY 2024-25</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5 */}
          <div className="card" style={{ marginBottom: 'var(--space-4)', border: '1px solid var(--color-primary-300)' }}>
            <div className="card-header" style={{ background: 'var(--color-primary-50)' }}><div className="card-title">Section 5: System-Generated Draft</div></div>
            <div className="card-body">
              <div style={{ marginBottom: 'var(--space-4)', background: 'var(--color-warning-light)', padding: 'var(--space-3)', borderRadius: '4px', display: 'flex', gap: '8px', color: 'var(--color-warning-800)', fontSize: 'var(--text-sm)' }}>
                <AlertTriangle size={16} style={{flexShrink: 0}} />
                <div>
                  <strong>Response Consistency Check:</strong> The draft response aligns with the latest verified data. No contradictions found with historical queries.
                </div>
              </div>
              <p>In response to the query regarding coal production steps in the concerned subsidiary (SECL), the following measures have been undertaken during the fiscal year 2024-25:</p>
              <ul style={{ paddingLeft: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                <li>Commissioning of 3 new Open Cast Projects (OCPs).</li>
                <li>Deployment of high-capacity Surface Miners to enhance extraction efficiency.</li>
                <li>Expansion of existing mine capacities in the Korba coalfields.</li>
              </ul>
              <p>As a result of these initiatives, the total coal production for the fiscal year 2024-25 stood at 45.2 Million Tonnes (MT).</p>
            </div>
          </div>
          
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="card-header"><div className="card-title">Evidence Supporting Response</div></div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div style={{ padding: 'var(--space-3)', border: '1px solid var(--color-neutral-200)', borderRadius: '4px' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>CLAIM</div>
                <div style={{ fontWeight: 500, marginBottom: 'var(--space-2)' }}>"total coal production stood at 45.2 Million Tonnes"</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>EVIDENCE</div>
                <div style={{ fontSize: 'var(--text-sm)' }}>Annual Production Report FY2024-25<br/>Page 42, Table 5.1</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Section 2 */}
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="card-header"><div className="card-title">Section 2: Relevant Records</div></div>
            <div className="card-body">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--text-sm)' }}>
                <li style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-neutral-100)' }}><FileText size={12}/> Annual Production Report FY2024-25</li>
                <li style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-neutral-100)' }}><FileText size={12}/> Project Progress Review FY2024-25</li>
                <li style={{ padding: 'var(--space-2) 0' }}><FileText size={12}/> SECL Subsidiary Overview</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="card">
            <div className="card-header"><div className="card-title">Section 3: Historical Responses</div></div>
            <div className="card-body">
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}><Search size={12}/> 4 related queries found.</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--text-sm)' }}>
                <li style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-neutral-100)' }}><strong>PQ-2023-142 (2023)</strong><br/>Steps to increase production in SECL</li>
                <li style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-neutral-100)' }}><strong>PQ-2022-088 (2022)</strong><br/>Coal extraction efficiency measures</li>
                <li style={{ padding: 'var(--space-2) 0' }}><strong>PQ-2020-311 (2020)</strong><br/>New projects in Korba region</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
