import { MapPin, Target, Layers, ArrowRight } from 'lucide-react';

export default function GeologyPage() {
  const boreholes = [
    { id: 'BH-KCF-101', project: 'Gevra OCP', depth: '150m', coal_seams: 'IV, V', status: 'Explored' },
    { id: 'BH-KCF-102', project: 'Kusmunda OCP', depth: '210m', coal_seams: 'Upper Kusmunda', status: 'Explored' },
    { id: 'BH-KCF-103', project: 'Dipka OCP', depth: '185m', coal_seams: 'Lower Seam', status: 'Drilling in Progress' },
  ];

  const rockLayers = [
    { name: 'Top Soil / Alluvium', thickness: '5m', color: '#8B5A2B', pattern: 'dots' },
    { name: 'Fine-grained Sandstone', thickness: '35m', color: '#E4D5B7', pattern: 'dots' },
    { name: 'Grey Shale', thickness: '12m', color: '#7D8489', pattern: 'lines' },
    { name: 'Seam V (Coal)', thickness: '18m', color: '#1A1A1A', pattern: 'solid' },
    { name: 'Coarse Sandstone', thickness: '45m', color: '#D2B48C', pattern: 'dots' },
    { name: 'Seam IV (Coal)', thickness: '32m', color: '#0F0F0F', pattern: 'solid' },
    { name: 'Carbonaceous Shale', thickness: '8m', color: '#3A3F44', pattern: 'lines' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Geological Information</h1>
          <p className="page-subtitle">Visual Stratigraphy, Boreholes, and Seams from Master Plan Korba CF.</p>
        </div>
      </div>
      
      <div className="kpi-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="kpi-card"><div className="kpi-label">Total Boreholes</div><div className="kpi-value">1,432</div></div>
        <div className="kpi-card"><div className="kpi-label">Identified Seams</div><div className="kpi-value">12</div></div>
        <div className="kpi-card"><div className="kpi-label">Geological Reserves (MT)</div><div className="kpi-value" style={{color:'var(--color-primary-600)'}}>12,850</div></div>
      </div>

      <div className="section-grid" style={{ marginTop: 'var(--space-6)' }}>
        {/* Visual Rock Layer / Stratigraphy */}
        <div className="card">
          <div className="card-header"><div className="card-title">Typical Stratigraphic Column (Gevra Block)</div></div>
          <div className="card-body" style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
            {/* SVG Column */}
            <svg width="120" height="380" viewBox="0 0 120 380" style={{ borderRadius: '8px', border: '2px solid var(--color-neutral-300)' }}>
              <defs>
                <pattern id="pattern-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="rgba(0,0,0,0.15)" />
                </pattern>
                <pattern id="pattern-lines" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M0,5 L10,5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                </pattern>
              </defs>
              
              {rockLayers.map((layer, idx) => {
                const totalHeight = 380;
                const totalThickness = rockLayers.reduce((acc, curr) => acc + parseInt(curr.thickness), 0);
                const height = (parseInt(layer.thickness) / totalThickness) * totalHeight;
                const yOffset = rockLayers.slice(0, idx).reduce((acc, curr) => acc + (parseInt(curr.thickness) / totalThickness) * totalHeight, 0);
                
                return (
                  <g key={idx}>
                    <rect x="0" y={yOffset} width="120" height={height} fill={layer.color} />
                    {layer.pattern !== 'solid' && (
                      <rect x="0" y={yOffset} width="120" height={height} fill={`url(#pattern-${layer.pattern})`} />
                    )}
                    <rect x="0" y={yOffset} width="120" height={height} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                  </g>
                );
              })}
            </svg>

            {/* Legend / Labels */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 0' }}>
              {rockLayers.map((layer, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ArrowRight size={14} color="var(--color-neutral-400)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: layer.color === '#1A1A1A' || layer.color === '#0F0F0F' ? 'var(--color-danger)' : 'var(--color-neutral-800)' }}>
                      {layer.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>Thickness: {layer.thickness}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Borehole Table */}
        <div className="card">
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
    </div>
  );
}
