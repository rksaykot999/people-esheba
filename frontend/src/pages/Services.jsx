import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiSearch, FiPhone, FiMapPin, FiStar,
  FiFilter, FiArrowRight, FiCheckCircle, FiTag
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const CATS = [
  { key: 'all', label: 'All Services', color: '#8B5CF6' },
  { key: 'home', label: 'Home Services', color: '#EF4444' },
  { key: 'transport', label: 'Transport', color: '#06B6D4' },
  { key: 'repairs', label: 'Repairs', color: '#F59E0B' },
  { key: 'telemedicine', label: 'Telemedicine', color: '#EC4899' },
  { key: 'tutor', label: 'Finding Tutor', color: '#A855F7' },
  { key: 'utility', label: 'Utility Services', color: '#10B981' },
];

// ✅ FIX 1: সব id এখন আলাদা (1 থেকে 15 পর্যন্ত)
const SAMPLE = [

  // --- Home Services ---
  {
    id: 1, cat: 'home', name: 'Sheba.xyz', area: 'Dhaka & Chittagong', phone: '16516', rating: 4.6, reviews: '20k+', badge: 'Home Service',
    price: 'Varies by Task', desc: 'One-stop solution for your house painting, plumbing, and electrical works.',
    features: ['Verified Pros', 'Service Warranty']
  },
  {
    id: 2, cat: 'home', name: 'Hello Task', area: 'Dhaka', phone: '09612345678', rating: 4.3, reviews: '5k+', badge: 'Maid Service',
    price: 'Starts 300 BDT', desc: 'On-demand professional maid and house cleaning services for urban busy life.',
    features: ['Background Checked', 'Flexible Timing']
  },
  {
    id: 3, cat: 'home', name: 'Home360', area: 'Dhaka', phone: '09612345679', rating: 4.2, reviews: '3k+', badge: 'Maid Service',
    price: 'Starts 300 BDT', desc: 'On-demand professional maid and house cleaning services for urban busy life.',
    features: ['Background Checked', 'Flexible Timing']
  },
  {
    id: 4, cat: 'home', name: 'HomeFix', area: 'Dhaka', phone: '09612345680', rating: 4.1, reviews: '2k+', badge: 'Maid Service',
    price: 'Starts 300 BDT', desc: 'On-demand professional maid and house cleaning services for urban busy life.',
    features: ['Background Checked', 'Flexible Timing']
  },

  // --- Transport Services ---
  {
    id: 5, cat: 'transport', name: 'Pathao Rides', area: 'Nationwide', phone: '16775', rating: 4.7, reviews: '50k+', badge: 'Ride Sharing',
    price: 'Distance Based', desc: 'Reliable and fast bike or car booking to move around the city safely.',
    features: ['GPS Tracking', 'Safety First']
  },
  {
    id: 6, cat: 'transport', name: 'Uber Bangladesh', area: 'Dhaka & Sylhet', phone: '01700000000', rating: 4.5, reviews: '100k+', badge: 'Car Service',
    price: 'Standard Rates', desc: 'World-class ride-hailing experience with premium car options and safety.',
    features: ['24/7 Availability', 'Cashless Pay']
  },
  {
    id: 7, cat: 'transport', name: 'Truck Lagbe', area: 'Nationwide', phone: '09638000245', rating: 4.8, reviews: '10k+', badge: 'Logistics',
    price: 'Bidding System', desc: 'Hire trucks or pickups for shifting your home or moving commercial goods.',
    features: ['Verified Drivers', 'Live Tracking']
  },

  // --- Repairs ---
  {
    id: 8, cat: 'repairs', name: 'HandyMama', area: 'Dhaka', phone: '09617008080', rating: 4.4, reviews: '3k+', badge: 'Repairing',
    price: 'Inspection Fee 200', desc: 'Professional AC repair, fridge fixing, and appliance maintenance services.',
    features: ['Warranty', 'Prompt Response']
  },
  {
    id: 9, cat: 'repairs', name: 'Jantrik', area: 'Dhaka', phone: '09612341234', rating: 4.5, reviews: '2k+', badge: 'Automobile',
    price: 'Service Charge', desc: 'Expert car repair, car wash, and emergency breakdown support at your doorstep.',
    features: ['Spare Parts', 'Emergency']
  },
  {
    id: 10, cat: 'repairs', name: 'AllSheba', area: 'Dhaka', phone: '09612341235', rating: 4.3, reviews: '1k+', badge: 'Automobile',
    price: 'Service Charge', desc: 'Expert car repair, car wash, and emergency breakdown support at your doorstep.',
    features: ['Spare Parts', 'Emergency']
  },

  // --- Telemedicine & Health ---
  {
    id: 11, cat: 'telemedicine', name: 'Praava Health', area: 'Dhaka', phone: '10649', rating: 4.9, reviews: '12k+', badge: 'Healthcare',
    price: 'Consultation Fee', desc: 'Family doctors and diagnostics with international standard lab facilities.',
    features: ['Online Report', 'Home Sample']
  },
  {
    id: 12, cat: 'telemedicine', name: 'Maya Apa', area: 'Nationwide', phone: '16789', rating: 4.6, reviews: '30k+', badge: 'Mental Health',
    price: 'Subscription Based', desc: 'Anonymous messaging and video calls for medical and mental health advice.',
    features: ['Privacy Focused', 'Expert Advice']
  },
    {
    id: 17, cat: 'telemedicine', name: 'medex', area: 'Nationwide', phone: '16789', rating: 4.6, reviews: '30k+', badge: 'Mental Health',
    price: 'Subscription Based', desc: 'Anonymous messaging and video calls for medical and mental health advice.',
    features: ['Privacy Focused', 'Expert Advice']
  },

  // --- Education & Tutor ---
  {
    id: 13, cat: 'tutor', name: 'Care Tutors', area: 'Major Cities', phone: '01756441122', rating: 4.7, reviews: '8k+', badge: 'Tutor Provider',
    price: 'Negotiable', desc: 'Find highly qualified home tutors or online mentors for any subject.',
    features: ['Academic Help', 'Skill Training']
  },
  {
    id: 14, cat: 'tutor', name: '10 Minute School', area: 'Nationwide', phone: '16106', rating: 4.9, reviews: '1M+', badge: 'Ed-Tech',
    price: 'Free & Premium', desc: 'Largest online platform for SSC, HSC, and University admission preparation.',
    features: ['Live Classes', 'Recorded Course']
  },

  // ✅ FIX 2: utility ক্যাটাগরিতে ডেটা যোগ করা হয়েছে
  {
    id: 15, cat: 'utility', name: 'Desco Bill Pay', area: 'Dhaka', phone: '16120', rating: 4.5, reviews: '15k+', badge: 'Electricity',
    price: 'Bill Amount', desc: 'Pay your electricity bill online or through mobile app quickly and easily.',
    features: ['Instant Payment', '24/7 Service']
  },
  {
    id: 16, cat: 'utility', name: 'Titas Gas', area: 'Dhaka & Surroundings', phone: '16400', rating: 4.2, reviews: '8k+', badge: 'Gas Service',
    price: 'Bill Amount', desc: 'Gas bill payment and new connection request service for residential areas.',
    features: ['Online Payment', 'Easy Process']
  },
    {
    id: 18, cat: 'utility', name: 'palli biddot', area: 'all over the bangladesh', phone: '16400', rating: 4.1, reviews: '8k+', badge: 'electriciy Service',
    price: 'Bill Amount', desc: 'Gas bill payment and new connection request service for residential areas.',
    features: ['Online Payment', 'Easy Process']
  },
];

