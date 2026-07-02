import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiDollarSign, FiSearch, FiList, FiFilter, FiPlusCircle, FiArrowRight, FiShield } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

const TYPES = [
  { key: 'all',       label: 'All Requests',   color: '#8B5CF6' },
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
  const { theme } = useTheme();
  const { t } = useLang();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch]         = useState('');
  const [activeType, setActiveType] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    setActiveType(searchParams.get('category') || 'all');
  }, [searchParams]);

  const handleCatChange = (key) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') newParams.delete('category');
    else newParams.set('category', key);
    setSearchParams(newParams);
    setActiveType(key);
  };

  const filtered = SAMPLE.filter(item => {
    const matchType   = activeType === 'all' || item.type === activeType;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.area.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      
      {/* --- HERO SECTION --- */}
      <div style={{
        position: 'relative',
        padding: '8rem 1rem 6rem',
        textAlign: 'center',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)'
      }}>
        {/* Decorative Background */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(139, 92, 246, 0.1)', padding: '8px 20px',
            borderRadius: '100px', color: '#8B5CF6', fontSize: '0.75rem', fontWeight: 600,
            marginBottom: '2rem', border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <FiShield size={14} /> Financial Assistance Network
          </div>

          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-2px', lineHeight: 1 }}>
            Financial <span style={{ color: '#8B5CF6' }}>Support</span>
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto', marginBottom: '3rem' }}>
            Help verified individuals facing medical, educational, and other financial crises.
          </p>
          <Link to="/donation/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px', borderRadius: '16px', border: 'none', cursor: 'pointer',
            fontSize: '1rem', fontWeight: 700, background: '#8B5CF6', color: '#fff', textDecoration: 'none'
          }}>
            <FiPlusCircle size={18} /> Request Help
          </Link>
        </div>
      </div>

      {/* --- SEARCH & CONTENT --- */}
      <div style={{ padding: '4rem 1.5rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '24px', borderRadius: '32px', marginBottom: '4rem'
        }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px' }}>
            {TYPES.map(c => (
              <button
                key={c.key}
                onClick={() => handleCatChange(c.key)}
                style={{
                  padding: '12px 24px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 600,
                  background: activeType === c.key ? c.color : 'var(--surface-2)',
                  color: activeType === c.key ? '#fff' : 'var(--text-muted)',
                  transition: '0.2s all'
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} size={20} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search requests by title or area..."
              style={{
                width: '100%', boxSizing: 'border-box', height: '64px',
                padding: '0 160px 0 56px', borderRadius: '20px',
                background: 'var(--bg)', border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: '1rem', outline: 'none'
              }}
            />
            <button style={{
              position: 'absolute', right: '10px', top: '10px', bottom: '10px',
              padding: '0 28px', borderRadius: '14px', border: 'none',
              background: '#8B5CF6', color: '#fff', fontWeight: 700, cursor: 'pointer'
            }}>
              Search
            </button>
          </div>
        </div>

        {/* Grid Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <FiFilter size={48} style={{ opacity: 0.2, display: 'block', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No requests found matching your criteria.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {filtered.map(item => {
              const typeColor = TYPES.find(t => t.key === item.type)?.color || '#64748B';
              return (
              <div key={item.id} style={{
                background: 'var(--surface)', borderRadius: '28px', padding: '28px',
                border: '1px solid var(--border)', position: 'relative', display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <span style={{
                    background: `${typeColor}15`, color: typeColor,
                    padding: '6px 14px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    {item.type}
                  </span>
                  <div style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: 800 }}>
                    {item.amount}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px', flex: 1 }}>{item.title}</h3>
                
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiList size={16} /> Status: <span style={{ color: item.status === 'Active' ? '#10B981' : '#64748B', fontWeight: 700 }}>{item.status}</span>
                  </div>
                </div>

                <Link to="/donation" style={{
                  width: '100%', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--surface-2)', color: 'var(--text)', borderRadius: '16px', fontWeight: 700, textDecoration: 'none', border: '1px solid var(--border)', gap: 8
                }}>
                  View Details <FiArrowRight size={18} />
                </Link>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
