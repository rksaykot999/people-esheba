import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { FiMapPin, FiCrosshair, FiSearch, FiLayers, FiAlertCircle, FiDroplet, FiShield, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function MapPage() {
  const { t, isBn } = useLang();
  const [search, setSearch] = useState('');

  const services = [
    { icon: <FiAlertCircle size={16} />, label: isBn ? 'হাসপাতাল' : 'Hospitals', color: '#E63946' },
    { icon: <FiDroplet size={16} />, label: isBn ? 'রক্তদাতা' : 'Blood Donors', color: '#EF4444' },
    { icon: <FiShield size={16} />, label: isBn ? 'পুলিশ' : 'Police', color: '#3B82F6' },
    { icon: <FiTruck size={16} />, label: isBn ? 'ফায়ার সার্ভিস' : 'Fire Service', color: '#F59E0B' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', fontFamily: "'Inter', sans-serif" }}>
      {/* HERO */}
      <div style={{
        position: 'relative',
        padding: '6rem 1rem 4rem',
        textAlign: 'center',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(139, 92, 246, 0.1)', padding: '8px 20px',
            borderRadius: '100px', color: '#8B5CF6', fontSize: '0.75rem', fontWeight: 600,
            marginBottom: '2rem', border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <FiMapPin size={14} /> {t('nav.map')}
          </div>

          <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            {isBn ? 'সার্ভিস' : 'Service'} <span style={{ color: '#8B5CF6' }}>{isBn ? 'ম্যাপ' : 'Map'}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', marginBottom: '2.5rem' }}>
            {isBn ? 'আপনার আশেপাশের সমস্ত জরুরি সেবা, হাসপাতাল এবং রক্তদাতাদের খুঁজুন।' : 'Discover all emergency services, hospitals, and blood donors near your current location.'}
          </p>

          <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={20} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isBn ? 'এলাকা বা সার্ভিস খুঁজুন...' : 'Search for an area or service...'}
              style={{
                width: '100%', boxSizing: 'border-box', height: '56px',
                padding: '0 20px 0 54px', borderRadius: '16px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: '1rem', outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '32px', overflow: 'hidden', position: 'relative', height: '600px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
        }}>
          {/* Mock Map Background */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 60%),
                              radial-gradient(circle at 70% 60%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)`,
            backgroundSize: '100% 100%',
            opacity: 0.8
          }} />
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: `linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />

          {/* Map Controls */}
          <div style={{ position: 'absolute', right: 24, top: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <FiCrosshair size={20} />
            </button>
            <button style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <FiLayers size={20} />
            </button>
          </div>

          {/* Map Content Overlay */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center'
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '24px', background: 'rgba(139, 92, 246, 0.1)',
              color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <FiMapPin size={40} />
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
              {isBn ? 'গুগল ম্যাপস সংযুক্ত করুন' : 'Connect Google Maps API'}
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.6, marginBottom: '2rem' }}>
              {isBn 
                ? 'ম্যাপটি সম্পূর্ণরূপে কাজ করার জন্য আপনার .env ফাইলে VITE_GOOGLE_MAPS_KEY যোগ করুন।'
                : 'Add VITE_GOOGLE_MAPS_KEY to your .env file to enable the fully interactive map functionality.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: '600px' }}>
              {services.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: '14px', fontSize: '0.85rem', fontWeight: 600
                }}>
                  <span style={{ color: s.color }}>{s.icon}</span> {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
