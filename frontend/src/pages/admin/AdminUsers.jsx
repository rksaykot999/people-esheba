import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiSearch, FiShield, FiTrash2, FiLock, FiUnlock, FiUser } from 'react-icons/fi';

export default function AdminUsers() {
  const { t, isBn } = useLang();
  const { user: me } = useAuth();
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);
  const [search, setSearch] = useState('');
  const [roleF, setRoleF]   = useState('');
  const [statusF, setStatusF] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit:20, ...(search&&{search}), ...(roleF&&{role:roleF}), ...(statusF&&{status:statusF}) });
      const { data } = await api.get(`/admin/users?${q}`);
      setUsers(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setUsers([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, roleF, statusF]); // eslint-disable-line

  const toggleUser = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle`);
      toast.success(data.message);
      setUsers(u => u.map(x => x.id===id ? {...x, is_active: data.data.is_active?1:0} : x));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      toast.success('Role updated');
      setUsers(u => u.map(x => x.id===id ? {...x, role} : x));
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers(u => u.filter(x => x.id !== id));
      setTotal(t => t - 1);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <h1 style={{ fontWeight:800, fontSize:'1.4rem', color:'#fff', marginBottom:3 }}>{t('admin.users')}</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{total} {isBn?'মোট ব্যবহারকারী':'total users'}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:'1.25rem', flexWrap:'wrap' }}>
        <form onSubmit={e=>{e.preventDefault();setPage(1);fetchUsers();}} style={{ display:'flex', gap:8, flex:1, minWidth:200 }}>
          <div style={{ flex:1, position:'relative' }}>
            <FiSearch style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)', pointerEvents:'none' }} size={14}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={isBn?'নাম বা ইমেইল...':'Search name or email...'} className="form-input" style={{ paddingLeft:34 }}/>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">{t('common.search')}</button>
        </form>
        <select value={roleF} onChange={e=>{setRoleF(e.target.value);setPage(1);}} className="form-select" style={{ width:'auto', minWidth:120 }}>
          <option value="">{isBn?'সব ভূমিকা':'All Roles'}</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select value={statusF} onChange={e=>{setStatusF(e.target.value);setPage(1);}} className="form-select" style={{ width:'auto', minWidth:130 }}>
          <option value="">{isBn?'সব স্ট্যাটাস':'All Status'}</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{isBn?'ব্যবহারকারী':'User'}</th>
                  <th>{isBn?'যোগাযোগ':'Contact'}</th>
                  <th>{isBn?'এলাকা':'Location'}</th>
                  <th>{isBn?'ভূমিকা':'Role'}</th>
                  <th>{isBn?'স্ট্যাটাস':'Status'}</th>
                  <th>{isBn?'যোগদান':'Joined'}</th>
                  <th>{isBn?'কার্যক্রম':'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--grad-cyan)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:800, color:'#fff', flexShrink:0 }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight:600, color:'#fff', fontSize:'0.85rem' }}>{u.name}</div>
                          {u.is_verified && <span style={{ fontSize:'0.68rem', color:'var(--cyan)' }}>✓ verified</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>
                      <div>{u.email}</div>
                      {u.phone && <div style={{ color:'var(--text-dim)' }}>{u.phone}</div>}
                    </td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{u.district||'—'}{u.division&&`, ${u.division}`}</td>
                    <td>
                      <select value={u.role} onChange={e=>changeRole(u.id, e.target.value)} disabled={u.id===me?.id}
                        style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:7, color: u.role==='admin'?'var(--red)':'var(--text-muted)', fontSize:'0.78rem', padding:'4px 8px', cursor:'pointer' }}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${u.is_active?'badge-green':'badge-red'}`}>{u.is_active?t('common.active'):t('common.inactive')}</span>
                    </td>
                    <td style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display:'flex', gap:5 }}>
                        {u.id !== me?.id && (
                          <>
                            <button onClick={()=>toggleUser(u.id)} title={u.is_active?'Block':'Unblock'} style={{ width:30, height:30, borderRadius:7, border:`1px solid ${u.is_active?'rgba(230,57,70,0.3)':'rgba(16,185,129,0.3)'}`, background:'transparent', color:u.is_active?'var(--red)':'var(--green)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                              {u.is_active?<FiLock size={13}/>:<FiUnlock size={13}/>}
                            </button>
                            <button onClick={()=>deleteUser(u.id, u.name)} title="Delete" style={{ width:30, height:30, borderRadius:7, border:'1px solid rgba(230,57,70,0.2)', background:'transparent', color:'var(--red)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                              <FiTrash2 size={13}/>
                            </button>
                          </>
                        )}
                        {u.id === me?.id && <span style={{ fontSize:'0.72rem', color:'var(--text-dim)' }}>You</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign:'center', padding:'2.5rem', color:'var(--text-dim)' }}>{t('common.noResults')}</td></tr>
                )}
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
