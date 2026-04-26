import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMapPin, FiClock, FiUser, FiDollarSign, FiSend, FiUpload } from 'react-icons/fi';

export default function JobDetail() {
  const { id }      = useParams();
  const { t, isBn } = useLang();
  const { isAuth }  = useAuth();
  const [job, setJob]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [cover, setCover]   = useState('');
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r=>setJob(r.data.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('cover_letter', cover);
      if (resume) fd.append('resume', resume);
      await api.post(`/jobs/${id}/apply`, fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      toast.success(isBn ? 'আবেদন সফলভাবে পাঠানো হয়েছে!' : 'Application submitted successfully!');
      setApplied(true); setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Application failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'5rem' }}><div className="spinner"/></div>;
  if (!job)    return <div className="empty"><div className="empty-icon">❌</div><div>Job not found</div></div>;

  const TYPE_COLOR = { 'full-time':'var(--green)', 'part-time':'var(--cyan)', 'freelance':'var(--purple)', 'internship':'var(--amber)', 'govt':'var(--red)' };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <Link to="/jobs" className="btn btn-ghost btn-sm" style={{ marginBottom:'1rem' }}><FiArrowLeft size={13}/>{t('common.back')}</Link>
        </div>
      </div>
      <div className="container" style={{ padding:'2rem 1.5rem', maxWidth:900 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'2rem', alignItems:'start' }}>
          {/* Left */}
          <div>
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:18, padding:'2rem', marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', gap:'1rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
                <span className="badge" style={{ background:`${TYPE_COLOR[job.type]}18`, color:TYPE_COLOR[job.type] }}>{job.type}</span>
                {job.is_remote && <span className="badge badge-cyan">🌐 Remote</span>}
                <span className={`badge ${job.status==='active'?'badge-green':'badge-gray'}`}>{job.status}</span>
              </div>
              <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#fff', marginBottom:8, lineHeight:1.2 }}>{job.title}</h1>
              <div style={{ fontSize:'1.1rem', color:'var(--cyan)', fontWeight:700, marginBottom:'1.5rem' }}>{job.company}</div>
              <div style={{ display:'flex', gap:'1.25rem', flexWrap:'wrap', fontSize:'0.85rem', color:'var(--text-muted)', paddingBottom:'1.25rem', borderBottom:'1px solid var(--border)' }}>
                {job.district    && <span style={{ display:'flex', alignItems:'center', gap:5 }}><FiMapPin size={13}/>📍 {job.district}{job.division&&`, ${job.division}`}</span>}
                {job.salary_min  && <span style={{ display:'flex', alignItems:'center', gap:5 }}><FiDollarSign size={13}/>৳{Number(job.salary_min).toLocaleString()}{job.salary_max&&`–${Number(job.salary_max).toLocaleString()}`}</span>}
                {job.deadline    && <span style={{ display:'flex', alignItems:'center', gap:5 }}><FiClock size={13}/>{isBn?'শেষ তারিখ':'Deadline'}: {new Date(job.deadline).toLocaleDateString()}</span>}
                {job.poster_name && <span style={{ display:'flex', alignItems:'center', gap:5 }}><FiUser size={13}/>{job.poster_name}</span>}
              </div>
              <div style={{ marginTop:'1.5rem' }}>
                <h3 style={{ fontWeight:700, color:'#fff', marginBottom:'0.75rem' }}>{isBn?'বিস্তারিত বিবরণ':'Job Description'}</h3>
                <div style={{ color:'var(--text-muted)', lineHeight:1.8, fontSize:'0.9rem', whiteSpace:'pre-wrap' }}>{job.description}</div>
              </div>
              {job.requirements && (
                <div style={{ marginTop:'1.5rem' }}>
                  <h3 style={{ fontWeight:700, color:'#fff', marginBottom:'0.75rem' }}>{isBn?'যোগ্যতা ও প্রয়োজনীয়তা':'Requirements'}</h3>
                  <div style={{ color:'var(--text-muted)', lineHeight:1.8, fontSize:'0.9rem', whiteSpace:'pre-wrap' }}>{job.requirements}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div style={{ position:'sticky', top:80 }}>
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:18, padding:'1.5rem', marginBottom:'1rem' }}>
              <div style={{ display:'flex', flex:'column', gap:6, marginBottom:'1.25rem', fontSize:'0.83rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ color:'var(--text-dim)' }}>{isBn?'ধরন':'Type'}</span>
                  <span style={{ fontWeight:600, color:TYPE_COLOR[job.type] }}>{job.type}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ color:'var(--text-dim)' }}>{isBn?'বিভাগ':'Category'}</span>
                  <span style={{ fontWeight:600, color:'#fff' }}>{job.category}</span>
                </div>
                {job.salary_min && <div style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ color:'var(--text-dim)' }}>{isBn?'বেতন':'Salary'}</span>
                  <span style={{ fontWeight:600, color:'var(--green)' }}>৳{Number(job.salary_min).toLocaleString()}+</span>
                </div>}
                <div style={{ display:'flex', justifyContent:'space-between', padding:'7px 0' }}>
                  <span style={{ color:'var(--text-dim)' }}>{isBn?'দেখেছেন':'Views'}</span>
                  <span style={{ fontWeight:600, color:'#fff' }}>{job.views}</span>
                </div>
              </div>

              {!applied ? (
                isAuth ? (
                  <button onClick={()=>setShowForm(true)} className="btn btn-primary" style={{ width:'100%', justifyContent:'center', height:44 }}>
                    <FiSend size={14}/>{t('jobs.apply')}
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', display:'flex' }}>
                    {t('nav.login')} {isBn?'করে আবেদন করুন':'to Apply'}
                  </Link>
                )
              ) : (
                <div style={{ textAlign:'center', padding:'1rem', background:'var(--green-light)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10, color:'var(--green)', fontWeight:700, fontSize:'0.88rem' }}>
                  ✅ {isBn?'আবেদন পাঠানো হয়েছে':'Application Submitted'}
                </div>
              )}
              {job.poster_email && (
                <a href={`mailto:${job.poster_email}`} className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', marginTop:8 }}>
                  {t('common.contact')} Employer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div onClick={()=>setShowForm(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)' }}/>
          <div style={{ position:'relative', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, width:'100%', maxWidth:500, padding:'2rem', animation:'fadeUp 0.25s ease' }}>
            <h2 style={{ fontWeight:800, fontSize:'1.2rem', marginBottom:5, color:'#fff' }}>{t('jobs.apply')}: {job.title}</h2>
            <p style={{ fontSize:'0.83rem', color:'var(--text-muted)', marginBottom:'1.5rem' }}>{job.company}</p>
            <form onSubmit={handleApply} style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
              <div className="form-group">
                <label className="form-label">{isBn?'কভার লেটার':'Cover Letter'}</label>
                <textarea value={cover} onChange={e=>setCover(e.target.value)} placeholder={isBn?'নিজের সম্পর্কে সংক্ষেপে লিখুন...':'Briefly introduce yourself...'} className="form-textarea" style={{ minHeight:110 }}/>
              </div>
              <div className="form-group">
                <label className="form-label">{isBn?'রেজুমে (PDF/DOC)':'Resume (PDF/DOC)'}</label>
                <label style={{ display:'flex', alignItems:'center', gap:10, padding:'0.75rem 1rem', border:'2px dashed var(--border)', borderRadius:10, cursor:'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='var(--cyan)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                  <FiUpload size={16} style={{ color:'var(--text-dim)' }}/>
                  <span style={{ fontSize:'0.83rem', color:'var(--text-muted)' }}>{resume ? resume.name : (isBn?'ফাইল বেছে নিন':'Choose file')}</span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e=>setResume(e.target.files[0])} style={{ display:'none' }}/>
                </label>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} disabled={submitting}>
                  {submitting ? <div className="spinner spinner-sm"/> : t('common.submit')}
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
