import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  FiPlus, FiArrowRight, FiCalendar, FiUser,
  FiHeart, FiDroplet, FiBook, FiAlertTriangle,
  FiCoffee, FiStar, FiZap, FiLayers, FiDollarSign,
  FiMapPin, FiBarChart2
} from 'react-icons/fi';

const CATS = ['all', 'medical', 'education', 'disaster', 'food', 'other'];
const CAT_META = {
  all:       { color: '#64748B', icon: <FiLayers size={13} />,  label: 'All' },
  medical:   { color: '#E63946', icon: <FiHeart size={13} />,   label: 'Medical' },
  education: { color: '#06B6D4', icon: <FiBook size={13} />,    label: 'Education' },
  disaster:  { color: '#F59E0B', icon: <FiAlertTriangle size={13} />, label: 'Disaster' },
  food:      { color: '#10B981', icon: <FiCoffee size={13} />,   label: 'Food' },
  other:     { color: '#8B5CF6', icon: <FiStar size={13} />,     label: 'Other' },
};

export default function Donation() {
  const { t, isBn } = useLang();
  const { isAuth } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [params, setParams] = useSearchParams();
  const catQuery = params.get('category') || 'all';

  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);
  const [statsTotalRaised, setStatsTotalRaised] = useState(0); // dynamic if available
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  // Fetch stats for hero (total raised etc.)
  useEffect(() => {
    api.get('/donations/stats')
      .then(({ data }) => {
        if (data?.data) {
          setStatsTotalRaised(data.data.total_raised || 0);
        }
      })
      .catch(() => {
        setStatsTotalRaised(500000); // fallback
      });
  }, []);

  useEffect(() => { setPage(1); }, [catQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page,
        limit: 12,
        ...(catQuery !== 'all' && { category: catQuery })
      });
      const { data } = await api.get(`/donations?${q}`);
      setItems(data.data.rows);
      setTotal(data.data.total);
      setPages(data.data.pages);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, catQuery]); // eslint-disable-line

  const handleCat = (c) => {
    const newParams = new URLSearchParams(params);
    if (c && c !== 'all') newParams.set('category', c);
    else newParams.delete('category');
    setParams(newParams);
  };

  const activeMeta = CAT_META[catQuery] || CAT_META.all;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ═══════ HERO ═══════ */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #1a0a10 0%, #1f0d1a 40%, #080E1A 100%)'
          : 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 40%, #f1f5f9 100%)',
        padding: '5rem 0 3rem',
        textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px', width: 400, height: 400, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(230,57,70,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '10%', width: 300, height: 300, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(230,57,70,0.05) 0%, transparent 70%)',
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
                background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.25)',
                color: 'var(--red)', padding: '5px 14px', borderRadius: 999,
                fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: 'var(--red)',
                  animation: 'pulse-dot 1.4s ease-in-out infinite',
                }} />
                Live Support Requests
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900,
              lineHeight: 1.08, letterSpacing: '-1.5px', color: 'var(--text)',
              marginBottom: '1rem', maxWidth: '700px',
            }}>
              {t('donation.title')}{' '}
              <span style={{
                background: 'linear-gradient(135deg, #E63946, #ff6b6b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Help
              </span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 520, lineHeight: 1.7, margin: '0 auto 2.5rem' }}>
              {t('donation.sub')}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                backdropFilter: 'blur(12px)',
                border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
                borderRadius: 16, padding: '1rem 1.25rem', minWidth: 130, textAlign: 'center',
              }}>
                <div style={{ color: 'var(--red)', marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
                  <FiLayers size={16} />
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
                  {loading ? '...' : total}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>
                  Active Requests
                </div>
              </div>

              <div style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                backdropFilter: 'blur(12px)',
                border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
                borderRadius: 16, padding: '1rem 1.25rem', minWidth: 130, textAlign: 'center',
              }}>
                <div style={{ color: 'var(--green)', marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
                  <FiDollarSign size={16} />
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
                  ৳{statsTotalRaised.toLocaleString()}+
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Raised
                </div>
              </div>

              <div style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                backdropFilter: 'blur(12px)',
                border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
                borderRadius: 16, padding: '1rem 1.25rem', minWidth: 130, textAlign: 'center',
              }}>
                <div style={{ color: 'var(--purple)', marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
                  <FiBarChart2 size={16} />
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
                  {CATS.length - 1}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>
                  Categories
                </div>
              </div>
            </div>

            {isAuth && (
              <div style={{ marginTop: '2rem' }}>
                <Link to="/donation/new" className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: 14, fontSize: '0.9rem', fontWeight: 700 }}>
                  <FiPlus size={16} style={{ marginRight: 6 }} /> {t('donation.new')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Category filter chips */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '1rem 1.25rem', marginBottom: '2rem',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginRight: 4 }}>
            <FiHeart size={11} style={{ marginRight: 4 }} /> Category:
          </span>
          {Object.entries(CAT_META).map(([key, meta]) => {
            const active = catQuery === key;
            return (
              <button
                key={key}
                onClick={() => handleCat(key)}
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

        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          {catQuery !== 'all' && activeMeta && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: `${activeMeta.color}18`,
              color: activeMeta.color,
              border: `1px solid ${activeMeta.color}30`,
              padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700,
            }}>
              {activeMeta.icon} {activeMeta.label}
            </span>
          )}
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {loading ? 'Loading...' : <><strong style={{ color: 'var(--text)' }}>{total}</strong> requests found</>}
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 18, padding: '1.5rem', minHeight: 180,
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
        ) : items.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '5rem 2rem', gap: '1rem', textAlign: 'center',
          }}>
            <FiHeart size={48} style={{ opacity: 0.4, color: 'var(--text-dim)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>No requests found</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Try selecting a different category.</div>
            {catQuery !== 'all' && (
              <button onClick={() => handleCat('all')} className="btn btn-outline btn-sm">Reset Filter</button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {items.map((d, i) => {
              const pct = Math.min(100, Math.round((d.amount_raised / d.amount_needed) * 100));
              const meta = CAT_META[d.category] || CAT_META.other;
              const color = meta.color;
              const IconComponent = meta.icon?.type || FiHeart;
              return (
                <div
                  key={d.id}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 18, padding: '1.5rem', position: 'relative',
                    overflow: 'hidden', transition: 'all 0.24s cubic-bezier(0.4,0,0.2,1)',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'none' : 'translateY(20px)',
                    transitionDelay: `${Math.min(i * 40, 200)}ms`,
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
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
                  onClick={() => window.location.href = `/donation/${d.id}`}
                >
                  {/* Progress bar top */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                    width: `${pct}%`,
                    transition: 'width 0.5s ease',
                  }} />

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                    {d.is_urgent && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        background: 'rgba(230,57,70,0.1)', color: 'var(--red)',
                        border: '1px solid rgba(230,57,70,0.2)',
                        padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 800,
                      }}>
                        <FiZap size={10} /> {t('donation.urgent')}
                      </span>
                    )}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: `${color}15`, color: color,
                      padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700,
                    }}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem',
                    fontSize: '0.97rem', lineHeight: 1.35,
                  }}>
                    {d.title}
                  </h3>
                  <p style={{
                    fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem',
                    lineHeight: 1.6, flex: 1,
                  }}>
                    {d.description?.substring(0, 90)}...
                  </p>

                  {/* Progress section */}
                  <div style={{ marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      <span>৳{Number(d.amount_raised).toLocaleString()} {isBn ? 'সংগ্রহ' : 'raised'}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text)' }}>{pct}%</span>
                    </div>
                    <div style={{
                      height: 6, borderRadius: 6, background: 'var(--surface-3)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}88)`,
                        borderRadius: 6,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginTop: 4 }}>
                      {isBn ? 'লক্ষ্য' : 'Target'}: ৳{Number(d.amount_needed).toLocaleString()}
                    </div>
                  </div>

                  {/* Poster info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FiUser size={11} /> {d.poster_name}
                    </span>
                    {d.deadline && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiCalendar size={11} /> {new Date(d.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Donate button */}
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 6, padding: '10px 0', borderRadius: 12,
                      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                      color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                      boxShadow: `0 4px 14px ${color}30`,
                      transition: 'all 0.15s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <FiHeart size={14} /> {t('donation.donate')}
                  </div>
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
      `}</style>
    </div>
  );
}