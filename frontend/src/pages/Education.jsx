import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiBook, FiSearch, FiMapPin, FiAward, FiExternalLink,
  FiFilter, FiLayers, FiBookOpen, FiGlobe, FiShield,
  FiDollarSign, FiStar
} from 'react-icons/fi';

/* ── Constants ──────────────────────────────────── */
const TYPE_CONFIG = {
  'all':           { label: 'All',                color: '#64748B', icon: <FiLayers size={14} /> },
  'govt-school':   { label: 'Govt School',        color: '#E63946', icon: <FiBookOpen size={14} /> },
  'govt-college':  { label: 'Govt College',       color: '#F59E0B', icon: <FiBook size={14} /> },
  'public-uni':    { label: 'Public University',  color: '#06B6D4', icon: <FiGlobe size={14} /> },
  'private-uni':   { label: 'Private University', color: '#8B5CF6', icon: <FiShield size={14} /> },
  'scholarships':  { label: 'Scholarships',       color: '#10B981', icon: <FiAward size={14} /> },
};

const SAMPLE = [
  { id:1,  type:'govt-school',   name:'Government Laboratory High School',  area:'Dhaka',      estd:1954, badge:'Govt School' },
  { id:2,  type:'govt-school',   name:'Rajshahi Collegiate School',          area:'Rajshahi',  estd:1828, badge:'Govt School' },
  { id:3,  type:'govt-college',  name:'Notre Dame College',                  area:'Dhaka',      estd:1949, badge:'Govt College' },
  { id:4,  type:'govt-college',  name:'Dhaka College',                       area:'Dhaka',      estd:1841, badge:'Govt College' },
  { id:5,  type:'public-uni',    name:'University of Dhaka',                 area:'Dhaka',      estd:1921, badge:'Public Uni' },
  { id:6,  type:'public-uni',    name:'Bangladesh University of Engineering',area:'Dhaka',     estd:1962, badge:'Public Uni' },
  { id:7,  type:'public-uni',    name:'University of Chittagong',            area:'Chittagong', estd:1966, badge:'Public Uni' },
  { id:8,  type:'private-uni',   name:'BRAC University',                     area:'Dhaka',      estd:2001, badge:'Private Uni' },
  { id:9,  type:'private-uni',   name:'North South University',              area:'Dhaka',      estd:1992, badge:'Private Uni' },
  { id:10, type:'scholarships',  name:'Prime Minister Scholarship',          area:'Nationwide', amount:'Variable', badge:'Scholarship' },
  { id:11, type:'scholarships',  name:'Board Scholarship (SSC/HSC)',         area:'Nationwide', amount:'3,000-5,000 BDT/mo', badge:'Scholarship' },
];

