import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiUsers, FiBriefcase, FiHeart, FiUsers as FiVol, FiTrendingUp, FiEye, FiCheck, FiClock, FiDroplet, FiDollarSign, FiAlertTriangle, FiPlusCircle, FiActivity, FiPieChart } from 'react-icons/fi';
import { MdOutlineMedicalServices, MdOutlineLocalPharmacy, MdOutlineSchool, MdOutlineAgriculture } from 'react-icons/md';

const PIE_COLORS = ['#E63946','#06B6D4','#10B981','#F59E0B','#8B5CF6','#EC4899'];

function StatCard({ icon, label, value, sub, color, to }) {
  const inner = (
    <div style={{ 
      background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'1.5rem', 
      transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: to?'pointer':'default',
      position: 'relative', overflow: 'hidden'
    }}
      onMouseEnter={e=>{ if(to){ e.currentTarget.style.borderColor=color; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 10px 25px -5px ${color}20`; }}}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
      <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '4rem', opacity: 0.03, color }}>{icon}</div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem', position: 'relative' }}>
        <div style={{ 
          width:48, height:48, borderRadius:14, background:`${color}12`, border:`1px solid ${color}25`, 
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', color,
          boxShadow: `inset 0 0 10px ${color}10`
        }}>{icon}</div>
        {sub && <span style={{ fontSize:'0.72rem', color:'var(--green)', background:'rgba(16,185,129,0.1)', padding:'4px 10px', borderRadius:99, fontWeight:700, border: '1px solid rgba(16,185,129,0.2)' }}>{sub}</span>}
      </div>
      <div style={{ fontSize:'2.2rem', fontWeight:800, color:'var(--text)', lineHeight:1, marginBottom:6, letterSpacing: '-0.02em' }}>{value ?? '—'}</div>
      <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:600, letterSpacing: '0.01em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
  return to ? <Link to={to} style={{ textDecoration:'none' }}>{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const { t, isBn } = useLang();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r=>setData(r.data.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>;
  if (!data) return <div style={{ color:'var(--red)' }}>Failed to load dashboard</div>;

  const s = data.stats;
  const DON_STATUS = [
    { name:'Approved', value: s.active_donations },
    { name:'Pending',  value: s.pending_donations },
  ];

  return (
    <div>
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontWeight:800, fontSize:'1.5rem', color:'var(--text-strong)', marginBottom:4 }}>{t('admin.dashboard')} {isBn?'সারসংক্ষেপ':'Overview'}</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'0.87rem' }}>{isBn?'প্ল্যাটফর্মের সামগ্রিক অবস্থা':'Platform summary at a glance'}</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard icon={<FiUsers/>} label={t('admin.totalUsers')}  value={s.total_users?.toLocaleString()}  color="#06B6D4"   to="/admin/users"     sub={`+${s.new_users_today} today`}/>
        <StatCard icon={<FiBriefcase/>} label={t('admin.totalJobs')} value={s.active_jobs?.toLocaleString()} color="#10B981"  to="/admin/jobs"/>
        <StatCard icon={<FiHeart/>} label={t('admin.totalDonations')} value={s.pending_donations?.toLocaleString()} color="#E63946" to="/admin/donations" sub={s.pending_donations>0? (isBn ? 'রিভিউ প্রয়োজন' : 'Review needed') : undefined}/>
        <StatCard icon={<FiVol/>} label={t('admin.totalVolunteers')} value={s.active_volunteers?.toLocaleString()} color="#8B5CF6" to="/admin/volunteers"/>
        <StatCard icon={<FiDroplet/>} label="Available Donors" value={s.available_donors?.toLocaleString()} color="#E63946" to="/admin/blood"/>
        <StatCard icon={<FiDollarSign/>} label="Total Donated (৳)" value={Number(s.total_donated||0).toLocaleString()} color="#F59E0B"/>
        <StatCard icon={<FiAlertTriangle/>} label="Emergency Services" value={s.emergency_services?.toLocaleString()} color="#E63946" to="/admin/emergency"/>
        <StatCard icon={<FiClock/>} label="Pending Reports" value={s.pending_reports?.toLocaleString()} color="#F59E0B" to="/admin/reports"/>
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'1.25rem', marginBottom:'1.75rem' }}>
        {/* Line chart */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            <FiTrendingUp style={{ color:'var(--red)' }}/> {isBn?'নতুন ব্যবহারকারী (গত ৬ মাস)':'New Users (Last 6 Months)'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.monthly_users}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="month" tick={{ fill:'var(--text-dim)', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'var(--text-dim)', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'var(--surface-3)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text-strong)', fontSize:12 }}/>
              <Line type="monotone" dataKey="count" stroke="var(--red)" strokeWidth={2.5} dot={{ fill:'var(--red)', r:4 }} activeDot={{ r:6 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            <FiPieChart style={{ color:'var(--cyan)' }}/> {isBn?'দান অবস্থা':'Donation Status'}
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={DON_STATUS} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {DON_STATUS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:'var(--surface-3)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text-strong)', fontSize:12 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        {/* Recent users */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
            <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', fontSize:'0.95rem' }}>
              <FiUsers style={{ color:'var(--cyan)' }}/> {isBn?'সাম্প্রতিক ব্যবহারকারী':'Recent Users'}
            </h3>
            <Link to="/admin/users" style={{ fontSize:'0.78rem', color:'var(--cyan)', fontWeight:600, textDecoration:'none' }}>{t('common.viewAll')}</Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {data.recent_users?.slice(0,6).map(u => (
              <div key={u.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--grad-cyan)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:800, color:'var(--text-strong)', flexShrink:0 }}>
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, color:'var(--text-strong)', fontSize:'0.83rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-dim)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</div>
                </div>
                <span className={`badge ${u.role==='admin'?'badge-red':'badge-gray'}`} style={{ fontSize:'0.65rem' }}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending donations */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
            <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', fontSize:'0.95rem' }}>
              <FiClock style={{ color:'var(--amber)' }}/> {isBn?'অনুমোদনের অপেক্ষায়':'Pending Approvals'}
            </h3>
            <Link to="/admin/donations" style={{ fontSize:'0.78rem', color:'var(--cyan)', fontWeight:600, textDecoration:'none' }}>{t('common.viewAll')}</Link>
          </div>
          {data.pending_donations?.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-dim)', fontSize:'0.85rem', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
              <FiCheck size={24} style={{ color:'var(--green)', opacity:0.5 }}/>
              {isBn?'সব পরিষ্কার':'All clear!'}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {data.pending_donations?.slice(0,5).map(d => (
                <div key={d.id} style={{ padding:'10px 12px', background:'var(--surface-2)', borderRadius:10, border:'1px solid var(--border)' }}>
                  <div style={{ fontWeight:600, color:'var(--text-strong)', fontSize:'0.83rem', marginBottom:2 }}>{d.title}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.73rem', color:'var(--text-dim)' }}>
                    <span>by {d.poster_name}</span>
                    <span>৳{Number(d.amount_needed).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
