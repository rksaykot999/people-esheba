import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiBook, FiSearch, FiMapPin, FiFilter, FiExternalLink,
  FiShield, FiAward, FiClock, FiNavigation, FiChevronRight,
  FiZap, FiCopy, FiCheckCircle, FiHeart, FiSmile, FiGlobe
} from 'react-icons/fi';
import { MdSchool, MdBusiness, MdHealthAndSafety, MdScience, MdEngineering } from 'react-icons/md';

/* ── Constants ──────────────────────────────────────────── */
const TYPES = ['public-uni', 'private-uni', 'medical-college', 'engineering-uni', 'other'];

const TYPE_META = {
  'public-uni': { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', icon: MdSchool, label: 'Public University' },
  'private-uni': { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', icon: MdBusiness, label: 'Private University' },
  'medical-college': { color: '#E63946', bg: 'rgba(230,57,70,0.1)', icon: MdHealthAndSafety, label: 'Medical College' },
  'engineering-uni': { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: MdEngineering, label: 'Engineering' },
  'other': { color: '#10B981', bg: 'rgba(16,185,129,0.1)', icon: MdScience, label: 'Other' },
};

/* Sample data */
const SAMPLE_UNIVERSITIES = [
  { id: 1, type: 'public-uni', name: 'University of Dhaka', area: 'Dhaka', district: 'Dhaka', estd: 1921, badge: 'Public Uni', is_verified: true, is_old: true },
  { id: 2, type: 'public-uni', name: 'Bangladesh University of Engineering & Technology', area: 'Dhaka', district: 'Dhaka', estd: 1962, badge: 'Public Uni', is_verified: true },
  { id: 3, type: 'public-uni', name: 'University of Chittagong', area: 'Chittagong', district: 'Chittagong', estd: 1966, badge: 'Public Uni', is_verified: true },
  { id: 4, type: 'public-uni', name: 'Jahangirnagar University', area: 'Savar', district: 'Dhaka', estd: 1970, badge: 'Public Uni', is_verified: true },
  { id: 5, type: 'public-uni', name: 'Rajshahi University', area: 'Rajshahi', district: 'Rajshahi', estd: 1953, badge: 'Public Uni', is_verified: true, is_old: true },
  { id: 6, type: 'private-uni', name: 'BRAC University', area: 'Dhaka', district: 'Dhaka', estd: 2001, badge: 'Private Uni', is_verified: true },
  { id: 7, type: 'private-uni', name: 'North South University', area: 'Dhaka', district: 'Dhaka', estd: 1992, badge: 'Private Uni', is_verified: true },
  { id: 8, type: 'private-uni', name: 'Independent University, Bangladesh', area: 'Dhaka', district: 'Dhaka', estd: 1993, badge: 'Private Uni', is_verified: false },
  { id: 9, type: 'medical-college', name: 'Dhaka Medical College', area: 'Dhaka', district: 'Dhaka', estd: 1946, badge: 'Medical', is_verified: true, is_old: true },
  { id: 10, type: 'engineering-uni', name: 'RUET', area: 'Rajshahi', district: 'Rajshahi', estd: 1964, badge: 'Engineering', is_verified: true },
];

/* ── Animated Counter ─────────────────────────────────── */
function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = Math.ceil(end / 50);
        const t = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(t); }
          else setCount(start);
        }, 30);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Main Component ───────────────────────────────────── */