export default function Education() {
  const { t, isBn } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchParams, setParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  const [search, setSearch]       = useState('');
  const [activeType, setActiveType] = useState(initialType);
  const [visible, setVisible]     = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const filtered = SAMPLE.filter(item => {
    const matchType   = activeType === 'all' || item.type === activeType;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.area.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleTypeChange = (key) => {
    setActiveType(key);
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') newParams.delete('type');
    else newParams.set('type', key);
    setParams(newParams);
  };

  // Stats from sample data
  const stats = [
    { label: 'Schools',      value: SAMPLE.filter(i => i.type === 'govt-school').length,  icon: <FiBookOpen size={16} />,  color: '#E63946' },
    { label: 'Colleges',     value: SAMPLE.filter(i => i.type === 'govt-college').length, icon: <FiBook size={16} />,     color: '#F59E0B' },
    { label: 'Public Unis',  value: SAMPLE.filter(i => i.type === 'public-uni').length,   icon: <FiGlobe size={16} />,    color: '#06B6D4' },
    { label: 'Private Unis', value: SAMPLE.filter(i => i.type === 'private-uni').length,  icon: <FiShield size={16} />,   color: '#8B5CF6' },
    { label: 'Scholarships', value: SAMPLE.filter(i => i.type === 'scholarships').length,  icon: <FiAward size={16} />,    color: '#10B981' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ═══════ HERO ═══════ */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #0a0f1f 0%, #10172d 40%, #080E1A 100%)'
          : 'linear-gradient(135deg, #fdf8f0 0%, #fef7e7 40%, #f1f5f9 100%)',
        padding: '5rem 0 3.5rem',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px', width: 400, height: 400, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '10%', width: 300, height: 300, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: isDark ? 0.03 : 0.04,
          backgroundImage: `linear-gradient(var(--amber) 1px, transparent 1px),
                            linear-gradient(90deg, var(--amber) 1px, transparent 1px)`,
          backgroundSize: '60px 60px', pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                color: 'var(--amber)', padding: '5px 14px', borderRadius: 999,
                fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)',
                  animation: 'pulse-dot 1.4s ease-in-out infinite',
                }} />
                Education Hub
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900,
              lineHeight: 1.08, letterSpacing: '-1.5px', color: 'var(--text)',
              marginBottom: '1rem', maxWidth: '750px',
            }}>
              Explore{' '}
              <span style={{
                background: 'linear-gradient(135deg, #F59E0B, #fbbf24)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Education
              </span>{' '}in Bangladesh
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 520, lineHeight: 1.7, margin: '0 auto 2.5rem' }}>
              Browse schools, colleges, universities and available scholarships — quick overview.
            </p>

            {/* Stats – with icons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {stats.map(s => (
                <div key={s.label} style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  backdropFilter: 'blur(12px)',
                  border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 16, padding: '1rem 1.25rem', minWidth: 110, textAlign: 'center',
                }}>
                  <div style={{ color: s.color, marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ FILTERS ═══════ */}
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '1.25rem', marginBottom: '2rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          {/* Category filters with icons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginRight: 4 }}>
              <FiFilter size={11} style={{ marginRight: 4 }} /> Category:
            </span>
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
              const active = activeType === key;
              return (
                <button
                  key={key}
                  onClick={() => handleTypeChange(key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700,
                    cursor: 'pointer', border: '1px solid', transition: 'all 0.18s',
                    background: active ? cfg.color : 'transparent',
                    borderColor: active ? cfg.color : 'var(--border-2)',
                    color: active ? '#fff' : 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = cfg.color;
                      e.currentTarget.style.background = `${cfg.color}10`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'var(--border-2)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {cfg.icon}
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FiSearch style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-dim)', pointerEvents: 'none',
              }} size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search institution or area..."
                className="form-input"
                style={{ paddingLeft: 42, height: 46, borderRadius: 12, fontSize: '0.9rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: 46, padding: '0 1.5rem', borderRadius: 12, fontSize: '0.85rem' }}>
              <FiSearch size={14} /> Search
            </button>
          </form>
        </div>

        {/* Result info */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          {activeType !== 'all' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: `${TYPE_CONFIG[activeType]?.color}18`,
              color: TYPE_CONFIG[activeType]?.color,
              border: `1px solid ${TYPE_CONFIG[activeType]?.color}30`,
              padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700,
            }}>
              {TYPE_CONFIG[activeType]?.icon}
              {TYPE_CONFIG[activeType]?.label}
            </span>
          )}
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> results
          </span>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '5rem 2rem', gap: '1rem', textAlign: 'center',
          }}>
            <FiFilter size={48} style={{ opacity: 0.4, color: 'var(--text-dim)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>No results found</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Try adjusting your search or filter.</div>
            <button onClick={() => { setSearch(''); handleTypeChange('all'); }} className="btn btn-outline btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {filtered.map((item, i) => {
              const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.all;
              const color = cfg.color;
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 18, padding: '1.5rem', position: 'relative',
                    overflow: 'hidden', transition: 'all 0.24s cubic-bezier(0.4,0,0.2,1)',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'none' : 'translateY(20px)',
                    transitionDelay: `${Math.min(i * 40, 200)}ms`,
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = color + '40';
                    e.currentTarget.style.boxShadow = `0 12px 40px ${color}18`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Accent line */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${color}, transparent)`,
                    borderRadius: '18px 18px 0 0',
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: `${color}18`, border: `1px solid ${color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: color, fontWeight: 700, fontSize: '1.2rem',
                    }}>
                      {cfg.icon || <FiBook size={22} />}
                    </div>
                    <FiExternalLink size={15} style={{ color: 'var(--text-dim)', opacity: 0.7 }} />
                  </div>

                  <h3 style={{
                    fontWeight: 800, color: 'var(--text)',
                    marginBottom: '0.3rem', fontSize: '0.97rem', lineHeight: 1.35,
                  }}>
                    {item.name}
                  </h3>

                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: `${color}15`,
                    color: color,
                    padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700,
                    marginBottom: '0.8rem',
                  }}>
                    {cfg.icon}
                    {item.badge}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiMapPin size={12} style={{ color, opacity: 0.7 }} /> {item.area}
                    </span>
                    {item.estd && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiBook size={12} style={{ color, opacity: 0.7 }} /> Est. {item.estd}
                      </span>
                    )}
                    {item.amount && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green)', fontWeight: 600 }}>
                        <FiDollarSign size={12} /> {item.amount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}