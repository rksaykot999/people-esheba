import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { usePaginated, useApi, useMutation } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { Badge, Empty, Pagination, Spinner, Modal, StatusBadge, SectionHeader } from '../../components/ui';
import { fmtDate, fmtMoney, trunc, JOB_TYPES, DIVISIONS } from '../../utils/helpers';
import toast from 'react-hot-toast';

/* ── Job List Page ───────────────────────────────────────────── */
export const JobsPage = () => {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [type,   setType]   = useState('');
  const [district, setDistrict] = useState('');

  const { items, total, pages, page, loading, load, updateParams } = usePaginated('/jobs', { limit:12 });

  const apply = (e) => {
    e.preventDefault();
    updateParams({ search, type, district });
  };

  const TYPE_COLOR = { 'full-time':'cyan','part-time':'purple','freelance':'amber','internship':'green','govt':'red' };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
            <div>
              <h1 style={{ fontWeight:900, fontSize:'clamp(1.8rem,4vw,2.5rem)', marginBottom:6 }}>💼 {t('jobs.title')}</h1>
              <p style={{ color:'var(--text-muted)' }}>{t('jobs.sub')}</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Link to="/jobs/my-applications" className="btn btn-ghost">My Applications</Link>
              <Link to="/jobs/new" className="btn btn-primary">+ {t('jobs.post')}</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem' }}>
        {/* Filters */}
        <form onSubmit={apply} style={{ display:'flex', gap:10, marginBottom:'1.5rem', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:220 }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)' }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs, companies..." className="form-input" style={{ paddingLeft:34 }} />
          </div>
          <select value={type} onChange={e=>{setType(e.target.value);updateParams({search,type:e.target.value,district});}} className="form-select" style={{ width:'auto' }}>
            <option value="">All Types</option>
            {JOB_TYPES.map(jt => <option key={jt} value={jt}>{jt.charAt(0).toUpperCase()+jt.slice(1)}</option>)}
          </select>
          <input value={district} onChange={e=>setDistrict(e.target.value)} placeholder="District" className="form-input" style={{ width:140 }} />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Type pills */}
        <div style={{ display:'flex', gap:8, marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {[['','All Jobs','🌐'],...JOB_TYPES.map(jt => [jt, jt.charAt(0).toUpperCase()+jt.slice(1), ''])].map(([val,lbl]) => (
            <button key={val} onClick={() => { setType(val); updateParams({search,type:val,district}); }} style={{
              padding:'5px 13px', borderRadius:99, border:'1px solid', cursor:'pointer', transition:'all 0.15s',
              borderColor: type===val ? `var(--${TYPE_COLOR[val]||'text-dim'})` : 'var(--border)',
              background: type===val ? `var(--${TYPE_COLOR[val]||'gray'}-light)` : 'transparent',
              color: type===val ? `var(--${TYPE_COLOR[val]||'text'})` : 'var(--text-muted)',
              fontSize:'0.78rem', fontWeight:600,
            }}>{lbl}</button>
          ))}
        </div>

        <div style={{ marginBottom:'1rem', fontSize:'0.85rem', color:'var(--text-muted)' }}>{total} jobs found</div>

        {loading ? <Spinner center /> : items.length === 0 ? <Empty icon="💼" title="No jobs found" /> : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
            {items.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} style={{ textDecoration:'none' }}>
                <div className="card card-pad" style={{ height:'100%' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                    <div style={{ flex:1 }}>
                      <h3 style={{ fontWeight:700, fontSize:'0.95rem', color:'#fff', marginBottom:3, lineHeight:1.3 }}>{job.title}</h3>
                      <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>🏢 {job.company}</div>
                    </div>
                    <Badge color={TYPE_COLOR[job.type]||'gray'}>{job.type}</Badge>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem 1rem', fontSize:'0.78rem', color:'var(--text-dim)', marginBottom:12 }}>
                    {job.district && <span>📍 {job.district}</span>}
                    {job.is_remote && <span style={{ color:'var(--green)' }}>🌐 Remote</span>}
                    {job.salary_max && <span style={{ color:'var(--cyan)' }}>💰 Up to {fmtMoney(job.salary_max)}</span>}
                    {job.deadline && <span>📅 {fmtDate(job.deadline)}</span>}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto', paddingTop:10, borderTop:'1px solid var(--border)' }}>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-dim)' }}>{job.applicants} applicant{job.applicants !== 1 ? 's' : ''}</span>
                    <span className="btn btn-primary btn-sm">Apply →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <Pagination page={page} pages={pages} onChange={p => load(p)} />
      </div>
    </div>
  );
};

/* ── Job Detail Page ─────────────────────────────────────────── */
export const JobDetailPage = () => {
  const { id } = useParams();
  const { isAuth, user } = useAuth();
  const { data: job, loading } = useApi(`/jobs/${id}`);
  const { mutate, loading: applying } = useMutation();
  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState({ cover_letter:'' });

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuth) { navigate('/login'); return; }
    try {
      await mutate('post', `/jobs/${id}/apply`, form);
      toast.success('Application submitted! 🎉');
      setApplyOpen(false);
    } catch (e) { toast.error(e.message); }
  };

  if (loading) return <Spinner center />;
  if (!job) return <Empty icon="💼" title="Job not found" />;

  const TYPE_COLOR = { 'full-time':'cyan','part-time':'purple','freelance':'amber','internship':'green','govt':'red' };

  return (
    <div className="container" style={{ padding:'2rem 1.5rem', maxWidth:800 }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom:'1.5rem' }}>← Back</button>

      <div className="card card-pad" style={{ marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'1.25rem' }}>
          <div>
            <h1 style={{ fontWeight:900, fontSize:'1.6rem', marginBottom:6 }}>{job.title}</h1>
            <div style={{ fontSize:'1rem', color:'var(--text-muted)', marginBottom:8 }}>🏢 {job.company}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              <Badge color={TYPE_COLOR[job.type]||'gray'}>{job.type}</Badge>
              {job.is_remote && <Badge color="green">🌐 Remote</Badge>}
              {job.poster_verified && <Badge color="cyan">✓ Verified Employer</Badge>}
            </div>
          </div>
          <button onClick={() => isAuth ? setApplyOpen(true) : navigate('/login')} className="btn btn-primary btn-lg">
            Apply Now →
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem', padding:'1rem', background:'var(--surface-2)', borderRadius:12, marginBottom:'1.25rem' }}>
          {[['📍 Location', [job.upazila, job.district, job.division].filter(Boolean).join(', ') || 'Bangladesh'],
            ['💰 Salary', job.salary_min ? `${fmtMoney(job.salary_min)} – ${fmtMoney(job.salary_max)}` : 'Negotiable'],
            ['📅 Deadline', fmtDate(job.deadline) || 'Open'],
            ['👥 Applicants', `${job.applicants || 0} applied`],
          ].map(([l,v]) => (
            <div key={l}>
              <div style={{ fontSize:'0.72rem', color:'var(--text-dim)', fontWeight:700, marginBottom:2 }}>{l.split(' ')[0]}</div>
              <div style={{ fontSize:'0.9rem', fontWeight:600 }}>{l.split(' ').slice(1).join(' ')} {v}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:'1.25rem' }}>
          <h2 style={{ fontWeight:700, marginBottom:'0.75rem', fontSize:'1rem' }}>Job Description</h2>
          <div style={{ color:'var(--text-muted)', lineHeight:1.8, fontSize:'0.9rem', whiteSpace:'pre-wrap' }}>{job.description}</div>
        </div>

        {job.requirements && (
          <div>
            <h2 style={{ fontWeight:700, marginBottom:'0.75rem', fontSize:'1rem' }}>Requirements</h2>
            <div style={{ color:'var(--text-muted)', lineHeight:1.8, fontSize:'0.9rem', whiteSpace:'pre-wrap' }}>{job.requirements}</div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <Modal isOpen={applyOpen} onClose={() => setApplyOpen(false)} title="Apply for this Job">
        <form onSubmit={handleApply} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div className="form-group">
            <label className="form-label">Cover Letter (optional)</label>
            <textarea
              value={form.cover_letter}
              onChange={e => setForm(f => ({ ...f, cover_letter: e.target.value }))}
              placeholder="Tell the employer why you're a great fit..."
              className="form-textarea"
              style={{ minHeight:140 }}
            />
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setApplyOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={applying}>
              {applying ? <span className="spinner spinner-sm" /> : '✅ Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/* ── Post New Job ─────────────────────────────────────────────── */
export const NewJobPage = () => {
  const { mutate, loading } = useMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', company:'', description:'', requirements:'', category:'', type:'full-time', salary_min:'', salary_max:'', division:'', district:'', is_remote:false, deadline:'' });

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await mutate('post', '/jobs', form);
      toast.success('Job posted! 🎉');
      navigate(`/jobs/${res.data.id}`);
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="container" style={{ padding:'2rem 1.5rem', maxWidth:700 }}>
      <SectionHeader title="💼 Post a Job" sub="Fill in the details to reach thousands of job seekers" />
      <form onSubmit={submit} className="card card-pad" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input name="title" value={form.title} onChange={handle} placeholder="e.g. Senior Developer" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Company *</label>
            <input name="company" value={form.company} onChange={handle} placeholder="Company name" className="form-input" required />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div className="form-group">
            <label className="form-label">Job Type</label>
            <select name="type" value={form.type} onChange={handle} className="form-select">
              {JOB_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input name="category" value={form.category} onChange={handle} placeholder="e.g. IT, Healthcare" className="form-input" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Job Description *</label>
          <textarea name="description" value={form.description} onChange={handle} placeholder="Describe the role and responsibilities..." className="form-textarea" style={{ minHeight:140 }} required />
        </div>
        <div className="form-group">
          <label className="form-label">Requirements</label>
          <textarea name="requirements" value={form.requirements} onChange={handle} placeholder="Skills, education, experience required..." className="form-textarea" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div className="form-group">
            <label className="form-label">Min Salary (BDT)</label>
            <input name="salary_min" type="number" value={form.salary_min} onChange={handle} placeholder="e.g. 20000" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Max Salary (BDT)</label>
            <input name="salary_max" type="number" value={form.salary_max} onChange={handle} placeholder="e.g. 50000" className="form-input" />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
          <div className="form-group">
            <label className="form-label">Division</label>
            <select name="division" value={form.division} onChange={handle} className="form-select">
              <option value="">Any</option>
              {DIVISIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">District</label>
            <input name="district" value={form.district} onChange={handle} placeholder="e.g. Dhaka" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={handle} className="form-input" />
          </div>
        </div>
        <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'0.88rem', fontWeight:600 }}>
          <input type="checkbox" name="is_remote" checked={form.is_remote} onChange={handle} style={{ width:16, height:16 }} />
          🌐 This is a remote job
        </label>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/jobs')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner spinner-sm" /> : '✅ Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ── My Applications ─────────────────────────────────────────── */
export const MyApplicationsPage = () => {
  const { data, loading } = useApi('/jobs/my-applications');

  return (
    <div className="container" style={{ padding:'2rem 1.5rem' }}>
      <SectionHeader title="📋 My Applications" sub="Track all your job applications" />
      {loading ? <Spinner center /> : !data?.length ? <Empty icon="📋" title="No applications yet" /> : (
        <div className="table-wrap card">
          <table>
            <thead><tr>
              <th>Job</th><th>Company</th><th>Status</th><th>Applied</th>
            </tr></thead>
            <tbody>
              {data.map(app => (
                <tr key={app.id}>
                  <td><Link to={`/jobs/${app.job_id}`} style={{ color:'var(--cyan)', fontWeight:600 }}>{app.job_title}</Link></td>
                  <td style={{ color:'var(--text-muted)' }}>{app.company}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td style={{ color:'var(--text-dim)', fontSize:'0.82rem' }}>{fmtDate(app.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
