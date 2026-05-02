import { useState } from 'react';
import { FiBook, FiSearch, FiMapPin, FiFilter, FiExternalLink } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';

const SAMPLE_UNIVERSITIES = [
  { id: 5, type: 'public-uni', name: 'University of Dhaka', area: 'Dhaka', estd: 1921, badge: 'Public Uni' },
  { id: 6, type: 'public-uni', name: 'Bangladesh University of Engineering', area: 'Dhaka', estd: 1962, badge: 'Public Uni' },
  { id: 7, type: 'public-uni', name: 'University of Chittagong', area: 'Chittagong', estd: 1966, badge: 'Public Uni' },
  { id: 8, type: 'private-uni', name: 'BRAC University', area: 'Dhaka', estd: 2001, badge: 'Private Uni' },
  { id: 9, type: 'private-uni', name: 'North South University', area: 'Dhaka', estd: 1992, badge: 'Private Uni' },
  { id: 16, type: 'public-uni', name: 'Jahangirnagar University', area: 'Savar', estd: 1970, badge: 'Public Uni' },
  { id: 17, type: 'private-uni', name: 'Independent University, Bangladesh', area: 'Dhaka', estd: 1993, badge: 'Private Uni' },
];

export default function University() {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, public, private

  const filtered = SAMPLE_UNIVERSITIES.filter(item => {
    const matchTab = activeTab === 'all' || (activeTab === 'public' && item.type === 'public-uni') || (activeTab === 'private' && item.type === 'private-uni');
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.area.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(6,182,212,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4' }}>
              <FiBook size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>{t("education.university_title")}</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{t("education.university_sub")}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {['all', 'public', 'private'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '7px 16px', borderRadius: 20, border: `1px solid ${activeTab === tab ? '#06B6D4' : 'var(--border)'}`, background: activeTab === tab ? 'rgba(6,182,212,0.12)' : 'var(--surface-2)', color: activeTab === tab ? '#06B6D4' : 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}
            >
              {tab === 'all' ? t("emergency.all") : tab === 'public' ? t("education.public_uni") : t("education.private_uni")}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', maxWidth: 460, marginBottom: '2rem' }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("common.search_placeholder")} className="form-input" style={{ paddingLeft: 40, borderRadius: 24 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filtered.map(item => {
            const color = item.type === 'public-uni' ? '#06B6D4' : '#8B5CF6';
            return (
              <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.2rem', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = color}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{item.name}</div>
                  <FiExternalLink size={14} style={{ color: 'var(--text-dim)', flexShrink: 0, marginLeft: 8 }} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: `${color}12`, color: color }}>{item.badge}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'var(--text-muted)' }}><FiMapPin size={12} />{item.area}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'var(--text-muted)' }}><FiBook size={12} />{t("common.established")} {item.estd}</div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <FiFilter size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
            <p>No universities found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
