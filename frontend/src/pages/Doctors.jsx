import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiUser, FiMapPin, FiPhone, FiSearch, FiStar,
  FiFilter, FiHeart, FiActivity, FiClock, FiCalendar,
  FiShield, FiAward, FiPlus
} from 'react-icons/fi';

/* ── Sample Specializations ──────────────────── */
const SPECIALIZATIONS = [
  { key: 'all',          label: 'All Doctors',       color: '#64748B' },
  { key: 'general',      label: 'General Physician', color: '#06B6D4' },
  { key: 'cardiologist', label: 'Cardiologist',      color: '#E63946' },
  { key: 'dermatologist',label: 'Dermatologist',     color: '#F59E0B' },
  { key: 'pediatrician', label: 'Pediatrician',      color: '#10B981' },
  { key: 'gynecologist', label: 'Gynecologist',      color: '#EC4899' },
  { key: 'neurologist',  label: 'Neurologist',       color: '#8B5CF6' },
];

/* ── Sample Data ────────────────────────────── */
const SAMPLE_DOCTORS = [
  { id:1,  name:'Dr. Ayesha Rahman',    specialization:'general',       area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.8, experience:'12 years', clinic:'Popular Diagnostic Centre' },
  { id:2,  name:'Dr. Kabir Hossain',    specialization:'cardiologist',  area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.9, experience:'15 years', clinic:'National Heart Foundation' },
  { id:3,  name:'Dr. Farzana Ahmed',    specialization:'dermatologist', area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.6, experience:'8 years',  clinic:'Labaid Specialized Hospital' },
  { id:4,  name:'Dr. Monirul Islam',    specialization:'pediatrician',  area:'Chittagong', phone:'01XXXXXXXXX', rating:4.7, experience:'10 years', clinic:'Chittagong Medical College' },
  { id:5,  name:'Dr. Sadia Sultana',    specialization:'gynecologist',  area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.5, experience:'20 years', clinic:'Dhaka Medical College Hospital' },
  { id:6,  name:'Dr. Zahid Hasan',      specialization:'neurologist',   area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.8, experience:'18 years', clinic:'United Hospital' },
  { id:7,  name:'Dr. Nasrin Akter',     specialization:'general',       area:'Sylhet',     phone:'01XXXXXXXXX', rating:4.4, experience:'6 years',  clinic:'Sylhet MAG Osmani Medical College' },
  { id:8,  name:'Dr. Rafiq Uddin',      specialization:'cardiologist',  area:'Khulna',    phone:'01XXXXXXXXX', rating:4.3, experience:'14 years', clinic:'Khulna Medical College' },
];

