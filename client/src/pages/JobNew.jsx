import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiBriefcase, FiZap, FiShield, FiGlobe } from 'react-icons/fi';

const TYPES = ['full-time', 'part-time', 'freelance', 'internship', 'govt'];
const DIVS = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];
const CATS = ['IT', 'Healthcare', 'Education', 'Engineering', 'Finance', 'Marketing', 'Legal', 'Government', 'NGO', 'Other'];

export default function JobNew() {
  const { isBn } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', company: '', description: '', requirements: '', category: 'IT', type: 'full-time', salary_min: '', salary_max: '', division: '', district: '', is_remote: false, deadline: '' });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const F = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const handle = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) return toast.error('Required fields missing');
    setLoading(true);
    try {
      const { data } = await api.post('/jobs', form);
      toast.success(isBn ? 'আপনার চাকরি পোস্টটি অনুমোদনের জন্য পাঠানো হয়েছে!' : 'Job submitted for admin review!');
      navigate('/jobs');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #0d0005 0%, #130008 40%, #080E1A 100%)'
          : 'linear-gradient(135deg, #fff5f5 0%, #fef2f2 40%, #f1f5f9 100%)',
        padding: '4rem 0 3rem',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px', width: 400, height: 400, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(230,57,70,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '10%', width: 300, height: 300, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(230,57,70,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(230,57,70,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: isDark ? 0.03 : 0.06,
          backgroundImage: `linear-gradient(var(--red) 1px, transparent 1px),
                            linear-gradient(90deg, var(--red) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.25)',
                color: 'var(--red)', padding: '5px 14px', borderRadius: 999,
                fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
              }}>
                {isBn ? 'চাকরি পোস্ট করুন' : 'Post a Job'}
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900,
              lineHeight: 1.08, letterSpacing: '-1.5px', color: 'var(--text)',
              marginBottom: '1rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto',
            }}>
              {isBn ? 'চাকরি পোস্ট করুন' : 'Post a Job'}<br />
              <span style={{
                background: 'linear-gradient(135deg, #E63946, #ff6b6b)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {isBn ? 'সহজে নিয়োগ নিন' : 'Hire with ease'}
              </span>{' '}{isBn ? 'বাংলাদেশে' : 'in Bangladesh'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 500, lineHeight: 1.7, margin: '0 auto 2rem' }}>
              {isBn ? 'সহজ ফর্ম ব্যবহার করে দ্রুত চাকরির বিজ্ঞাপন তৈরি করুন এবং আরও বেশি প্রার্থীর কাছে পৌঁছান।' : 'Create job listings fast using a simple form and reach more candidates.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { label: isBn ? 'দ্রুত পোস্ট' : 'Fast Posting', value: isBn ? 'স্বল্প সময়' : 'Quick', icon: <FiBriefcase size={16} />, color: 'var(--red)' },
                { label: isBn ? 'প্রত্যাশী' : 'Candidates', value: isBn ? 'আবেদনকারী' : 'Wide', icon: <FiZap size={16} />, color: 'var(--cyan)' },
                { label: isBn ? 'বিশ্বস্ত' : 'Trusted', value: isBn ? 'নির্ভরযোগ্য' : 'Verified', icon: <FiShield size={16} />, color: 'var(--green)' },
              ].map(s => (
                <div key={s.label} style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  backdropFilter: 'blur(12px)',
                  border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 16, padding: '1rem 1.25rem', minWidth: 110, textAlign: 'center',
                }}>
                  <div style={{ color: s.color, marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 720 }}>
        <form onSubmit={handle} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">{isBn ? 'পদের শিরোনাম' : 'Job Title'} *</label>
              <input value={form.title} onChange={e => F('title', e.target.value)} placeholder="Software Engineer" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">{isBn ? 'প্রতিষ্ঠানের নাম' : 'Company'} *</label>
              <input value={form.company} onChange={e => F('company', e.target.value)} placeholder="Company Name" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">{isBn ? 'বিভাগ' : 'Category'}</label>
              <select value={form.category} onChange={e => F('category', e.target.value)} className="form-select">
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{isBn ? 'চাকরির বিবরণ' : 'Job Description'} *</label>
            <textarea value={form.description} onChange={e => F('description', e.target.value)} placeholder={isBn ? 'চাকরির বিস্তারিত বিবরণ...' : 'Detailed job description...'} className="form-textarea" style={{ minHeight: 140 }} required />
          </div>
          <div className="form-group">
            <label className="form-label">{isBn ? 'যোগ্যতা ও প্রয়োজনীয়তা' : 'Requirements'}</label>
            <textarea value={form.requirements} onChange={e => F('requirements', e.target.value)} placeholder={isBn ? 'শিক্ষাগত যোগ্যতা, অভিজ্ঞতা, দক্ষতা...' : 'Education, experience, skills...'} className="form-textarea" style={{ minHeight: 100 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">{isBn ? 'ধরন' : 'Job Type'}</label>
              <select value={form.type} onChange={e => F('type', e.target.value)} className="form-select">
                {TYPES.map(tp => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{isBn ? 'ন্যূনতম বেতন (৳)' : 'Min Salary (BDT)'}</label>
              <input type="number" value={form.salary_min} onChange={e => F('salary_min', e.target.value)} placeholder="30000" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">{isBn ? 'সর্বোচ্চ বেতন (৳)' : 'Max Salary (BDT)'}</label>
              <input type="number" value={form.salary_max} onChange={e => F('salary_max', e.target.value)} placeholder="60000" className="form-input" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">{isBn ? 'বিভাগ (এলাকা)' : 'Division'}</label>
              <select value={form.division} onChange={e => F('division', e.target.value)} className="form-select">
                <option value="">{isBn ? 'বেছে নিন' : 'Select'}</option>
                {DIVS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{isBn ? 'জেলা' : 'District'}</label>
              <input value={form.district} onChange={e => F('district', e.target.value)} placeholder="Dhaka" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">{isBn ? 'শেষ তারিখ' : 'Deadline'}</label>
              <input type="date" value={form.deadline} onChange={e => F('deadline', e.target.value)} className="form-input" />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_remote} onChange={e => F('is_remote', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--cyan)' }} />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center' }}><FiGlobe size={14} style={{ marginRight: 6 }} /> {isBn ? 'রিমোট কাজ সম্ভব' : 'This is a remote job'}</span>
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', height: 46 }} disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" />{isBn ? 'পোস্ট হচ্ছে...' : 'Posting...'}</> : (isBn ? 'চাকরি পোস্ট করুন' : 'Post Job')}
            </button>
            <Link to="/jobs" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', height: 46 }}>{isBn ? 'বাতিল' : 'Cancel'}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
