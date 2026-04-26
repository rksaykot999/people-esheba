import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2, FiEye } from 'react-icons/fi';

export default function AdminDonations() {
  const { t, isBn } = useLang();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);
  const [statusF, setStatusF] = useState('pending');

  const fetch = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit:15, ...(statusF&&statusF!=='all'&&{status:statusF}) });
      const { data } = await api.get(`/admin/donations?${q}`);
      setItems(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, statusF]); // eslint-disable-line

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/donations/${id}`, { status });
      toast.success(`Donation ${status}`);
      setItems(i => i.map(x => x.id===id ? {...x, status} : x));
    } catch { toast.error('Failed'); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this donation request?')) return;
    try {
      await api.delete(`/admin/donations/${id}`);
      toast.success('Deleted');
      setItems(i => i.filter(x => x.id!==id));
      setTotal(t => t-1);
    } catch { toast.error('Failed'); }
  };

  const S_COLOR = { pending:'badge-amber', approved:'badge-green', rejected:'badge-red', completed:'badge-cyan' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <h1 style={{ fontWeight:800, fontSize:'1.4rem', color:'#fff', marginBottom:3 }}>{t('admin.donations')}</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{total} {isBn?'মোট অনুরোধ':'total requests'}</p>
        </div>
        <div style={{ display:'flex', gap:7 }}>
          {['all','pending','approved','rejected','completed'].map(s => (
            <button key={s} onClick={()=>{setStatusF(s);setPage(1);}} className={`btn btn-sm ${statusF===s?'btn-primary':'btn-ghost'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>{isBn?'শিরোনাম':'Title'}</th>
                <th>{isBn?'পোস্টকারী':'Posted By'}</th>
                <th>{isBn?'বিভাগ':'Category'}</th>
                <th>{isBn?'লক্ষ্য':'Target'}</th>
                <th>{isBn?'সংগ্রহ':'Raised'}</th>
                <th>{isBn?'স্ট্যাটাস':'Status'}</th>
                <th>{isBn?'তারিখ':'Date'}</th>
                <th>{isBn?'কার্যক্রম':'Actions'}</th>
              </tr></thead>
              <tbody>
                {items.map(d => (
                  <tr key={d.id}>
                    <td style={{ maxWidth:180 }}>
                      <div style={{ fontWeight:600, color:'#fff', fontSize:'0.85rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.title}</div>
                      {d.is_urgent && <span className="badge badge-red" style={{ fontSize:'0.65rem', marginTop:3 }}>⚡ URGENT</span>}
                    </td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>
                      <div>{d.poster_name}</div>
                      <div style={{ color:'var(--text-dim)', fontSize:'0.72rem' }}>{d.poster_email}</div>
                    </td>
                    <td><span className="badge badge-gray">{d.category}</span></td>
                    <td style={{ color:'var(--text-muted)', fontSize:'0.83rem' }}>৳{Number(d.amount_needed).toLocaleString()}</td>
                    <td style={{ color:'var(--green)', fontWeight:600, fontSize:'0.83rem' }}>৳{Number(d.amount_raised).toLocaleString()}</td>
                    <td><span className={`badge ${S_COLOR[d.status]||'badge-gray'}`}>{d.status}</span></td>
                    <td style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>{new Date(d.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display:'flex', gap:5 }}>
                        {d.status === 'pending' && <>
                          <button onClick={()=>updateStatus(d.id,'approved')} title="Approve" style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(16,185,129,0.3)', background:'transparent', color:'var(--green)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><FiCheck size={13}/></button>
                          <button onClick={()=>updateStatus(d.id,'rejected')} title="Reject"  style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(230,57,70,0.3)', background:'transparent', color:'var(--red)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><FiX size={13}/></button>
                        </>}
                        {d.status === 'approved' && (
                          <button onClick={()=>updateStatus(d.id,'completed')} title="Mark Complete" style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(6,182,212,0.3)', background:'transparent', color:'var(--cyan)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:700 }}>✓</button>
                        )}
                        <button onClick={()=>deleteItem(d.id)} title="Delete" style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(230,57,70,0.2)', background:'transparent', color:'var(--red)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><FiTrash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length===0 && <tr><td colSpan={8} style={{ textAlign:'center', padding:'2.5rem', color:'var(--text-dim)' }}>{t('common.noResults')}</td></tr>}
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
