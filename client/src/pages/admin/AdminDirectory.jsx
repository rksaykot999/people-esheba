import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  FiPlus, FiTrash2, FiEdit2, FiX, FiSave, FiPhone, FiSearch, FiStar, FiUploadCloud,
} from 'react-icons/fi';
import { MdLocalHospital, MdMiscellaneousServices, MdAccountBalance, MdAttachMoney } from 'react-icons/md';
import BulkImportModal from '../../components/admin/BulkImportModal';

/* Every public "static" page that used to hardcode sample data now
 * reads from directory_listings via /directory?category=X. This one
 * admin screen manages all four categories with a tab switcher,
 * instead of four near-identical admin pages. */
const CATEGORIES = [
  { key: 'hospital',   label: 'Hospitals',  icon: <MdLocalHospital/>,           subtypes: ['govt-hospital', 'private-hospital'] },
  { key: 'service',    label: 'Services',   icon: <MdMiscellaneousServices/>,   subtypes: ['home', 'transport', 'repairs', 'telemedicine', 'tutor', 'utility'] },
  { key: 'government', label: 'Government', icon: <MdAccountBalance/>,          subtypes: ['nid', 'schemes', 'passport', 'land', 'utility'] },
];

const DIVS  = ['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'];
const BLANK = (category, subtype) => ({
  category, subtype, name: '', description: '', area: '', district: '', division: '',
  address: '', phone: '', website: '', rating: 0, badge_key: '', price_info: '', features: '', is_verified: false,
});

export default function AdminDirectory() {
  const { isBn } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = CATEGORIES.find(c => c.key === searchParams.get('cat')) || CATEGORIES[0];

  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(BLANK(activeCat.key, activeCat.subtypes[0]));
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/directory', { params: { category: activeCat.key, search: search || undefined } });
      setItems(data.data.rows || []);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [activeCat.key]);

  const switchCat = (key) => {
    const p = new URLSearchParams(searchParams);
    p.set('cat', key);
    setSearchParams(p);
  };

  const openAdd  = () => { setForm(BLANK(activeCat.key, activeCat.subtypes[0])); setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setForm({ ...item, is_verified: !!item.is_verified }); setEditing(item.id); setShowForm(true); };

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/directory/${editing}`, form);
        toast.success('Updated');
        setItems(list => list.map(x => x.id === editing ? { ...x, ...form } : x));
      } else {
        const { data } = await api.post('/admin/directory', form);
        toast.success('Created');
        setItems(list => [data.data, ...list]);
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const remove = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/admin/directory/${id}`);
      toast.success('Deleted');
      setItems(list => list.filter(x => x.id !== id));
    } catch { toast.error('Delete failed'); }
  };

  const submitSearch = (e) => { e.preventDefault(); load(); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-strong)', marginBottom: 4 }}>
            {isBn ? 'ডিরেক্টরি ব্যবস্থাপনা' : 'Directory Manager'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {isBn ? 'হাসপাতাল, সেবা, সরকারি ও অন্যান্য তালিকা এখান থেকে নিয়ন্ত্রণ করুন' : 'Controls what shows on Health, Services, and Government pages'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={openAdd} className="btn btn-primary" style={{ height: 42, borderRadius: 10 }}>
            <FiPlus size={16}/> {isBn ? 'নতুন যোগ করুন' : 'Add Listing'}
          </button>
          <button onClick={() => setShowImport(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 10, color: 'var(--cyan)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', height: 42 }}>
            <FiUploadCloud size={15} /> {isBn ? 'ডেটা আমদানি' : 'Import CSV/Excel'}
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => switchCat(c.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10,
              border: '1px solid', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
              background: activeCat.key === c.key ? 'var(--primary)' : 'transparent',
              borderColor: activeCat.key === c.key ? 'var(--primary)' : 'var(--border)',
              color: activeCat.key === c.key ? '#fff' : 'var(--text-muted)',
            }}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <form onSubmit={submitSearch} style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', maxWidth: 360 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name..." className="form-input" style={{ height: 40 }}/>
        <button className="btn btn-ghost" style={{ height: 40 }}><FiSearch size={14}/></button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner"/></div>
        ) : items.map(item => (
          <div key={item.id} className="card card-pad" style={{ borderLeft: `3px solid ${item.is_verified ? 'var(--green)' : 'var(--border)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span className="badge" style={{ fontSize: '0.65rem' }}>{item.subtype}</span>
              {item.is_verified && <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>✓ Verified</span>}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-strong)', fontSize: '0.9rem', marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{item.area || item.district || '—'}</div>
            {item.phone && <div style={{ fontSize: '0.8rem', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}><FiPhone size={11}/>{item.phone}</div>}
            {!!item.rating && <div style={{ fontSize: '0.78rem', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '0.9rem' }}><FiStar size={11}/>{item.rating}/5</div>}
            <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
              <button onClick={() => openEdit(item)} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}><FiEdit2 size={12}/>Edit</button>
              <button onClick={() => remove(item.id, item.name)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(230,57,70,0.2)', background: 'transparent', color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiTrash2 size={12}/></button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '4rem', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', textAlign: 'center' }}>
            {activeCat.icon}
            <div style={{ color: 'var(--text-muted)', marginTop: 12 }}>No {activeCat.label.toLowerCase()} listed yet. Click "Add Listing" to create the first one.</div>
          </div>
        )}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setShowForm(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}/>
          <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 560, padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-strong)' }}>{editing ? 'Edit Listing' : `Add ${activeCat.label} Listing`}</h2>
              <button onClick={() => setShowForm(false)} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><FiX size={13}/></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Name *</label>
                  <input value={form.name} onChange={e => F('name', e.target.value)} className="form-input" required/>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select value={form.category} onChange={e => F('category', e.target.value)} className="form-select">
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subtype</label>
                  <select value={form.subtype} onChange={e => F('subtype', e.target.value)} className="form-select">
                    {(CATEGORIES.find(c => c.key === form.category)?.subtypes || []).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input value={form.phone} onChange={e => F('phone', e.target.value)} className="form-input"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input value={form.website} onChange={e => F('website', e.target.value)} className="form-input"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Division</label>
                  <select value={form.division} onChange={e => F('division', e.target.value)} className="form-select">
                    <option value="">Select</option>
                    {DIVS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input value={form.district} onChange={e => F('district', e.target.value)} className="form-input"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Area</label>
                  <input value={form.area} onChange={e => F('area', e.target.value)} className="form-input"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Rating (0-5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => F('rating', e.target.value)} className="form-input"/>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Address</label>
                  <input value={form.address} onChange={e => F('address', e.target.value)} className="form-input"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Price info (optional)</label>
                  <input value={form.price_info} onChange={e => F('price_info', e.target.value)} className="form-input" placeholder="e.g. Starts 300 BDT"/>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Features (comma-separated, optional)</label>
                  <input value={form.features} onChange={e => F('features', e.target.value)} className="form-input" placeholder="Verified Pros, 24/7 Support"/>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Description</label>
                  <textarea value={form.description} onChange={e => F('description', e.target.value)} className="form-input" rows={3}/>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <input type="checkbox" checked={!!form.is_verified} onChange={e => F('is_verified', e.target.checked)} style={{ width: 15, height: 15, accentColor: 'var(--green)' }}/>
                Verified
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>
                  {saving ? <div className="spinner spinner-sm"/> : <><FiSave size={13}/>Save</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <BulkImportModal isOpen={showImport} onClose={() => setShowImport(false)} table="directory_listings" onImportSuccess={() => { load(); }} />
    </div>
  );
}
