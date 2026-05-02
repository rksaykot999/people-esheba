import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FiHeart, FiSearch, FiPhone, FiMapPin, FiClock,
  FiDroplet, FiUser, FiList, FiActivity, FiFilter, FiArrowRight
} from 'react-icons/fi';
import { MdLocalHospital } from 'react-icons/md';
import { useLang } from '../context/LanguageContext';

const TYPES = [
  { key: 'all', label: 'All', color: '#64748B' },
  { key: 'govt-hospital', label: 'Government Hospital', color: '#E63946' },
  { key: 'private-hospital', label: 'Private Hospital', color: '#06B6D4' },
];

const SAMPLE = [
  {
    id: 1, type: 'govt-hospital', name: 'Dhaka Medical College Hospital',
    area: 'Dhaka', phone: '02-55165001', rating: 4.5,
    desc: 'The largest tertiary care hospital in Bangladesh providing specialized healthcare.',
    badge: 'Emergency 24/7'
  },
  {
    id: 2, type: 'govt-hospital', name: 'BSMMU (PG Hospital)',
    area: 'Dhaka', phone: '02-9661068', rating: 4.7,
    desc: 'Premier postgraduate medical institution and hospital for advanced treatment.',
    badge: 'Research Center'
  },
  {
    id: 3, type: 'private-hospital', name: 'Square Hospital Ltd.',
    area: 'Dhaka', phone: '02-8159457', rating: 4.8,
    desc: 'Leading private healthcare provider with international standard facilities.',
    badge: 'Premium Care'
  },
  {
    id: 4, type: 'private-hospital', name: 'United Hospital',
    area: 'Dhaka', phone: '02-8836000', rating: 4.6,
    desc: 'Specialized multidisciplinary hospital known for cardiac and oncology care.',
    badge: 'Specialized'
  },
];

export default function Health() {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'all');

  // Sync state with URL params
  useEffect(() => {
    setActiveType(searchParams.get('type') || 'all');
  }, [searchParams]);

  const handleTypeChange = (key) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') newParams.delete('type');
    else newParams.set('type', key);
    setSearchParams(newParams);
  };

  const filtered = SAMPLE.filter(item => {
    const matchType = activeType === 'all' || item.type === activeType;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* --- HERO SECTION --- */}
      <div style={{ position: 'relative', padding: '6rem 1rem 4rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '400px', height: '200px', background: 'rgba(230, 57, 70, 0.1)',
          filter: 'blur(100px)', borderRadius: '100%', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(230, 57, 70, 0.1)', padding: '8px 20px',
            borderRadius: '100px', color: '#fb7185', fontSize: '0.75rem', fontWeight: 600,
            marginBottom: '1.5rem', border: '1px solid rgba(230, 57, 70, 0.2)'
          }}>
            <FiHeart size={14} /> Health & Medical Network
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1.5px' }}>
            Find Best Healthcare
          </h1>
        </div>
      </div>

      <div style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* --- SEARCH & FILTER BAR --- */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' }}>
            {TYPES.map(type => (
              <button
                key={type.key}
                onClick={() => handleTypeChange(type.key)}
                style={{
                  padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 600,
                  background: activeType === type.key ? '#e63946' : 'rgba(255,255,255,0.05)',
                  color: activeType === type.key ? '#fff' : '#94a3b8',
                  transition: '0.3s'
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={20} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hospitals, clinics or areas..."
              style={{
                width: '100%', boxSizing: 'border-box', height: '56px',
                padding: '0 20px 0 55px', borderRadius: '16px',
                background: '#000', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* --- HOSPITAL GRID --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
          {filtered.map(item => (
            <div key={item.id} style={{
              background: '#111113', borderRadius: '24px', padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)', transition: '0.3s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{
                  background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee',
                  padding: '5px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700
                }}>
                  {item.badge}
                </span>
                <MdLocalHospital size={22} color={item.type === 'govt-hospital' ? '#e63946' : '#06b6d4'} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>{item.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '20px' }}>{item.desc}</p>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <FiMapPin size={14} /> {item.area}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontSize: '0.85rem' }}>
                  <FiClock size={14} /> Open 24 Hours
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={`tel:${item.phone}`} style={{
                  flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#e63946', color: '#fff', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', gap: 8
                }}>
                  <FiPhone size={16} /> Contact
                </a>
                <button style={{
                  width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '12px', color: '#fff'
                }}>
                  <FiArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}