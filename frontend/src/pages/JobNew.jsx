import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

const TYPES = ['full-time','part-time','freelance','internship','govt'];
const DIVS  = ['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'];
const CATS  = ['IT','Healthcare','Education','Engineering','Finance','Marketing','Legal','Government','NGO','Other'];

export default function JobNew() {
  const { isBn } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', company:'', description:'', requirements:'', category:'IT', type:'full-time', salary_min:'', salary_max:'', division:'', district:'', is_remote:false, deadline:'' });
  const [loading, setLoading] = useState(false);
  const F = (k,v) => setForm(f=>({...f,[k]:v}));

  const handle = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) return toast.error('Required fields missing');
    setLoading(true);
    try {
      const { data } = await api.post('/jobs', form);
      toast.success(isBn?'চাকরি পোস্ট হয়েছে!':'Job posted successfully!');
      navigate(`/jobs/${data.data.id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <Link to="/jobs" className="btn btn-ghost btn-sm" style={{ marginBottom:'1rem' }}><FiArrowLeft size={13}/>{isBn?'ফিরে যান':'Back'}</Link>
          <h1 className="section-title" style={{ marginBottom:6 }}>{isBn?'চাকরি পোস্ট করুন':'Post a Job'}</h1>
        </div>
      </div>
      <div className="container" style={{ padding:'2rem 1.5rem', maxWidth:720 }}>
        <form onSubmit={handle} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'2rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label className="form-label">{isBn?'পদের শিরোনাম':'Job Title'} *</label>
              <input value={form.title} onChange={e=>F('title',e.target.value)} placeholder="Software Engineer" className="form-input" required/>
            </div>
            <div className="form-group">
              <label className="form-label">{isBn?'প্রতিষ্ঠানের নাম':'Company'} *</label>
              <input value={form.company} onChange={e=>F('company',e.target.value)} placeholder="Company Name" className="form-input" required/>
            </div>
            <div className="form-group">
              <label className="form-label">{isBn?'বিভাগ':'Category'}</label>
              <select value={form.category} onChange={e=>F('category',e.target.value)} className="form-select">
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{isBn?'চাকরির বিবরণ':'Job Description'} *</label>
            <textarea value={form.description} onChange={e=>F('description',e.target.value)} placeholder={isBn?'চাকরির বিস্তারিত বিবরণ...':'Detailed job description...'} className="form-textarea" style={{ minHeight:140 }} required/>
          </div>
          <div className="form-group">
            <label className="form-label">{isBn?'যোগ্যতা ও প্রয়োজনীয়তা':'Requirements'}</label>
            <textarea value={form.requirements} onChange={e=>F('requirements',e.target.value)} placeholder={isBn?'শিক্ষাগত যোগ্যতা, অভিজ্ঞতা, দক্ষতা...':'Education, experience, skills...'} className="form-textarea" style={{ minHeight:100 }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
            <div className="form-group">
              <label className="form-label">{isBn?'ধরন':'Job Type'}</label>
              <select value={form.type} onChange={e=>F('type',e.target.value)} className="form-select">
                {TYPES.map(tp=><option key={tp} value={tp}>{tp}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{isBn?'ন্যূনতম বেতন (৳)':'Min Salary (BDT)'}</label>
              <input type="number" value={form.salary_min} onChange={e=>F('salary_min',e.target.value)} placeholder="30000" className="form-input"/>
            </div>
            <div className="form-group">
              <label className="form-label">{isBn?'সর্বোচ্চ বেতন (৳)':'Max Salary (BDT)'}</label>
              <input type="number" value={form.salary_max} onChange={e=>F('salary_max',e.target.value)} placeholder="60000" className="form-input"/>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
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
            <div className="form-group">
              <label className="form-label">{isBn?'শেষ তারিখ':'Deadline'}</label>
              <input type="date" value={form.deadline} onChange={e=>F('deadline',e.target.value)} className="form-input"/>
            </div>
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer' }}>
            <input type="checkbox" checked={form.is_remote} onChange={e=>F('is_remote',e.target.checked)} style={{ width:16, height:16, accentColor:'var(--cyan)' }}/>
            <span style={{ fontSize:'0.88rem', color:'var(--text-muted)', fontWeight:600 }}>🌐 {isBn?'রিমোট কাজ সম্ভব':'This is a remote job'}</span>
          </label>
          <div style={{ display:'flex', gap:10 }}>
            <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center', height:46 }} disabled={loading}>
              {loading ? <><div className="spinner spinner-sm"/>{isBn?'পোস্ট হচ্ছে...':'Posting...'}</> : (isBn?'চাকরি পোস্ট করুন':'Post Job')}
            </button>
            <Link to="/jobs" className="btn btn-ghost" style={{ flex:1, justifyContent:'center', height:46 }}>{isBn?'বাতিল':'Cancel'}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
