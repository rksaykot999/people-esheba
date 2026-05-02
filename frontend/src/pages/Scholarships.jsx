import { useState } from 'react';
import { FiAward, FiSearch, FiMapPin, FiFilter, FiExternalLink } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';

const SAMPLE_SCHOLARSHIPS = [
  { id: 10, type: 'scholarships', name: 'Prime Minister Scholarship', area: 'Nationwide', amount: 'Variable', badge: 'Scholarship' },
  { id: 11, type: 'scholarships', name: 'Board Scholarship (SSC/HSC)', area: 'Nationwide', amount: '3,000-5,000 BDT/mo', badge: 'Scholarship' },
  { id: 18, type: 'scholarships', name: 'District Council Scholarship', area: 'District Level', amount: 'One-time Grant', badge: 'Scholarship' },
  { id: 19, type: 'scholarships', name: 'NGO Educational Grant', area: 'Nationwide', amount: 'Tuition Support', badge: 'Scholarship' },
];

export default function Scholarships() {
  const { t } = useLang();
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_SCHOLARSHIPS.filter(item => 
    !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <FiAward size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>{t("education.scholarships_title")}</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{t("education.scholarships_sub")}</p>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', maxWidth: 460, marginBottom: '2rem' }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("common.search_placeholder")} className="form-input" style={{ paddingLeft: 40, borderRadius: 24 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.2rem', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#10B981'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{item.name}</div>
                <FiExternalLink size={14} style={{ color: 'var(--text-dim)', flexShrink: 0, marginLeft: 8 }} />
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>{item.badge}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'var(--text-muted)' }}><FiMapPin size={12} />{item.area}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: '#10B981', fontWeight: 600 }}><FiAward size={12} />{item.amount}</div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <FiFilter size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
            <p>No scholarships found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
