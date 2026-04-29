import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FiPlus, FiMapPin, FiSearch, FiPhone, FiShield,
  FiUsers, FiHeart, FiBook, FiAlertTriangle,
  FiCoffee, FiGlobe, FiMonitor, FiStar, FiLayers,
  FiClock, FiUser, FiCheckCircle, FiXCircle,
  FiBriefcase, FiActivity
} from 'react-icons/fi';

const CATS = ['general','medical','education','disaster','food','environment','tech','other'];
const CAT_META = {
  general:   { color: '#06B6D4', icon: <FiUsers size={13} />, label: 'General' },
  medical:   { color: '#EC4899', icon: <FiHeart size={13} />, label: 'Medical' },
  education: { color: '#F59E0B', icon: <FiBook size={13} />, label: 'Education' },
  disaster:  { color: '#E63946', icon: <FiAlertTriangle size={13} />, label: 'Disaster' },
  food:      { color: '#F97316', icon: <FiCoffee size={13} />, label: 'Food' },
  environment: { color: '#10B981', icon: <FiGlobe size={13} />, label: 'Environment' },
  tech:      { color: '#8B5CF6', icon: <FiMonitor size={13} />, label: 'Tech' },
  other:     { color: '#64748B', icon: <FiStar size={13} />, label: 'Other' },
};

