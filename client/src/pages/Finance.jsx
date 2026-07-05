import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiArrowRight, FiShield, FiPhone, FiGlobe, FiStar } from 'react-icons/fi';
import { MdAccountBalance, MdSavings, MdPhoneAndroid, MdHealthAndSafety } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { useApi } from '../hooks/useApi';

/* This page used to be an orphaned duplicate of the Donation "financial aid
 * request" flow (not linked anywhere, zero backend). It's now a real,
 * admin-managed directory of banks / NBFIs / mobile financial services /
 * insurance providers, sourced from the same directory_listings table that
 * backs Health, Services & Government. */
const TYPES = [
  { key: 'all',       label: 'All Institutions', color: '#8B5CF6', icon: FiFilter },
  { key: 'bank',      label: 'Banks',            color: '#3B82F6', icon: MdAccountBalance },
  { key: 'nbfi',      label: 'NBFI / Leasing',   color: '#F59E0B', icon: MdSavings },
  { key: 'mfs',       label: 'Mobile Finance',   color: '#10B981', icon: MdPhoneAndroid },
  { key: 'insurance', label: 'Insurance',        color: '#E63946', icon: MdHealthAndSafety },
  { key: 'other',     label: 'Other',            color: '#8B5CF6', icon: FiFilter },
];

function mapFinance(row) {
  return {
    id: row.id,
    type: row.subtype,
    name: row.name,
    area: row.area || row.district || 'Nationwide',
    phone: row.phone,
    website: row.website,
    rating: Number(row.rating) || 0,
    desc: row.description,
    is_verified: !!row.is_verified,
  };
}

export default function Finance() {
  const { theme } = useTheme();
  const { t } = useLang();

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch]         = useState('');
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'all');

  useEffect(() => {
    setActiveType(searchParams.get('type') || 'all');
  }, [searchParams]);

  const handleCatChange = (key) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') newParams.delete('type');
    else newParams.set('type', key);
    setSearchParams(newParams);
    setActiveType(key);
  };

  /* Real data — managed from Admin → Directory → Finance */
  const { data, loading } = useApi('/directory', { params: { category: 'finance', subtype: activeType !== 'all' ? activeType : undefined, search: search || undefined } });
  const institutions = (data?.rows || []).map(mapFinance);

  const filtered = institutions.filter(item => {
    const matchType   = activeType === 'all' || item.type === activeType;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.area.toLowerCase().includes(search.toLowerCase());
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
            <FiShield size={14} /> Financial Institution Directory
          </div>

          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-2px', lineHeight: 1 }}>
            Find <span style={{ color: '#8B5CF6' }}>Finance</span> Services
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto', marginBottom: '3rem' }}>
            Banks, NBFIs, mobile financial services and insurance providers near you.
          </p>
          <Link to="/donation" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px', borderRadius: '16px', border: 'none', cursor: 'pointer',
            fontSize: '1rem', fontWeight: 700, background: '#8B5CF6', color: '#fff', textDecoration: 'none'
          }}>
            Need financial help instead? Visit Donation <FiArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* --- SEARCH & CONTENT --- */}
      <div style={{ padding: '4rem 1.5rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '24px', borderRadius: '32px', marginBottom: '4rem'
        }}>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px' }}>
            {TYPES.map(c => (
              <button
                key={c.key}
                onClick={() => handleCatChange(c.key)}
                style={{
                  padding: '12px 24px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: activeType === c.key ? c.color : 'var(--surface-2)',
                  color: activeType === c.key ? '#fff' : 'var(--text-muted)',
                  transition: '0.2s all'
                }}
              >
                <c.icon size={14} /> {c.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} size={20} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or area..."
              style={{
                width: '100%', boxSizing: 'border-box', height: '64px',
                padding: '0 20px 0 56px', borderRadius: '20px',
                background: 'var(--bg)', border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: '1rem', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Grid Results */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner"/></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <FiFilter size={48} style={{ opacity: 0.2, display: 'block', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No institutions listed yet for this category.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {filtered.map(item => {
              const typeColor = TYPES.find(tp => tp.key === item.type)?.color || '#64748B';
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
                  {!!item.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#f59e0b', fontWeight: 700 }}>
                      <FiStar size={14} fill="#f59e0b" /> {item.rating}
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px', flex: 1 }}>{item.name}</h3>
                {item.desc && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>{item.desc}</p>}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiShield size={16} color="#10B981" /> {item.area}
                  </div>
                  {item.phone && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FiPhone size={16} /> {item.phone}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  {item.phone && (
                    <a href={`tel:${item.phone}`} style={{
                      flex: 1, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--surface-2)', color: 'var(--text)', borderRadius: '16px', fontWeight: 700, textDecoration: 'none', border: '1px solid var(--border)', gap: 8
                    }}>
                      <FiPhone size={16} /> Call
                    </a>
                  )}
                  {item.website && (
                    <a href={item.website} target="_blank" rel="noreferrer" style={{
                      flex: 1, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: typeColor, color: '#fff', borderRadius: '16px', fontWeight: 700, textDecoration: 'none', gap: 8
                    }}>
                      <FiGlobe size={16} /> Visit
                    </a>
                  )}
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
