import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiEye, FiUsers } from 'react-icons/fi';

export default function AdminJobs() {
  const { t, isBn } = useLang();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/jobs?page=${page}&limit=15`);
      setItems(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]); // eslint-disable-line

  const deleteJob = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      toast.success('Job deleted');
      setItems(i => i.filter(x => x.id!==id));
      setTotal(t => t-1);
    } catch { toast.error('Failed'); }
  };

  const TYPE_COLOR = { 'full-time':'var(--green)', 'part-time':'var(--cyan)', 'freelance':'var(--purple)', 'internship':'var(--amber)', 'govt':'var(--red)' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontWeight:800, fontSize:'1.4rem', color:'#fff', marginBottom:3 }}>{t('admin.jobs')}</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{total} {isBn?'মোট চাকরি':'total jobs'}</p>
        </div>
      </div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>{isBn?'পদ':'Position'}</th>
                <th>{isBn?'প্রতিষ্ঠান':'Company'}</th>
                <th>{isBn?'ধরন':'Type'}</th>
                <th>{isBn?'এলাকা':'Location'}</th>
                <th>{isBn?'আবেদনকারী':'Applicants'}</th>
                <th>{isBn?'দেখেছেন':'Views'}</th>
                <th>{isBn?'স্ট্যাটাস':'Status'}</th>
                <th>{isBn?'তারিখ':'Date'}</th>
                <th>{isBn?'কার্যক্রম':'Actions'}</th>
              </tr></thead>
              <tbody>
                {items.map(j => (
                  <tr key={j.id}>
                    <td>
                      <div style={{ fontWeight:600, color:'#fff', fontSize:'0.85rem' }}>{j.title}</div>
                      <div style={{ fontSize:'0.72rem', color:'var(--text-dim)', marginTop:1 }}>by {j.poster_name}</div>
                    </td>
                    <td style={{ fontSize:'0.83rem', color:'var(--text-muted)' }}>{j.company}</td>
                    <td><span className="badge" style={{ background:`${TYPE_COLOR[j.type]||'var(--green)'}18`, color:TYPE_COLOR[j.type]||'var(--green)' }}>{j.type}</span></td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{j.district||'—'}</td>
                    <td>
                      <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.83rem', color:'var(--cyan)' }}>
                        <FiUsers size={12}/>{j.applicants||0}
                      </span>
                    </td>
                    <td style={{ fontSize:'0.83rem', color:'var(--text-muted)' }}>{j.views}</td>
                    <td><span className={`badge ${j.status==='active'?'badge-green':'badge-gray'}`}>{j.status}</span></td>
                    <td style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>{new Date(j.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display:'flex', gap:5 }}>
                        <Link to={`/jobs/${j.id}`} target="_blank" style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(6,182,212,0.3)', background:'transparent', color:'var(--cyan)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <FiEye size={13}/>
                        </Link>
                        <button onClick={()=>deleteJob(j.id, j.title)} style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(230,57,70,0.2)', background:'transparent', color:'var(--red)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <FiTrash2 size={12}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length===0 && <tr><td colSpan={9} style={{ textAlign:'center', padding:'2.5rem', color:'var(--text-dim)' }}>{t('common.noResults')}</td></tr>}
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
