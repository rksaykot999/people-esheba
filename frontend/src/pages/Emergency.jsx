import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import api from '../services/api';
import { FiPhone, FiMapPin, FiSearch, FiFilter, FiShield, FiClock } from 'react-icons/fi';

const TYPES = ['hospital','police','fire','ambulance','mental','other'];
const TYPE_COLORS = { hospital:'var(--red)', police:'var(--cyan)', fire:'var(--amber)', ambulance:'var(--red)', mental:'var(--purple)', other:'var(--green)' };
const TYPE_ICONS  = { hospital:'🏥', police:'👮', fire:'🚒', ambulance:'🚑', mental:'🧠', other:'📞' };

export default function Emergency() {
  const { t, isBn } = useLang();
  const [params, setParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [page,  setPage]        = useState(1);
  const [pages, setPages]       = useState(1);
  const [search, setSearch]     = useState('');
  const typeFilter = params.get('type') || '';

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit:12, ...(typeFilter&&{type:typeFilter}), ...(search&&{search}) });
      const { data } = await api.get(`/emergency?${q}`);
      setServices(data.data.rows);
      setTotal(data.data.total);
      setPages(data.data.pages);
    } catch { setServices([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page, typeFilter]); // eslint-disable-line
  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchData(); };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="section-title" style={{ marginBottom:6 }}>{t('emergency.title')}</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.95rem' }}>{t('emergency.sub')}</p>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem' }}>
        {/* Filters */}
        <div style={{ display:'flex', gap:12, marginBottom:'1.75rem', flexWrap:'wrap' }}>
          <form onSubmit={handleSearch} style={{ display:'flex', gap:8, flex:1, minWidth:200 }}>
            <div style={{ flex:1, position:'relative' }}>
              <FiSearch style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)', pointerEvents:'none' }} size={14}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('emergency.search')} className="form-input" style={{ paddingLeft:34 }}/>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">{t('common.search')}</button>
          </form>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            <button onClick={()=>{setParams({});setPage(1);}} className={`btn btn-sm ${!typeFilter?'btn-primary':'btn-ghost'}`}>{t('emergency.all')}</button>
            {TYPES.map(tp => (
              <button key={tp} onClick={()=>{setParams({type:tp});setPage(1);}} className={`btn btn-sm ${typeFilter===tp?'btn-primary':'btn-ghost'}`}>
                {TYPE_ICONS[tp]} {t(`emergency.${tp}`) || tp}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>
          {loading ? t('common.loading') : `${total} services found`}
        </p>

        {/* Grid */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>
        ) : services.length === 0 ? (
          <div className="empty"><div className="empty-icon">🏥</div><div>{t('common.noResults')}</div></div>
        ) : (
          <div className="grid-3">
            {services.map(s => (
              <div key={s.id} className="card card-pad fade-up" style={{ borderLeft:`3px solid ${TYPE_COLORS[s.type]||'var(--red)'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                  <span style={{ fontSize:'1.4rem' }}>{TYPE_ICONS[s.type]||'📞'}</span>
                  <div style={{ display:'flex', gap:5 }}>
                    {s.is_verified && <span className="badge badge-green"><FiShield size={9}/>{t('emergency.verified')}</span>}
                    {s.is_24h      && <span className="badge badge-cyan"><FiClock size={9}/>{t('emergency.available24')}</span>}
                  </div>
                </div>
                <h3 style={{ fontWeight:700, color:'#fff', marginBottom:6, fontSize:'0.95rem', lineHeight:1.3 }}>{s.name}</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:4, fontSize:'0.8rem', color:'var(--text-muted)' }}>
                  {s.address  && <span style={{ display:'flex', alignItems:'flex-start', gap:5 }}><FiMapPin size={12} style={{ marginTop:2, flexShrink:0 }}/>{s.address}</span>}
                  {s.district && <span>📍 {s.district}{s.division&&`, ${s.division}`}</span>}
                </div>
                {s.phone && (
                  <a href={`tel:${s.phone}`} className="btn btn-primary btn-sm" style={{ marginTop:'1rem', justifyContent:'center' }}>
                    <FiPhone size={13}/>{t('emergency.call')}: {s.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={()=>setPage(p=>p-1)} disabled={page===1}>‹</button>
            {Array.from({length:Math.min(5,pages)}, (_,i)=>i+Math.max(1,page-2)).filter(p=>p<=pages).map(p=>(
              <button key={p} className={`page-btn${p===page?' active':''}`} onClick={()=>setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" onClick={()=>setPage(p=>p+1)} disabled={page===pages}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}
