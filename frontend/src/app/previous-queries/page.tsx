import { History, Search, FileText } from 'lucide-react';

export default function PreviousQueriesPage() {
  const queries = [
    { id: 'PQ-2023-145', question: 'Status of Environmental Clearances in Korba Coalfields', date: '2023-08-12', answer: 'Clearance obtained for Gevra and Kusmunda. Dipka pending final review.' },
    { id: 'PQ-2023-089', question: 'Land Acquisition details for SECL Mega Projects', date: '2023-06-05', answer: 'As per Chapter 8 of Master Plan, 4250 Ha required. 80% acquired.' },
    { id: 'PQ-2022-312', question: 'Safety measures implemented in Opencast Mines', date: '2022-11-20', answer: 'SSR radar deployed in highwalls. HIRA completed for all active zones.' }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Previous Queries & Responses</h1>
          <p className="page-subtitle">Search historical parliamentary questions and their finalized answers.</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <div className="card-title">Search History</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input type="text" className="form-input" style={{flex: 1}} placeholder="Search past queries (e.g. 'Environmental Clearance')" />
            <button className="btn btn-primary"><Search size={16} /> Search</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {queries.map(q => (
              <div key={q.id} style={{ border: '1px solid var(--color-neutral-200)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary-700)' }}>{q.id}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>{q.date}</span>
                </div>
                <div style={{ fontWeight: 500, marginBottom: '8px' }}>Q: {q.question}</div>
                <div style={{ color: 'var(--color-neutral-700)', fontSize: '14px', background: 'var(--color-neutral-50)', padding: '8px', borderRadius: '4px' }}>
                  A: {q.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
