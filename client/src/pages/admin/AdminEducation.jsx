import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiSearch, FiUploadCloud } from 'react-icons/fi';
import BulkImportModal from '../../components/admin/BulkImportModal';

const TYPES = ['school','college','university'];
const DIVS = ['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'];
const BLANK = { name:'', type:'school', district:'', division:'', address:'', phone:'', website:'', description:'', is_verified:false, is_active:true };

export default function AdminEducation() {
  const { isBn } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit:15, ...(search&&{search}), ...(typeFilter&&{type:typeFilter}) });
      const { data } = await api.get(`/admin/education?${q}`);
      setItems(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setItems([]); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, [page, typeFilter]); // eslint-disable-line

  const openAdd  = () => { setForm(BLANK); setEditing(null); setShowForm(true); };
  const openEdit = (it) => { setForm({...it, is_verified:!!it.is_verified, is_active:!!it.is_active}); setEditing(it.id); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Name required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/education/${editing}`, form);
        toast.success('Updated');
        setItems(i=>i.map(x=>x.id===editing?{...x,...form}:x));
      } else {
        const { data } = await api.post('/admin/education', form);
        toast.success('Created');
        setItems(i=>[data.data,...i]);
        setTotal(t=>t+1);
      }
      setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/admin/education/${id}`); toast.success('Deleted'); setItems(i=>i.filter(x=>x.id!==id)); setTotal(t=>t-1); }
    catch { toast.error('Failed'); }
  };

  const F = (k,v) => setForm(f=>({...f,[k]:v}));
  const TYPE_ICON = { school:'🏫', college:'🏛️', university:'🎓' };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
        <div>
          <h1 style={{fontWeight:800,fontSize:'1.4rem',color:'#fff',marginBottom:3}}>🎓 {isBn?'শিক্ষা প্রতিষ্ঠান ব্যবস্থাপনা':'Education Management'}</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{total} {isBn?'মোট প্রতিষ্ঠান':'total institutions'}</p>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:5}}>
            {['','school','college','university'].map(t=>(
              <button key={t} onClick={()=>{setTypeFilter(t);setPage(1);}} className={`btn btn-sm ${typeFilter===t?'btn-primary':'btn-ghost'}`}>{t?TYPE_ICON[t]+' '+t:'All'}</button>
            ))}
          </div>
          <form onSubmit={e=>{e.preventDefault();setPage(1);fetchData();}} style={{display:'flex',gap:6}}>
            <div style={{position:'relative'}}>
              <FiSearch style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-dim)'}} size={13}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={isBn?'খুঁজুন...':'Search...'} className="form-input" style={{paddingLeft:30,height:36,fontSize:'0.83rem',minWidth:160}}/>
            </div>
            <button type="submit" className="btn btn-ghost btn-sm">Go</button>
          </form>
          <button onClick={() => setShowImport(true)} className="btn btn-ghost btn-sm" style={{ border:'1px solid var(--border)' }}><FiUploadCloud size={13}/>{isBn ? 'ইমপোর্ট' : 'Import'}</button>
          <button onClick={openAdd} className="btn btn-primary btn-sm"><FiPlus size={13}/>{isBn?'যোগ করুন':'Add'}</button>
        </div>
      </div>

      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
        {loading?<div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><div className="spinner"/></div>:(
          <div className="table-wrap"><table>
            <thead><tr>
              <th>{isBn?'নাম':'Name'}</th><th>{isBn?'ধরন':'Type'}</th>
              <th>{isBn?'জেলা':'District'}</th><th>{isBn?'ফোন':'Phone'}</th>
              <th>Status</th><th>{isBn?'কার্যক্রম':'Actions'}</th>
            </tr></thead>
            <tbody>
              {items.map(it=>(
                <tr key={it.id}>
                  <td>
                    <div style={{fontWeight:600,color:'var(--text-strong)',fontSize:'0.85rem'}}>{it.name}</div>
                    {it.is_verified&&<span style={{fontSize:'0.68rem',color:'var(--green)'}}>✓ verified</span>}
                    {it.website&&<div style={{fontSize:'0.68rem',color:'var(--cyan)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:140}}>{it.website}</div>}
                  </td>
                  <td><span className="badge badge-cyan">{TYPE_ICON[it.type]} {it.type}</span></td>
                  <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{it.district||'—'}{it.division&&`, ${it.division}`}</td>
                  <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{it.phone||'—'}</td>
                  <td><span className={`badge ${it.is_active?'badge-green':'badge-gray'}`}>{it.is_active?'Active':'Inactive'}</span></td>
                  <td><div style={{display:'flex',gap:5}}>
                    <button onClick={()=>openEdit(it)} style={{width:28,height:28,borderRadius:7,border:'1px solid rgba(6,182,212,0.3)',background:'transparent',color:'var(--cyan)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiEdit2 size={12}/></button>
                    <button onClick={()=>deleteItem(it.id,it.name)} style={{width:28,height:28,borderRadius:7,border:'1px solid rgba(230,57,70,0.2)',background:'transparent',color:'var(--red)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiTrash2 size={12}/></button>
                  </div></td>
                </tr>
              ))}
              {items.length===0&&<tr><td colSpan={6} style={{textAlign:'center',padding:'2.5rem',color:'var(--text-dim)'}}>🎓 {isBn?'কোনো প্রতিষ্ঠান নেই':'No institutions found'}</td></tr>}
            </tbody>
          </table></div>
        )}
      </div>

      {pages>1&&<div className="pagination">
        <button className="page-btn" onClick={()=>setPage(p=>p-1)} disabled={page===1}>‹</button>
        {Array.from({length:Math.min(5,pages)},(_,i)=>i+Math.max(1,page-2)).filter(p=>p<=pages).map(p=>(
          <button key={p} className={`page-btn${p===page?' active':''}`} onClick={()=>setPage(p)}>{p}</button>
        ))}
        <button className="page-btn" onClick={()=>setPage(p=>p+1)} disabled={page===pages}>›</button>
      </div>}

      {showForm&&(
        <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
          <div onClick={()=>setShowForm(false)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(6px)'}}/>
          <div style={{position:'relative',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:20,width:'100%',maxWidth:560,padding:'2rem',maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <h2 style={{fontWeight:800,fontSize:'1.1rem',color:'#fff'}}>{editing?(isBn?'সম্পাদনা':'Edit'):(isBn?'নতুন প্রতিষ্ঠান':'New Institution')}</h2>
              <button onClick={()=>setShowForm(false)} style={{width:28,height:28,borderRadius:7,border:'1px solid var(--border)',background:'transparent',color:'var(--text-muted)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiX size={13}/></button>
            </div>
            <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:'0.9rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">{isBn?'নাম':'Name'} *</label>
                  <input value={form.name} onChange={e=>F('name',e.target.value)} className="form-input" placeholder="Institution name" required/>
                </div>
                <div className="form-group"><label className="form-label">{isBn?'ধরন':'Type'}</label>
                  <select value={form.type} onChange={e=>F('type',e.target.value)} className="form-select">
                    {TYPES.map(t=><option key={t} value={t}>{TYPE_ICON[t]} {t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">{isBn?'ফোন':'Phone'}</label>
                  <input value={form.phone} onChange={e=>F('phone',e.target.value)} className="form-input" placeholder="02-XXXXXXX"/>
                </div>
                <div className="form-group"><label className="form-label">{isBn?'জেলা':'District'}</label>
                  <input value={form.district} onChange={e=>F('district',e.target.value)} className="form-input" placeholder="Dhaka"/>
                </div>
                <div className="form-group"><label className="form-label">{isBn?'বিভাগ':'Division'}</label>
                  <select value={form.division} onChange={e=>F('division',e.target.value)} className="form-select">
                    <option value="">{isBn?'বেছে নিন':'Select'}</option>
                    {DIVS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">{isBn?'ঠিকানা':'Address'}</label>
                  <input value={form.address} onChange={e=>F('address',e.target.value)} className="form-input" placeholder="Full address"/>
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Website</label>
                  <input value={form.website} onChange={e=>F('website',e.target.value)} className="form-input" placeholder="https://..."/>
                </div>
              </div>
              <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap'}}>
                {[{field:'is_verified',label:isBn?'যাচাইকৃত':'Verified'},{field:'is_active',label:isBn?'সক্রিয়':'Active'}].map(({field,label})=>(
                  <label key={field} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'0.85rem',color:'var(--text-muted)'}}>
                    <input type="checkbox" checked={!!form[field]} onChange={e=>F(field,e.target.checked)} style={{width:15,height:15,accentColor:'var(--green)'}}/>{label}
                  </label>
                ))}
              </div>
              <div style={{display:'flex',gap:10,marginTop:4}}>
                <button type="submit" className="btn btn-primary" style={{flex:1,justifyContent:'center'}} disabled={saving}>{saving?<div className="spinner spinner-sm"/>:<><FiSave size={13}/>{isBn?'সংরক্ষণ':'Save'}</>}</button>
                <button type="button" onClick={()=>setShowForm(false)} className="btn btn-ghost" style={{flex:1,justifyContent:'center'}}>{isBn?'বাতিল':'Cancel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BulkImportModal 
        isOpen={showImport} 
        onClose={() => setShowImport(false)} 
        table="education_institutions" 
        onImportSuccess={() => { setPage(1); fetchData(); }} 
      />
    </div>
  );
}
