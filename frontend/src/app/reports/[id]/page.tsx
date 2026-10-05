'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, FileOutput, Save, Download, Share2, 
  Wand2, AlignLeft, Send, Sparkles, MessageSquare, Check, X, Loader2
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getToken(): string {
  try {
    const authData = JSON.parse(localStorage.getItem('cirs_auth') || '{}');
    return authData.accessToken || '';
  } catch { return ''; }
}

export default function ReportEditorPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiSidebar, setShowAiSidebar] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [params.id]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/reports/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
        setContent(data.content || '');
      }
    } catch (e) {
      console.error('Failed to load report:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAiPrompt = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/query`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ query: prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setContent(prev => prev + `\n\n## AI Generated Section\n${data.answer || data.response || 'No additional content generated.'}`);
      }
    } catch (e) {
      setContent(prev => prev + `\n\n## AI Generated Section\nBased on your prompt "${prompt}", the system was unable to reach the AI service. Please try again.`);
    }
    
    setPrompt('');
    setIsGenerating(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 'var(--space-3)' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary-500)' }} />
        <span style={{ color: 'var(--color-neutral-500)' }}>Loading report...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <FileOutput size={48} style={{ color: 'var(--color-neutral-300)' }} />
        <div style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-lg)' }}>Report not found</div>
        <button className="btn btn-primary" onClick={() => router.push('/reports')}>← Back to Reports</button>
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: 'var(--space-3) var(--space-4)', background: 'white', 
        borderBottom: '1px solid var(--color-neutral-200)', flexShrink: 0 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={() => router.push('/reports')}
            style={{ padding: '4px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <FileOutput size={20} style={{ color: 'var(--color-primary-500)' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-neutral-900)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {report.title}
              <span className={`status-badge ${(report.status || '').toLowerCase().replace(/\s+/g, '-')}`}>{report.status}</span>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
              {report.template} • {report.period} • {report.subsidiary}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAiSidebar(!showAiSidebar)}>
            <Wand2 size={14} style={{ color: 'var(--color-primary-600)' }} /> AI Assistance
          </button>
          <button className="btn btn-secondary btn-sm"><Share2 size={14} /> Share</button>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
          <button className="btn btn-primary btn-sm"><Save size={14} /> Save Draft</button>
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-neutral-50)', padding: 'var(--space-4)' }}>
          <div style={{ 
            flex: 1, background: 'white', border: '1px solid var(--color-neutral-200)', 
            borderRadius: 'var(--border-radius)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            display: 'flex', flexDirection: 'column'
          }}>
            {/* Formatting Toolbar */}
            <div style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)', display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontWeight: 'bold' }}>B</button>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontStyle: 'italic' }}>I</button>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', textDecoration: 'underline' }}>U</button>
              <div style={{ width: '1px', background: 'var(--color-neutral-200)' }}></div>
              <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}><AlignLeft size={16} /></button>
            </div>
            
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ 
                flex: 1, border: 'none', resize: 'none', padding: 'var(--space-6) var(--space-8)',
                fontSize: '15px', lineHeight: '1.6', fontFamily: 'var(--font-sans)',
                color: 'var(--color-neutral-800)', outline: 'none'
              }}
              placeholder="Start writing your report here or use the AI Assistance to generate sections..."
            />
          </div>
        </div>

        {/* AI Assistance Sidebar */}
        {showAiSidebar && (
          <div style={{ 
            width: '380px', background: 'white', borderLeft: '1px solid var(--color-neutral-200)', 
            display: 'flex', flexDirection: 'column', flexShrink: 0
          }}>
            <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--color-primary-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} style={{ color: 'var(--color-primary-600)' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-neutral-900)', fontSize: 'var(--text-sm)' }}>AI Assistance</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>Context-aware drafting powered by Gemini</div>
              </div>
            </div>

            <div style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Report Summary
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-info-light)', borderRadius: 'var(--border-radius)', fontSize: 'var(--text-sm)', color: 'var(--color-primary-800)', marginBottom: 'var(--space-4)' }}>
                <strong>Title:</strong> {report.title}<br/>
                <strong>Subsidiary:</strong> {report.subsidiary}<br/>
                <strong>Period:</strong> {report.period}<br/>
                <strong>Status:</strong> {report.status}<br/>
                <strong>Created:</strong> {report.created_at}
              </div>

              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Quick Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-3)' }}
                  onClick={() => { setPrompt('Add an Executive Summary section'); }}
                >
                  <Wand2 size={14} /> Draft Executive Summary
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-3)' }}
                  onClick={() => { setPrompt('Add a Safety & Environment section'); }}
                >
                  <Wand2 size={14} /> Draft Safety & Environment section
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-3)' }}
                  onClick={() => { setPrompt('Summarize key constraints and recommendations'); }}
                >
                  <MessageSquare size={14} /> Summarize constraints
                </button>
              </div>
            </div>

            {/* Prompt Input */}
            <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-neutral-200)', background: 'var(--color-neutral-50)' }}>
              <textarea 
                className="form-input" 
                placeholder="Ask AI to draft a section or pull data..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{ resize: 'none', height: '80px', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}
              />
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleAiPrompt}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <><Send size={14} /> Generate Content</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
