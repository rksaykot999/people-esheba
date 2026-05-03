import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiSearch, FiExternalLink, FiUploadCloud } from 'react-icons/fi';
import BulkImportModal from '../../components/admin/BulkImportModal';

const CATS = ['govt','education','job','health','general'];
const BLANK = { title:'', category:'general', source:'', link:'', description:'', is_active:true };

export default function AdminNotices() {
  const { isBn } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit:15, ...(search&&{search}), ...(catFilter&&{category:catFilter}) });
      const { data } = await api.get(`/admin/notices?${q}`);
      setItems(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setItems([]); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, [page, catFilter]); // eslint-disable-line

  const openAdd  = () => { setForm(BLANK); setEditing(null); setShowForm(true); };
  const openEdit = (it) => { setForm({...it, is_active:!!it.is_active}); setEditing(it.id); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/notices/${editing}`, form);
        toast.success('Updated');
        setItems(i=>i.map(x=>x.id===editing?{...x,...form}:x));
      } else {
        const { data } = await api.post('/admin/notices', form);
        toast.success('Notice created');
        setItems(i=>[data.data,...i]);
        setTotal(t=>t+1);
      }
      setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try { await api.delete(`/admin/notices/${id}`); toast.success('Deleted'); setItems(i=>i.filter(x=>x.id!==id)); setTotal(t=>t-1); }
    catch { toast.error('Failed'); }
  };

  const F = (k,v) => setForm(f=>({...f,[k]:v}));
  const CAT_COLOR = { govt:'badge-red', education:'badge-cyan', job:'badge-green', health:'badge-amber', general:'badge-gray' };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
        <div>
          <h1 style={{fontWeight:800,fontSize:'1.4rem',color:'#fff',marginBottom:3}}>📢 {isBn?'নোটিশ ব্যবস্থাপনা':'Notices Management'}</h1>
          <p style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{total} {isBn?'মোট নোটিশ':'total notices'}</p>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:6}}>
            {['','govt','education','job','health','general'].map(c=>(
              <button key={c} onClick={()=>{setCatFilter(c);setPage(1);}} className={`btn btn-sm ${catFilter===c?'btn-primary':'btn-ghost'}`}>{c||'All'}</button>
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
          <button onClick={openAdd} className="btn btn-primary btn-sm"><FiPlus size={13}/>{isBn?'যোগ করুন':'Add Notice'}</button>
        </div>
      </div>

      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden'}}>
        {loading?<div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><div className="spinner"/></div>:(
          <div className="table-wrap"><table>
            <thead><tr>
              <th>{isBn?'শিরোনাম':'Title'}</th><th>{isBn?'বিভাগ':'Category'}</th>
              <th>{isBn?'উৎস':'Source'}</th><th>Status</th><th>{isBn?'তারিখ':'Date'}</th><th>{isBn?'কার্যক্রম':'Actions'}</th>
            </tr></thead>
            <tbody>
              {items.map(n=>(
                <tr key={n.id}>
                  <td style={{maxWidth:220}}>
                    <div style={{fontWeight:600,color:'var(--text-strong)',fontSize:'0.85rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.title}</div>
                    {n.link&&<a href={n.link} target="_blank" rel="noreferrer" style={{fontSize:'0.68rem',color:'var(--cyan)',display:'flex',alignItems:'center',gap:3}}><FiExternalLink size={9}/>View link</a>}
                  </td>
                  <td><span className={`badge ${CAT_COLOR[n.category]||'badge-gray'}`}>{n.category}</span></td>
                  <td style={{fontSize:'0.78rem',color:'var(--text-muted)',maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.source||'—'}</td>
                  <td><span className={`badge ${n.is_active?'badge-green':'badge-gray'}`}>{n.is_active?'Active':'Hidden'}</span></td>
                  <td style={{fontSize:'0.78rem',color:'var(--text-dim)'}}>{new Date(n.created_at).toLocaleDateString()}</td>
                  <td><div style={{display:'flex',gap:5}}>
                    <button onClick={()=>openEdit(n)} style={{width:28,height:28,borderRadius:7,border:'1px solid rgba(6,182,212,0.3)',background:'transparent',color:'var(--cyan)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiEdit2 size={12}/></button>
                    <button onClick={()=>deleteItem(n.id,n.title)} style={{width:28,height:28,borderRadius:7,border:'1px solid rgba(230,57,70,0.2)',background:'transparent',color:'var(--red)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiTrash2 size={12}/></button>
                  </div></td>
                </tr>
              ))}
              {items.length===0&&<tr><td colSpan={6} style={{textAlign:'center',padding:'2.5rem',color:'var(--text-dim)'}}>📢 {isBn?'কোনো নোটিশ নেই':'No notices found'}</td></tr>}
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
              <h2 style={{fontWeight:800,fontSize:'1.1rem',color:'#fff'}}>{editing?(isBn?'নোটিশ সম্পাদনা':'Edit Notice'):(isBn?'নতুন নোটিশ':'New Notice')}</h2>
              <button onClick={()=>setShowForm(false)} style={{width:28,height:28,borderRadius:7,border:'1px solid var(--border)',background:'transparent',color:'var(--text-muted)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><FiX size={13}/></button>
            </div>
            <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:'0.9rem'}}>
              <div className="form-group"><label className="form-label">{isBn?'শিরোনাম':'Title'} *</label>
                <input value={form.title} onChange={e=>F('title',e.target.value)} className="form-input" placeholder="Notice title..." required/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                <div className="form-group"><label className="form-label">{isBn?'বিভাগ':'Category'}</label>
                  <select value={form.category} onChange={e=>F('category',e.target.value)} className="form-select">
                    {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">{isBn?'উৎস':'Source'}</label>
                  <input value={form.source} onChange={e=>F('source',e.target.value)} className="form-input" placeholder="Govt website, BUET, etc."/>
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">{isBn?'লিঙ্ক':'Link (URL)'}</label>
                  <input value={form.link} onChange={e=>F('link',e.target.value)} className="form-input" placeholder="https://..."/>
                </div>
              </div>
              <div className="form-group"><label className="form-label">{isBn?'বিবরণ':'Description'}</label>
                <textarea value={form.description} onChange={e=>F('description',e.target.value)} className="form-textarea" rows={3} placeholder="Optional details..."/>
              </div>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'0.85rem',color:'var(--text-muted)'}}>
                <input type="checkbox" checked={!!form.is_active} onChange={e=>F('is_active',e.target.checked)} style={{width:15,height:15,accentColor:'var(--green)'}}/>
                {isBn?'সক্রিয় (প্রকাশিত)':'Active (Published)'}
              </label>
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
        table="notices" 
        onImportSuccess={() => { setPage(1); fetchData(); }} 
      />
    </div>
  );
}
