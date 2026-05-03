import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiSearch, FiUploadCloud } from 'react-icons/fi';
import BulkImportModal from '../../components/admin/BulkImportModal';

const SPECIALTIES = ['Cardiologist','Pediatrician','Neurologist','Gynecologist','Medicine','Orthopedic','Ophthalmologist','ENT','Dermatologist','Psychiatrist','Dentist','Dermatology','General'];
const DIVS = ['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'];
const BLANK = { name:'', specialty:'Medicine', area:'', district:'', division:'', phone:'', hours:'', rating:'', is_verified:false, is_active:true };

export default function AdminDoctors() {
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
      const q = new URLSearchParams({ page, limit: 15, ...(search && { search }) });
      const { data } = await api.get(`/admin/doctors?${q}`);
      setItems(data.data.rows); setTotal(data.data.total); setPages(data.data.pages);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page]); // eslint-disable-line

  const openAdd  = () => { setForm(BLANK); setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setForm({ ...item, is_verified: !!item.is_verified, is_active: !!item.is_active }); setEditing(item.id); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.specialty) return toast.error('Name and specialty required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/doctors/${editing}`, form);
        toast.success('Updated');
        setItems(i => i.map(x => x.id === editing ? { ...x, ...form } : x));
      } else {
        const { data } = await api.post('/admin/doctors', form);
        toast.success('Doctor created');
        setItems(i => [data.data, ...i]);
        setTotal(t => t + 1);
      }
      setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/admin/doctors/${id}`);
      toast.success('Deleted');
      setItems(i => i.filter(x => x.id !== id));
      setTotal(t => t - 1);
    } catch { toast.error('Failed'); }
  };

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <h1 style={{ fontWeight:800, fontSize:'1.4rem', color:'#fff', marginBottom:3 }}>
            🩺 {isBn ? 'ডাক্তার ব্যবস্থাপনা' : 'Doctors Management'}
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{total} {isBn ? 'মোট ডাক্তার' : 'total doctors'}</p>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <form onSubmit={e => { e.preventDefault(); setPage(1); fetchData(); }} style={{ display:'flex', gap:6 }}>
            <div style={{ position:'relative' }}>
              <FiSearch style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)' }} size={13} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={isBn ? 'খুঁজুন...' : 'Search...'} className="form-input" style={{ paddingLeft:30, height:36, fontSize:'0.83rem', minWidth:180 }} />
            </div>
            <button type="submit" className="btn btn-ghost btn-sm">Go</button>
          </form>
          <button onClick={() => setShowImport(true)} className="btn btn-ghost btn-sm" style={{ border:'1px solid var(--border)' }}><FiUploadCloud size={13}/>{isBn ? 'ইমপোর্ট' : 'Import'}</button>
          <button onClick={openAdd} className="btn btn-primary btn-sm"><FiPlus size={13}/>{isBn ? 'যোগ করুন' : 'Add Doctor'}</button>
        </div>
      </div>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        {loading ? <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>{isBn ? 'নাম' : 'Name'}</th>
                <th>{isBn ? 'বিশেষজ্ঞতা' : 'Specialty'}</th>
                <th>{isBn ? 'এলাকা' : 'Area'}</th>
                <th>{isBn ? 'ফোন' : 'Phone'}</th>
                <th>{isBn ? 'সময়' : 'Hours'}</th>
                <th>{isBn ? 'রেটিং' : 'Rating'}</th>
                <th>Status</th>
                <th>{isBn ? 'কার্যক্রম' : 'Actions'}</th>
              </tr></thead>
              <tbody>
                {items.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight:600, color:'#fff', fontSize:'0.85rem' }}>{d.name}</div>
                      {d.is_verified ? <span style={{ fontSize:'0.68rem', color:'var(--green)' }}>✓ verified</span> : null}
                    </td>
                    <td><span className="badge badge-cyan" style={{ fontSize:'0.7rem' }}>{d.specialty}</span></td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{d.area || '—'}{d.district && `, ${d.district}`}</td>
                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{d.phone || '—'}</td>
                    <td style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>{d.hours || '—'}</td>
                    <td style={{ fontSize:'0.83rem', color:'var(--amber)', fontWeight:700 }}>{d.rating ? `⭐ ${d.rating}` : '—'}</td>
                    <td><span className={`badge ${d.is_active ? 'badge-green' : 'badge-gray'}`}>{d.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:5 }}>
                        <button onClick={() => openEdit(d)} style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(6,182,212,0.3)', background:'transparent', color:'var(--cyan)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><FiEdit2 size={12}/></button>
                        <button onClick={() => deleteItem(d.id, d.name)} style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(230,57,70,0.2)', background:'transparent', color:'var(--red)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><FiTrash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={8} style={{ textAlign:'center', padding:'2.5rem', color:'var(--text-dim)' }}>🩺 {isBn ? 'কোনো ডাক্তার নেই' : 'No doctors found'}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => p-1)} disabled={page===1}>‹</button>
          {Array.from({length:Math.min(5,pages)},(_,i)=>i+Math.max(1,page-2)).filter(p=>p<=pages).map(p=>(
            <button key={p} className={`page-btn${p===page?' active':''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => p+1)} disabled={page===pages}>›</button>
        </div>
      )}

      {showForm && (
        <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div onClick={() => setShowForm(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }}/>
          <div style={{ position:'relative', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, width:'100%', maxWidth:560, padding:'2rem', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontWeight:800, fontSize:'1.1rem', color:'#fff' }}>
                {editing ? (isBn ? 'ডাক্তার সম্পাদনা' : 'Edit Doctor') : (isBn ? 'নতুন ডাক্তার যোগ করুন' : 'Add New Doctor')}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ width:28, height:28, borderRadius:7, border:'1px solid var(--border)', background:'transparent', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><FiX size={13}/></button>
            </div>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div className="form-group" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">{isBn ? 'নাম' : 'Full Name'} *</label>
                  <input value={form.name} onChange={e => F('name', e.target.value)} className="form-input" placeholder="Dr. ..." required/>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'বিশেষজ্ঞতা' : 'Specialty'} *</label>
                  <select value={form.specialty} onChange={e => F('specialty', e.target.value)} className="form-select" required>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'ফোন' : 'Phone'}</label>
                  <input value={form.phone} onChange={e => F('phone', e.target.value)} className="form-input" placeholder="017XXXXXXXX"/>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'এলাকা' : 'Area'}</label>
                  <input value={form.area} onChange={e => F('area', e.target.value)} className="form-input" placeholder="Mirpur, Dhaka"/>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'জেলা' : 'District'}</label>
                  <input value={form.district} onChange={e => F('district', e.target.value)} className="form-input" placeholder="Dhaka"/>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'বিভাগ' : 'Division'}</label>
                  <select value={form.division} onChange={e => F('division', e.target.value)} className="form-select">
                    <option value="">{isBn ? 'বেছে নিন' : 'Select'}</option>
                    {DIVS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'সময়সূচি' : 'Hours'}</label>
                  <input value={form.hours} onChange={e => F('hours', e.target.value)} className="form-input" placeholder="Sat–Thu 9-5"/>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn ? 'রেটিং' : 'Rating'} (0–5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => F('rating', e.target.value)} className="form-input" placeholder="4.5"/>
                </div>
              </div>
              <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                {[
                  { field:'is_verified', label: isBn ? 'যাচাইকৃত' : 'Verified' },
                  { field:'is_active',   label: isBn ? 'সক্রিয়' : 'Active' },
                ].map(({ field, label }) => (
                  <label key={field} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'0.85rem', color:'var(--text-muted)' }}>
                    <input type="checkbox" checked={!!form[field]} onChange={e => F(field, e.target.checked)} style={{ width:15, height:15, accentColor:'var(--green)' }}/>
                    {label}
                  </label>
                ))}
              </div>
              <div style={{ display:'flex', gap:10, marginTop:4 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} disabled={saving}>
                  {saving ? <div className="spinner spinner-sm"/> : <><FiSave size={13}/>{isBn ? 'সংরক্ষণ করুন' : 'Save'}</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}>{isBn ? 'বাতিল' : 'Cancel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BulkImportModal 
        isOpen={showImport} 
        onClose={() => setShowImport(false)} 
        table="doctors" 
        onImportSuccess={() => { setPage(1); fetchData(); }} 
      />
    </div>
  );
}
