import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiShield, FiSearch, FiFileText, FiCreditCard, FiZap, FiFilter, FiExternalLink } from 'react-icons/fi';

const TYPES = [
  { key: 'all',     label: 'All Info',       color: '#64748B' },
  { key: 'nid',     label: 'NID Info',       color: '#06B6D4' },
  { key: 'schemes', label: 'Gov Schemes',    color: '#8B5CF6' },
  { key: 'utility', label: 'Utility Bills',  color: '#F59E0B' },
];

const SAMPLE = [
  { id: 1, type: 'nid',     title: 'NID Card Correction Guide',    desc: 'Step-by-step process to correct your NID details online.', link: '#' },
  { id: 2, type: 'schemes', title: 'Universal Pension Scheme',      desc: 'Information about the new government pension system.', link: '#' },
  { id: 3, type: 'utility', title: 'DESCO Online Bill Payment',    desc: 'Pay your electricity bills safely from home.', link: '#' },
  { id: 4, type: 'nid',     title: 'Smart Card Distribution',      desc: 'Check your smart card status and collection point.', link: '#' },
  { id: 5, type: 'utility', title: 'WASA Bill Information',        desc: 'Check and pay your water bills online.', link: '#' },
  { id: 6, type: 'schemes', title: 'Student Loan Program',         desc: 'Government interest-free loans for higher education.', link: '#' },
];

export default function Government() {
  const [searchParams] = useSearchParams();
  const [search, setSearch]         = useState('');
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'all');

  // Sync state with URL params
  useEffect(() => {
    setActiveType(searchParams.get('type') || 'all');
  }, [searchParams]);

  const filtered = SAMPLE.filter(item => {
    const matchType   = activeType === 'all' || item.type === activeType;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const typeColor = TYPES.find(t => t.key === activeType)?.color || '#64748B';

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(6,182,212,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
              <FiShield size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Government Information</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>NID, Utility bills, and Government schemes</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {TYPES.map(t => (
            <button key={t.key} onClick={() => setActiveType(t.key)}
              style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${activeType === t.key ? t.color : 'var(--border)'}`, background: activeType === t.key ? `${t.color}15` : 'var(--surface-2)', color: activeType === t.key ? t.color : 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >{t.label}</button>
          ))}
        </div>

        <div style={{ position: 'relative', maxWidth: 460, marginBottom: '2rem' }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search information..." className="form-input" style={{ paddingLeft: 40, borderRadius: 24 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{item.title}</div>
                <FiExternalLink size={16} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 15 }}>{item.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.type === 'nid' && <FiCreditCard size={14} style={{ color: '#06B6D4' }} />}
                {item.type === 'schemes' && <FiFileText size={14} style={{ color: '#8B5CF6' }} />}
                {item.type === 'utility' && <FiZap size={14} style={{ color: '#F59E0B' }} />}
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: typeColor }}>{TYPES.find(t => t.key === item.type)?.label}</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <FiFilter size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
            <p>No information found. Try another search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
