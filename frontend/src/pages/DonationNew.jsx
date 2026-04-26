import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';

const CATS = ['medical','education','disaster','food','other'];
const DIVS = ['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'];

export default function DonationNew() {
  const { t, isBn } = useLang();
  const navigate    = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', category:'medical', amount_needed:'', division:'', district:'', is_urgent:false, deadline:'' });
  const [image, setImage]   = useState(null);
  const [loading, setLoading] = useState(false);

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.amount_needed) return toast.error('Please fill required fields');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await api.post('/donations', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(isBn ? 'অনুরোধ পাঠানো হয়েছে! অ্যাডমিন অনুমোদন করলে দেখা যাবে।' : 'Request submitted! It will be visible after admin approval.');
      navigate('/donation');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <Link to="/donation" className="btn btn-ghost btn-sm" style={{ marginBottom:'1rem' }}><FiArrowLeft size={13}/>{t('common.back')}</Link>
          <h1 className="section-title" style={{ marginBottom:6 }}>{t('donation.new')}</h1>
        </div>
      </div>
      <div className="container" style={{ padding:'2rem 1.5rem', maxWidth:700 }}>
        <form onSubmit={handleSubmit} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'2rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div className="form-group">
            <label className="form-label">{isBn?'শিরোনাম':'Title'} *</label>
            <input value={form.title} onChange={e=>F('title',e.target.value)} placeholder={isBn?'সংক্ষিপ্ত শিরোনাম লিখুন':'Brief title for your request'} className="form-input" required/>
          </div>
          <div className="form-group">
            <label className="form-label">{isBn?'বিস্তারিত':'Description'} *</label>
            <textarea value={form.description} onChange={e=>F('description',e.target.value)} placeholder={isBn?'আপনার পরিস্থিতি বিস্তারিত বলুন...':'Describe your situation in detail...'} className="form-textarea" style={{ minHeight:130 }} required/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div className="form-group">
              <label className="form-label">{isBn?'বিভাগ':'Category'}</label>
              <select value={form.category} onChange={e=>F('category',e.target.value)} className="form-select">
                {CATS.map(c=><option key={c} value={c}>{t(`donation.${c}`)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{isBn?'প্রয়োজনীয় পরিমাণ (৳)':'Amount Needed (BDT)'} *</label>
              <input type="number" min="1" value={form.amount_needed} onChange={e=>F('amount_needed',e.target.value)} placeholder="50000" className="form-input" required/>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div className="form-group">
              <label className="form-label">{isBn?'বিভাগ (এলাকা)':'Division'}</label>
              <select value={form.division} onChange={e=>F('division',e.target.value)} className="form-select">
                <option value="">{isBn?'বেছে নিন':'Select'}</option>
                {DIVS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{isBn?'জেলা':'District'}</label>
              <input value={form.district} onChange={e=>F('district',e.target.value)} placeholder="Dhaka" className="form-input"/>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div className="form-group">
              <label className="form-label">{isBn?'শেষ তারিখ':'Deadline'}</label>
              <input type="date" value={form.deadline} onChange={e=>F('deadline',e.target.value)} className="form-input"/>
            </div>
            <div className="form-group" style={{ justifyContent:'flex-end' }}>
              <label style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer', marginTop:'1.5rem' }}>
                <input type="checkbox" checked={form.is_urgent} onChange={e=>F('is_urgent',e.target.checked)} style={{ width:16, height:16, accentColor:'var(--red)' }}/>
                <span style={{ fontSize:'0.88rem', color:'var(--text-muted)', fontWeight:600 }}>⚡ {isBn?'জরুরি হিসেবে চিহ্নিত করুন':'Mark as Urgent'}</span>
              </label>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{isBn?'ছবি (ঐচ্ছিক)':'Image (Optional)'}</label>
            <label style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'1.5rem', border:'2px dashed var(--border)', borderRadius:12, cursor:'pointer', transition:'border-color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--red)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
              <FiUpload size={22} style={{ color:'var(--text-dim)' }}/>
              <span style={{ fontSize:'0.83rem', color:'var(--text-muted)' }}>{image ? image.name : (isBn?'ছবি আপলোড করুন (JPG/PNG, max 5MB)':'Upload image (JPG/PNG, max 5MB)')}</span>
              <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} style={{ display:'none' }}/>
            </label>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center', height:46 }} disabled={loading}>
              {loading ? <><div className="spinner spinner-sm"/>{isBn?'পাঠানো হচ্ছে...':'Submitting...'}</> : t('common.submit')}
            </button>
            <Link to="/donation" className="btn btn-ghost" style={{ flex:1, justifyContent:'center', height:46 }}>{t('common.cancel')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
