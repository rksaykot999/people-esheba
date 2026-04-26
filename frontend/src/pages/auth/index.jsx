// ── Login Page ────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [form,    setForm]    = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [show,    setShow]    = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill all fields'); return; }
    setLoading(true);
    try {
      const u = await login(form);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}! 👋`);
      navigate(u.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Welcome Back" sub="Sign in to your People E-Sheba account">
      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position:'relative' }}>
            <input name="password" type={show ? 'text':'password'} value={form.password} onChange={handle} placeholder="Your password" className="form-input" style={{ paddingRight:44 }} required />
            <button type="button" onClick={() => setShow(s=>!s)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', fontSize:'1rem' }}>
              {show ? '🙈':'👁️'}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'0.8rem', marginTop:4 }}>
          {loading ? <span className="spinner spinner-sm" /> : '🔐 Sign In'}
        </button>
        <p style={{ textAlign:'center', fontSize:'0.85rem', color:'var(--text-muted)', marginTop:8 }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color:'var(--red)', fontWeight:600 }}>Register free →</Link>
        </p>
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:'0.75rem', textAlign:'center' }}>
          <p style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>Demo Admin: admin@esheba.bd / Admin@1234</p>
        </div>
      </form>
    </AuthShell>
  );
};

// ── Register Page ─────────────────────────────────────────────
export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'', division:'', district:'' });
  const [loading, setLoading] = useState(false);
  const [show, setShow]       = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Required fields missing'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password too short (min 6 chars)'); return; }
    setLoading(true);
    try {
      const { default: toast } = await import('react-hot-toast');
      await register(form);
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (err) {
      const { default: toast } = await import('react-hot-toast');
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Create Account" sub="Join People E-Sheba — Bangladesh's citizen platform">
      <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input name="name" value={form.name} onChange={handle} placeholder="Your full name" className="form-input" required />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.9rem' }}>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="email@example.com" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input name="phone" value={form.phone} onChange={handle} placeholder="01XXXXXXXXX" className="form-input" />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.9rem' }}>
          <div className="form-group">
            <label className="form-label">Division</label>
            <select name="division" value={form.division} onChange={handle} className="form-select">
              <option value="">Select Division</option>
              {['Dhaka','Chittagong','Rajshahi','Khulna','Barisal','Sylhet','Rangpur','Mymensingh'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">District</label>
            <input name="district" value={form.district} onChange={handle} placeholder="Your district" className="form-input" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Password *</label>
          <div style={{ position:'relative' }}>
            <input name="password" type={show?'text':'password'} value={form.password} onChange={handle} placeholder="Min 6 characters" className="form-input" style={{ paddingRight:44 }} required />
            <button type="button" onClick={() => setShow(s=>!s)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', fontSize:'1rem' }}>
              {show?'🙈':'👁️'}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password *</label>
          <input name="confirm" type="password" value={form.confirm} onChange={handle} placeholder="Re-enter password" className="form-input" required />
          {form.confirm && form.password !== form.confirm && <span className="form-error">Passwords don't match</span>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'0.8rem', marginTop:4 }}>
          {loading ? <span className="spinner spinner-sm" /> : '✅ Create Account'}
        </button>
        <p style={{ textAlign:'center', fontSize:'0.85rem', color:'var(--text-muted)', marginTop:4 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--red)', fontWeight:600 }}>Sign in →</Link>
        </p>
      </form>
    </AuthShell>
  );
};

// ── Shared Auth Shell ─────────────────────────────────────────
const AuthShell = ({ title, sub, children }) => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'2rem 1rem', backgroundImage:'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(230,57,70,0.12) 0%,transparent 70%)' }}>
    <div style={{ width:'100%', maxWidth:460 }}>
      <div style={{ textAlign:'center', marginBottom:'2rem' }}>
        <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:'1.5rem' }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#E63946,#c1121f)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', fontSize:'1.2rem' }}>ই</div>
          <div>
            <div style={{ fontWeight:800, color:'#fff', fontSize:'1.05rem' }}>People <span style={{ color:'#E63946' }}>E-Sheba</span></div>
            <div style={{ fontSize:'0.65rem', color:'var(--text-dim)' }}>জনসেবা প্ল্যাটফর্ম</div>
          </div>
        </Link>
        <h1 style={{ fontWeight:800, fontSize:'1.6rem', marginBottom:6 }}>{title}</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>{sub}</p>
      </div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'2rem' }}>
        {children}
      </div>
    </div>
  </div>
);

import toast from 'react-hot-toast';
export default LoginPage;
