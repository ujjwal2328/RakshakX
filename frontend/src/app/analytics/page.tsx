'use client';
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .catch(() => null)
      .then(setData);
  }, []);

  const reportStats = [
    { label: 'Total Documents Processed', value: data?.summary?.total_documents || '0' },
    { label: 'Entities Extracted', value: data?.summary?.total_entities || '0' },
    { label: 'System-Prepared Drafts', value: '4' },
    { label: 'Validation Pass Rate', value: '91%' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">
            Production, exploration, and reporting analytics
          </p>
        </div>
      </div>

      <div className="kpi-grid">
        {reportStats.map((stat) => (
          <div className="kpi-card" key={stat.label}>
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-value" style={{ fontSize: 'var(--text-xl)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Subsidiary Production Comparison (MT)</div>
              <div className="card-subtitle">Current Data</div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.subsidiary_performance || []} barSize={14} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #E5E7EB' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="production" fill="#0B3A66" name="Production" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Monthly Production vs Target (MT)</div>
              <div className="card-subtitle">CIL Trend</div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data?.production_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #E5E7EB' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="actual" stroke="#0B3A66" strokeWidth={2} name="Actual" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="target" stroke="#D1D5DB" strokeWidth={2} strokeDasharray="5 5" name="Target" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