export default function Doctors() {
  const { t, isBn } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchParams, setParams] = useSearchParams();
  const initialSpec = searchParams.get('specialization') || 'all';
  const [search, setSearch]             = useState('');
  const [activeSpec, setActiveSpec]     = useState(initialSpec);
  const [visible, setVisible]           = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState(SAMPLE_DOCTORS);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  useEffect(() => {
    let result = SAMPLE_DOCTORS.filter(doc => {
      const matchSpec   = activeSpec === 'all' || doc.specialization === activeSpec;
      const matchSearch = !search || doc.name.toLowerCase().includes(search.toLowerCase()) || doc.area.toLowerCase().includes(search.toLowerCase());
      return matchSpec && matchSearch;
    });
    setFilteredDoctors(result);
  }, [search, activeSpec]);

  const handleSpecChange = (key) => {
    setActiveSpec(key);
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') newParams.delete('specialization');
    else newParams.set('specialization', key);
    setParams(newParams);
  };

  const stats = [
    { label: 'Doctors',      value: SAMPLE_DOCTORS.length, icon: <FiUser size={16} />, color: 'var(--cyan)' },
    { label: 'Specializations', value: SPECIALIZATIONS.length - 1, icon: <FiActivity size={16} />, color: 'var(--purple)' },
    { label: 'Avg. Rating',  value: '4.7',                icon: <FiStar size={16} />, color: 'var(--amber)' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ═══════ HERO ═══════ */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #0c1a2b 0%, #11243e 40%, #080E1A 100%)'
          : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f1f5f9 100%)',
        padding: '5rem 0 3rem',
        textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px', width: 400, height: 400, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '10%', width: 300, height: 300, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)',
                color: 'var(--cyan)', padding: '5px 14px', borderRadius: 999,
                fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: 'var(--cyan)',
                  animation: 'pulse-dot 1.4s ease-in-out infinite',
                }} />
                Verified Doctors
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900,
              lineHeight: 1.08, letterSpacing: '-1.5px', color: 'var(--text)',
              marginBottom: '1rem', maxWidth: '750px',
            }}>
              Find Trusted{' '}
              <span style={{
                background: 'linear-gradient(135deg, #06B6D4, #3b82f6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Doctors
              </span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 520, lineHeight: 1.7, margin: '0 auto 2.5rem' }}>
              Search by specialization, location, or name – with verified profiles and ratings.
            </p>

            {/* Stats */}
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
          {/* Specialization chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginRight: 4 }}>
              <FiFilter size={11} style={{ marginRight: 4 }} /> Specialization:
            </span>
            {SPECIALIZATIONS.map(spec => {
              const active = activeSpec === spec.key;
              return (
                <button
                  key={spec.key}
                  onClick={() => handleSpecChange(spec.key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700,
                    cursor: 'pointer', border: '1px solid', transition: 'all 0.18s',
                    background: active ? spec.color : 'transparent',
                    borderColor: active ? spec.color : 'var(--border-2)',
                    color: active ? '#fff' : 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = spec.color;
                      e.currentTarget.style.background = `${spec.color}10`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'var(--border-2)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {spec.label}
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
                placeholder="Search by name, area, or specialization..."
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
          {activeSpec !== 'all' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: `${SPECIALIZATIONS.find(s => s.key === activeSpec)?.color}18`,
              color: SPECIALIZATIONS.find(s => s.key === activeSpec)?.color,
              border: `1px solid ${SPECIALIZATIONS.find(s => s.key === activeSpec)?.color}30`,
              padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700,
            }}>
              {SPECIALIZATIONS.find(s => s.key === activeSpec)?.label}
            </span>
          )}
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)' }}>{filteredDoctors.length}</strong> doctors found
          </span>
        </div>

        {/* Doctor Cards */}
        {filteredDoctors.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '5rem 2rem', gap: '1rem', textAlign: 'center',
          }}>
            <FiUser size={48} style={{ opacity: 0.4, color: 'var(--text-dim)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>No doctors found</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Try adjusting your search or filter.</div>
            <button onClick={() => { setSearch(''); handleSpecChange('all'); }} className="btn btn-outline btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {filteredDoctors.map((doc, i) => {
              const specInfo = SPECIALIZATIONS.find(s => s.key === doc.specialization) || SPECIALIZATIONS[0];
              const color = specInfo.color;
              return (
                <div
                  key={doc.id}
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
                  {/* Accent top line */}
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
                      {doc.name.charAt(0)}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      fontSize: '0.85rem', fontWeight: 800, color: 'var(--amber)',
                      background: 'rgba(245,158,11,0.1)', borderRadius: 10,
                      padding: '2px 8px',
                    }}>
                      <FiStar size={12} /> {doc.rating}
                    </div>
                  </div>

                  <h3 style={{
                    fontWeight: 800, color: 'var(--text)',
                    marginBottom: '0.3rem', fontSize: '0.97rem', lineHeight: 1.35,
                  }}>
                    {doc.name}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <FiActivity size={12} style={{ color }} /> {specInfo.label}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <FiMapPin size={12} style={{ color: 'var(--cyan)', opacity: 0.8 }} /> {doc.area}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <FiAward size={12} style={{ color: 'var(--green)' }} /> {doc.experience}
                    </span>
                    {doc.clinic && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        <FiShield size={12} style={{ color: 'var(--purple)' }} /> {doc.clinic}
                      </span>
                    )}
                  </div>

                  {/* Contact & Appointment */}
                  <div style={{ display: 'flex', gap: 8, marginTop: '0.5rem' }}>
                    <a
                      href={`tel:${doc.phone}`}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '8px 0', borderRadius: 12,
                        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                        color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem',
                        boxShadow: `0 4px 14px ${color}30`,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <FiPhone size={14} /> Call
                    </a>
                    <button
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '8px 0', borderRadius: 12,
                        background: 'var(--surface-2)', border: `1px solid ${color}30`,
                        color: 'var(--text)', fontWeight: 700, fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${color}15`;
                        e.currentTarget.style.borderColor = color;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'var(--surface-2)';
                        e.currentTarget.style.borderColor = `${color}30`;
                      }}
                    >
                      <FiCalendar size={14} /> Book
                    </button>
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