export default function University() {
  const { t, isBn } = useLang();
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  useEffect(() => {
    setLoading(true);
    const tmt = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(tmt);
  }, [search, typeFilter]);

  const filtered = SAMPLE_UNIVERSITIES.filter(item => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.area.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ════════════════ HERO SECTION ════════════════ */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #000510 0%, #010b1a 40%, #060520 100%)'
          : 'linear-gradient(135deg, #f0f9ff 0%, #ecfeff 40%, #f5f3ff 100%)',
        padding: '4rem 0 3rem',
      }}>
        {/* Blobs */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: 400, height: 400, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: isDark ? 0.03 : 0.06,
          backgroundImage: `linear-gradient(var(--cyan) 1px, transparent 1px),
                            linear-gradient(90deg, var(--cyan) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
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
                background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)',
                color: 'var(--cyan)', padding: '5px 14px', borderRadius: 999,
                fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: 'var(--cyan)',
                  animation: 'pulse-dot 1.4s ease-in-out infinite',
                }} />
                {t("education.live_badge") || "Comprehensive University Directory"}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900,
              lineHeight: 1.08, letterSpacing: '-1.5px', color: 'var(--text)',
              marginBottom: '1rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto',
            }}>
              {t("education.university_title") || "Discover Top Universities"}<br />
              <span style={{
                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {t("education.university_highlight") || "For Your Future"}
              </span>{' '}Bangladesh
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 500, lineHeight: 1.7, margin: '0 auto 2rem' }}>
              {t("education.university_sub") || "Explore verified information on public universities, private institutions, and specialized colleges across the country."}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { label: t("education.stat_universities") || "Universities Listed", value: 450, suffix: '+', icon: <FiBook size={16} />, color: 'var(--cyan)' },
                { label: t("education.stat_districts") || "Districts", value: 64, suffix: '', icon: <FiMapPin size={16} />, color: 'var(--purple)' },
                { label: t("education.stat_verified") || "Verified", value: 92, suffix: '%', icon: <FiShield size={16} />, color: 'var(--green)' },
              ].map(s => (
                <div key={s.label} style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  backdropFilter: 'blur(12px)',
                  border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 16, padding: '1rem 1.25rem', minWidth: 110, textAlign: 'center',
                }}>
                  <div style={{ color: s.color, marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
                    <Counter end={s.value} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════ MAIN CONTENT ════════════════ */}
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>

        {/* Search + Filter Bar */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '1.25rem', marginBottom: '2rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FiSearch style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-dim)', pointerEvents: 'none',
              }} size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("common.search_placeholder") || "Search universities..."}
                className="form-input"
                style={{ paddingLeft: 42, height: 46, borderRadius: 12, fontSize: '0.9rem' }}
              />
            </div>
            <button type="button" className="btn btn-primary" style={{ height: 46, padding: '0 1.5rem', borderRadius: 12, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, background: 'var(--cyan)', borderColor: 'var(--cyan)' }}>
              <FiSearch size={14} /> {t("common.search") || "Search"}
            </button>
          </div>

          {/* Type filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginRight: 4 }}>
              <FiFilter size={11} style={{ marginRight: 4 }} />{t("common.filter") || "Filter"}:
            </span>
            <button
              onClick={() => setTypeFilter('')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer', border: '1px solid', transition: 'all 0.18s',
                background: !typeFilter ? 'var(--cyan)' : 'transparent',
                borderColor: !typeFilter ? 'var(--cyan)' : 'var(--border-2)',
                color: !typeFilter ? '#fff' : 'var(--text-muted)',
              }}
            >
              {t("education.all") || "All"}
            </button>
            {TYPES.map(tp => {
              const m = TYPE_META[tp];
              const active = typeFilter === tp;
              const Icon = m.icon;
              return (
                <button
                  key={tp}
                  onClick={() => setTypeFilter(tp)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700,
                    cursor: 'pointer', border: '1px solid', transition: 'all 0.18s',
                    background: active ? m.color : 'transparent',
                    borderColor: active ? m.color : 'var(--border-2)',
                    color: active ? '#fff' : 'var(--text-muted)',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.color = m.color; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
                >
                  <Icon size={12} /> {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result meta */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {loading ? t("common.loading") : <><strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> {t("education.found") || "universities found"}</>}
          </span>
          {(typeFilter || search) && (
            <button
              onClick={() => { setSearch(''); setTypeFilter(''); }}
              style={{
                fontSize: '0.78rem', color: 'var(--text-dim)', background: 'none',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {t("education.clear_filter") || "Clear all"} ×
            </button>
          )}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '1.5rem', minHeight: 180,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[60, 100, 80, 40].map((w, j) => (
                    <div key={j} style={{
                      height: j === 0 ? 40 : 12, width: `${w}%`, borderRadius: 8,
                      background: 'var(--surface-3)',
                      animation: 'shimmer 1.6s infinite',
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '5rem 2rem', gap: '1rem', textAlign: 'center',
          }}>
            <FiFilter size={48} style={{ opacity: 0.4, color: 'var(--text-dim)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{t("education.no_results") || "No universities found"}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{t("education.no_results_sub") || "Try adjusting your search or filter."}</div>
            <button onClick={() => { setSearch(''); setTypeFilter(''); }} className="btn btn-outline btn-sm">
              {t("education.reset") || "Reset Filters"}
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {filtered.map((item, i) => {
              const meta = TYPE_META[item.type] || TYPE_META.other;
              const Icon = meta.icon;
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 18, padding: '1.5rem', position: 'relative',
                    overflow: 'hidden', transition: 'all 0.24s cubic-bezier(0.4,0,0.2,1)',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'none' : 'translateY(20px)',
                    transitionDelay: `${Math.min(i * 50, 300)}ms`,
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = meta.color + '40';
                    e.currentTarget.style.boxShadow = `0 12px 40px ${meta.color}18`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${meta.color}, transparent)`,
                    borderRadius: '18px 18px 0 0',
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: meta.bg, border: `1px solid ${meta.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: meta.color,
                    }}>
                      <Icon size={22} />
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {item.is_verified && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          background: 'rgba(16,185,129,0.1)', color: 'var(--green)',
                          border: '1px solid rgba(16,185,129,0.2)',
                          padding: '3px 9px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 800,
                        }}>
                          <FiShield size={9} /> Verified
                        </span>
                      )}
                      {item.is_old && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          background: 'rgba(245,158,11,0.1)', color: '#F59E0B',
                          border: '1px solid rgba(245,158,11,0.2)',
                          padding: '3px 9px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 800,
                        }}>
                          <FiClock size={9} /> Historic
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 style={{
                    fontWeight: 800, color: 'var(--text)',
                    marginBottom: '0.6rem', fontSize: '0.97rem', lineHeight: 1.35,
                  }}>
                    {item.name}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: '1.1rem' }}>
                    {item.area && (
                      <span style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <FiMapPin size={11} style={{ marginTop: 2, flexShrink: 0, color: meta.color, opacity: 0.7 }} />
                        {item.area}
                      </span>
                    )}
                    {item.district && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                        <FiNavigation size={10} style={{ color: meta.color, opacity: 0.6 }} />
                        {item.district}
                      </span>
                    )}
                  </div>

                  {item.estd ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: 12,
                      background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
                      color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem',
                      boxShadow: `0 4px 14px ${meta.color}30`,
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <FiBook size={14} /> Estd. {item.estd}
                      </span>
                      <FiExternalLink size={15} style={{ opacity: 0.7 }} />
                    </div>
                  ) : (
                    <div style={{
                      padding: '10px 14px', borderRadius: 12,
                      background: 'var(--surface-3)', color: 'var(--text-dim)',
                      fontSize: '0.8rem', fontWeight: 600, textAlign: 'center',
                    }}>
                      {t("education.no_details") || "Established year unavailable"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ════════════════ EDUCATIONAL TIPS ════════════════ */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.75rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(6,182,212,0.12)', color: 'var(--cyan)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiAward size={17} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>
                {t("education.tips_title_uni") || "Choosing the Right University"}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {t("education.tips_sub_uni") || "Key factors to consider before making a decision."}
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              { Icon: FiGlobe, color: '#06B6D4', title: t("education.tip_accreditation") || "Accreditation", desc: t("education.tip_accreditation_desc") || "Ensure the university is UGC approved and recognized." },
              { Icon: FiAward, color: '#8B5CF6', title: t("education.tip_ranking") || "Ranking & Reputation", desc: t("education.tip_ranking_desc") || "Research national and international rankings." },
              { Icon: FiHeart, color: '#10B981', title: t("education.tip_campus") || "Campus & Facilities", desc: t("education.tip_campus_desc") || "Labs, libraries, and research facilities matter." },
              { Icon: FiExternalLink, color: '#F59E0B', title: t("education.tip_visit") || "Visit in Person", desc: t("education.tip_visit_desc") || "Always visit the campus before finalizing." },
            ].map((tip, i) => {
              const Icon = tip.Icon;
              return (
                <div key={i} style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '1.25rem',
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  transition: 'all 0.22s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = tip.color + '40'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: `${tip.color}15`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: tip.color,
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem', marginBottom: 4 }}>{tip.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{tip.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity:1; transform:scale(1); }
          50%       { opacity:0.5; transform:scale(1.4); }
        }
        @keyframes shimmer {
          0%   { opacity:0.5; }
          50%  { opacity:1; }
          100% { opacity:0.5; }
        }
      `}</style>
    </div>
  );
}