import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiDollarSign, FiSearch, FiHeart, FiBook, FiActivity, FiList, FiFilter, FiPlusCircle } from 'react-icons/fi';

const TYPES = [
  { key: 'all',       label: 'All Requests',   color: '#64748B' },
  { key: 'medical',   label: 'Medical Aid',    color: '#E63946' },
  { key: 'education', label: 'Education Fund', color: '#F59E0B' },
  { key: 'other',     label: 'Other',          color: '#10B981' },
];

const SAMPLE = [
  { id: 1, type: 'medical',   title: 'Urgent Heart Surgery Assistance', amount: '2,00,000 BDT', area: 'Dhaka', status: 'Active' },
  { id: 2, type: 'education', title: 'Scholarship for Higher Studies',   amount: '50,000 BDT',  area: 'Chittagong', status: 'Active' },
  { id: 3, type: 'medical',   title: 'Treatment for Cancer Patient',    amount: '5,00,000 BDT', area: 'Sylhet', status: 'Active' },
  { id: 4, type: 'other',     title: 'Flood Relief Fund',               amount: '1,00,000 BDT', area: 'Feni', status: 'Completed' },
];

export default function Finance() {
  const [searchParams] = useSearchParams();
  const [search, setSearch]         = useState('');
  const [activeType, setActiveType] = useState(searchParams.get('category') || 'all');

  // Sync state with URL params
  useEffect(() => {
    setActiveType(searchParams.get('category') || 'all');
  }, [searchParams]);

  const filtered = SAMPLE.filter(item => {
    const matchType   = activeType === 'all' || item.type === activeType;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.area.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const typeColor = TYPES.find(t => t.key === activeType)?.color || '#64748B';

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <FiDollarSign size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Financial Assistance</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Donations and financial support requests</p>
            </div>
          </div>
          <Link to="/donation/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiPlusCircle /> Request Help
          </Link>
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests..." className="form-input" style={{ paddingLeft: 40, borderRadius: 24 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{item.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: typeColor, background: `${typeColor}15`, padding: '2px 10px', borderRadius: 12 }}>{item.type.toUpperCase()}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)' }}>{item.amount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <FiList size={14} /> Status: <span style={{ color: item.status === 'Active' ? '#10B981' : '#64748B' }}>{item.status}</span>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 15 }}>View Details</button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <FiFilter size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
            <p>No requests found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
