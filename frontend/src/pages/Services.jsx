import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FiSearch, FiPhone, FiMapPin, FiStar, 
  FiFilter, FiArrowRight, FiActivity, FiClock, FiCheckCircle, FiShield 
} from 'react-icons/fi';

const CATS = [
  { key: 'all', label: 'All Services', color: '#8B5CF6' },
  { key: 'home', label: 'Home Services', color: '#EF4444' },
  { key: 'transport', label: 'Transport', color: '#06B6D4' },
  { key: 'repairs', label: 'Repairs', color: '#F59E0B' },
  { key: 'telemedicine', label: 'Telemedicine', color: '#EC4899' },
  { key: 'tutor', label: 'Finding Tutor', color: '#A855F7' },
  { key: 'utility', label: 'Utility Services', color: '#10B981' },
];

const SAMPLE = [
  { 
    id: 1, cat: 'home', name: 'CleanBD Home Services', area: 'Dhaka', phone: '01XXXXXXXXX', rating: 4.5, badge: 'Cleaning',
    desc: 'Professional deep cleaning for homes and offices using eco-friendly products.',
    hours: '9 AM - 8 PM', verified: true, stats: '2k+ Jobs'
  },
  { 
    id: 3, cat: 'transport', name: 'Pathao Rides', area: 'Nationwide', phone: '16775', rating: 4.7, badge: 'Ride Sharing',
    desc: 'Reliable and fast bike/car booking to move around the city safely.',
    hours: '24/7 Service', verified: true, stats: '50k+ Daily'
  },
  { 
    id: 7, cat: 'telemedicine', name: 'Maya Apa (Telehealth)', area: 'Nationwide', phone: '16789', rating: 4.8, badge: 'Online Doctor',
    desc: 'Instant medical consultation with verified experts via chat or call.',
    hours: '24/7 Support', verified: true, stats: '1M+ Users'
  },
  { 
    id: 9, cat: 'tutor', name: '10 Minute School', area: 'Nationwide', phone: '01XXXXXXXXX', rating: 4.9, badge: 'Online Tutor',
    desc: 'High-quality educational resources and live classes for all levels.',
    hours: 'Anytime', verified: true, stats: '5M+ Learners'
  }
];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || 'all');

  const handleCatChange = (key) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') newParams.delete('cat');
    else newParams.set('cat', key);
    setSearchParams(newParams);
    setActiveCat(key);
  };

  const filtered = SAMPLE.filter(item => {
    const matchCat = activeCat === 'all' || item.cat === activeCat;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ background: '#0B0F1A', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Hero Section (Matched with Blood Page) */}
      <div style={{ 
        padding: '5rem 1rem 4rem', 
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
      }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: 8, 
          background: 'rgba(139, 92, 246, 0.1)', padding: '6px 16px', 
          borderRadius: '100px', color: '#A78BFA', fontSize: '0.8rem', fontWeight: 600,
          marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <span style={{ width: 8, height: 8, background: '#A78BFA', borderRadius: '50%', display: 'inline-block' }}></span>
          ALL-IN-ONE SERVICE HUB
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>
          Explore <span style={{ color: '#8B5CF6' }}>Services</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Find, book, and enjoy the best professional services available in your city with just one tap.
        </p>

        {/* Stats Grid */}
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '3rem', flexWrap: 'wrap' }}>
          {[
            { val: '25+', label: 'Categories' },
            { val: '500+', label: 'Verified Pros' },
            { val: '4.8', label: 'Avg Rating' }
          ].map((s, i) => (
            <div key={i} style={{ 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              padding: '20px 40px', borderRadius: '24px', minWidth: '160px'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{s.val}</h2>
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '0 1.5rem 5rem' }}>
        
        {/* Filtering & Search Bar */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          padding: '25px', borderRadius: '32px', marginBottom: '3rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '15px' }}>
            {CATS.map(c => (
              <button 
                key={c.key} 
                onClick={() => handleCatChange(c.key)}
                style={{ 
                  padding: '10px 20px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 600,
                  background: activeCat === c.key ? c.color : 'rgba(255,255,255,0.05)',
                  color: activeCat === c.key ? '#fff' : '#94A3B8',
                  transition: '0.3s all ease'
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} size={20}/>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="What service are you looking for?" 
              style={{ 
                width: '100%', height: '60px', padding: '0 60px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid-3" style={{ gap: '25px' }}>
          {filtered.map(item => (
            <div key={item.id} className="card-hover" style={{ 
              background: '#161B28', borderRadius: '28px', padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)', position: 'relative',
              transition: '0.4s all ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ 
                  background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6',
                  padding: '6px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700
                }}>
                  {item.badge}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#F59E0B', fontWeight: 700 }}>
                  <FiStar size={16} fill="#F59E0B" /> {item.rating}
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>{item.name}</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>{item.desc}</p>

              <div style={{ 
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', 
                marginBottom: '25px', padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiMapPin size={14} /> {item.area}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiClock size={14} /> {item.hours}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a href={`tel:${item.phone}`} style={{ 
                  flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#8B5CF6', color: '#fff', borderRadius: '14px', fontWeight: 600, textDecoration: 'none'
                }}>
                  <FiPhone size={18} style={{ marginRight: 8 }} /> Call
                </a>
                <button style={{ 
                  width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '14px', color: '#fff'
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