import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FiHeart, FiPlus, FiPlusCircle, FiActivity, 
  FiBook, FiCloudLightning, FiCoffee, FiBox, FiArrowRight 
} from 'react-icons/fi';

const DONATE_CATS = [
  { key: 'all', label: 'All', color: '#8B5CF6' },
  { key: 'medical', label: 'Medical Aid', color: '#EF4444' },
  { key: 'education', label: 'Education Fund', color: '#06B6D4' },
  { key: 'disaster', label: 'Disaster', color: '#F59E0B' },
  { key: 'food', label: 'Food', color: '#10B981' },
  { key: 'other', label: 'Other', color: '#EC4899' },
];

const HELP_REQUESTS = [
  // --- Medical Aid ---
  {
    id: 1, cat: 'medical', title: 'Emergency Kidney Transplant Support',
    name: 'Rahim Uddin', location: 'Barishal', amount: '50,000 BDT Needed',
    desc: 'Critical medical emergency. Patient needs immediate surgery support at Barishal Medical College.',
    urgency: 'High', date: '2026-05-02'
  },
  {
    id: 5, cat: 'medical', title: 'Thalassemia Treatment for 8yr Child',
    name: 'Mitu Akter', location: 'Dhaka', amount: '25,000 BDT Needed',
    desc: 'Monthly blood transfusion and medication costs for a young child from a low-income family.',
    urgency: 'High', date: '2026-05-01'
  },

  // --- Education Fund ---
  {
    id: 2, cat: 'education', title: 'Tuition Fees for Orphan Student',
    name: 'Sumi Akter', location: 'Dhaka', amount: '12,000 BDT Needed',
    desc: 'Support a brilliant student to continue her HSC studies after losing her father. Needs help with exam fees.',
    urgency: 'Medium', date: '2026-05-01'
  },
  {
    id: 6, cat: 'education', title: 'Medical Admission Coaching Fee',
    name: 'Tanvir Hossain', location: 'Rajshahi', amount: '15,000 BDT Needed',
    desc: 'A meritorious student from a rural background needs support for his medical admission preparation.',
    urgency: 'Medium', date: '2026-04-28'
  },

  // --- Disaster Relief ---
  {
    id: 3, cat: 'disaster', title: 'Flood Relief Materials for Sylhet',
    name: 'Local Community', location: 'Sylhet', amount: 'Any Amount',
    desc: 'Providing dry food and clean water to families affected by sudden flash floods in Sunamganj.',
    urgency: 'High', date: '2026-05-02'
  },
  {
    id: 7, cat: 'disaster', title: 'Rebuilding Home After Fire',
    name: 'Anwar Ali', location: 'Gazipur', amount: '30,000 BDT Needed',
    desc: 'A short circuit caused a fire that destroyed a small family home. Need funds for tin and wood.',
    urgency: 'High', date: '2026-04-25'
  },

  // --- Food Support ---
  {
    id: 4, cat: 'food', title: 'Iftar Program for Street Children',
    name: 'Volunteer Group', location: 'Chittagong', amount: '5,000 BDT Needed',
    desc: 'Help us provide nutritious Iftar meals to 100 street children daily throughout Ramadan.',
    urgency: 'Normal', date: '2026-04-30'
  },
  {
    id: 8, cat: 'food', title: 'Monthly Grocery for Elderly Couple',
    name: 'Ayesha Begum', location: 'Khulna', amount: '3,500 BDT Needed',
    desc: 'An elderly couple with no income source needs help with basic food supplies for the month.',
    urgency: 'Normal', date: '2026-05-02'
  },

  // --- Agriculture & Other ---
  {
    id: 9, cat: 'other', title: 'Seeds & Fertilizer for Poor Farmer',
    name: 'Moklesur Rahman', location: 'Rangpur', amount: '8,000 BDT Needed',
    desc: 'Support a farmer to start his seasonal cultivation after a heavy crop loss last year.',
    urgency: 'Medium', date: '2026-04-27'
  },
  {
    id: 10, cat: 'other', title: 'Wheelchair for Disabled Youth',
    name: 'Jamil Ahmed', location: 'Comilla', amount: '10,000 BDT Needed',
    desc: 'A 19-year-old boy needs a wheelchair to regain his mobility and start a small tea stall.',
    urgency: 'High', date: '2026-05-01'
  }
];


export default function Donate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get('category') || 'all';

  const handleCatChange = (key) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') newParams.delete('category');
    else newParams.set('category', key);
    setSearchParams(newParams);
  };

  const filteredRequests = HELP_REQUESTS.filter(req => 
    activeCat === 'all' || req.cat === activeCat
  );

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- HERO SECTION --- */}
      <div style={{ padding: '8rem 1rem 4rem', textAlign: 'center', position: 'relative' }}>
         <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '400px', height: '200px', background: 'rgba(239, 68, 68, 0.1)',
          filter: 'blur(100px)', borderRadius: '100%', pointerEvents: 'none'
        }} />
        
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>
          Help Requests
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', marginBottom: '3rem' }}>
          Support people in need across Bangladesh through verified community requests.
        </p>

        {/* --- ACTION BUTTONS & FILTERS --- */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <button style={{
            background: '#ef4444', color: '#fff', border: 'none', padding: '14px 28px',
            borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)'
          }}>
            <FiPlusCircle size={20} /> Post Help Request
          </button>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {DONATE_CATS.map(c => (
              <button
                key={c.key}
                onClick={() => handleCatChange(c.key)}
                style={{
                  padding: '10px 20px', borderRadius: '10px', border: activeCat === c.key ? `2px solid ${c.color}` : '1px solid rgba(255,255,255,0.1)',
                  background: activeCat === c.key ? `${c.color}15` : 'transparent',
                  color: activeCat === c.key ? c.color : '#71717a',
                  fontWeight: 600, cursor: 'pointer', transition: '0.2s'
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        {filteredRequests.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {filteredRequests.map(req => (
              <div key={req.id} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                padding: '24px', borderRadius: '24px', transition: '0.3s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ 
                    background: req.urgency === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                    color: req.urgency === 'High' ? '#ef4444' : '#a1a1aa',
                    padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800
                  }}>
                    {req.urgency} Priority
                  </span>
                  <span style={{ color: '#71717a', fontSize: '0.8rem' }}>{req.date}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>{req.title}</h3>
                <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{req.desc}</p>
                
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                    <span>{req.amount}</span>
                    <span style={{ color: '#71717a' }}>{req.location}</span>
                  </div>
                </div>

                <button style={{
                  width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}>
                  Donate Now <FiArrowRight />
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State - যখন কোনো ডাটা থাকবে না */
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❤️</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>No requests found</h3>
            <p style={{ color: '#71717a' }}>Try switching categories or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}