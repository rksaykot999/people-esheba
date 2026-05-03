import React, { useState } from 'react';
import { FiX, FiSave, FiImage, FiAlertCircle } from 'react-icons/fi';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CATS = [
  { key: 'medical', label: 'Medical Aid' },
  { key: 'education', label: 'Education Fund' },
  { key: 'disaster', label: 'Disaster' },
  { key: 'food', label: 'Food' },
  { key: 'agriculture', label: 'Agriculture Fund' },
  { key: 'other', label: 'Other' },
];

export default function HelpRequestModal({ isOpen, onClose, onSuccess }) {
  const { t, isBn } = useLang();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'medical',
    amount_needed: '',
    division: '',
    district: '',
    is_urgent: false,
    deadline: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.amount_needed) {
      return toast.error(isBn ? 'অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন' : 'Please fill all required fields');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (image) formData.append('image', image);

      await api.post('/donations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(isBn ? 'আপনার অনুরোধ জমা দেওয়া হয়েছে এবং অনুমোদনের অপেক্ষায় আছে' : 'Your request has been submitted and is pending approval');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || (isBn ? 'ব্যর্থ হয়েছে' : 'Failed to submit'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} 
      />
      
      <div style={{
        position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 24, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              {isBn ? 'সাহায্যের অনুরোধ করুন' : 'Post Help Request'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isBn ? 'আপনার প্রয়োজন বিস্তারিত লিখুন' : 'Describe your need in detail for potential donors'}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)',
            border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">{isBn ? 'শিরোনাম' : 'Title'} *</label>
            <input 
              name="title" value={form.title} onChange={handleChange} 
              className="form-input" placeholder={isBn ? 'যেমন: জরুরি হার্ট সার্জারি সহায়তা' : 'e.g. Emergency Heart Surgery Support'} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">{isBn ? 'বিভাগ' : 'Category'}</label>
              <select name="category" value={form.category} onChange={handleChange} className="form-select">
                {CATS.map(c => <option key={c.key} value={c.key}>{isBn ? t(`donate.${c.key}`) : c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{isBn ? 'প্রয়োজনীয় পরিমাণ (BDT)' : 'Amount Needed (BDT)'} *</label>
              <input 
                name="amount_needed" type="number" value={form.amount_needed} onChange={handleChange} 
                className="form-input" placeholder="50000" required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">{isBn ? 'বিভাগ (Division)' : 'Division'}</label>
              <input name="division" value={form.division} onChange={handleChange} className="form-input" placeholder="Dhaka" />
            </div>
            <div className="form-group">
              <label className="form-label">{isBn ? 'জেলা (District)' : 'District'}</label>
              <input name="district" value={form.district} onChange={handleChange} className="form-input" placeholder="Dhaka" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{isBn ? 'বিস্তারিত বিবরণ' : 'Description'} *</label>
            <textarea 
              name="description" value={form.description} onChange={handleChange} 
              className="form-textarea" rows={4} 
              placeholder={isBn ? 'আপনার পরিস্থিতি বিস্তারিত লিখুন...' : 'Explain the situation, medical reports, or educational needs...'}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isBn ? 'সহায়ক ছবি (যদি থাকে)' : 'Supporting Image (Optional)'}</label>
            <div style={{
              border: '2px dashed var(--border)', borderRadius: 12, padding: '1.5rem',
              textAlign: 'center', cursor: 'pointer', position: 'relative',
              background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s'
            }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
               onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <input type="file" accept="image/*" onChange={handleImage} style={{
                position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer'
              }} />
              {preview ? (
                <img src={preview} alt="Preview" style={{ height: 100, borderRadius: 8, objectFit: 'cover' }} />
              ) : (
                <div style={{ color: 'var(--text-dim)' }}>
                  <FiImage size={24} style={{ marginBottom: 8 }} /><br />
                  <span style={{ fontSize: '0.85rem' }}>{isBn ? 'ছবি আপলোড করতে ক্লিক করুন' : 'Click to upload reports or photos'}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
              <input 
                type="checkbox" name="is_urgent" checked={form.is_urgent} onChange={handleChange}
                style={{ width: 18, height: 18, accentColor: '#ef4444' }} 
              />
              {isBn ? 'এটি খুব জরুরি' : 'This is extremely urgent'}
            </label>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input 
                type="date" name="deadline" value={form.deadline} onChange={handleChange}
                className="form-input" style={{ width: 'auto', padding: '6px 12px', height: 38 }} 
              />
            </div>
          </div>

          <div style={{ 
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', 
            borderRadius: 12, padding: '0.75rem 1rem', display: 'flex', gap: 10, alignItems: 'flex-start'
          }}>
            <FiAlertCircle size={18} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              {isBn ? 'আপনার অনুরোধ আমাদের টিম দ্বারা যাচাই করা হবে। সঠিক তথ্য দিলে অনুমোদনের সম্ভাবনা বাড়বে।' 
                    : 'Your request will be reviewed by our team. Providing accurate information increases chances of approval.'}
            </p>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{
            height: 52, borderRadius: 14, fontSize: '1rem', fontWeight: 700,
            justifyContent: 'center', boxShadow: '0 8px 24px rgba(239,68,68,0.2)'
          }}>
            {loading ? <div className="spinner spinner-sm" /> : <><FiSave size={20} /> {isBn ? 'অনুরোধ জমা দিন' : 'Submit Request'}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
