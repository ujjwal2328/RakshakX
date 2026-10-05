'use client';

import React, { useState, useEffect } from 'react';
import { Tags, TrendingUp, FileText, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function TopicsPage() {
  const { accessToken: token } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const [topics, setTopics] = useState<any[]>([]);
  const [wordCloud, setWordCloud] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Injecting mock topics based on Korba Master Plan
    const mockTopics = [
      { id: '1', name: 'Opencast Mining', count: 145, trend: '+12%' },
      { id: '2', name: 'Environment Clearance', count: 89, trend: '+5%' },
      { id: '3', name: 'Land Acquisition', count: 76, trend: '-2%' },
      { id: '4', name: 'Coal Evacuation', count: 54, trend: '+8%' },
      { id: '5', name: 'Rehabilitation & Resettlement', count: 42, trend: '+1%' }
    ];

    const mockWordCloud = [
      { text: 'Gevra OCP', weight: 45 },
      { text: 'Kusmunda', weight: 40 },
      { text: 'Dipka', weight: 38 },
      { text: 'Overburden', weight: 25 },
      { text: 'Production', weight: 30 },
      { text: 'Environment', weight: 35 },
      { text: 'CHP', weight: 20 },
      { text: 'Mechanised', weight: 15 }
    ];

    setTopics(mockTopics);
    setWordCloud(mockWordCloud);
    setIsLoading(false);
  }, [token]);

  function trendColor(trend: string) {
    if (trend.startsWith('+')) return 'var(--color-success)';
    if (trend.startsWith('-')) return 'var(--color-danger)';
    return 'var(--color-neutral-500)';
  }

  function trendLabel(trend: string) {
    if (trend.startsWith('+')) return `↑ Increasing (${trend})`;
    if (trend.startsWith('-')) return `↓ Decreasing (${trend})`;
    return `— Stable (${trend})`;
  }

  if (isLoading) {
    return <div style={{ padding: 'var(--space-10)', textAlign: 'center' }}><RefreshCw className="animate-spin" /> Loading topics...</div>;
  }

  if (error) {
    return <div style={{ padding: 'var(--space-10)', color: 'var(--color-danger)', textAlign: 'center' }}><AlertCircle /> {error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Subject & Trend Analysis</h1>
          <p className="page-subtitle">
            System-identified subjects, keyword analysis, and document-subject mapping
          </p>
        </div>
      </div>

      <div className="section-grid">
        {/* Subject Overview */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Subject Overview</div>
            <div className="card-subtitle">Extracted from indexed documents</div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center', alignItems: 'center', minHeight: '220px', padding: 'var(--space-6)' }}>
            {wordCloud.map((w) => (
              <span
                key={w.text}
                style={{
                  fontSize: `${w.value * 0.03 + 12}px`,
                  fontWeight: w.value > 800 ? 600 : 400,
                  color: w.value > 1000 ? 'var(--color-primary)' : 'var(--color-secondary-600)',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  transition: 'opacity 0.15s ease',
                }}
                title={`${w.text}: ${w.value} occurrences`}
              >
                {w.text}
              </span>
            ))}
          </div>
        </div>

        {/* Topic Frequency */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Frequently Reported Subjects</div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {topics.map((t, i) => (
              <div
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderBottom: '1px solid var(--color-neutral-100)',
                  cursor: 'pointer',
                  background: selectedTopic === t.id ? 'var(--color-primary-50)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontWeight: 500, color: 'var(--color-neutral-900)' }}>{t.name}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: trendColor(t.trend) }}>
                    {trendLabel(t.trend)}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', paddingLeft: '28px' }}>
                  <span>{t.mentions} mentions</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={12} /> {t.documents} docs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
