'use client';

import React from 'react';
import { Map, Info } from 'lucide-react';

export default function GISPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Geographic Information</h1>
          <p className="page-subtitle">Spatial intelligence — mines, blocks, boreholes, and geological features</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="empty-state">
            <Map size={40} />
            <div className="empty-state-title">Geographic Information — Phase 8</div>
            <div className="empty-state-text">
              Interactive map with Leaflet/PostGIS integration will display mine locations, blocks, boreholes, exploration areas, and linked documents.
              Requires PostGIS database connection.
            </div>
            <div style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--color-info-light)',
              borderRadius: 'var(--border-radius)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-primary-700)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              maxWidth: '360px',
              margin: '0 auto',
            }}>
              <Info size={13} />
              Planned features: spatial search, click-to-view linked documents, map-based report discovery, borehole visualization.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
