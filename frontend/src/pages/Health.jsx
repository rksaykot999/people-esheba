import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FiHeart, FiSearch, FiPhone, FiMapPin, FiClock,
  FiDroplet, FiUser, FiList, FiActivity, FiFilter, FiArrowRight,
  FiStar
} from 'react-icons/fi';
import { MdLocalHospital } from 'react-icons/md';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const TYPES = [
  { key: 'all', label: 'nav.all', color: 'var(--text-dim)' },
  { key: 'govt-hospital', label: 'health.govt_hospital', color: 'var(--red)' },
  { key: 'private-hospital', label: 'health.private_hospital', color: 'var(--cyan)' },
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
    id: 3, type: 'govt-hospital', name: 'Barishal General Hospital',
    area: 'Dhaka', phone: '02-9661068', rating: 3.9,
    desc: 'Premier postgraduate medical institution and hospital for advanced treatment.',
    badge: 'Research Center'
  },
  {
    id: 4, type: 'govt-hospital', name: 'Government Employee Hospital',
    area: 'Dhaka', phone: '02-9661068', rating: 4.3,
    desc: 'Premier postgraduate medical institution and hospital for advanced treatment.',
    badge: 'Research Center'
  },
  {
    id: 5, type: 'govt-hospital', name: '250 Bed General Hospital, Noakhali',
    area: 'Dhaka', phone: '02-9661068', rating: 3.8,
    desc: 'Premier postgraduate medical institution and hospital for advanced treatment.',
    badge: 'Research Center'
  },
  {
    id: 6, type: 'govt-hospital', name: 'BIU, Green Model Town, Mugda, Dhaka',
    area: 'Dhaka', phone: '02-9661068', rating: 4.1,
    desc: 'Premier postgraduate medical institution and hospital for advanced treatment.',
    badge: 'Research Center'
  },
  {
    id: 7, type: 'govt-hospital', name: 'Shaheed Suhrawardy Medical College and Hospital',
    area: 'Dhaka', phone: '02-9661068', rating: 4.2,
    desc: 'Premier postgraduate medical institution and hospital for advanced treatment.',
    badge: 'Research Center'
  },
  {
    id: 8, type: 'govt-hospital', name: 'Shaheed Ahsan Ullah Master General Hospital',
    area: 'Dhaka', phone: '02-9661068', rating: 4.1,
    desc: 'Premier postgraduate medical institution and hospital for advanced treatment.',
    badge: 'Research Center'
  },
  {
    id: 9, type: 'govt-hospital', name: 'MEGHNA UPAZILLA HEALTH COMPLEX',
    area: 'Dhaka', phone: '02-9661068', rating: 3.4,
    desc: 'Premier postgraduate medical institution and hospital for advanced treatment.',
    badge: 'Research Center'
  },
  {
    id: 10, type: 'private-hospital', name: 'Square Hospital Ltd.',
    area: 'Dhaka', phone: '02-8159457', rating: 4.8,
    desc: 'Leading private healthcare provider with international standard facilities.',
    badge: 'Premium Care'
  },
  {
    id: 11, type: 'private-hospital', name: 'United Hospital',
    area: 'Dhaka', phone: '02-8836000', rating: 4.6,
    desc: 'Specialized multidisciplinary hospital known for cardiac and oncology care.',
    badge: 'Specialized'
  },
  {
    id: 12, type: 'private-hospital', name: 'Barishal Metropolitan Hospital',
    area: 'Dhaka', phone: '02-8836000', rating: 4.0,
    desc: 'Specialized multidisciplinary hospital known for cardiac and oncology care.',
    badge: 'Specialized'
  },
  {
    id: 13, type: 'private-hospital', name: 'KMC Hospital',
    area: 'Dhaka', phone: '02-8836000', rating: 4.3,
    desc: 'Specialized multidisciplinary hospital known for cardiac and oncology care.',
    badge: 'Specialized'
  },
  {
    id: 14, type: 'private-hospital', name: 'Arif Memorial Hospital',
    area: 'Dhaka', phone: '02-8836000', rating: 3.9,
    desc: 'Specialized multidisciplinary hospital known for cardiac and oncology care.',
    badge: 'Specialized'
  },
  {
    id: 15, type: 'private-hospital', name: 'South Apollo Medical College & Hospital',
    area: 'Dhaka', phone: '02-8836000', rating: 4.6,
    desc: 'Specialized multidisciplinary hospital known for cardiac and oncology care.',
    badge: 'Specialized'
  },
  {
    id: 16, type: 'private-hospital', name: 'Continental Hospital PLC',
    area: 'Dhaka', phone: '02-8836000', rating: 3.8,
    desc: 'Specialized multidisciplinary hospital known for cardiac and oncology care.',
    badge: 'Specialized'
  },
  {
    id: 17, type: 'private-hospital', name: 'Rahat Anwar Hospital',
    area: 'Dhaka', phone: '02-8836000', rating: 4.0,
    desc: 'Specialized multidisciplinary hospital known for cardiac and oncology care.',
    badge: 'Specialized'
  },
  {
    id: 18, type: 'private-hospital', name: 'The Life Care',
    area: 'Dhaka', phone: '02-8836000', rating: 5.0,
    desc: 'Specialized multidisciplinary hospital known for cardiac and oncology care.',
    badge: 'Specialized'
  },
];

