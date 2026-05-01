import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiBell, FiSearch, FiClock, FiExternalLink, FiBook, FiBriefcase, FiAward, FiShield, FiFilter, FiCalendar } from 'react-icons/fi';

const CATS = [
  { key:'all',           label:'All Notices',        color:'#64748B' },
  { key:'school-college',label:'School & College',   color:'#E63946' },
  { key:'university',    label:'University',         color:'#F59E0B' },
  { key:'admission',     label:'Admission News',     color:'#06B6D4' },
  { key:'job-circular',  label:'Job Circular',       color:'#8B5CF6' },
  { key:'exam',          label:'Exam & Admit Card',  color:'#EC4899' },
  { key:'internship',    label:'Internship',         color:'#10B981' },
  { key:'scholarship',   label:'Scholarships',       color:'#10B981' },
  { key:'gazette',       label:'Gov. Gazettes',      color:'#64748B' },
];

const SAMPLE = [
  { id:1,  cat:'school-college', title:'2025 SSC Routine Published by BISE Dhaka',           date:'2025-03-10', source:'BISE Dhaka' },
  { id:2,  cat:'school-college', title:'HSC Registration Form Submission Deadline Extended', date:'2025-02-28', source:'Education Board' },
  { id:3,  cat:'university',     title:'Dhaka University Admission Test 2024-25 Schedule',   date:'2025-04-01', source:'DU' },
  { id:4,  cat:'university',     title:'BUET Admission Notice 2024-25',                       date:'2025-03-15', source:'BUET' },
  { id:5,  cat:'admission',      title:'GST Cluster Admission Result 2024-25 Published',     date:'2025-05-02', source:'GST Cluster' },
  { id:6,  cat:'admission',      title:'National University Honours Admission Circular',      date:'2025-04-12', source:'NU Bangladesh' },
  { id:7,  cat:'job-circular',   title:'Bangladesh Civil Service (BCS) 46th Circular',       date:'2025-01-20', source:'BPSC' },
  { id:8,  cat:'job-circular',   title:'Sonali Bank Recruitment Circular 2025',              date:'2025-02-14', source:'Sonali Bank' },
  { id:9,  cat:'exam',           title:'44th BCS Written Exam Schedule Announced',           date:'2025-03-05', source:'BPSC' },
  { id:10, cat:'exam',           title:'SSC 2025 Exam Admit Card Download Started',          date:'2025-04-18', source:'BISE Dhaka' },
  { id:11, cat:'internship',     title:'ICTD Government Internship Program 2025',            date:'2025-04-25', source:'ICT Division' },
  { id:12, cat:'scholarship',    title:'Prime Minister Education Trust Scholarship 2025',     date:'2025-03-22', source:'PMO' },
  { id:13, cat:'scholarship',    title:'Chinese Government Scholarship 2025-26',             date:'2025-02-10', source:'Chinese Embassy' },
  { id:14, cat:'gazette',        title:'Bangladesh Gazette: Financial Act Amendment 2025',   date:'2025-04-08', source:'MoF' },
];

export default function Notices() {
  const [searchParams] = useSearchParams();
  const [search, setSearch]       = useState('');
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || 'all');

  // Sync state with URL params
  useEffect(() => {
    setActiveCat(searchParams.get('cat') || 'all');
  }, [searchParams]);

  const filtered = SAMPLE.filter(item => {
    const matchCat    = activeCat === 'all' || item.cat === activeCat;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.source.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight:'100vh', padding:'2rem 1rem' }}>
      <div className="container" style={{ maxWidth:900 }}>
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'rgba(100,116,139,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748B' }}>
              <FiBell size={22}/>
            </div>
            <div>
              <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', margin:0 }}>Notices</h1>
              <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', margin:0 }}>Academic, Career, Scholarships & Government Notices</p>
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices..." className="form-input" style={{ paddingLeft:40, borderRadius:24 }}/>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {filtered.map(item => {
            const iColor = CATS.find(c => c.key === item.cat)?.color || '#64748B';
            const iLabel = CATS.find(c => c.key === item.cat)?.label || item.cat;
            return (
              <a key={item.id} href="#"
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:'1rem 1.25rem', textDecoration:'none', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=iColor; e.currentTarget.style.background='var(--surface-2)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--surface)'; }}
              >
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:'0.72rem', fontWeight:600, padding:'2px 8px', borderRadius:10, background:`${iColor}15`, color:iColor, whiteSpace:'nowrap' }}>{iLabel}</span>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-dim)', display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}><FiClock size={11}/>{item.date}</span>
                  </div>
                  <div style={{ fontSize:'0.92rem', fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:3 }}>Source: {item.source}</div>
                </div>
                <FiExternalLink size={15} style={{ color:'var(--text-dim)', flexShrink:0, marginLeft:16 }}/>
              </a>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem 1rem', color:'var(--text-muted)' }}>
            <FiFilter size={32} style={{ opacity:0.3, display:'block', margin:'0 auto 12px' }}/>
            <p>No notices found. Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
