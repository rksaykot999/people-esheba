import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiList, FiSearch, FiPhone, FiMapPin, FiStar, FiFilter, FiHome, FiTruck, FiTool, FiActivity, FiUsers, FiWifi } from 'react-icons/fi';

const CATS = [
  { key:'all',          label:'All Services',          color:'#64748B' },
  { key:'home',         label:'Home Services',          color:'#E63946' },
  { key:'transport',    label:'Transport',              color:'#06B6D4' },
  { key:'repairs',      label:'Repairs & Maintenance',  color:'#F59E0B' },
  { key:'telemedicine', label:'Telemedicine',           color:'#EC4899' },
  { key:'tutor',        label:'Finding Tutor',          color:'#8B5CF6' },
  { key:'utility',      label:'Utility Services',       color:'#10B981' },
];

const SAMPLE = [
  { id:1,  cat:'home',         name:'CleanBD Home Services',    area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.5, badge:'Cleaning' },
  { id:2,  cat:'home',         name:'HomeFix BD',               area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.2, badge:'Plumbing & Electric' },
  { id:3,  cat:'transport',    name:'Pathao Rides',             area:'Nationwide', phone:'16775',       rating:4.7, badge:'Ride Sharing' },
  { id:4,  cat:'transport',    name:'Shohoz Bus Booking',       area:'Nationwide', phone:'16789',       rating:4.3, badge:'Bus Tickets' },
  { id:5,  cat:'repairs',      name:'FixIt BD',                 area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.4, badge:'Electronics Repair' },
  { id:6,  cat:'repairs',      name:'AC & Fridge Service BD',   area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.1, badge:'Appliance Repair' },
  { id:7,  cat:'telemedicine', name:'Maya Apa (Telehealth)',    area:'Nationwide', phone:'16789',       rating:4.8, badge:'Online Doctor' },
  { id:8,  cat:'telemedicine', name:'Praava Health',            area:'Dhaka',      phone:'01XXXXXXXXX', rating:4.6, badge:'Telemedicine' },
  { id:9,  cat:'tutor',        name:'10 Minute School Tutor',   area:'Nationwide', phone:'01XXXXXXXXX', rating:4.9, badge:'Online Tutor' },
  { id:10, cat:'tutor',        name:'Shikho.com',               area:'Nationwide', phone:'01XXXXXXXXX', rating:4.7, badge:'Online Learning' },
  { id:11, cat:'utility',      name:'DESCO Bill Payment',       area:'Dhaka',      phone:'16118',       rating:4.0, badge:'Electricity Bill' },
  { id:12, cat:'utility',      name:'WASA Dhaka',               area:'Dhaka',      phone:'16162',       rating:3.9, badge:'Water & Sewerage' },
];

export default function Services() {
  const [searchParams] = useSearchParams();
  const [search, setSearch]       = useState('');
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || 'all');

  const filtered = SAMPLE.filter(item => {
    const matchCat    = activeCat === 'all' || item.cat === activeCat;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.area.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  const catColor = CATS.find(c => c.key === activeCat)?.color || '#64748B';

  return (
    <div style={{ minHeight:'100vh', padding:'2rem 1rem' }}>
      <div className="container" style={{ maxWidth:1100 }}>
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'rgba(139,92,246,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'#8B5CF6' }}>
              <FiList size={22}/>
            </div>
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', margin:0 }}>Services</h1>
              <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', margin:0 }}>Home, Transport, Repairs, Telemedicine & More</p>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {CATS.map(c => (
            <button key={c.key} onClick={() => setActiveCat(c.key)}
              style={{ padding:'7px 14px', borderRadius:20, border:`1px solid ${activeCat===c.key ? c.color : 'var(--border)'}`, background: activeCat===c.key ? `${c.color}15` : 'var(--surface-2)', color: activeCat===c.key ? c.color : 'var(--text-muted)', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}
            >{c.label}</button>
          ))}
        </div>
        <div style={{ position:'relative', maxWidth:460, marginBottom:'2rem' }}>
          <FiSearch style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)' }} size={15}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services or area..." className="form-input" style={{ paddingLeft:40, borderRadius:24 }}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem' }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.2rem', transition:'all 0.2s', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor=catColor}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <div style={{ fontSize:'0.95rem', fontWeight:700, color:'var(--text)' }}>{item.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:3, fontSize:'0.8rem', fontWeight:700, color:'#F59E0B', flexShrink:0, marginLeft:8 }}>
                  <FiStar size={12}/>{item.rating}
                </div>
              </div>
              <span style={{ fontSize:'0.72rem', fontWeight:600, padding:'2px 8px', borderRadius:10, background:`${catColor}15`, color:catColor }}>{item.badge}</span>
              <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.82rem', color:'var(--text-muted)' }}><FiMapPin size={12}/>{item.area}</div>
                <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.82rem', color:'var(--text-muted)' }}><FiPhone size={12}/>{item.phone}</div>
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
