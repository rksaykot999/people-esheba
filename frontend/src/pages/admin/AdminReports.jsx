import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiCheck } from 'react-icons/fi';

export default function AdminReports() {
  const { t, isBn } = useLang();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/reports').then(r=>setItems(r.data.data)).catch(()=>[]).finally(()=>setLoading(false));
  }, []);

  const resolve = async (id) => {
    try {
      await api.put(`/admin/reports/${id}/resolve`);
      toast.success('Resolved');
      setItems(i => i.map(x => x.id===id ? {...x, status:'resolved'} : x));
    } catch { toast.error('Failed'); }
  };

  const S_COLOR = { pending:'badge-amber', reviewed:'badge-cyan', resolved:'badge-green' };

  return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ fontWeight:800, fontSize:'1.4rem', color:'#fff', marginBottom:3 }}>{t('admin.reports')}</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{items.filter(r=>r.status==='pending').length} {isBn?'অপেক্ষমান':'pending'}</p>
      </div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>{isBn?'রিপোর্টকারী':'Reporter'}</th>
                <th>{isBn?'বিষয়':'Entity'}</th>
                <th>{isBn?'কারণ':'Reason'}</th>
                <th>{isBn?'স্ট্যাটাস':'Status'}</th>
                <th>{isBn?'তারিখ':'Date'}</th>
                <th>{isBn?'কার্যক্রম':'Actions'}</th>
              </tr></thead>
              <tbody>
                {items.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight:600, color:'#fff', fontSize:'0.85rem' }}>{r.reporter_name}</td>
                    <td><span className="badge badge-gray">{r.entity_type} #{r.entity_id}</span></td>
                    <td style={{ fontSize:'0.82rem', color:'var(--text-muted)', maxWidth:220 }}>{r.reason}</td>
                    <td><span className={`badge ${S_COLOR[r.status]||'badge-gray'}`}>{r.status}</span></td>
                    <td style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      {r.status === 'pending' && (
                        <button onClick={()=>resolve(r.id)} className="btn btn-sm btn-ghost" style={{ color:'var(--green)', borderColor:'rgba(16,185,129,0.3)' }}>
                          <FiCheck size={13}/>{isBn?'সমাধান':'Resolve'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {items.length===0 && <tr><td colSpan={6} style={{ textAlign:'center', padding:'2.5rem', color:'var(--text-dim)' }}>✅ {isBn?'কোনো রিপোর্ট নেই':'No reports'}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
