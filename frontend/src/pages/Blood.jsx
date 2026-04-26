import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPhone, FiMapPin, FiSearch, FiPlus, FiDroplet, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const GROUP_COLORS = { 'A+':'#E63946','A-':'#c1121f','B+':'#06B6D4','B-':'#0284c7','AB+':'#8B5CF6','AB-':'#6d28d9','O+':'#10B981','O-':'#059669' };

export default function Blood() {
  const { t, isBn } = useLang();
  const { isAuth }  = useAuth();
  const [donors, setDonors]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [pages, setPages]         = useState(1);
  const [filter, setFilter]       = useState({ blood_group:'', district:'' });
  const [showReg, setShowReg]     = useState(false);
  const [myDonor, setMyDonor]     = useState(null);
  const [regForm, setRegForm]     = useState({ blood_group:'', district:'', division:'', address:'', emergency_contact:'' });

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit:16, ...filter });
      const { data } = await api.get(`/blood-donors?${q}`);
      setDonors(data.data.rows);
      setTotal(data.data.total);
      setPages(data.data.pages);
    } catch { setDonors([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDonors(); }, [page, filter.blood_group]); // eslint-disable-line

  useEffect(() => {
    if (isAuth) api.get('/blood-donors/me').then(r=>setMyDonor(r.data.data)).catch(()=>{});
  }, [isAuth]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.blood_group) return toast.error('Blood group required');
    try {
      const { data } = await api.post('/blood-donors', regForm);
      setMyDonor(data.data);
      setShowReg(false);
      toast.success('Registered as blood donor!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const toggleAvail = async () => {
    try {
      const { data } = await api.put('/blood-donors/availability');
      setMyDonor(d => ({...d, is_available: data.data.is_available}));
      toast.success(data.message);
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 className="section-title" style={{ marginBottom:6 }}>{t('blood.title')}</h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.95rem' }}>{t('blood.sub')}</p>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {isAuth && myDonor && (
              <button onClick={toggleAvail} className={`btn ${myDonor.is_available?'btn-secondary':'btn-primary'}`} style={{ fontSize:'0.85rem' }}>
                {myDonor.is_available ? <><FiXCircle size={14}/>{t('blood.unavailable')}</> : <><FiCheckCircle size={14}/>{t('blood.available')}</>}
              </button>
            )}
            {isAuth && !myDonor && (
              <button onClick={()=>setShowReg(true)} className="btn btn-primary">
                <FiPlus size={14}/>{t('blood.register')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem' }}>
        {/* Blood group filter */}
        <div style={{ marginBottom:'1.75rem' }}>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'1rem' }}>
            <button onClick={()=>setFilter(f=>({...f,blood_group:''}))} className={`btn btn-sm ${!filter.blood_group?'btn-primary':'btn-ghost'}`}>{isBn?'সব':'All'}</button>
            {GROUPS.map(g => (
              <button key={g} onClick={()=>setFilter(f=>({...f,blood_group:g}))} className={`btn btn-sm ${filter.blood_group===g?'btn-primary':'btn-ghost'}`}
                style={{ borderColor: filter.blood_group===g?undefined:GROUP_COLORS[g], color: filter.blood_group===g?undefined:GROUP_COLORS[g] }}>
                🩸 {g}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input value={filter.district} onChange={e=>setFilter(f=>({...f,district:e.target.value}))} placeholder={isBn?'জেলা লিখুন':'District...'} className="form-input" style={{ maxWidth:200 }}/>
            <button onClick={fetchDonors} className="btn btn-secondary btn-sm"><FiSearch size={13}/>{t('common.search')}</button>
          </div>
        </div>

        <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>{loading?t('common.loading'):`${total} donors available`}</p>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>
        ) : donors.length === 0 ? (
          <div className="empty"><div className="empty-icon">🩸</div><div>{t('common.noResults')}</div></div>
        ) : (
          <div className="grid-4">
            {donors.map(d => (
              <div key={d.id} className="card card-pad fade-in">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.9rem' }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:GROUP_COLORS[d.blood_group]||'var(--red)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', fontSize:'0.9rem', boxShadow:`0 0 16px ${GROUP_COLORS[d.blood_group]}44` }}>
                    {d.blood_group}
                  </div>
                  <span className={`badge ${d.is_available?'badge-green':'badge-gray'}`}>
                    {d.is_available ? t('blood.available') : t('blood.unavailable')}
                  </span>
                </div>
                <div style={{ fontWeight:700, color:'#fff', marginBottom:4, fontSize:'0.95rem' }}>{d.name}</div>
                {d.district && <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4, marginBottom:4 }}><FiMapPin size={11}/>{d.district}</div>}
                {d.last_donation && <div style={{ fontSize:'0.75rem', color:'var(--text-dim)' }}>{t('blood.lastDonation')}: {new Date(d.last_donation).toLocaleDateString()}</div>}
                {d.phone && d.is_available && (
                  <a href={`tel:${d.phone}`} className="btn btn-primary btn-sm" style={{ marginTop:'0.9rem', justifyContent:'center', width:'100%' }}>
                    <FiPhone size={12}/>{t('common.contact')}
                  </a>
                )}
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

      {/* Register donor modal */}
      {showReg && (
        <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div onClick={()=>setShowReg(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)' }}/>
          <div style={{ position:'relative', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, width:'100%', maxWidth:440, padding:'2rem', animation:'fadeUp 0.25s ease' }}>
            <h2 style={{ fontWeight:800, fontSize:'1.25rem', marginBottom:'1.5rem', color:'#fff' }}>🩸 {t('blood.register')}</h2>
            <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div className="form-group">
                <label className="form-label">{isBn?'রক্তের গ্রুপ':'Blood Group'} *</label>
                <select value={regForm.blood_group} onChange={e=>setRegForm(f=>({...f,blood_group:e.target.value}))} className="form-select" required>
                  <option value="">{isBn?'বেছে নিন':'Select group'}</option>
                  {GROUPS.map(g=><option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">{isBn?'বিভাগ':'Division'}</label>
                  <input value={regForm.division} onChange={e=>setRegForm(f=>({...f,division:e.target.value}))} placeholder="Dhaka" className="form-input"/>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn?'জেলা':'District'}</label>
                  <input value={regForm.district} onChange={e=>setRegForm(f=>({...f,district:e.target.value}))} placeholder="Mirpur" className="form-input"/>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{isBn?'জরুরি যোগাযোগ':'Emergency Contact'}</label>
                <input value={regForm.emergency_contact} onChange={e=>setRegForm(f=>({...f,emergency_contact:e.target.value}))} placeholder="01XXXXXXXXX" className="form-input"/>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:'0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>{t('common.submit')}</button>
                <button type="button" onClick={()=>setShowReg(false)} className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}>{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
