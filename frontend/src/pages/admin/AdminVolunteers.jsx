import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';

export default function AdminVolunteers() {
  const { t, isBn } = useLang();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/volunteers?page=${page}&limit=20`)
      .then(r=>{ setItems(r.data.data.rows); setTotal(r.data.data.total); setPages(r.data.data.pages); })
      .catch(()=>setItems([]))
      .finally(()=>setLoading(false));
  }, [page]);

  return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ fontWeight:800, fontSize:'1.4rem', color:'#fff', marginBottom:3 }}>{t('admin.volunteers')}</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{total} {isBn?'নিবন্ধিত স্বেচ্ছাসেবক':'registered volunteers'}</p>
      </div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>{isBn?'স্বেচ্ছাসেবক':'Volunteer'}</th>
                <th>{isBn?'বিভাগ':'Category'}</th>
                <th>{isBn?'দক্ষতা':'Skills'}</th>
                <th>{isBn?'এলাকা':'Location'}</th>
                <th>{isBn?'উপলব্ধতা':'Availability'}</th>
                <th>{isBn?'স্ট্যাটাস':'Status'}</th>
                <th>{isBn?'তারিখ':'Date'}</th>
              </tr></thead>
              <tbody>
                {items.map(v => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--grad-cyan)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:800, color:'#fff' }}>
                          {v.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight:600, color:'#fff', fontSize:'0.85rem' }}>{v.name}</div>
                          <div style={{ fontSize:'0.72rem', color:'var(--text-dim)' }}>{v.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-green">{v.category}</span></td>
                    <td style={{ fontSize:'0.78rem', color:'var(--text-muted)', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.skills||'—'}</td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{v.district||'—'}</td>
                    <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{v.availability||'—'}</td>
                    <td><span className={`badge ${v.is_active?'badge-green':'badge-gray'}`}>{v.is_active?t('common.active'):t('common.inactive')}</span></td>
                    <td style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>{new Date(v.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {items.length===0 && <tr><td colSpan={7} style={{ textAlign:'center', padding:'2.5rem', color:'var(--text-dim)' }}>{t('common.noResults')}</td></tr>}
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
