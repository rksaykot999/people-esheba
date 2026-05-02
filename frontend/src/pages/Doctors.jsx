import { useState } from 'react';
import { FiUser, FiSearch, FiPhone, FiMapPin, FiClock, FiFilter } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';

const SAMPLE_DOCTORS = [
  { id: 7, name: 'Dr. Md. Aminul Islam', area: 'Dhaka', phone: '01XXXXXXXXX', hours: 'Sat-Thu 9-5', specialty: 'Cardiologist' },
  { id: 8, name: 'Dr. Farzana Hossain', area: 'Chittagong', phone: '01XXXXXXXXX', hours: 'Sun-Thu 10-4', specialty: 'Pediatrician' },
  { id: 9, name: 'Dr. Rafiqul Islam', area: 'Sylhet', phone: '01XXXXXXXXX', hours: 'Sat-Wed 4-8', specialty: 'Neurologist' },
  { id: 10, name: 'Dr. Salma Begum', area: 'Rajshahi', phone: '01XXXXXXXXX', hours: 'Mon-Fri 9-5', specialty: 'Gynecologist' },
];

export default function Doctors() {
  const { t } = useLang();
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_DOCTORS.filter(item => {
    const matchSearch = !search || 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.area.toLowerCase().includes(search.toLowerCase()) ||
      item.specialty.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <FiUser size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>{t("health.doctors")}</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{t("health.doctors_sub")}</p>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', maxWidth: 460, marginBottom: '2rem' }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={15} />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder={t("health.search_doctors")} 
            className="form-input" 
            style={{ paddingLeft: 40, borderRadius: 24 }} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filtered.map(item => (
            <div 
              key={item.id} 
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.2rem', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#8B5CF6'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{item.name}</div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}>{item.specialty}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'var(--text-muted)' }}><FiMapPin size={12} />{item.area}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'var(--text-muted)' }}><FiPhone size={12} />{item.phone}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'var(--text-muted)' }}><FiClock size={12} />{item.hours}</div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <FiFilter size={32} style={{ opacity: 0.3, marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
            <p>No doctors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
