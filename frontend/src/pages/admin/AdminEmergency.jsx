import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiPhone } from 'react-icons/fi';

const TYPES = ['hospital','police','fire','ambulance','mental','other'];
const ICONS  = { hospital:'🏥', police:'👮', fire:'🚒', ambulance:'🚑', mental:'🧠', other:'📞' };
const DIVS   = ['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'];
const BLANK  = { name:'', type:'hospital', address:'', division:'', district:'', phone:'', latitude:'', longitude:'', is_24h:false };

export default function AdminEmergency() {
  const { t, isBn } = useLang();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]  = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/emergency');
      setItems(data.data);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd  = () => { setForm(BLANK); setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setForm({...item, is_24h:!!item.is_24h}); setEditing(item.id); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type) return toast.error('Name and type required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/emergency/${editing}`, form);
        toast.success('Updated');
        setItems(i => i.map(x => x.id===editing ? {...x,...form} : x));
      } else {
        const { data } = await api.post('/admin/emergency', form);
        toast.success('Created');
        setItems(i => [data.data, ...i]);
      }
      setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/admin/emergency/${id}`);
      toast.success('Deleted');
      setItems(i => i.filter(x => x.id!==id));
    } catch { toast.error('Failed'); }
  };

  const F = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontWeight:800, fontSize:'1.4rem', color:'#fff', marginBottom:3 }}>{t('admin.emergency')}</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{items.length} {isBn?'সেবা':'services'}</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><FiPlus size={14}/>{isBn?'নতুন যোগ করুন':'Add Service'}</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
        {loading ? <div style={{ gridColumn:'1/-1', display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>
        : items.map(item => (
          <div key={item.id} className="card card-pad" style={{ borderLeft:`3px solid ${item.is_verified?'var(--green)':'var(--border)'}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
              <span style={{ fontSize:'1.4rem' }}>{ICONS[item.type]||'📞'}</span>
              <div style={{ display:'flex', gap:5 }}>
                {item.is_verified && <span className="badge badge-green" style={{ fontSize:'0.65rem' }}>✓</span>}
                {item.is_24h     && <span className="badge badge-cyan"  style={{ fontSize:'0.65rem' }}>24h</span>}
              </div>
            </div>
            <div style={{ fontWeight:700, color:'#fff', fontSize:'0.9rem', marginBottom:4 }}>{item.name}</div>
            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:4 }}>{item.type} · {item.district||'—'}</div>
            {item.phone && <div style={{ fontSize:'0.8rem', color:'var(--cyan)', display:'flex', alignItems:'center', gap:4, marginBottom:'0.9rem' }}><FiPhone size={11}/>{item.phone}</div>}
            <div style={{ display:'flex', gap:6, marginTop:'auto' }}>
              <button onClick={()=>openEdit(item)} className="btn btn-ghost btn-sm" style={{ flex:1, justifyContent:'center' }}><FiEdit2 size={12}/>{t('common.edit')}</button>
              <button onClick={()=>deleteItem(item.id, item.name)} style={{ width:32, height:32, borderRadius:8, border:'1px solid rgba(230,57,70,0.2)', background:'transparent', color:'var(--red)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><FiTrash2 size={12}/></button>
            </div>
          </div>
        ))}
        {!loading && items.length===0 && (
          <div className="empty" style={{ gridColumn:'1/-1' }}><div className="empty-icon">🏥</div><div>{t('common.noResults')}</div></div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div onClick={()=>setShowForm(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }}/>
          <div style={{ position:'relative', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, width:'100%', maxWidth:540, padding:'2rem', animation:'fadeUp 0.25s ease', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontWeight:800, fontSize:'1.1rem', color:'#fff' }}>{editing ? t('common.edit') : isBn?'নতুন সেবা যোগ করুন':'Add Emergency Service'}</h2>
              <button onClick={()=>setShowForm(false)} style={{ width:28, height:28, borderRadius:7, border:'1px solid var(--border)', background:'transparent', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><FiX size={13}/></button>
            </div>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div className="form-group" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">{isBn?'নাম':'Name'} *</label>
                  <input value={form.name} onChange={e=>F('name',e.target.value)} className="form-input" placeholder="Dhaka Medical College Hospital" required/>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn?'ধরন':'Type'} *</label>
                  <select value={form.type} onChange={e=>F('type',e.target.value)} className="form-select" required>
                    {TYPES.map(tp=><option key={tp} value={tp}>{ICONS[tp]} {tp}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn?'ফোন':'Phone'}</label>
                  <input value={form.phone} onChange={e=>F('phone',e.target.value)} className="form-input" placeholder="01XXXXXXXXX"/>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn?'বিভাগ (এলাকা)':'Division'}</label>
                  <select value={form.division} onChange={e=>F('division',e.target.value)} className="form-select">
                    <option value="">{isBn?'বেছে নিন':'Select'}</option>
                    {DIVS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{isBn?'জেলা':'District'}</label>
                  <input value={form.district} onChange={e=>F('district',e.target.value)} className="form-input" placeholder="Dhaka"/>
                </div>
                <div className="form-group" style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">{isBn?'ঠিকানা':'Address'}</label>
                  <input value={form.address} onChange={e=>F('address',e.target.value)} className="form-input" placeholder="Full address"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input type="number" step="any" value={form.latitude} onChange={e=>F('latitude',e.target.value)} className="form-input" placeholder="23.8103"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input type="number" step="any" value={form.longitude} onChange={e=>F('longitude',e.target.value)} className="form-input" placeholder="90.4125"/>
                </div>
              </div>
              <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                {[
                  { field:'is_24h', label:isBn?'২৪ ঘণ্টা খোলা':'Open 24 Hours' },
                  { field:'is_verified', label:isBn?'যাচাইকৃত':'Verified' },
                ].map(({field,label}) => (
                  <label key={field} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'0.85rem', color:'var(--text-muted)' }}>
                    <input type="checkbox" checked={!!form[field]} onChange={e=>F(field,e.target.checked)} style={{ width:15, height:15, accentColor:'var(--green)' }}/>
                    {label}
                  </label>
                ))}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} disabled={saving}>
                  {saving?<div className="spinner spinner-sm"/>:<><FiSave size={13}/>{t('common.save')}</>}
                </button>
                <button type="button" onClick={()=>setShowForm(false)} className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}>{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