export default function Health() {
  const { t, isBn } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'all');

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
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', transition: 'background 0.3s' }}>

      {/* --- HERO SECTION --- */}
      <div style={{
        position: 'relative',
        padding: '6rem 1rem 4rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        background: isDark 
          ? 'linear-gradient(to bottom, rgba(2,17,46,0.5), var(--bg))' 
          : 'linear-gradient(to bottom, rgba(230,57,70,0.05), var(--bg))'
      }}>
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '400px', height: '200px', background: 'var(--red-light)',
          filter: 'blur(100px)', borderRadius: '100%', pointerEvents: 'none', opacity: isDark ? 0.3 : 0.6
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--red-light)', padding: '8px 20px',
            borderRadius: '100px', color: 'var(--red)', fontSize: '0.75rem', fontWeight: 600,
            marginBottom: '1.5rem', border: '1px solid var(--border)'
          }}>
            <FiHeart size={14} /> {t('health.hero_badge')}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1.5px', color: 'var(--text)' }}>
            {t('health.hero_title')}
          </h1>
        </div>
      </div>

      <div style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* --- SEARCH & FILTER BAR --- */}
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '24px', marginBottom: '3rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '5px' }}>
            {TYPES.map(type => (
              <button
                key={type.key}
                onClick={() => handleTypeChange(type.key)}
                style={{
                  padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 600,
                  background: activeType === type.key ? 'var(--red)' : 'var(--surface-2)',
                  color: activeType === type.key ? '#fff' : 'var(--text-muted)',
                  transition: '0.3s'
                }}
              >
                {t(type.label)}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={20} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('health.search_placeholder')}
              style={{
                width: '100%', boxSizing: 'border-box', height: '56px',
                padding: '0 20px 0 55px', borderRadius: '16px',
                background: 'var(--bg)', border: '1px solid var(--border)',
                color: 'var(--text)', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* --- HOSPITAL GRID --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {filtered.map(item => (
            <div key={item.id} style={{
              background: 'var(--surface)', borderRadius: '24px', padding: '24px',
              border: '1px solid var(--border)', transition: '0.3s',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{
                    background: 'var(--cyan-light)', color: 'var(--cyan)',
                    padding: '5px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                  <MdLocalHospital size={22} color={item.type === 'govt-hospital' ? 'var(--red)' : 'var(--cyan)'} />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text)' }}>{item.name}</h3>

                {/* --- RATING WITH ICON --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: '12px' }}>
                  <FiStar size={14} style={{ fill: 'var(--amber)', color: 'var(--amber)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--amber)' }}>{item.rating}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>({t('health.rating')})</span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '20px' }}>{item.desc}</p>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <FiMapPin size={14} /> {item.area}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', fontSize: '0.85rem' }}>
                    <FiClock size={14} /> {t('health.open_24')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={`tel:${item.phone}`} style={{
                  flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--red)', color: '#fff', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', gap: 8, transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FiPhone size={16} /> {t('common.contact')}
                </a>
                <button style={{
                  width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--surface-2)', border: 'none', borderRadius: '12px', color: 'var(--text)', cursor: 'pointer'
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