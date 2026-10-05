import { FileText, Download, Eye, Clock } from 'lucide-react';
import Link from 'next/link';

export default function RecordsPage() {
  const mockRecords = [
    { id: 'REC-001', title: 'Chapter 6: Mining Strategy', type: 'Master Plan', date: '2026-10-04', status: 'Finalized', size: '4.5 MB' },
    { id: 'REC-002', title: 'Chapter 16: Environment & Ecology', type: 'Master Plan', date: '2026-10-03', status: 'Under Review', size: '3.1 MB' },
    { id: 'REC-003', title: 'Chapter 15: Safety', type: 'Master Plan', date: '2026-10-02', status: 'Finalized', size: '1.2 MB' },
    { id: 'REC-004', title: 'Q3 Production Figures - Kusmunda', type: 'Production Report', date: '2026-09-30', status: 'Pending', size: '56 KB' },
    { id: 'REC-005', title: 'Gevra OCP Land Acquisition Status', type: 'Land Report', date: '2026-09-15', status: 'Finalized', size: '890 KB' }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Reports & Records</h1>
          <p className="page-subtitle">Historical and active records for administrative overview.</p>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Document Title</th>
              <th>Category</th>
              <th>Date Modified</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRecords.map((rec) => (
              <tr key={rec.id}>
                <td style={{ fontWeight: 500, color: 'var(--color-neutral-600)' }}>{rec.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="var(--color-primary-600)" />
                    {rec.title}
                  </div>
                </td>
                <td><span className="status-badge" style={{ backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)' }}>{rec.type}</span></td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-neutral-600)' }}><Clock size={14} /> {rec.date}</div></td>
                <td>
                  <span className={`status-badge ${rec.status === 'Finalized' ? 'status-success' : rec.status === 'Pending' ? 'status-danger' : 'status-warning'}`}>
                    {rec.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="icon-btn" title="View"><Eye size={16} /></button>
                    <button className="icon-btn" title="Download"><Download size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
