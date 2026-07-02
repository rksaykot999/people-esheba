import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiShield, FiDroplet, FiSearch, FiFilter } from 'react-icons/fi';

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

  const verifyDonor = async (id, name) => {
    try {
      await api.put(`/admin/blood-donors/${id}/verify`);
      toast.success(`${name} verified`);
      setItems(i => i.map(x => x.id===id ? {...x, is_verified:1} : x));
    } catch { toast.error('Failed'); }
  };

  const deleteItem = async (id, name) => {
    if (!window.confirm(`Remove ${name} as blood donor?`)) return;
    try {
      await api.delete(`/admin/blood-donors/${id}`);
      toast.success('Removed');
      setItems(i => i.filter(x => x.id!==id));
      setTotal(t => t-1);
    } catch { toast.error('Failed'); }
  };

  const BG_COLOR = { 'A+':'#E63946','A-':'#c1121f','B+':'#06B6D4','B-':'#0284c7','AB+':'#8B5CF6','AB-':'#6d28d9','O+':'#10B981','O-':'#059669' };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ display:'flex', alignItems:'center', gap:10, fontWeight:800, fontSize:'1.6rem', color:'var(--text-strong)', marginBottom:4 }}>
            <FiDroplet style={{ color:'#EF4444' }}/> {t('admin.blood')}
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>{total} {isBn?'নিবন্ধিত রক্তদাতার তালিকা':'total registered blood donors'}</p>
        </div>
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
                <th>{isBn?'কার্যক্রম':'Actions'}</th>
              </tr></thead>
              <tbody>
                {items.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight:600, color:'var(--text-strong)', fontSize:'0.85rem' }}>{d.name}</div>
                      <div style={{ fontSize:'0.72rem', color:'var(--text-dim)' }}>{d.email}</div>
                      {d.is_verified ? <span style={{ fontSize:'0.68rem', color:'var(--green)' }}>✓ verified</span> : null}
                    </td>
                    <td>
                      <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:40, height:40, borderRadius:'50%', background:BG_COLOR[d.blood_group]||'var(--red)', color:'var(--text-strong)', fontWeight:900, fontSize:'0.82rem', boxShadow:`0 0 12px ${BG_COLOR[d.blood_group]||'var(--red)'}44` }}>
                        {d.blood_group}
                      </span>
                    </td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{d.phone||'—'}</td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{d.district||'—'}{d.division&&`, ${d.division}`}</td>
                    <td style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>{d.last_donation ? new Date(d.last_donation).toLocaleDateString() : '—'}</td>
                    <td><span className={`badge ${d.is_available?'badge-green':'badge-gray'}`}>{d.is_available?t('common.available'):t('common.unavailable')}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:5 }}>
                        {!d.is_verified && (
                          <button onClick={() => verifyDonor(d.id, d.name)} title="Verify" style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(16,185,129,0.3)', background:'transparent', color:'var(--green)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <FiShield size={12}/>
                          </button>
                        )}
                        <button onClick={() => deleteItem(d.id, d.name)} title="Remove" style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(230,57,70,0.2)', background:'transparent', color:'var(--red)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <FiTrash2 size={12}/>
                        </button>
                      </div>
                    </td>
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
