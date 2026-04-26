import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import { FiMapPin, FiPhone } from 'react-icons/fi';

export default function AdminBlood() {
  const { t, isBn } = useLang();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/blood-donors?page=${page}&limit=20`);
      setItems(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]); // eslint-disable-line

  const BG_COLOR = { 'A+':'#E63946','A-':'#c1121f','B+':'#06B6D4','B-':'#0284c7','AB+':'#8B5CF6','AB-':'#6d28d9','O+':'#10B981','O-':'#059669' };

  return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ fontWeight:800, fontSize:'1.4rem', color:'#fff', marginBottom:3 }}>{t('admin.blood')}</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{total} {isBn?'নিবন্ধিত দাতা':'registered donors'}</p>
      </div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>{isBn?'দাতা':'Donor'}</th>
                <th>{isBn?'রক্তের গ্রুপ':'Blood Group'}</th>
                <th>{isBn?'যোগাযোগ':'Contact'}</th>
                <th>{isBn?'এলাকা':'Location'}</th>
                <th>{isBn?'শেষ দান':'Last Donation'}</th>
                <th>{isBn?'উপলব্ধ':'Available'}</th>
              </tr></thead>
              <tbody>
                {items.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight:600, color:'#fff', fontSize:'0.85rem' }}>{d.name}</div>
                      <div style={{ fontSize:'0.72rem', color:'var(--text-dim)' }}>{d.email}</div>
                    </td>
                    <td>
                      <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:40, height:40, borderRadius:'50%', background:BG_COLOR[d.blood_group]||'var(--red)', color:'#fff', fontWeight:900, fontSize:'0.82rem', boxShadow:`0 0 12px ${BG_COLOR[d.blood_group]||'var(--red)'}44` }}>
                        {d.blood_group}
                      </span>
                    </td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{d.phone||'—'}</td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{d.district||'—'}{d.division&&`, ${d.division}`}</td>
                    <td style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>{d.last_donation ? new Date(d.last_donation).toLocaleDateString() : '—'}</td>
                    <td><span className={`badge ${d.is_available?'badge-green':'badge-gray'}`}>{d.is_available?t('common.available'):t('common.unavailable')}</span></td>
                  </tr>
                ))}
                {items.length===0 && <tr><td colSpan={6} style={{ textAlign:'center', padding:'2.5rem', color:'var(--text-dim)' }}>{t('common.noResults')}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
  );
}
