import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiMapPin, FiSearch, FiPhone, FiShield, FiUsers, FiHeart, FiBook, FiAlertCircle, FiCoffee, FiFeather, FiMonitor, FiStar, FiCheckCircle } from 'react-icons/fi';

const CATS = ['general','medical','education','disaster','food','environment','tech','other'];
const CAT_ICONS = { general:<FiUsers/>, medical:<FiHeart/>, education:<FiBook/>, disaster:<FiAlertCircle/>, food:<FiCoffee/>, environment:<FiFeather/>, tech:<FiMonitor/>, other:<FiStar/> };

export default function Volunteers() {
  const { t, isBn } = useLang();
  const { isAuth }  = useAuth();
  const [params, setParams] = useSearchParams();
  const actionQuery = params.get('action');
  const catQuery = params.get('category') || '';
  const searchQuery = params.get('search') || '';

  const [vols, setVols]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [search, setSearch]   = useState(searchQuery);
  const [showReg, setShowReg] = useState(false);
  const [myVol, setMyVol]     = useState(null);
  const [regForm, setRegForm] = useState({ skills:'', availability:'', category:'general', division:'', district:'', bio:'' });

  useEffect(() => {
    setSearch(searchQuery);
    setPage(1);
  }, [catQuery, searchQuery]);

  useEffect(() => {
    if (actionQuery === 'register' && !myVol) setShowReg(true);
  }, [actionQuery, myVol]);

  const fetchVols = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit:16, ...(catQuery&&{category:catQuery}), ...(searchQuery&&{search:searchQuery}) });
      const { data } = await api.get(`/volunteers?${q}`);
      setVols(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setVols([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchVols(); }, [page, catQuery, searchQuery]); // eslint-disable-line
  useEffect(() => {
    if (isAuth) api.get('/volunteers/me').then(r=>setMyVol(r.data.data)).catch(()=>{});
  }, [isAuth]);

  const closeReg = () => {
    setShowReg(false);
    const newParams = new URLSearchParams(params);
    newParams.delete('action');
    setParams(newParams);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/volunteers', regForm);
      setMyVol(data.data); closeReg();
      toast.success(isBn?'স্বেচ্ছাসেবক হিসেবে নিবন্ধিত!':'Registered as volunteer!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleCat = (c) => {
    const newParams = new URLSearchParams(params);
    if (c) newParams.set('category', c);
    else newParams.delete('category');
    setParams(newParams);
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams(params);
    if (search) newParams.set('search', search);
    else newParams.delete('search');
    setParams(newParams);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 className="section-title" style={{ marginBottom:6 }}>{t('volunteers.title')}</h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.95rem' }}>{t('volunteers.sub')}</p>
          </div>
          {isAuth && !myVol && (
            <button onClick={()=>setShowReg(true)} className="btn btn-primary"><FiPlus size={14}/>{t('volunteers.register')}</button>
          )}
          {myVol && (
            <div style={{ padding:'8px 14px', background:'var(--green-light)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10, fontSize:'0.83rem', color:'var(--green)', fontWeight:600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiCheckCircle size={14}/> {isBn?'আপনি নিবন্ধিত স্বেচ্ছাসেবক':'You are a registered volunteer'}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem' }}>
        <div style={{ display:'flex', gap:8, marginBottom:'1.5rem', flexWrap:'wrap' }}>
          <button onClick={()=>handleCat('')} className={`btn btn-sm ${!catQuery?'btn-primary':'btn-ghost'}`}>{isBn?'সব':'All'}</button>
          {CATS.map(c => (
            <button key={c} onClick={()=>handleCat(c)} className={`btn btn-sm ${catQuery===c?'btn-primary':'btn-ghost'}`} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {CAT_ICONS[c]} {c}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:'1.5rem' }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} placeholder={isBn?'নাম বা দক্ষতা খুঁজুন...':'Search by name...'} className="form-input" style={{ maxWidth:260 }}/>
          <button onClick={handleSearch} className="btn btn-secondary btn-sm"><FiSearch size={13}/></button>
        </div>

        <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>{loading?t('common.loading'):`${total} volunteers`}</p>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>
        ) : vols.length === 0 ? (
          <div className="empty"><div className="empty-icon"><FiUsers size={40} style={{ opacity: 0.4 }}/></div><div>{t('common.noResults')}</div></div>
        ) : (
          <div className="grid-4">
            {vols.map(v => (
              <div key={v.id} className="card card-pad fade-in">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.9rem' }}>
                  <div style={{ width:46, height:46, borderRadius:'50%', background:'var(--grad-cyan)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#fff', fontSize:'1.1rem' }}>
                    {v.name?.[0]?.toUpperCase()||'V'}
                  </div>
                  <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{CAT_ICONS[v.category]||<FiUsers/>} {v.category}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
                  <span style={{ fontWeight:700, color:'var(--text)', fontSize:'0.95rem' }}>{v.name}</span>
                  {v.is_verified && <FiShield size={13} style={{ color:'var(--cyan)' }}/>}
                </div>
                {v.district   && <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4, marginBottom:4 }}><FiMapPin size={11}/>{v.district}</div>}
                {v.availability && <div style={{ fontSize:'0.75rem', color:'var(--text-dim)', marginBottom:4 }}>⏰ {v.availability}</div>}
                {v.skills && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:6 }}>
                    {v.skills.split(',').slice(0,3).map(s => (
                      <span key={s} className="badge badge-purple" style={{ fontSize:'0.68rem' }}>{s.trim()}</span>
                    ))}
                  </div>
                )}
                {v.bio && <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:8, lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{v.bio}</p>}
              </div>
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

      {/* Register modal */}
      {showReg && (
        <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div onClick={closeReg} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)' }}/>
          <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 480, padding: '2rem', animation: 'fadeUp 0.25s ease', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}><FiUsers size={18}/> {t('volunteers.register')}</h2>
            <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div className="form-group">
                <label className="form-label">{isBn?'বিভাগ':'Category'}</label>
                <select value={regForm.category} onChange={e=>setRegForm(f=>({...f,category:e.target.value}))} className="form-select">
                  {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{isBn?'দক্ষতা (কমা দিয়ে আলাদা করুন)':'Skills (comma-separated)'}</label>
                <input value={regForm.skills} onChange={e=>setRegForm(f=>({...f,skills:e.target.value}))} placeholder="First Aid, Teaching, IT" className="form-input"/>
              </div>
              <div className="form-group">
                <label className="form-label">{isBn?'উপলব্ধতা':'Availability'}</label>
                <input value={regForm.availability} onChange={e=>setRegForm(f=>({...f,availability:e.target.value}))} placeholder="Weekends, Evenings" className="form-input"/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn?'বিভাগ (এলাকা)':'Division'}</label>
                  <input value={regForm.division} onChange={e=>setRegForm(f=>({...f,division:e.target.value}))} placeholder="Dhaka" className="form-input"/>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn?'জেলা':'District'}</label>
                  <input value={regForm.district} onChange={e=>setRegForm(f=>({...f,district:e.target.value}))} placeholder="Mirpur" className="form-input"/>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{isBn?'সংক্ষিপ্ত পরিচয়':'Bio'}</label>
                <textarea value={regForm.bio} onChange={e=>setRegForm(f=>({...f,bio:e.target.value}))} placeholder={isBn?'নিজের সম্পর্কে সংক্ষেপে লিখুন...':'Brief intro...'} className="form-textarea" style={{ minHeight:80 }}/>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>{t('common.submit')}</button>
                <button type="button" onClick={closeReg} className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}>{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
