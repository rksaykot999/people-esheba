import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiList, FiSearch, FiPhone, FiMapPin, FiStar,
  FiFilter, FiHome, FiTruck, FiTool, FiActivity,
  FiUsers, FiWifi, FiHeart, FiShield, FiAward,
  FiZap
} from 'react-icons/fi';

const CATS = [
  { key: 'all',          label: 'All Services',          color: '#64748B', icon: <FiList size={12} /> },
  { key: 'home',         label: 'Home Services',          color: '#E63946', icon: <FiHome size={12} /> },
  { key: 'transport',    label: 'Transport',              color: '#06B6D4', icon: <FiTruck size={12} /> },
  { key: 'repairs',      label: 'Repairs & Maintenance',  color: '#F59E0B', icon: <FiTool size={12} /> },
  { key: 'telemedicine', label: 'Telemedicine',           color: '#EC4899', icon: <FiHeart size={12} /> },
  { key: 'tutor',        label: 'Finding Tutor',          color: '#8B5CF6', icon: <FiActivity size={12} /> },
  { key: 'utility',      label: 'Utility Services',       color: '#10B981', icon: <FiShield size={12} /> },
];

const SAMPLE = [
  { id:1,  cat:'home',         name:'CleanBD Home Services',    area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.5, badge:'Cleaning' },
  { id:2,  cat:'home',         name:'HomeFix BD',               area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.2, badge:'Plumbing & Electric' },
  { id:3,  cat:'transport',    name:'Pathao Rides',             area:'Nationwide', phone:'16775',       rating:4.7, badge:'Ride Sharing' },
  { id:4,  cat:'transport',    name:'Shohoz Bus Booking',       area:'Nationwide', phone:'16789',       rating:4.3, badge:'Bus Tickets' },
  { id:5,  cat:'repairs',      name:'FixIt BD',                 area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.4, badge:'Electronics Repair' },
  { id:6,  cat:'repairs',      name:'AC & Fridge Service BD',   area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.1, badge:'Appliance Repair' },
  { id:7,  cat:'telemedicine', name:'Maya Apa (Telehealth)',    area:'Nationwide', phone:'16789',       rating:4.8, badge:'Online Doctor' },
  { id:8,  cat:'telemedicine', name:'Praava Health',            area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.6, badge:'Telemedicine' },
  { id:9,  cat:'tutor',        name:'10 Minute School Tutor',   area:'Nationwide', phone:'01XXXXXXXXX', rating:4.9, badge:'Online Tutor' },
  { id:10, cat:'tutor',        name:'Shikho.com',               area:'Nationwide', phone:'01XXXXXXXXX', rating:4.7, badge:'Online Learning' },
  { id:11, cat:'utility',      name:'DESCO Bill Payment',       area:'Dhaka',      phone:'16118',       rating:4.0, badge:'Electricity Bill' },
  { id:12, cat:'utility',      name:'WASA Dhaka',               area:'Dhaka',      phone:'16162',       rating:3.9, badge:'Water & Sewerage' },
];

export default function Services() {
  const { t, isBn } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchParams, setParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const [search, setSearch]       = useState('');
  const [activeCat, setActiveCat] = useState(initialCat);
  const [visible, setVisible]     = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const filtered = SAMPLE.filter(item => {
    const matchCat    = activeCat === 'all' || item.cat === activeCat;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.area.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCatChange = (key) => {
    setActiveCat(key);
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') newParams.delete('cat');
    else newParams.set('cat', key);
    setParams(newParams);
  };

  // Stats from sample data
  const stats = [
    { label: 'Services', value: SAMPLE.length, icon: <FiList size={16} />, color: 'var(--purple)' },
    { label: 'Categories', value: CATS.length - 1, icon: <FiZap size={16} />, color: 'var(--cyan)' },
    { label: 'Avg. Rating', value: '4.4', icon: <FiStar size={16} />, color: 'var(--amber)' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ═══════ HERO ═══════ */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #100b1f 0%, #1a1030 40%, #080E1A 100%)'
          : 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 40%, #f1f5f9 100%)',
        padding: '5rem 0 3rem',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px', width: 400, height: 400, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '10%', width: 300, height: 300, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
                color: 'var(--purple)', padding: '5px 14px', borderRadius: 999,
                fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: 'var(--purple)',
                  animation: 'pulse-dot 1.4s ease-in-out infinite',
                }} />
                Everyday Services
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900,
              lineHeight: 1.08, letterSpacing: '-1.5px', color: 'var(--text)',
              marginBottom: '1rem', maxWidth: '750px',
            }}>
              Trusted{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6, #a78bfa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Services
              </span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 520, lineHeight: 1.7, margin: '0 auto 2.5rem' }}>
              Home repair, transport, telemedicine, tutoring, utility help — trusted contacts across Bangladesh.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {stats.map(s => (
                <div key={s.label} style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  backdropFilter: 'blur(12px)',
                  border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 16, padding: '1rem 1.25rem', minWidth: 120, textAlign: 'center',
                }}>
                  <div style={{ color: s.color, marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ FILTERS & SEARCH ═══════ */}
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '1.25rem', marginBottom: '2rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          {/* Category chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginRight: 4 }}>
              <FiFilter size={11} style={{ marginRight: 4 }} /> Category:
            </span>
            {CATS.map(cat => {
              const active = activeCat === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCatChange(cat.key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700,
                    cursor: 'pointer', border: '1px solid', transition: 'all 0.18s',
                    background: active ? cat.color : 'transparent',
                    borderColor: active ? cat.color : 'var(--border-2)',
                    color: active ? '#fff' : 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = cat.color;
                      e.currentTarget.style.background = `${cat.color}10`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'var(--border-2)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {cat.icon} {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FiSearch style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-dim)', pointerEvents: 'none',
              }} size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search services or area..."
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
          {activeCat !== 'all' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: `${CATS.find(c => c.key === activeCat)?.color}18`,
              color: CATS.find(c => c.key === activeCat)?.color,
              border: `1px solid ${CATS.find(c => c.key === activeCat)?.color}30`,
              padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700,
            }}>
              {CATS.find(c => c.key === activeCat)?.icon} {CATS.find(c => c.key === activeCat)?.label}
            </span>
          )}
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> services found
          </span>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '5rem 2rem', gap: '1rem', textAlign: 'center',
          }}>
            <FiFilter size={48} style={{ opacity: 0.4, color: 'var(--text-dim)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>No services found</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Try adjusting your search or filter.</div>
            <button onClick={() => { setSearch(''); handleCatChange('all'); }} className="btn btn-outline btn-sm">
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
              const catInfo = CATS.find(c => c.key === item.cat) || CATS[0];
              const color = catInfo.color;
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
                      {catInfo.icon}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      fontSize: '0.85rem', fontWeight: 800, color: 'var(--amber)',
                      background: 'rgba(245,158,11,0.1)', borderRadius: 10,
                      padding: '2px 8px',
                    }}>
                      <FiStar size={12} /> {item.rating}
                    </div>
                  </div>

                  <h3 style={{
                    fontWeight: 800, color: 'var(--text)',
                    marginBottom: '0.3rem', fontSize: '0.97rem', lineHeight: 1.35,
                  }}>
                    {item.name}
                  </h3>

                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: `${color}15`, color: color,
                    padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700,
                    marginBottom: '0.8rem',
                  }}>
                    {catInfo.icon} {item.badge}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiMapPin size={12} style={{ color, opacity: 0.7 }} /> {item.area}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiPhone size={12} style={{ color, opacity: 0.7 }} /> {item.phone}
                    </span>
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