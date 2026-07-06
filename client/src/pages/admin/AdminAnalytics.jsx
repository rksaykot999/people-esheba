import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import {
  FiBarChart2, FiDroplet, FiUsers, FiEye, FiDollarSign,
  FiRefreshCw, FiTrendingUp, FiBriefcase,
} from 'react-icons/fi';

const COLORS = ['#E63946','#06B6D4','#10B981','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#F97316'];

/* Custom tooltip */
function CustomTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:'var(--surface-3)', border:'1px solid var(--border)',
      borderRadius:10, padding:'8px 12px', fontSize:12,
    }}>
      <p style={{ color:'var(--text-muted)', marginBottom:4 }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color: p.color || 'var(--text-strong)', fontWeight:700, margin:0 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function AdminAnalytics() {
  const { t, isBn } = useLang();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.get('/admin/analytics')
      .then(r => {
        const d = r.data?.data || {};
        // Ensure all expected keys exist with defaults
        setData({
          topJobs:              d.topJobs              || [],
          topDonations:         d.topDonations         || [],
          bloodByGroup:         d.bloodByGroup         || [],
          volunteerByCategory:  d.volunteerByCategory  || [],
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'4rem', gap:'1rem' }}>
      <div className="spinner"/>
      <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Loading analytics…</p>
    </div>
  );

  if (error || !data) return (
    <div style={{ textAlign:'center', padding:'4rem' }}>
      <div style={{ color:'var(--red)', marginBottom:'1rem', fontSize:'1rem', fontWeight:700 }}>
        Failed to load analytics data
      </div>
      <button onClick={load} className="btn btn-ghost" style={{ border:'1px solid var(--border)' }}>
        <FiRefreshCw size={14}/> Retry
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ display:'flex', alignItems:'center', gap:10, fontWeight:800, fontSize:'1.6rem', color:'var(--text-strong)', marginBottom:4 }}>
            <FiBarChart2 style={{ color:'var(--cyan)' }}/> {t('admin.analytics') || 'Analytics'}
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>
            {isBn ? 'প্ল্যাটফর্ম কার্যক্রমের বিস্তারিত বিশ্লেষণ' : 'Detailed insights into platform activity'}
          </p>
        </div>
        <button onClick={load} className="btn btn-ghost" style={{ border:'1px solid var(--border)', height:40 }}>
          <FiRefreshCw size={14}/> {isBn ? 'রিফ্রেশ' : 'Refresh'}
        </button>
      </div>

      {/* ── Row 1: Blood + Volunteers ─────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'1.25rem', marginBottom:'1.25rem' }}>

        {/* Blood group distribution */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            <FiDroplet style={{ color:'#EF4444' }}/> {isBn ? 'রক্তের গ্রুপ বিতরণ' : 'Blood Group Distribution'}
          </h3>
          {data.bloodByGroup.length === 0 ? (
            <div style={{ textAlign:'center', color:'var(--text-dim)', fontSize:'0.85rem', padding:'2rem' }}>
              No blood donor data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.bloodByGroup} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="blood_group" tick={{ fill:'var(--text-dim)', fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'var(--text-dim)', fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip content={<CustomTip/>}/>
                <Bar dataKey="count" name="Donors" radius={[6,6,0,0]}>
                  {data.bloodByGroup.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Volunteer by category */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            <FiUsers style={{ color:'var(--primary)' }}/> {isBn ? 'স্বেচ্ছাসেবক বিভাগ' : 'Volunteer Categories'}
          </h3>
          {data.volunteerByCategory.length === 0 ? (
            <div style={{ textAlign:'center', color:'var(--text-dim)', fontSize:'0.85rem', padding:'2rem' }}>
              No volunteer data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data.volunteerByCategory}
                  cx="50%" cy="50%" outerRadius={85}
                  dataKey="count" nameKey="category"
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false} fontSize={11}
                >
                  {data.volunteerByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
                <Tooltip content={<CustomTip/>}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Row 2: Top jobs + Top donations ──────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'1.25rem' }}>

        {/* Top jobs by views */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            <FiEye style={{ color:'var(--cyan)' }}/> {isBn ? 'সর্বাধিক দেখা চাকরি' : 'Most Viewed Jobs'}
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {data.topJobs.length === 0 ? (
              <div style={{ textAlign:'center', color:'var(--text-dim)', fontSize:'0.85rem', padding:'1.5rem' }}>No jobs data yet</div>
            ) : data.topJobs.map((j, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{
                  width:26, height:26, borderRadius:7, flexShrink:0,
                  background:`${COLORS[i % COLORS.length]}22`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.75rem', fontWeight:800, color:COLORS[i % COLORS.length],
                }}>{i+1}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, color:'var(--text-strong)', fontSize:'0.83rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{j.title}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-dim)' }}>{j.company}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.78rem', color:'var(--cyan)', fontWeight:700, flexShrink:0 }}>
                  <FiEye size={11}/> {j.views || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top donations */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            <FiDollarSign style={{ color:'var(--amber)' }}/> {isBn ? 'সর্বাধিক সংগ্রহ' : 'Top Fundraisers'}
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {data.topDonations.length === 0 ? (
              <div style={{ textAlign:'center', color:'var(--text-dim)', fontSize:'0.85rem', padding:'1.5rem' }}>No donation data yet</div>
            ) : data.topDonations.map((d, i) => {
              const pct = d.amount_needed > 0 ? Math.min(100, Math.round((d.amount_raised / d.amount_needed) * 100)) : 0;
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{
                    width:26, height:26, borderRadius:7, flexShrink:0,
                    background:`${COLORS[i % COLORS.length]}22`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'0.75rem', fontWeight:800, color:COLORS[i % COLORS.length],
                  }}>{i+1}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, color:'var(--text-strong)', fontSize:'0.83rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.title}</div>
                    <div style={{ height:4, background:'var(--surface-3)', borderRadius:99, marginTop:5 }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${COLORS[i % COLORS.length]},${COLORS[i % COLORS.length]}88)`, borderRadius:99, transition:'width 1s ease' }}/>
                    </div>
                  </div>
                  <div style={{ fontSize:'0.78rem', color:'var(--green)', fontWeight:700, flexShrink:0 }}>৳{Number(d.amount_raised || 0).toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
