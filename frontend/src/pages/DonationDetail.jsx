import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUser, FiCalendar, FiPhone, FiHeart, FiShield } from 'react-icons/fi';

export default function DonationDetail() {
  const { id }      = useParams();
  const { t, isBn } = useLang();
  const { isAuth }  = useAuth();
  const [item, setItem]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [message, setMsg]   = useState('');
  const [anon, setAnon]     = useState(false);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    api.get(`/donations/${id}`).then(r=>setItem(r.data.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error('Enter a valid amount');
    setDonating(true);
    try {
      await api.post(`/donations/${id}/donate`, { amount:Number(amount), message, is_anonymous:anon });
      toast.success(isBn ? 'দান করার জন্য ধন্যবাদ! ❤️' : 'Thank you for your donation! ❤️');
      const r = await api.get(`/donations/${id}`);
      setItem(r.data.data);
      setAmount(''); setMsg('');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setDonating(false); }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'5rem' }}><div className="spinner"/></div>;
  if (!item)   return <div className="empty"><div className="empty-icon">❌</div><div>Not found</div></div>;

  const pct = Math.min(100, Math.round((item.amount_raised / item.amount_needed) * 100));

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <Link to="/donation" className="btn btn-ghost btn-sm" style={{ marginBottom:'1rem' }}><FiArrowLeft size={13}/>{t('common.back')}</Link>
        </div>
      </div>
      <div className="container" style={{ padding:'2rem 1.5rem', maxWidth:860 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'2rem', alignItems:'start' }}>
          {/* Left */}
          <div>
            {item.image && <img src={item.image} alt={item.title} style={{ width:'100%', borderRadius:16, marginBottom:'1.5rem', maxHeight:320, objectFit:'cover', border:'1px solid var(--border)' }}/>}
            <div style={{ display:'flex', gap:8, marginBottom:'1rem', flexWrap:'wrap' }}>
              {item.is_urgent && <span className="badge badge-red">⚡ {t('donation.urgent')}</span>}
              <span className="badge badge-gray">{item.category}</span>
              <span className={`badge ${item.status==='approved'?'badge-green':'badge-amber'}`}>{item.status}</span>
            </div>
            <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'#fff', marginBottom:'1rem', lineHeight:1.2 }}>{item.title}</h1>
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'1.5rem', fontSize:'0.82rem', color:'var(--text-muted)' }}>
              <span style={{ display:'flex', alignItems:'center', gap:5 }}><FiUser size={13}/>{item.poster_name}{item.poster_verified&&<FiShield size={11} style={{ color:'var(--cyan)' }}/>}</span>
              {item.district && <span>📍 {item.district}</span>}
              {item.deadline && <span style={{ display:'flex', alignItems:'center', gap:5 }}><FiCalendar size={13}/>{new Date(item.deadline).toLocaleDateString()}</span>}
            </div>
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:'1.5rem', marginBottom:'1.5rem' }}>
              <p style={{ color:'var(--text-muted)', lineHeight:1.8, whiteSpace:'pre-line' }}>{item.description}</p>
            </div>
            {item.poster_phone && (
              <a href={`tel:${item.poster_phone}`} className="btn btn-secondary" style={{ gap:8 }}><FiPhone size={14}/>{t('common.contact')}: {item.poster_phone}</a>
            )}

            {/* Transactions */}
            {item.transactions?.length > 0 && (
              <div style={{ marginTop:'2rem' }}>
                <h3 style={{ fontWeight:700, color:'#fff', marginBottom:'1rem', fontSize:'1rem' }}>
                  {isBn?'সাম্প্রতিক দান':'Recent Donations'} ({item.transactions.length})
                </h3>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {item.transactions.map(tx => (
                    <div key={tx.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'var(--surface-2)', borderRadius:10, border:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--grad-red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:800, color:'#fff' }}>
                          {tx.is_anonymous ? '?' : tx.donor_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight:600, fontSize:'0.85rem', color:'#fff' }}>{tx.is_anonymous ? (isBn?'পরিচয় গোপন':'Anonymous') : tx.donor_name || 'Someone'}</div>
                          {tx.message && <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{tx.message}</div>}
                        </div>
                      </div>
                      <div style={{ fontWeight:800, color:'var(--green)', fontSize:'0.95rem' }}>+৳{Number(tx.amount).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Donate panel */}
          <div style={{ position:'sticky', top:'80px' }}>
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:18, padding:'1.5rem', marginBottom:'1rem' }}>
              <div style={{ marginBottom:'1.25rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>{t('donation.raised')}</span>
                  <span style={{ fontWeight:800, color:'var(--green)', fontSize:'0.95rem' }}>৳{Number(item.amount_raised).toLocaleString()}</span>
                </div>
                <div className="progress-track" style={{ height:8, marginBottom:6 }}>
                  <div className="progress-fill" style={{ width:`${pct}%` }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text-dim)' }}>
                  <span>{pct}% {isBn?'সম্পন্ন':'complete'}</span>
                  <span>{t('donation.target')}: ৳{Number(item.amount_needed).toLocaleString()}</span>
                </div>
              </div>

              {isAuth && item.status === 'approved' ? (
                <form onSubmit={handleDonate} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
                  <div className="form-group">
                    <label className="form-label">{isBn?'পরিমাণ (৳)':'Amount (BDT)'} *</label>
                    <input type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="500" className="form-input" required/>
                  </div>
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                    {[100,500,1000,5000].map(a=>(
                      <button key={a} type="button" onClick={()=>setAmount(String(a))} className={`btn btn-sm ${amount===String(a)?'btn-primary':'btn-ghost'}`} style={{ flex:1 }}>৳{a}</button>
                    ))}
                  </div>
                  <div className="form-group">
                    <label className="form-label">{isBn?'বার্তা (ঐচ্ছিক)':'Message'}</label>
                    <input value={message} onChange={e=>setMsg(e.target.value)} placeholder={isBn?'অনুপ্রেরণামূলক বার্তা...':'Encouraging message...'} className="form-input"/>
                  </div>
                  <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'0.84rem', color:'var(--text-muted)' }}>
                    <input type="checkbox" checked={anon} onChange={e=>setAnon(e.target.checked)} style={{ width:15, height:15, accentColor:'var(--red)' }}/>
                    {isBn?'পরিচয় গোপন রাখুন':'Donate anonymously'}
                  </label>
                  <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', height:44 }} disabled={donating}>
                    {donating ? <><div className="spinner spinner-sm"/></> : <><FiHeart size={14}/>{t('donation.donate')}</>}
                  </button>
                </form>
              ) : !isAuth ? (
                <Link to="/login" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>{t('nav.login')} {isBn?'করে দান করুন':'to Donate'}</Link>
              ) : (
                <div style={{ textAlign:'center', padding:'1rem', color:'var(--text-dim)', fontSize:'0.85rem' }}>{isBn?'এই অনুরোধটি বর্তমানে সক্রিয় নয়':'This request is not currently active'}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
