import { Pickaxe, Activity, Truck } from 'lucide-react';

export default function MiningPage() {
  const mines = [
    { name: 'Gevra OCP', type: 'Mega Project', method: 'Opencast / Surface Miner', target: '70 MTPA', actual: '68.5 MTPA', status: 'Active' },
    { name: 'Kusmunda OCP', type: 'Mega Project', method: 'Opencast / Surface Miner', target: '50 MTPA', actual: '49.1 MTPA', status: 'Active' },
    { name: 'Dipka OCP', type: 'Mega Project', method: 'Opencast / Surface Miner', target: '40 MTPA', actual: '38.2 MTPA', status: 'Active' },
    { name: 'Manikpur OCP', type: 'OCP', method: 'Opencast (Shovel-Dumper)', target: '5.2 MTPA', actual: '5.0 MTPA', status: 'Active' }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Mining Information</h1>
          <p className="page-subtitle">Production figures, mining methods, and operational status for Korba CF.</p>
        </div>
      </div>
      
      <div className="kpi-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="kpi-card"><div className="kpi-label">Active Mines (Korba)</div><div className="kpi-value">14</div></div>
        <div className="kpi-card"><div className="kpi-label">Total Targeted Production</div><div className="kpi-value">165.2 MTPA</div></div>
        <div className="kpi-card"><div className="kpi-label">Primary Extraction Method</div><div className="kpi-value" style={{color:'var(--color-primary-600)'}}>Surface Miner</div></div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header"><div className="card-title">Major Mine Profiles</div></div>
        <table className="data-table">
          <thead>
            <tr><th>Mine Name</th><th>Category</th><th>Mining Method</th><th>Target (MTPA)</th><th>Actual (MTPA)</th><th>Status</th></tr>
          </thead>
          <tbody>
            {mines.map(m => (
              <tr key={m.name}>
                <td style={{fontWeight:500}}><Pickaxe size={14} style={{display:'inline', marginRight:'8px'}}/>{m.name}</td>
                <td>{m.type}</td>
                <td>{m.method}</td>
                <td>{m.target}</td>
                <td>{m.actual}</td>
                <td><span className="status-badge status-success">{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
