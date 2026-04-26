import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiPlus, FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';

const CATS = ['all','medical','education','disaster','food','other'];
const CAT_COLORS = { medical:'var(--red)', education:'var(--cyan)', disaster:'var(--amber)', food:'var(--green)', other:'var(--purple)' };

export default function Donation() {
  const { t, isBn } = useLang();
  const { isAuth }  = useAuth();
  const [params, setParams] = useSearchParams();
  const catQuery = params.get('category') || 'all';

  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);

  useEffect(() => { setPage(1); }, [catQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit:12, ...(catQuery!=='all'&&{category:catQuery}) });
      const { data } = await api.get(`/donations?${q}`);
      setItems(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page, catQuery]); // eslint-disable-line

  const handleCat = (c) => {
    const newParams = new URLSearchParams(params);
    if (c && c !== 'all') newParams.set('category', c);
    else newParams.delete('category');
    setParams(newParams);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 className="section-title" style={{ marginBottom:6 }}>{t('donation.title')}</h1>
            <p style={{ color:'var(--text-muted)', fontSize:'0.95rem' }}>{t('donation.sub')}</p>
          </div>
          {isAuth && <Link to="/donation/new" className="btn btn-primary"><FiPlus size={14}/>{t('donation.new')}</Link>}
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem' }}>
        {/* Category tabs */}
        <div style={{ display:'flex', gap:7, marginBottom:'1.75rem', flexWrap:'wrap' }}>
          {CATS.map(c => (
            <button key={c} onClick={()=>handleCat(c)} className={`btn btn-sm ${catQuery===c?'btn-primary':'btn-ghost'}`}
              style={catQuery!==c&&c!=='all'?{borderColor:CAT_COLORS[c],color:CAT_COLORS[c]}:{}}>
              {t(`donation.${c}`) || c}
            </button>
          ))}
        </div>

        <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>
          {loading ? t('common.loading') : `${total} requests found`}
        </p>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>
        ) : items.length === 0 ? (
          <div className="empty"><div className="empty-icon">❤️</div><div>{t('common.noResults')}</div></div>
        ) : (
          <div className="grid-3">
            {items.map(d => {
              const pct = Math.min(100, Math.round((d.amount_raised / d.amount_needed) * 100));
              return (
                <div key={d.id} className="card fade-up" style={{ overflow:'hidden' }}>
                  <div style={{ background:'var(--surface-2)', height:6 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg, ${CAT_COLORS[d.category]||'var(--red)'}, ${CAT_COLORS[d.category]||'var(--red)'}88)`, transition:'width 0.5s ease' }}/>
                  </div>
                  <div style={{ padding:'1.25rem' }}>
                    <div style={{ display:'flex', gap:7, marginBottom:'0.75rem', flexWrap:'wrap' }}>
                      {d.is_urgent && <span className="badge badge-red">⚡ {t('donation.urgent')}</span>}
                      <span className="badge" style={{ background:`${CAT_COLORS[d.category]||'var(--red)'}18`, color:CAT_COLORS[d.category]||'var(--red)' }}>{d.category}</span>
                    </div>
                    <h3 style={{ fontWeight:700, color:'#fff', marginBottom:6, fontSize:'0.95rem', lineHeight:1.4 }}>{d.title}</h3>
                    <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'1rem', lineHeight:1.6 }}>{d.description?.substring(0,90)}...</p>
                    <div style={{ marginBottom:'0.75rem' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:5 }}>
                        <span>৳{Number(d.amount_raised).toLocaleString()} {isBn?'সংগ্রহ':'raised'}</span>
                        <span style={{ fontWeight:700, color:'#fff' }}>{pct}%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${CAT_COLORS[d.category]||'var(--red)'},${CAT_COLORS[d.category]||'var(--red)'}88)` }}/></div>
                      <div style={{ fontSize:'0.73rem', color:'var(--text-dim)', marginTop:4 }}>
                        {isBn?'লক্ষ্য':'Target'}: ৳{Number(d.amount_needed).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.75rem', color:'var(--text-dim)', marginBottom:'0.9rem' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}><FiUser size={11}/>{d.poster_name}</span>
                      {d.deadline && <span style={{ display:'flex', alignItems:'center', gap:4 }}><FiCalendar size={11}/>{new Date(d.deadline).toLocaleDateString()}</span>}
                    </div>
                    <Link to={`/donation/${d.id}`} className="btn btn-primary btn-sm" style={{ width:'100%', justifyContent:'center' }}>
                      {t('donation.donate')} <FiArrowRight size={12}/>
                    </Link>
                  </div>
                </div>
              );
            })}
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