export default function Volunteers() {
  const { t, isBn } = useLang();
  const { isAuth } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [params, setParams] = useSearchParams();
  const actionQuery = params.get('action');
  const catQuery = params.get('category') || '';
  const searchQuery = params.get('search') || '';

  const [vols, setVols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState(searchQuery);
  const [showReg, setShowReg] = useState(false);
  const [myVol, setMyVol] = useState(null);
  const [regForm, setRegForm] = useState({
    skills: '', availability: '', category: 'general',
    division: '', district: '', bio: ''
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  useEffect(() => {
    setSearch(searchQuery);
    setPage(1);
  }, [catQuery, searchQuery]);

  useEffect(() => {
    if (actionQuery === 'register' && !myVol) setShowReg(true);
  }, [actionQuery, myVol]);

  const fetchVols = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page, limit: 16,
        ...(catQuery && { category: catQuery }),
        ...(searchQuery && { search: searchQuery })
      });
      const { data } = await api.get(`/volunteers?${q}`);
      setVols(data.data.rows);
      setTotal(data.data.total);
      setPages(data.data.pages);
    } catch {
      setVols([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVols(); }, [page, catQuery, searchQuery]); // eslint-disable-line

  useEffect(() => {
    if (isAuth) api.get('/volunteers/me').then(r => setMyVol(r.data.data)).catch(() => {});
  }, [isAuth]);

  const closeReg = () => {
    setShowReg(false);
    const newParams = new URLSearchParams(params);
    newParams.delete('action');
    setParams(newParams);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/volunteers', regForm);
      setMyVol(data.data);
      closeReg();
      toast.success(isBn ? 'স্বেচ্ছাসেবক হিসেবে নিবন্ধিত!' : 'Registered as volunteer!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleCat = (c) => {
    const newParams = new URLSearchParams(params);
    if (c) newParams.set('category', c);
    else newParams.delete('category');
    setParams(newParams);
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams(params);
    if (search) newParams.set('search', search);
    else newParams.delete('search');
    setParams(newParams);
  };

  // Stats for hero (static fallback)
  const stats = [
    { label: 'Volunteers', value: total, icon: <FiUsers size={16} />, color: 'var(--green)' },
    { label: 'Categories', value: CATS.length, icon: <FiLayers size={16} />, color: 'var(--purple)' },
    { label: 'Districts', value: 64, icon: <FiMapPin size={16} />, color: 'var(--cyan)' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ═══════ HERO ═══════ */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #0a1f16 0%, #0f2d22 40%, #080E1A 100%)'
          : 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 40%, #f1f5f9 100%)',
        padding: '5rem 0 3rem',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px', width: 400, height: 400, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '10%', width: 300, height: 300, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
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
                background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                color: 'var(--green)', padding: '5px 14px', borderRadius: 999,
                fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: 'var(--green)',
                  animation: 'pulse-dot 1.4s ease-in-out infinite',
                }} />
                Live Volunteer Network
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900,
              lineHeight: 1.08, letterSpacing: '-1.5px', color: 'var(--text)',
              marginBottom: '1rem', maxWidth: '750px',
            }}>
              Community{' '}
              <span style={{
                background: 'linear-gradient(135deg, #10B981, #34d399)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Volunteers
              </span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 520, lineHeight: 1.7, margin: '0 auto 2.5rem' }}>
              Find skilled community helpers ready to support — from medical aid to disaster relief.
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
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA – Register Now */}
            {isAuth && !myVol && (
              <div style={{ marginTop: '2rem' }}>
                <button onClick={() => setShowReg(true)} className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: 14, fontSize: '0.9rem', fontWeight: 700 }}>
                  <FiPlus size={16} style={{ marginRight: 6 }} /> {t('volunteers.register')}
                </button>
              </div>
            )}
            {myVol && (
              <div style={{ marginTop: '1.5rem' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                  color: 'var(--green)', padding: '8px 16px', borderRadius: 999,
                  fontSize: '0.83rem', fontWeight: 700,
                }}>
                  <FiCheckCircle size={15} />
                  {isBn ? 'আপনি নিবন্ধিত স্বেচ্ছাসেবক' : 'You are a registered volunteer'}
                </span>
              </div>
            )}
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
          {/* Category filter chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginRight: 4 }}>
              <FiUsers size={11} style={{ marginRight: 4 }} /> Category:
            </span>
            <button
              onClick={() => handleCat('')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer', border: '1px solid', transition: 'all 0.18s',
                background: !catQuery ? 'var(--green)' : 'transparent',
                borderColor: !catQuery ? 'var(--green)' : 'var(--border-2)',
                color: !catQuery ? '#fff' : 'var(--text-muted)',
              }}
            >
              All Categories
            </button>
            {CATS.map(catKey => {
              const meta = CAT_META[catKey];
              const active = catQuery === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => handleCat(catKey)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700,
                    cursor: 'pointer', border: '1px solid', transition: 'all 0.18s',
                    background: active ? meta.color : 'transparent',
                    borderColor: active ? meta.color : 'var(--border-2)',
                    color: active ? '#fff' : 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = meta.color;
                      e.currentTarget.style.background = `${meta.color}10`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'var(--border-2)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {meta.icon} {meta.label}
                </button>
              );
            })}
          </div>

          {/* Search row */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FiSearch style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-dim)', pointerEvents: 'none',
              }} size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder={isBn ? 'নাম বা দক্ষতা খুঁজুন...' : 'Search by name or skills...'}
                className="form-input"
                style={{ paddingLeft: 42, height: 46, borderRadius: 12, fontSize: '0.9rem' }}
              />
            </div>
            <button onClick={handleSearch} className="btn btn-primary" style={{ height: 46, padding: '0 1.5rem', borderRadius: 12, fontSize: '0.85rem' }}>
              <FiSearch size={14} /> Search
            </button>
          </div>
        </div>

        {/* Result info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {catQuery && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: `${CAT_META[catQuery]?.color}18`,
                color: CAT_META[catQuery]?.color,
                border: `1px solid ${CAT_META[catQuery]?.color}30`,
                padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700,
              }}>
                {CAT_META[catQuery]?.icon} {CAT_META[catQuery]?.label}
              </span>
            )}
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {loading ? 'Loading...' : <><strong style={{ color: 'var(--text)' }}>{total}</strong> volunteers</>}
            </span>
          </div>
          {isAuth && !myVol && (
            <button onClick={() => setShowReg(true)} className="btn btn-primary btn-sm">
              <FiPlus size={14} /> {t('volunteers.register')}
            </button>
          )}
        </div>

        {/* Volunteer Cards */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 18, padding: '1.5rem', minHeight: 160,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[60, 100, 80].map((w, j) => (
                    <div key={j} style={{
                      height: j === 0 ? 36 : 10, width: `${w}%`, borderRadius: 8,
                      background: 'var(--surface-3)', animation: 'shimmer 1.6s infinite',
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : vols.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '5rem 2rem', gap: '1rem', textAlign: 'center',
          }}>
            <FiUsers size={48} style={{ opacity: 0.4, color: 'var(--text-dim)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>No volunteers found</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Try adjusting your filters.</div>
            <button onClick={() => { handleCat(''); handleSearch(); }} className="btn btn-outline btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {vols.map((v, i) => {
              const meta = CAT_META[v.category] || CAT_META.other;
              const color = meta.color;
              return (
                <div
                  key={v.id}
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 800, fontSize: '1rem',
                      }}>
                        {v.name?.[0]?.toUpperCase() || 'V'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {v.name}
                          {v.is_verified && <FiShield size={13} style={{ color: 'var(--cyan)' }} title="Verified" />}
                        </div>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: `${color}15`, color: color,
                          padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700,
                          marginTop: 2,
                        }}>
                          {meta.icon} {meta.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {v.district && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                      <FiMapPin size={11} style={{ color }} /> {v.district}
                    </div>
                  )}
                  {v.availability && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                      <FiClock size={11} style={{ color }} /> {v.availability}
                    </div>
                  )}

                  {v.skills && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      {v.skills.split(',').slice(0, 4).map(s => (
                        <span
                          key={s}
                          style={{
                            background: `${color}10`, color: color,
                            border: `1px solid ${color}20`,
                            padding: '2px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 600,
                          }}
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {v.bio && (
                    <p style={{
                      fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8,
                      lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {v.bio}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {pages > 1 && (
          <div className="pagination" style={{ marginTop: '2rem' }}>
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
            {Array.from({ length: Math.min(5, pages) }, (_, i) => i + Math.max(1, page - 2))
              .filter(p => p <= pages)
              .map(p => (
                <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === pages}>›</button>
          </div>
        )}
      </div>

      {/* Register Modal – professionally styled */}
      {showReg && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={closeReg} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
          <div style={{
            position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 24, width: '100%', maxWidth: 480, padding: '2rem',
            animation: 'fadeUp 0.25s ease', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.5)' : '0 25px 60px rgba(0,0,0,0.12)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(16,185,129,0.12)', color: 'var(--green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiUsers size={17} />
              </div>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)' }}>{t('volunteers.register')}</h2>
            </div>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">{isBn ? 'বিভাগ' : 'Category'}</label>
                <select value={regForm.category} onChange={e => setRegForm(f => ({ ...f, category: e.target.value }))} className="form-select">
                  {CATS.map(c => {
                    const catMeta = CAT_META[c];
                    return (
                      <option key={c} value={c}>{catMeta.label}</option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{isBn ? 'দক্ষতা (কমা দিয়ে আলাদা করুন)' : 'Skills (comma-separated)'}</label>
                <input value={regForm.skills} onChange={e => setRegForm(f => ({ ...f, skills: e.target.value }))} placeholder="First Aid, Teaching, IT" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">{isBn ? 'উপলব্ধতা' : 'Availability'}</label>
                <input value={regForm.availability} onChange={e => setRegForm(f => ({ ...f, availability: e.target.value }))} placeholder="Weekends, Evenings" className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'বিভাগ (এলাকা)' : 'Division'}</label>
                  <input value={regForm.division} onChange={e => setRegForm(f => ({ ...f, division: e.target.value }))} placeholder="Dhaka" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'জেলা' : 'District'}</label>
                  <input value={regForm.district} onChange={e => setRegForm(f => ({ ...f, district: e.target.value }))} placeholder="Mirpur" className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{isBn ? 'সংক্ষিপ্ত পরিচয়' : 'Bio'}</label>
                <textarea value={regForm.bio} onChange={e => setRegForm(f => ({ ...f, bio: e.target.value }))} placeholder={isBn ? 'নিজের সম্পর্কে সংক্ষেপে লিখুন...' : 'Brief intro...'} className="form-textarea" style={{ minHeight: 80 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{t('common.submit')}</button>
                <button type="button" onClick={closeReg} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}