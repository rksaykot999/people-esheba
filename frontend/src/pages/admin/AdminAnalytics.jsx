import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiBarChart2, FiDroplet, FiUsers, FiEye, FiDollarSign, FiPieChart, FiTrendingUp } from 'react-icons/fi';

const COLORS = ['#E63946','#06B6D4','#10B981','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#F97316'];

export default function AdminAnalytics() {
  const { t, isBn } = useLang();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(r=>setData(r.data.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner"/></div>;
  if (!data)   return <div style={{ color:'var(--red)' }}>Failed to load analytics</div>;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ display:'flex', alignItems:'center', gap:10, fontWeight:800, fontSize:'1.6rem', color:'var(--text-strong)', marginBottom:4 }}>
            <FiBarChart2 style={{ color:'var(--cyan)' }}/> {t('admin.analytics')}
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>{isBn?'প্ল্যাটফর্ম কার্যক্রমের বিস্তারিত বিশ্লেষণ':'Detailed insights into platform activity'}</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginBottom:'1.25rem' }}>
        {/* Blood group distribution */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            <FiDroplet style={{ color:'#EF4444' }}/> {isBn?'রক্তের গ্রুপ বিতরণ':'Blood Group Distribution'}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.bloodByGroup}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="blood_group" tick={{ fill:'var(--text-dim)', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'var(--text-dim)', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'var(--surface-3)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text-strong)', fontSize:12 }}/>
              <Bar dataKey="count" fill="var(--red)" radius={[6,6,0,0]}>
                {data.bloodByGroup?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Volunteer by category */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            <FiUsers style={{ color:'var(--primary)' }}/> {isBn?'স্বেচ্ছাসেবক বিভাগ':'Volunteer Categories'}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.volunteerByCategory||[]} cx="50%" cy="50%" outerRadius={90} dataKey="count" nameKey="category"
                label={({category, percent}) => `${category} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {(data.volunteerByCategory||[]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:'var(--surface-3)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text-strong)', fontSize:12 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        {/* Top jobs */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            <FiEye style={{ color:'var(--cyan)' }}/> {isBn?'সর্বাধিক দেখা চাকরি':'Most Viewed Jobs'}
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {(data.topJobs||[]).map((j, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:26, height:26, borderRadius:7, background:`${COLORS[i]}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:800, color:COLORS[i], flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, color:'var(--text-strong)', fontSize:'0.83rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{j.title}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-dim)' }}>{j.company}</div>
                </div>
                <div style={{ fontSize:'0.78rem', color:'var(--cyan)', fontWeight:700, flexShrink:0 }}>{j.views} views</div>
              </div>
            ))}
            {!data.topJobs?.length && <div style={{ textAlign:'center', color:'var(--text-dim)', fontSize:'0.85rem', padding:'1rem' }}>No data</div>}
          </div>
        </div>

        {/* Top donations */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
          <h3 style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--text-strong)', marginBottom:'1.25rem', fontSize:'0.95rem' }}>
            <FiDollarSign style={{ color:'var(--amber)' }}/> {isBn?'সর্বাধিক সংগ্রহ':'Top Fundraisers'}
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {(data.topDonations||[]).map((d, i) => {
              const pct = Math.min(100, Math.round((d.amount_raised/d.amount_needed)*100));
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:26, height:26, borderRadius:7, background:`${COLORS[i]}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:800, color:COLORS[i], flexShrink:0 }}>{i+1}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, color:'var(--text-strong)', fontSize:'0.83rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.title}</div>
                    <div style={{ height:4, background:'var(--surface-3)', borderRadius:99, marginTop:5 }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${COLORS[i]},${COLORS[i]}88)`, borderRadius:99 }}/>
                    </div>
                  </div>
                  <div style={{ fontSize:'0.78rem', color:'var(--green)', fontWeight:700, flexShrink:0 }}>৳{Number(d.amount_raised).toLocaleString()}</div>
                </div>
              );
            })}
            {!data.topDonations?.length && <div style={{ textAlign:'center', color:'var(--text-dim)', fontSize:'0.85rem', padding:'1rem' }}>No data</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
