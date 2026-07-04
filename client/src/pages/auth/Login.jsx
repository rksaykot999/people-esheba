import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

export default function Login() {
  const { login }  = useAuth();
  const { t, isBn } = useLang();
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const expired = params.get('expired');

  const handle = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1rem', background:'var(--grad-hero)' }}>
      {/* background orb */}
      <div style={{ position:'fixed', top:'20%', left:'10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(230,57,70,0.06) 0%, transparent 60%)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:420, animation:'fadeUp 0.4s ease' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:'1.5rem' }}>
            <div style={{ width:44, height:44, background:'var(--grad-red)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:'1.25rem', boxShadow:'var(--shadow-red)' }}>ই</div>
            <div>
              <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#fff' }}>People <span style={{ color:'var(--red)' }}>E-Sheba</span></div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-dim)' }}>জনসেবা প্ল্যাটফর্ম</div>
            </div>
          </Link>
          <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#fff', marginBottom:6 }}>{isBn?'লগইন করুন':'Sign In'}</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>{isBn?'আপনার অ্যাকাউন্টে প্রবেশ করুন':'Access your account'}</p>
        </div>

        {expired && (
          <div style={{ padding:'10px 14px', background:'rgba(230,57,70,0.1)', border:'1px solid rgba(230,57,70,0.2)', borderRadius:10, marginBottom:'1.25rem', fontSize:'0.83rem', color:'var(--red)', display:'flex', gap:8, alignItems:'center' }}>
            <FiShield size={14}/> Session expired. Please log in again.
          </div>
        )}

        <form onSubmit={handle} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'2rem' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem', marginBottom:'1.75rem' }}>
            <div className="form-group">
              <label className="form-label">{isBn?'ইমেইল':'Email'}</label>
              <div style={{ position:'relative' }}>
                <FiMail style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)', pointerEvents:'none' }} size={15}/>
                <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                  placeholder="you@example.com" className="form-input" style={{ paddingLeft:38 }} required/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{isBn?'পাসওয়ার্ড':'Password'}</label>
              <div style={{ position:'relative' }}>
                <FiLock style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)', pointerEvents:'none' }} size={15}/>
                <input type={showPwd?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                  placeholder="••••••••" className="form-input" style={{ paddingLeft:38, paddingRight:42 }} required/>
                <button type="button" onClick={()=>setShowPwd(s=>!s)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}>
                  {showPwd?<FiEyeOff size={15}/>:<FiEye size={15}/>}
                </button>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', height:46, fontSize:'0.95rem' }} disabled={loading}>
            {loading ? <><div className="spinner spinner-sm"/>{isBn?'লগইন হচ্ছে...':'Signing in...'}</> : (isBn?'লগইন করুন':'Sign In')}
          </button>
        </form>

        <div style={{ marginTop:'1.5rem', textAlign:'center' }}>
          <p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>
            {isBn?'অ্যাকাউন্ট নেই?':'Don\'t have an account?'}{' '}
            <Link to="/register" style={{ color:'var(--red)', fontWeight:700, textDecoration:'none' }}>{isBn?'নিবন্ধন করুন':'Register Free'}</Link>
          </p>
          <button
            type="button"
            onClick={() => setForm({ email:'admin@esheba.bd', password:'Admin@1234' })}
            style={{ background:'rgba(6,182,212,0.08)', border:'1px solid rgba(6,182,212,0.2)', borderRadius:8, padding:'6px 12px', color:'var(--cyan)', fontSize:'0.75rem', cursor:'pointer', marginTop:'0.75rem', fontWeight:600 }}
          >
            🔐 Admin: admin@esheba.bd / Admin@1234 (click to fill)
          </button>
        </div>
      </div>
    </div>
  );
}
