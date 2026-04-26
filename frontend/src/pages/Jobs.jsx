import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiPlus, FiBriefcase, FiMapPin, FiClock, FiArrowRight, FiSearch, FiFilter } from 'react-icons/fi';

const TYPES = ['full-time','part-time','freelance','internship','govt'];
const TYPE_COLORS = { 'full-time':'var(--green)', 'part-time':'var(--cyan)', 'freelance':'var(--purple)', 'internship':'var(--amber)', 'govt':'var(--red)' };

export default function Jobs() {
  const { t, isBn } = useLang();
  const { isAuth }  = useAuth();
  const [params, setParams] = useSearchParams();
  const typeFilter = params.get('type') || '';
  const querySearch = params.get('search') || '';

  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);
  const [search, setSearch] = useState(querySearch);
  const [remote, setRemote] = useState(false);

  useEffect(() => {
    setSearch(querySearch);
    setPage(1);
  }, [typeFilter, querySearch]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit:12, ...(typeFilter&&{type:typeFilter}), ...(querySearch&&{search:querySearch}), ...(remote&&{remote:'true'}) });
      const { data } = await api.get(`/jobs?${q}`);
      setJobs(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setJobs([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [page, typeFilter, querySearch, remote]); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(params);
    if (search) newParams.set('search', search);
    else newParams.delete('search');
    setParams(newParams);
  };

  const handleType = (tp) => {
    const newParams = new URLSearchParams(params);
    if (tp) newParams.set('type', tp);
    else newParams.delete('type');
    setParams(newParams);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 className="section-title" style={{ marginBottom:6 }}>{t('jobs.title')}</h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.95rem' }}>{t('jobs.sub')}</p>
          </div>
          {isAuth && <Link to="/jobs/new" className="btn btn-primary"><FiPlus size={14}/>{t('jobs.post')}</Link>}
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem' }}>
        {/* Search + filters */}
        <div style={{ display:'flex', gap:12, marginBottom:'1.5rem', flexWrap:'wrap' }}>
          <form onSubmit={handleSearch} style={{ display:'flex', gap:8, flex:1, minWidth:220 }}>
            <div style={{ flex:1, position:'relative' }}>
              <FiSearch style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)', pointerEvents:'none' }} size={14}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={isBn?'চাকরি বা কোম্পানি খুঁজুন...':'Search jobs or companies...'} className="form-input" style={{ paddingLeft:34 }}/>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">{t('common.search')}</button>
          </form>
          <label style={{ display:'flex', alignItems:'center', gap:7, cursor:'pointer', fontSize:'0.84rem', color:'var(--text-muted)', background:'var(--surface-2)', border:'1px solid var(--border)', padding:'0 12px', borderRadius:9 }}>
            <input type="checkbox" checked={remote} onChange={e=>setRemote(e.target.checked)} style={{ accentColor:'var(--cyan)' }}/>
            {isBn?'রিমোট':'Remote only'}
          </label>
        </div>

        {/* Type filter */}
        <div style={{ display:'flex', gap:7, marginBottom:'1.5rem', flexWrap:'wrap' }}>
          <button onClick={()=>handleType('')} className={`btn btn-sm ${!typeFilter?'btn-primary':'btn-ghost'}`}>{isBn?'সব':'All'}</button>
          {TYPES.map(tp => (
            <button key={tp} onClick={()=>handleType(tp)} className={`btn btn-sm ${typeFilter===tp?'btn-primary':'btn-ghost'}`}
              style={typeFilter!==tp?{borderColor:TYPE_COLORS[tp],color:TYPE_COLORS[tp]}:{}}>
              {t(`jobs.${tp.replace('-','')}`)||tp}
            </button>
          ))}
        </div>

        <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>
          {loading ? t('common.loading') : `${total} jobs found`}
        </p>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>
        ) : jobs.length === 0 ? (
          <div className="empty"><div className="empty-icon">💼</div><div>{t('common.noResults')}</div></div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
            {jobs.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} style={{ textDecoration:'none' }}>
                <div className="card" style={{ padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:'1.25rem' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(6,182,212,0.3)';e.currentTarget.style.transform='translateX(4px)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='none';}}>
                  <div style={{ width:48, height:48, borderRadius:12, background:'var(--surface-2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>💼</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem', flexWrap:'wrap' }}>
                      <div>
                        <h3 style={{ fontWeight:700, color:'#fff', fontSize:'0.97rem', marginBottom:3 }}>{job.title}</h3>
                        <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:500 }}>{job.company}</div>
                      </div>
                      <div style={{ display:'flex', gap:6, flexShrink:0, flexWrap:'wrap' }}>
                        <span className="badge" style={{ background:`${TYPE_COLORS[job.type]}18`, color:TYPE_COLORS[job.type] }}>{job.type}</span>
                        {job.is_remote && <span className="badge badge-cyan">Remote</span>}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'1rem', marginTop:8, flexWrap:'wrap', fontSize:'0.78rem', color:'var(--text-dim)' }}>
                      {job.district  && <span style={{ display:'flex', alignItems:'center', gap:3 }}><FiMapPin size={11}/>{job.district}</span>}
                      {job.salary_min && <span>💰 ৳{Number(job.salary_min).toLocaleString()}+ {job.salary_currency}</span>}
                      {job.deadline  && <span style={{ display:'flex', alignItems:'center', gap:3 }}><FiClock size={11}/>{new Date(job.deadline).toLocaleDateString()}</span>}
                      <span style={{ display:'flex', alignItems:'center', gap:3 }}>👥 {job.applicants||0} {isBn?'আবেদনকারী':'applicants'}</span>
                    </div>
                  </div>
                  <FiArrowRight size={18} style={{ color:'var(--text-dim)', flexShrink:0 }}/>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={()=>setPage(p=>p-1)} disabled={page===1}>‹</button>
            {Array.from({length:Math.min(5,pages)},(_,i)=>i+Math.max(1,page-2)).filter(p=>p<=pages).map(p=>(
              <button key={p} className={`page-btn${p===page?' active':''}`} onClick={()=>setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" onClick={()=>setPage(p=>p+1)} disabled={page===pages}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}
