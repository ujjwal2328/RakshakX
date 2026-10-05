'use client';

import React from 'react';
import { BookOpen, ChevronRight, Database, FileText, MapPin, Layers } from 'lucide-react';

const KNOWLEDGE_TREE = [
  {
    name: 'Coal India Limited (CIL)',
    type: 'Organization',
    children: [
      {
        name: 'South Eastern Coalfields Ltd (SECL)',
        type: 'Subsidiary',
        children: [
          { name: 'Gevra OCP', type: 'Mine', docs: 24, children: [
            { name: 'Block A — Exploration', type: 'Project', docs: 8 },
            { name: 'BH-127', type: 'Borehole', docs: 3 },
            { name: 'BH-128', type: 'Borehole', docs: 2 },
            { name: 'Seam IV', type: 'Coal Seam', docs: 5 },
          ]},
          { name: 'Kusmunda OCP', type: 'Mine', docs: 18, children: [
            { name: 'Expansion Phase II', type: 'Project', docs: 6 },
          ]},
          { name: 'Dipka OCP', type: 'Mine', docs: 15 },
        ],
      },
      {
        name: 'Northern Coalfields Ltd (NCL)',
        type: 'Subsidiary',
        children: [
          { name: 'Jayant OCP', type: 'Mine', docs: 12 },
          { name: 'Nigahi OCP', type: 'Mine', docs: 10 },
          { name: 'Singrauli Coalfield', type: 'Geological Area', docs: 7 },
        ],
      },
      {
        name: 'Eastern Coalfields Ltd (ECL)',
        type: 'Subsidiary',
        children: [
          { name: 'Rajmahal OCP', type: 'Mine', docs: 9 },
          { name: 'Block IV — Exploration', type: 'Project', docs: 4 },
        ],
      },
    ],
  },
];

const ENTITY_STATS = [
  { label: 'Mines', count: 42, icon: Layers },
  { label: 'Projects', count: 28, icon: FileText },
  { label: 'Boreholes', count: 156, icon: MapPin },
  { label: 'Coal Seams', count: 89, icon: Database },
];

function TreeNode({ node, depth = 0 }: { node: any; depth?: number }) {
  const [expanded, setExpanded] = React.useState(depth < 2);

  const typeColor: Record<string, string> = {
    Organization: 'var(--color-primary)',
    Subsidiary: 'var(--color-primary-500)',
    Mine: 'var(--color-secondary)',
    Project: 'var(--color-success)',
    Borehole: 'var(--color-warning)',
    'Coal Seam': 'var(--color-neutral-600)',
    'Geological Area': 'var(--color-secondary-500)',
  };

  return (
    <div style={{ marginLeft: depth > 0 ? '20px' : 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-1) var(--space-2)',
          borderRadius: 'var(--border-radius)',
          cursor: node.children ? 'pointer' : 'default',
          fontSize: 'var(--text-sm)',
        }}
        onClick={() => node.children && setExpanded(!expanded)}
      >
        {node.children && (
          <ChevronRight
            size={12}
            style={{
              transform: expanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.15s ease',
              color: 'var(--color-neutral-400)',
            }}
          />
        )}
        {!node.children && <span style={{ width: 12 }} />}
        <span style={{
          fontSize: 'var(--text-xs)',
          padding: '0 4px',
          borderRadius: '2px',
          background: `${typeColor[node.type] || 'var(--color-neutral-500)'}15`,
          color: typeColor[node.type] || 'var(--color-neutral-500)',
          fontWeight: 500,
        }}>
          {node.type}
        </span>
        <span style={{ fontWeight: 500, color: 'var(--color-neutral-800)' }}>{node.name}</span>
        {node.docs && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginLeft: 'auto' }}>
            {node.docs} docs
          </span>
        )}
      </div>
      {expanded && node.children && node.children.map((child: any, i: number) => (
        <TreeNode key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function KnowledgePage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Information Repository</h1>
          <p className="page-subtitle">
            Unified organizational knowledge — entities, relationships, and document connections
          </p>
        </div>
      </div>

      {/* Entity Stats */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--space-5)' }}>
        {ENTITY_STATS.map((stat) => (
          <div className="kpi-card" key={stat.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <stat.icon size={16} style={{ color: 'var(--color-primary-400)' }} />
              <div>
                <div className="kpi-label">{stat.label}</div>
                <div className="kpi-value" style={{ fontSize: 'var(--text-xl)' }}>{stat.count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Information Repository */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Information Repository</div>
            <div className="card-subtitle">Navigate the organizational knowledge hierarchy</div>
          </div>
        </div>
        <div className="card-body">
          {KNOWLEDGE_TREE.map((node, i) => (
            <TreeNode key={i} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
