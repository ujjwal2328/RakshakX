'use client';

import React, { useState } from 'react';
import { Search, Send, FileText, ExternalLink, ChevronRight, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const EXAMPLE_QUERIES = [
  'What was SECL production during FY 2024-25?',
  'Show geological reports related to Gevra Block.',
  'What changed between the 2024 and 2025 annual reports?',
  'Which reports mention Borehole BH-127?',
  'Summarize exploration progress over the last five years.',
  'What are the recurring environmental topics in recent reports?',
];

interface Evidence {
  title: string;
  page?: number;
  content: string;
  relevance: number;
}

interface QueryResponseData {
  query_id: string;
  question: string;
  answer: string;
  confidence: string;
  sources: Evidence[];
}

export default function QueryPage() {
  const { accessToken: token } = useAuth();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<QueryResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (q: string) => {
    setQuery(q);
    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      // Mocking response for Vercel deployment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: QueryResponseData = {
        query_id: 'QRY-999',
        question: q,
        answer: 'Based on the Master Plan Korba CF, the targeted production for Gevra OCP is 70 MTPA, Kusmunda is 50 MTPA, and Dipka is 40 MTPA. The strategy emphasizes mechanised opencast mining with 42-cum shovels and 240-Ton dumpers. For reserves beyond the techno-economic stripping ratio, underground mining using Continuous Miners is proposed.',
        confidence: '95%',
        sources: [
          {
            title: 'Chapter-6 MINING STRATEGY.doc',
            page: 12,
            content: 'Targeted expansion to 70 MTPA for Gevra, 50 MTPA for Kusmunda...',
            relevance: 0.98
          },
          {
            title: 'CHAPTER-7-METHOD OF MINING.doc',
            page: 4,
            content: 'Mechanised underground mining (Continuous Miners / Longwall) is proposed...',
            relevance: 0.89
          }
        ]
      };
      
      setResponse(mockData);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the response.');
    } finally {
      setIsLoading(false);
    }
  };

  const confidenceColor = {
    'High': 'var(--color-success)',
    'Medium': 'var(--color-warning)',
    'Requires Review': 'var(--color-danger)',
  } as Record<string, string>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Information Search</h1>
          <p className="page-subtitle">Search reports, documents, records and organizational information.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-primary btn-sm">Basic Search</button>
        <button className="btn btn-ghost btn-sm">Advanced Search</button>
      </div>

      {/* Query Input */}
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }} />
              <input
                className="form-input"
                type="text"
                placeholder="Search documents, reports, mines, projects, boreholes or subjects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && query.trim() && handleSubmit(query)}
                style={{ height: '40px', paddingLeft: '36px', fontSize: 'var(--text-md)' }}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => query.trim() && handleSubmit(query)}
              disabled={!query.trim() || isLoading}
              style={{ height: '40px' }}
            >
              <Send size={14} /> Search
            </button>
          </div>

          {/* Example Queries */}
          {!response && !isLoading && (
            <div style={{ marginTop: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-2)' }}>Example queries:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {EXAMPLE_QUERIES.map((q) => (
                  <button
                    key={q}
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleSubmit(q)}
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
            <Clock size={24} style={{ color: 'var(--color-primary-400)', marginBottom: 'var(--space-2)' }} />
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--color-neutral-700)', marginBottom: 'var(--space-1)' }}>Processing query...</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>
              Searching documents · Retrieving evidence · Generating system response
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="card" style={{ borderColor: 'var(--color-danger)' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--color-danger)' }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </div>
        </div>
      )}

      {/* Response */}
      {response && !isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-4)' }}>
          {/* Main Answer */}
          <div>
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="card-header">
                <div className="card-title">Response</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>Data Confidence:</span>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: confidenceColor[response.confidence] || 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <CheckCircle2 size={12} />
                    {response.confidence}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-2)' }}>
                  <strong>Q:</strong> {response.question}
                </div>
                <div style={{
                  fontSize: 'var(--text-md)',
                  color: 'var(--color-neutral-800)',
                  lineHeight: 'var(--line-height-relaxed)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {response.answer}
                </div>
                <div style={{
                  marginTop: 'var(--space-4)',
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--color-info-light)',
                  borderRadius: 'var(--border-radius)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}>
                  <AlertCircle size={13} />
                  System-Generated Response. Verify critical figures against source documents before official use.
                </div>
              </div>
            </div>

            {/* Evidence details */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Context Text Analysed</div>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {response.sources.map((ev, i) => (
                  <div key={i} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderBottom: '1px solid var(--color-neutral-100)',
                  }}>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-neutral-700)',
                      fontStyle: 'italic',
                      marginBottom: 'var(--space-1)',
                      padding: 'var(--space-2) var(--space-3)',
                      borderLeft: '3px solid var(--color-primary-300)',
                      background: 'var(--color-neutral-50)',
                    }}>
                      "{ev.content}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sources Panel */}
          <div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Sources Used</div>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {response.sources.map((src, i) => (
                  <div key={i} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderBottom: '1px solid var(--color-neutral-100)',
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                      <FileText size={14} style={{ color: 'var(--color-primary-400)', flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-neutral-800)' }}>
                          {src.title}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                          Page {src.page || 'N/A'}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginTop: '2px' }}>
                          Relevance: {Math.round(src.relevance * 100)}%
                        </div>
                      </div>
                      <ChevronRight size={14} style={{ color: 'var(--color-neutral-400)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
