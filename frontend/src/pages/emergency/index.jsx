import { useState } from 'react';
import { usePaginated } from '../../hooks/useApi';
import { Badge, Empty, Pagination, Spinner } from '../../components/ui';
import { EMERGENCY_TYPES } from '../../utils/helpers';
import { useLang } from '../../context/LanguageContext';

const EmergencyPage = () => {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [type,   setType]   = useState('');

  const { items, total, pages, page, loading, load, updateParams } = usePaginated('/emergency', { limit: 20 });

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search, type });
  };

  const handleType = (v) => {
    setType(v);
    updateParams({ search, type: v });
  };

  const TYPE_ICONS = { hospital:'🏥', police:'👮', fire:'🚒', ambulance:'🚑', mental:'🧠', other:'🏛️' };
  const TYPE_COLOR = { hospital:'red', police:'blue', fire:'amber', ambulance:'cyan', mental:'purple', other:'gray' };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1 style={{ fontWeight:900, fontSize:'clamp(1.8rem,4vw,2.5rem)', marginBottom:6 }}>
            🚨 {t('emergency.title')}
          </h1>
          <p style={{ color:'var(--text-muted)' }}>{t('emergency.sub')}</p>

          {/* SOS Quick Dial */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginTop:'1.25rem' }}>
            {[['999','National Emergency','🆘'],['199','Fire & Ambulance','🚒'],['1098','Child Helpline','👶'],['10921','Women Helpline','👩']].map(([num,label,icon]) => (
              <a key={num} href={`tel:${num}`} style={{
                display:'flex', alignItems:'center', gap:7, padding:'8px 14px',
                background:'rgba(230,57,70,0.1)', border:'1px solid rgba(230,57,70,0.25)',
                borderRadius:10, textDecoration:'none', transition:'all 0.2s',
              }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(230,57,70,0.2)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(230,57,70,0.1)'; }}
              >
                <span>{icon}</span>
                <div>
                  <div style={{ fontWeight:800, color:'var(--red)', fontSize:'0.85rem', lineHeight:1.1 }}>{num}</div>
                  <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>{label}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem' }}>
        {/* Filters */}
        <form onSubmit={handleSearch} style={{ display:'flex', gap:10, marginBottom:'1.5rem', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)' }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('emergency.search')} className="form-input" style={{ paddingLeft:34 }} />
          </div>
          <select value={type} onChange={e=>handleType(e.target.value)} className="form-select" style={{ width:'auto' }}>
            <option value="">All Types</option>
            {EMERGENCY_TYPES.map(t => <option key={t} value={t}>{TYPE_ICONS[t]} {t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Type tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {[['','All','',...Object.entries(TYPE_ICONS).map(([k,v]) => [k,k.charAt(0).toUpperCase()+k.slice(1),v])].flat()].length === 0 ? null :
            [['','All','🏛️'], ...Object.entries(TYPE_ICONS).map(([k,v]) => [k,k.charAt(0).toUpperCase()+k.slice(1),v])].map(([val,label,icon]) => (
              <button key={val} onClick={() => handleType(val)} style={{
                padding:'6px 14px', borderRadius:99, border:'1px solid',
                borderColor: type===val ? 'var(--red)' : 'var(--border)',
                background: type===val ? 'var(--red-light)' : 'transparent',
                color: type===val ? 'var(--red)' : 'var(--text-muted)',
                fontSize:'0.8rem', fontWeight:600, cursor:'pointer', transition:'all 0.15s',
              }}>
                {icon} {label}
              </button>
            ))
          }
        </div>

        <div style={{ marginBottom:'1rem', color:'var(--text-muted)', fontSize:'0.85rem' }}>
          {total} service{total !== 1 ? 's' : ''} found
        </div>

        {loading ? <Spinner center /> : items.length === 0 ? (
          <Empty icon="🏥" title="No services found" sub="Try a different search or filter." />
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
            {items.map(svc => (
              <div key={svc.id} className="card card-pad">
                <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10 }}>
                  <div style={{ fontSize:'2rem', flexShrink:0 }}>{TYPE_ICONS[svc.type] || '🏛️'}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:4 }}>
                      <h3 style={{ fontWeight:700, fontSize:'0.95rem', color:'#fff' }}>{svc.name}</h3>
                      {svc.is_verified && <span style={{ fontSize:'0.65rem', background:'var(--cyan-light)', color:'var(--cyan)', padding:'2px 7px', borderRadius:99, fontWeight:700 }}>✓ Verified</span>}
                      {svc.is_24h && <span style={{ fontSize:'0.65rem', background:'var(--green-light)', color:'var(--green)', padding:'2px 7px', borderRadius:99, fontWeight:700 }}>24h</span>}
                    </div>
                    <Badge color={TYPE_COLOR[svc.type] || 'gray'}>{svc.type}</Badge>
                  </div>
                </div>

                {svc.address && <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:4 }}>📍 {svc.address}</div>}
                {(svc.district || svc.division) && (
                  <div style={{ fontSize:'0.8rem', color:'var(--text-dim)', marginBottom:10 }}>
                    🗺️ {[svc.upazila, svc.district, svc.division].filter(Boolean).join(', ')}
                  </div>
                )}

                {svc.phone && (
                  <div style={{ display:'flex', gap:8, marginTop:10 }}>
                    <a href={`tel:${svc.phone}`} className="btn btn-primary btn-sm" style={{ flex:1, justifyContent:'center' }}>
                      📞 {svc.phone}
                    </a>
                    <a href={`https://maps.google.com/?q=${svc.latitude},${svc.longitude}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                      🗺️
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} pages={pages} onChange={p => load(p)} />
      </div>
    </div>
  );
};

export default EmergencyPage;
