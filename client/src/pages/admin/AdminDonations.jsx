import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2, FiEye, FiFilter, FiTrendingUp, FiHeart, FiClock, FiSearch } from 'react-icons/fi';
import { MdOutlineMedicalServices, MdOutlineSchool, MdOutlineAgriculture } from 'react-icons/md';

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
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ display:'flex', alignItems:'center', gap:10, fontWeight:800, fontSize:'1.6rem', color:'var(--text-strong)', marginBottom:4 }}>
            <FiHeart style={{ color:'#EF4444' }}/> {t('admin.donations')}
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>{total} {isBn?'মোট সাহায্যের অনুরোধ':'total help requests'}</p>
        </div>
        <div style={{ display:'flex', gap:6, background:'var(--surface)', padding:4, borderRadius:12, border:'1px solid var(--border)' }}>
          {['all','pending','approved','rejected','completed'].map(s => (
            <button key={s} onClick={()=>{setStatusF(s);setPage(1);}} 
              style={{ 
                padding:'6px 12px', borderRadius:8, border:'none', fontSize:'0.75rem', fontWeight:700,
                cursor:'pointer', transition:'all 0.2s',
                background: statusF===s ? 'var(--primary)' : 'transparent',
                color: statusF===s ? '#fff' : 'var(--text-muted)'
              }}>
              {s.toUpperCase()}
            </button>
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
                      <div style={{ fontWeight:600, color:'var(--text-strong)', fontSize:'0.85rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.title}</div>
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
                      <div style={{ display:'flex', gap:6 }}>
                        {d.status === 'pending' && <>
                          <button onClick={()=>updateStatus(d.id,'approved')} title="Approve Request" 
                            style={{ 
                              width:34, height:34, borderRadius:10, border:'1px solid var(--border)', 
                              background:'var(--surface-2)', color:'#10B981', 
                              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                              transition:'all 0.2s'
                            }}
                            onMouseEnter={e=>e.currentTarget.style.borderColor='#10B981'}
                            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                            <FiCheck size={15}/>
                          </button>
                          <button onClick={()=>updateStatus(d.id,'rejected')} title="Reject Request" 
                            style={{ 
                              width:34, height:34, borderRadius:10, border:'1px solid var(--border)', 
                              background:'var(--surface-2)', color:'#EF4444', 
                              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                              transition:'all 0.2s'
                            }}
                            onMouseEnter={e=>e.currentTarget.style.borderColor='#EF4444'}
                            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                            <FiX size={15}/>
                          </button>
                        </>}
                        {d.status === 'approved' && (
                          <button onClick={()=>updateStatus(d.id,'completed')} title="Mark as Completed" 
                            style={{ 
                              padding:'0 12px', height:34, borderRadius:10, border:'1px solid var(--border)', 
                              background:'var(--surface-2)', color:'var(--cyan)', 
                              cursor:'pointer', display:'flex', alignItems:'center', gap:6,
                              fontSize:'0.72rem', fontWeight:800, transition:'all 0.2s'
                            }}
                            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--cyan)'}
                            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                            <FiCheck size={14}/> DONE
                          </button>
                        )}
                        <button onClick={()=>deleteItem(d.id)} title="Delete Permanently" 
                          style={{ 
                            width:34, height:34, borderRadius:10, border:'1px solid var(--border)', 
                            background:'var(--surface-2)', color:'var(--text-dim)', 
                            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                            transition:'all 0.2s'
                          }}
                          onMouseEnter={e=>e.currentTarget.style.borderColor='#EF4444'}
                          onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                          <FiTrash2 size={14}/>
                        </button>
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