export default function Services() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* --- HERO SECTION --- */}
      <div style={{
        position: 'relative',
        padding: '8rem 1rem 6rem',
        textAlign: 'center',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)'
      }}>
        {/* Background Grid */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          pointerEvents: 'none'
        }} />

        {/* Purple Glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '300px',
          background: 'rgba(139, 92, 246, 0.15)',
          filter: 'blur(100px)', borderRadius: '100%', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(139, 92, 246, 0.1)', padding: '8px 20px',
            borderRadius: '100px', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600,
            marginBottom: '2rem', border: '1px solid rgba(139, 92, 246, 0.2)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)'
          }}>
            <span style={{ display: 'block', width: 8, height: 8, background: '#a78bfa', borderRadius: '50%', boxShadow: '0 0 10px #a78bfa' }}></span>
            Live Service Hub
          </div>

          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-2px', lineHeight: 1 }}>
            Service Network
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto', marginBottom: '4rem', fontWeight: 400 }}>
            Discover trusted professional services and local experts tailored to your daily needs.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
            {[
              { val: '25+', label: 'Categories', icon: <FiFilter size={20} /> },
              { val: '500+', label: 'Verified Pros', icon: <FiCheckCircle size={20} /> },
              { val: '64', label: 'Districts', icon: <FiMapPin size={20} /> }
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                padding: '30px', borderRadius: '24px', flex: '1', minWidth: '200px',
                backdropFilter: 'blur(12px)'
              }}>
                <div style={{ color: '#8b5cf6', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>{s.val}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- SEARCH & CONTENT SECTION --- */}
      <div style={{ padding: '4rem 1.5rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Filter & Search Bar */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '24px', borderRadius: '32px', marginBottom: '4rem'
        }}>
          {/* Category Buttons */}
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px' }}>
            {CATS.map(c => (
              <button
                key={c.key}
                onClick={() => handleCatChange(c.key)}
                style={{
                  padding: '12px 24px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 600,
                  background: activeCat === c.key ? '#8b5cf6' : 'var(--surface-2)',
                  color: activeCat === c.key ? '#fff' : 'var(--text-muted)',
                  transition: '0.2s all'
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* ✅ FIX 3: boxSizing যোগ করা হয়েছে যাতে input overflow না করে */}
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} size={20} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services by name or area..."
              style={{
                width: '100%',
                boxSizing: 'border-box', // ✅ overflow fix
                height: '64px',
                padding: '0 160px 0 56px',
                borderRadius: '20px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button style={{
              position: 'absolute', right: '10px', top: '10px', bottom: '10px',
              padding: '0 28px', borderRadius: '14px', border: 'none',
              background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
            }}>
              <FiSearch size={18} /> Search
            </button>
          </div>
        </div>

        {/* ✅ FIX 4: key হিসেবে item.id ব্যবহার করা হচ্ছে, যেগুলো এখন সব unique */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {filtered.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center',
              padding: '80px 20px', color: '#52525b'
            }}>
              <FiSearch size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>কোনো সার্ভিস পাওয়া যায়নি</p>
              <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>অন্য কিছু দিয়ে সার্চ করুন</p>
            </div>
          ) : (
            filtered.map(item => (
              <div key={item.id} style={{
                background: 'var(--surface)', borderRadius: '28px', padding: '28px',
                border: '1px solid var(--border)', position: 'relative',
                transition: 'transform 0.3s ease, border-color 0.3s ease'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{
                    background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa',
                    padding: '6px 14px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    {item.badge}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem' }}>
                    <FiStar size={16} fill="#f59e0b" /> {item.rating}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>{item.desc}</p>

                <div style={{
                  borderTop: '1px solid var(--border)', paddingTop: '20px',
                  display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px'
                }}>
                  <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiTag size={16} /> {item.price}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiMapPin size={16} /> {item.area} ({item.reviews} reviews)
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <a href={`tel:${item.phone}`} style={{
                    flex: 1, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#8b5cf6', color: '#fff', borderRadius: '16px', fontWeight: 700, textDecoration: 'none'
                  }}>
                    <FiPhone size={18} style={{ marginRight: 10 }} /> Call Now
                  </a>
                  <button style={{
                    width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '16px', color: 'var(--text)', cursor: 'pointer'
                  }}>
                    <FiArrowRight size={22} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}