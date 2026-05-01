import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiBook, FiSearch, FiMapPin, FiAward, FiFilter, FiExternalLink } from 'react-icons/fi';

const TYPES = [
  { key:'all',          label:'All',                color:'#64748B' },
  { key:'govt-school',  label:'Government School',  color:'#E63946' },
  { key:'govt-college', label:'Government College', color:'#F59E0B' },
  { key:'public-uni',   label:'Public University',  color:'#06B6D4' },
  { key:'private-uni',  label:'Private University', color:'#8B5CF6' },
  { key:'scholarships', label:'Scholarships',       color:'#10B981' },
];

const SAMPLE = [
  { id:1,  type:'govt-school',  name:'Government Laboratory High School', area:'Dhaka',      estd:1954, badge:'Govt School' },
  { id:2,  type:'govt-school',  name:'Rajshahi Collegiate School',         area:'Rajshahi',  estd:1828, badge:'Govt School' },
  { id:3,  type:'govt-college', name:'Notre Dame College',                 area:'Dhaka',      estd:1949, badge:'Govt College' },
  { id:4,  type:'govt-college', name:'Dhaka College',                      area:'Dhaka',      estd:1841, badge:'Govt College' },
  { id:5,  type:'public-uni',   name:'University of Dhaka',                area:'Dhaka',      estd:1921, badge:'Public Uni' },
  { id:6,  type:'public-uni',   name:'Bangladesh University of Engineering',area:'Dhaka',     estd:1962, badge:'Public Uni' },
  { id:7,  type:'public-uni',   name:'University of Chittagong',           area:'Chittagong', estd:1966, badge:'Public Uni' },
  { id:8,  type:'private-uni',  name:'BRAC University',                    area:'Dhaka',      estd:2001, badge:'Private Uni' },
  { id:9,  type:'private-uni',  name:'North South University',             area:'Dhaka',      estd:1992, badge:'Private Uni' },
  { id:10, type:'scholarships', name:'Prime Minister Scholarship',         area:'Nationwide', amount:'Variable', badge:'Scholarship' },
  { id:11, type:'scholarships', name:'Board Scholarship (SSC/HSC)',        area:'Nationwide', amount:'3,000-5,000 BDT/mo', badge:'Scholarship' },
];

export default function Education() {
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
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'rgba(245,158,11,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'#F59E0B' }}>
              <FiBook size={22}/>
            </div>
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', margin:0 }}>Education</h1>
              <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', margin:0 }}>Schools, Colleges, Universities & Scholarships</p>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {TYPES.map(t => (
            <button key={t.key} onClick={() => setActiveType(t.key)}
              style={{ padding:'7px 14px', borderRadius:20, border:`1px solid ${activeType===t.key ? t.color : 'var(--border)'}`, background: activeType===t.key ? `${t.color}15` : 'var(--surface-2)', color: activeType===t.key ? t.color : 'var(--text-muted)', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}
            >{t.label}</button>
          ))}
        </div>
        <div style={{ position:'relative', maxWidth:460, marginBottom:'2rem' }}>
          <FiSearch style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)' }} size={15}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search institutions or area..." className="form-input" style={{ paddingLeft:40, borderRadius:24 }}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem' }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.2rem', transition:'all 0.2s', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor=typeColor}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <div style={{ fontSize:'0.95rem', fontWeight:700, color:'var(--text)' }}>{item.name}</div>
                <FiExternalLink size={14} style={{ color:'var(--text-dim)', flexShrink:0, marginLeft:8 }}/>
              </div>
              <span style={{ fontSize:'0.72rem', fontWeight:600, padding:'2px 8px', borderRadius:10, background:`${typeColor}15`, color:typeColor }}>{item.badge}</span>
              <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.82rem', color:'var(--text-muted)' }}><FiMapPin size={12}/>{item.area}</div>
                {item.estd   && <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.82rem', color:'var(--text-muted)' }}><FiBook size={12}/>Est. {item.estd}</div>}
                {item.amount && <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.82rem', color:'#10B981' }}><FiAward size={12}/>{item.amount}</div>}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem 1rem', color:'var(--text-muted)' }}>
            <FiFilter size={32} style={{ opacity:0.3, display:'block', margin:'0 auto 12px' }}/>
            <p>No results found. Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
