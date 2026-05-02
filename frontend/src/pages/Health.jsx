import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiHeart, FiSearch, FiPhone, FiMapPin, FiClock, FiDroplet, FiUser, FiList, FiActivity, FiFilter } from 'react-icons/fi';
import { MdLocalHospital } from 'react-icons/md';
import { useLang } from '../context/LanguageContext';

const TYPES = [
  { key: 'all',              label: 'All',                color: '#64748B' },
  { key: 'govt-hospital',    label: 'Government Hospital',color: '#E63946' },
  { key: 'private-hospital', label: 'Private Hospital',  color: '#06B6D4' },
];

const SAMPLE = [
  { id:1, type:'govt-hospital',    name:'Dhaka Medical College Hospital',  area:'Dhaka',      phone:'02-55165088', hours:'24/7',         badge:'Government' },
  { id:2, type:'govt-hospital',    name:'BSMMU (PG Hospital)',              area:'Dhaka',      phone:'02-9661062',  hours:'24/7',         badge:'Government' },
  { id:3, type:'private-hospital', name:'Square Hospital Ltd.',             area:'Dhaka',      phone:'02-8159457',  hours:'24/7',         badge:'Private' },
  { id:4, type:'private-hospital', name:'United Hospital',                  area:'Dhaka',      phone:'02-8836000',  hours:'24/7',         badge:'Private' },
];

export default function Health() {
  const { t } = useLang();
  const [searchParams] = useSearchParams();
  const [search, setSearch]         = useState('');
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'all');

  // Sync state with URL params
  useEffect(() => {
    setActiveType(searchParams.get('type') || 'all');
  }, [searchParams]);

  const filtered = SAMPLE.filter(item => {
    const matchType   = activeType === 'all' || item.type === activeType;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.area.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });
  const typeColor = TYPES.find(t => t.key === activeType)?.color || '#64748B';

  return (
    <div style={{ minHeight:'100vh', padding:'2rem 1rem' }}>
      <div className="container" style={{ maxWidth:1100 }}>
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'rgba(236,72,153,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'#EC4899' }}>
              <FiHeart size={22}/>
            </div>
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', margin:0 }}>{t("health.title")}</h1>
              <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', margin:0 }}>{t("health.sub")}</p>
            </div>
          </div>
          <Link to="/blood" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:20, background:'rgba(230,57,70,0.08)', border:'1px solid rgba(230,57,70,0.2)', color:'var(--red)', fontSize:'0.82rem', fontWeight:600, textDecoration:'none' }}>
            <FiDroplet size={13}/> {t("health.blood")}
          </Link>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {TYPES.map(t_item => (
            <button key={t_item.key} onClick={() => setActiveType(t_item.key)}
              style={{ padding:'7px 14px', borderRadius:20, border:`1px solid ${activeType===t_item.key ? t_item.color : 'var(--border)'}`, background: activeType===t_item.key ? `${t_item.color}15` : 'var(--surface-2)', color: activeType===t_item.key ? t_item.color : 'var(--text-muted)', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}
            >{t_item.key === 'all' ? t("emergency.all") : t(`health.${t_item.key.replace('-','_')}`)}</button>
          ))}
        </div>
        <div style={{ position:'relative', maxWidth:460, marginBottom:'2rem' }}>
          <FiSearch style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)' }} size={15}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("common.search")} className="form-input" style={{ paddingLeft:40, borderRadius:24 }}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem' }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.2rem', transition:'all 0.2s', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor=typeColor}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
            >
              <div style={{ fontSize:'0.95rem', fontWeight:700, color:'var(--text)', marginBottom:6 }}>{item.name}</div>
              <span style={{ fontSize:'0.72rem', fontWeight:600, padding:'2px 8px', borderRadius:10, background:`${typeColor}15`, color:typeColor }}>{item.badge}</span>
              <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.82rem', color:'var(--text-muted)' }}><FiMapPin size={12}/>{item.area}</div>
                <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.82rem', color:'var(--text-muted)' }}><FiPhone size={12}/>{item.phone}</div>
                <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.82rem', color:'var(--text-muted)' }}><FiClock size={12}/>{item.hours}</div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem 1rem', color:'var(--text-muted)' }}>
            <FiFilter size={32} style={{ opacity:0.3, marginBottom:12, display:'block', margin:'0 auto 12px' }}/>
            <p>No results found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
