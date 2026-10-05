import { MapPin, Target, Layers } from 'lucide-react';

export default function GeologyPage() {
  const boreholes = [
    { id: 'BH-KCF-101', project: 'Gevra OCP', depth: '150m', coal_seams: 'IV, V', status: 'Explored' },
    { id: 'BH-KCF-102', project: 'Kusmunda OCP', depth: '210m', coal_seams: 'Upper Kusmunda', status: 'Explored' },
    { id: 'BH-KCF-103', project: 'Dipka OCP', depth: '185m', coal_seams: 'Lower Seam', status: 'Drilling in Progress' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Geological Information</h1>
          <p className="page-subtitle">Boreholes, Seams, and Exploration reports from Master Plan Korba CF.</p>
        </div>
      </div>
      
      <div className="kpi-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="kpi-card"><div className="kpi-label">Total Boreholes</div><div className="kpi-value">1,432</div></div>
        <div className="kpi-card"><div className="kpi-label">Identified Seams</div><div className="kpi-value">12</div></div>
        <div className="kpi-card"><div className="kpi-label">Geological Reserves (MT)</div><div className="kpi-value" style={{color:'var(--color-primary-600)'}}>12,850</div></div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header"><div className="card-title">Recent Borehole Logs (Korba CF)</div></div>
        <table className="data-table">
          <thead>
            <tr><th>Borehole ID</th><th>Associated Project</th><th>Total Depth</th><th>Intersected Seams</th><th>Status</th></tr>
          </thead>
          <tbody>
            {boreholes.map(bh => (
              <tr key={bh.id}>
                <td style={{fontWeight:500}}><MapPin size={14} style={{display:'inline', marginRight:'8px'}}/>{bh.id}</td>
                <td>{bh.project}</td>
                <td>{bh.depth}</td>
                <td>{bh.coal_seams}</td>
                <td><span className={`status-badge ${bh.status === 'Explored' ? 'status-success' : 'status-warning'}`}>{bh.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
