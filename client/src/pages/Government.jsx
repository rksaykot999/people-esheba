import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiSearch, FiPhone, FiMapPin, FiStar,
  FiFilter, FiArrowRight, FiCheckCircle, FiShield, FiExternalLink
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useApi } from '../hooks/useApi';

const CATS = [
  { key: 'all', label: 'All Services', color: '#8B5CF6' },
  { key: 'nid', label: 'NID & Identity', color: '#3B82F6' },
  { key: 'schemes', label: 'Gov Schemes', color: '#10B981' },
  { key: 'passport', label: 'Passport & Visa', color: '#F59E0B' },
  { key: 'land', label: 'Land Services', color: '#EF4444' },
  { key: 'utility', label: 'Utility Bills', color: '#06B6D4' },
];

/* Maps a directory_listings row (category=government) into this page's shape */
function mapGovService(row) {
  return {
    id: row.id,
    cat: row.subtype,
    name: row.name,
    area: row.area || row.district || 'Nationwide',
    phone: row.phone,
    rating: Number(row.rating) || 0,
    reviews: null,
    badge: row.badge_key || CATS.find(c => c.key === row.subtype)?.label,
    price: row.price_info || 'Contact for details',
    desc: row.description,
    features: row.features ? row.features.split(',').map(f => f.trim()) : [],
  };
}

export default function Government() {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || 'all');

  const handleCatChange = (key) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') newParams.delete('cat');
    else newParams.set('cat', key);
    setSearchParams(newParams);
    setActiveCat(key);
  };

  /* Real data — managed from Admin → Directory → Government */
  const { data, loading } = useApi('/directory', { params: { category: 'government', subtype: activeCat !== 'all' ? activeCat : undefined, search: search || undefined } });
  const govServices = (data?.rows || []).map(mapGovService);

  const filtered = govServices.filter(item => {
    const matchCat = activeCat === 'all' || item.cat === activeCat;
    const matchSearch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.desc || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
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
            background: 'rgba(16, 185, 129, 0.1)', padding: '8px 20px',
            borderRadius: '100px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600,
            marginBottom: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <FiShield size={14} /> Official Government Portals
          </div>

          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-2px', lineHeight: 1 }}>
            Citizen <span style={{ color: '#10b981' }}>Services</span>
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto', marginBottom: '4rem' }}>
            Access all essential Bangladesh government services, digital forms, and social safety net programs.
          </p>
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
            {CATS.map(c => (
              <button
                key={c.key}
                onClick={() => handleCatChange(c.key)}
                style={{
                  padding: '12px 24px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 600,
                  background: activeCat === c.key ? '#10b981' : 'var(--surface-2)',
                  color: activeCat === c.key ? '#fff' : 'var(--text-muted)',
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
              placeholder="Search by service name (e.g. NID, Passport, Bill)..."
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
              background: '#10b981', color: '#fff', fontWeight: 700, cursor: 'pointer'
            }}>
              Search
            </button>
          </div>
        </div>

        {/* Grid Results */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner"/></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No government services listed yet for this category.</div>
        ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {filtered.map(item => (
            <div key={item.id} style={{
              background: 'var(--surface)', borderRadius: '28px', padding: '28px',
              border: '1px solid var(--border)', position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                  padding: '6px 14px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  {item.badge}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#f59e0b', fontWeight: 700 }}>
                  <FiStar size={16} fill="#f59e0b" /> {item.rating}
                </div>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px' }}>{item.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px', height: '3.2rem', overflow: 'hidden' }}>
                {item.desc}
              </p>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiCheckCircle size={16} color="#10b981" /> {item.area}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiMapPin size={16} /> Contact: {item.phone}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a href={`tel:${item.phone}`} style={{
                  flex: 1, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--surface-2)', color: 'var(--text)', borderRadius: '16px', fontWeight: 700, textDecoration: 'none', border: '1px solid var(--border)'
                }}>
                  <FiPhone size={18} style={{ marginRight: 10 }} /> Helpline
                </a>
                <button style={{
                  flex: 1.5, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#10b981', color: '#fff', borderRadius: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', gap: 8
                }}>
                  Apply Online <FiExternalLink size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

      </div>
    </div>
  );
}