import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiSearch, FiUploadCloud } from 'react-icons/fi';
import BulkImportModal from '../../components/admin/BulkImportModal';

const DIVS = ['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'];
const BLANK = { name:'', area:'', district:'', division:'', phone:'', hours:'', is_24h:false, is_verified:false, is_active:true };

export default function AdminPharmacy() {
  const { isBn } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit:15, ...(search && { search }) });
      const { data } = await api.get(`/admin/pharmacies?${q}`);
      setItems(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setItems([]); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, [page]); // eslint-disable-line

  const openAdd  = () => { setForm(BLANK); setEditing(null); setShowForm(true); };
  const openEdit = (it) => { setForm({...it, is_24h:!!it.is_24h, is_verified:!!it.is_verified, is_active:!!it.is_active}); setEditing(it.id); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Name required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/pharmacies/${editing}`, form);
        toast.success('Updated');
        setItems(i => i.map(x => x.id===editing ? {...x,...form} : x));
      } else {
        const { data } = await api.post('/admin/pharmacies', form);
        toast.success('Created');
        setItems(i => [data.data,...i]);
        setTotal(t => t+1);
      }
      setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/admin/pharmacies/${id}`); toast.success('Deleted'); setItems(i=>i.filter(x=>x.id!==id)); setTotal(t=>t-1); }
    catch { toast.error('Failed'); }
  };

  const F = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
        <div>
          <h1 style={{fontWeight:800,fontSize:'1.4rem',color:'#fff',marginBottom:3}}>💊 {isBn?'ফার্মেসি ব্যবস্থাপনা':'Pharmacy Management'}</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{total} {isBn?'মোট ফার্মেসি':'total pharmacies'}</p>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <form onSubmit={e=>{e.preventDefault();setPage(1);fetchData();}} style={{display:'flex',gap:6}}>
            <div style={{position:'relative'}}>
              <FiSearch style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-dim)'}} size={13}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={isBn?'খুঁজুন...':'Search...'} className="form-input" style={{paddingLeft:30,height:36,fontSize:'0.83rem',minWidth:180}}/>
            </div>
            <button type="submit" className="btn btn-ghost btn-sm">Go</button>
          </form>
          <button onClick={() => setShowImport(true)} className="btn btn-ghost btn-sm" style={{ border:'1px solid var(--border)' }}><FiUploadCloud size={13}/>{isBn ? 'ইমপোর্ট' : 'Import'}</button>
          <button onClick={openAdd} className="btn btn-primary btn-sm"><FiPlus size={13}/>{isBn?'যোগ করুন':'Add Pharmacy'}</button>
        </div>
      </div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
        {loading ? <div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><div className="spinner"/></div> : (
          <div className="table-wrap"><table>
            <thead><tr>
              <th>{isBn?'নাম':'Name'}</th><th>{isBn?'এলাকা':'Area'}</th><th>{isBn?'জেলা':'District'}</th>
              <th>{isBn?'ফোন':'Phone'}</th><th>24/7</th><th>Status</th><th>{isBn?'কার্যক্রম':'Actions'}</th>
            </tr></thead>
            <tbody>
              {items.map(p=>(
                <tr key={p.id}>
                  <td><div style={{fontWeight:600,color:'var(--text-strong)',fontSize:'0.85rem'}}>{p.name}</div>{p.is_verified&&<span style={{fontSize:'0.68rem',color:'var(--green)'}}>✓ verified</span>}</td>
                  <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{p.area||'—'}</td>
                  <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{p.district||'—'}</td>
                  <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{p.phone||'—'}</td>
                  <td><span className={`badge ${p.is_24h?'badge-cyan':'badge-gray'}`}>{p.is_24h?'24h':'No'}</span></td>
                  <td><span className={`badge ${p.is_active?'badge-green':'badge-gray'}`}>{p.is_active?'Active':'Inactive'}</span></td>
                  <td><div style={{display:'flex',gap:5}}>
                    <button onClick={()=>openEdit(p)} style={{width:28,height:28,borderRadius:7,border:'1px solid rgba(6,182,212,0.3)',background:'transparent',color:'var(--cyan)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiEdit2 size={12}/></button>
                    <button onClick={()=>deleteItem(p.id,p.name)} style={{width:28,height:28,borderRadius:7,border:'1px solid rgba(230,57,70,0.2)',background:'transparent',color:'var(--red)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiTrash2 size={12}/></button>
                  </div></td>
                </tr>
              ))}
              {items.length===0&&<tr><td colSpan={7} style={{textAlign:'center',padding:'2.5rem',color:'var(--text-dim)'}}>💊 {isBn?'কোনো ফার্মেসি নেই':'No pharmacies found'}</td></tr>}
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
          <div style={{position:'relative',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:20,width:'100%',maxWidth:520,padding:'2rem',maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <h2 style={{fontWeight:800,fontSize:'1.1rem',color:'#fff'}}>{editing?(isBn?'সম্পাদনা':'Edit Pharmacy'):(isBn?'নতুন ফার্মেসি':'Add Pharmacy')}</h2>
              <button onClick={()=>setShowForm(false)} style={{width:28,height:28,borderRadius:7,border:'1px solid var(--border)',background:'transparent',color:'var(--text-muted)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiX size={13}/></button>
            </div>
            <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:'0.9rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">{isBn?'নাম':'Name'} *</label><input value={form.name} onChange={e=>F('name',e.target.value)} className="form-input" placeholder="Pharmacy name" required/></div>
                <div className="form-group"><label className="form-label">{isBn?'এলাকা':'Area'}</label><input value={form.area} onChange={e=>F('area',e.target.value)} className="form-input" placeholder="Mirpur, Dhaka"/></div>
                <div className="form-group"><label className="form-label">{isBn?'ফোন':'Phone'}</label><input value={form.phone} onChange={e=>F('phone',e.target.value)} className="form-input" placeholder="017XXXXXXXX"/></div>
                <div className="form-group"><label className="form-label">{isBn?'জেলা':'District'}</label><input value={form.district} onChange={e=>F('district',e.target.value)} className="form-input" placeholder="Dhaka"/></div>
                <div className="form-group"><label className="form-label">{isBn?'বিভাগ':'Division'}</label>
                  <select value={form.division} onChange={e=>F('division',e.target.value)} className="form-select">
                    <option value="">{isBn?'বেছে নিন':'Select'}</option>
                    {DIVS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">{isBn?'সময়সূচি':'Opening Hours'}</label><input value={form.hours} onChange={e=>F('hours',e.target.value)} className="form-input" placeholder="Sat–Thu 8am–10pm"/></div>
              </div>
              <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap'}}>
                {[{field:'is_24h',label:isBn?'২৪ ঘণ্টা খোলা':'Open 24h'},{field:'is_verified',label:isBn?'যাচাইকৃত':'Verified'},{field:'is_active',label:isBn?'সক্রিয়':'Active'}].map(({field,label})=>(
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
        table="pharmacies" 
        onImportSuccess={() => { setPage(1); fetchData(); }} 
      />
    </div>
  );
}
