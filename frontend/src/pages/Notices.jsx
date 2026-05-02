import { useState } from 'react';
import { 
  FiBell, FiBookOpen, FiBriefcase, FiAward, 
  FiFileText, FiArrowRight, FiClock, FiExternalLink, FiActivity 
} from 'react-icons/fi';

// ১. ক্যাটাগরি লিস্ট (স্ক্রিনশট ২১ ও ২৩ এর সাথে মিল রেখে)
const NOTICE_CATS = [
  { id: 'academic', label: 'Academic Notices', icon: <FiBookOpen />, color: '#8B5CF6' },
  { id: 'career', label: 'Career Hub', icon: <FiBriefcase />, color: '#06B6D4' },
  { id: 'scholarship', label: 'Scholarships', icon: <FiAward />, color: '#F59E0B' },
  { id: 'government', label: 'Gov Gazettes', icon: <FiFileText />, color: '#10B981' },
  { id: 'donate', label: 'Donation Requests', icon: <FiActivity />, color: '#EF4444' },
];

// ২. ডাটাবেস (এক্সপার্ট লেভেল ইনফরমেশন সহ)
const NOTICES_DATA = [
  {
    id: 1, cat: 'academic', title: 'HSC Examination Schedule 2026 Released',
    date: 'May 02, 2026', org: 'Education Board', urgent: true,
    desc: 'The official routine for HSC candidates of all boards has been published. Exams start from June 15.'
  },
  {
    id: 2, cat: 'academic', title: 'University Admission Test: Unit A Results',
    date: 'May 01, 2026', org: 'Dhaka University', urgent: false,
    desc: 'The results for the Science unit admission test are now available on the official portal.'
  },
  {
    id: 3, cat: 'career', title: 'Senior Software Engineer - National Data Center',
    date: 'Apr 30, 2026', org: 'ICT Division', urgent: true,
    desc: 'New job circular for the Bangladesh Government digitization project. Minimum 5 years experience required.'
  },
  {
    id: 4, cat: 'career', title: 'Bank Asia Trainee Officer Recruitment',
    date: 'Apr 28, 2026', org: 'Bank Asia Ltd', urgent: false,
    desc: 'Fresh graduates are encouraged to apply for the Management Trainee program. Deadline: May 20.'
  },
  {
    id: 5, cat: 'scholarship', title: 'Prime Minister Achievement Award 2026',
    date: 'May 01, 2026', org: 'PMO Office', urgent: true,
    desc: 'Applications are open for merit-based scholarships for university students across the country.'
  },
  {
    id: 6, cat: 'scholarship', title: 'Full-Free Studentship for Undergraduates',
    date: 'Apr 25, 2026', org: 'Education Ministry', urgent: false,
    desc: 'Special grants for students from low-income families to continue their higher education.'
  },
  {
    id: 7, cat: 'government', title: 'New Labor Law Amendments 2026',
    date: 'Apr 20, 2026', org: 'Ministry of Law', urgent: false,
    desc: 'The official gazette for the updated labor regulations has been published for public review.'
  },
  {
    id: 8, cat: 'donate', title: 'Emergency Medical Aid for Flood Victims',
    date: 'May 02, 2026', org: 'Red Crescent', urgent: true,
    desc: 'Urgent collection of medicine and dry food for the affected people in Sylhet region.'
  },
  {
    id: 9, cat: 'donate', title: 'Education Fund for Orphans - 2026',
    date: 'May 01, 2026', org: 'People E-Sheba', urgent: false,
    desc: 'Help us provide school supplies and tuition fees for 500 underprivileged children.'
  }
];

export default function Notices() {
  const [activeTab, setActiveTab] = useState('academic');

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- HERO SECTION --- */}
      <div style={{ 
        position: 'relative', padding: '8rem 1rem 4rem', textAlign: 'center', overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Background Gradients */}
        <div style={{
          position: 'absolute', top: '10%', left: '-5%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.07) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 8, 
            background: 'rgba(139, 92, 246, 0.1)', padding: '8px 20px', 
            borderRadius: '100px', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 700,
            marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <FiBell /> Official Updates & Bulletins
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-2px' }}>
            Notice Center
          </h1>
          <p style={{ color: '#71717a', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Stay informed with the latest academic, career, and donation updates tailored for you.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        
        {/* --- CATEGORY SELECTOR --- */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '15px', marginBottom: '3rem' 
        }}>
          {NOTICE_CATS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                background: activeTab === cat.id ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activeTab === cat.id ? '#8b5cf6' : 'rgba(255,255,255,0.05)'}`,
                padding: '20px', borderRadius: '20px', color: '#fff', cursor: 'pointer',
                transition: '0.3s all', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
              }}
            >
              <div style={{ color: activeTab === cat.id ? '#8b5cf6' : '#71717a', fontSize: '1.5rem' }}>
                {cat.icon}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* --- NOTICE LIST --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {NOTICES_DATA.filter(n => n.cat === activeTab).map(notice => (
            <div key={notice.id} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: '20px'
            }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase' }}>
                    {notice.org}
                  </span>
                  {notice.urgent && (
                    <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>
                      URGENT
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>
                  {notice.title}
                </h3>
                <p style={{ color: '#71717a', fontSize: '0.9rem', lineHeight: 1.5 }}>{notice.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginTop: '15px', color: '#52525b', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><FiClock /> {notice.date}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <FiExternalLink size={16} /> View Details
                </button>
                <button style={{
                  padding: '12px 18px', borderRadius: '12px', border: 'none',
                  background: '#8b5cf6', color: '#fff', cursor: 'pointer'
                }}>
                  <FiArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {NOTICES_DATA.filter(n => n.cat === activeTab).length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#52525b' }}>
              <FiBell size={40} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>No current updates in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
