import { Pickaxe, Map, Layers } from 'lucide-react';

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
          <h1 className="page-title">Mining Operations (Korba CF)</h1>
          <p className="page-subtitle">Production figures, operational maps, and block status.</p>
        </div>
      </div>
      
      <div className="kpi-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="kpi-card"><div className="kpi-label">Active Mines (Korba)</div><div className="kpi-value">14</div></div>
        <div className="kpi-card"><div className="kpi-label">Total Targeted Production</div><div className="kpi-value">165.2 MTPA</div></div>
        <div className="kpi-card"><div className="kpi-label">Primary Extraction Method</div><div className="kpi-value" style={{color:'var(--color-primary-600)'}}>Surface Miner</div></div>
      </div>

      <div className="section-grid" style={{ marginTop: 'var(--space-6)' }}>
        {/* Visual Map */}
        <div className="card">
          <div className="card-header"><div className="card-title">Korba Coalfield - Block Schematic</div></div>
          <div className="card-body" style={{ textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px' }}>
            <svg viewBox="0 0 400 300" style={{ width: '100%', maxWidth: '400px', height: 'auto', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
              <rect width="400" height="300" fill="#f0f5fa" />
              <path d="M50 150 Q100 80, 200 120 T350 100" fill="none" stroke="#add8e6" strokeWidth="8" />
              <text x="360" y="105" fontSize="10" fill="#666">Hasdeo River</text>

              {/* Gevra */}
              <path d="M 100 130 L 180 130 L 190 220 L 110 210 Z" fill="rgba(255, 99, 71, 0.5)" stroke="#ff6347" strokeWidth="2" />
              <text x="125" y="175" fontSize="12" fontWeight="bold" fill="#333">Gevra</text>

              {/* Kusmunda */}
              <path d="M 210 140 L 290 150 L 270 240 L 200 230 Z" fill="rgba(60, 179, 113, 0.5)" stroke="#3cb371" strokeWidth="2" />
              <text x="215" y="195" fontSize="12" fontWeight="bold" fill="#333">Kusmunda</text>

              {/* Dipka */}
              <path d="M 40 210 L 90 210 L 100 270 L 30 260 Z" fill="rgba(255, 215, 0, 0.5)" stroke="#ffd700" strokeWidth="2" />
              <text x="45" y="245" fontSize="12" fontWeight="bold" fill="#333">Dipka</text>
            </svg>
            <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--color-neutral-500)' }}>Schematic representation of major OCP blocks relative to Hasdeo River.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Major Mine Profiles</div></div>
          <table className="data-table">
            <thead>
              <tr><th>Mine Name</th><th>Category</th><th>Mining Method</th><th>Target</th><th>Actual</th><th>Status</th></tr>
            </thead>
            <tbody>
              {mines.map(m => (
                <tr key={m.name}>
                  <td style={{fontWeight:500}}><Pickaxe size={14} style={{display:'inline', marginRight:'8px'}}/>{m.name}</td>
                  <td>{m.type}</td>
                  <td style={{fontSize:'12px'}}>{m.method}</td>
                  <td>{m.target}</td>
                  <td>{m.actual}</td>
                  <td><span className="status-badge status-success">{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
