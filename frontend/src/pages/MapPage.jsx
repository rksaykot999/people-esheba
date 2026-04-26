import { useLang } from '../context/LanguageContext';
export default function MapPage() {
  const { isBn } = useLang();
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="section-title" style={{ marginBottom:6 }}>🗺️ {isBn?'মানচিত্র':'Services Map'}</h1>
          <p style={{ color:'var(--text-muted)' }}>{isBn?'আপনার কাছের সব সেবা মানচিত্রে দেখুন':'View all services near you on the map'}</p>
        </div>
      </div>
      <div className="container" style={{ padding:'2rem 1.5rem' }}>
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, height:520, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem' }}>
          <div style={{ fontSize:'4rem' }}>🗺️</div>
          <div style={{ fontWeight:700, color:'#fff', fontSize:'1.1rem' }}>{isBn?'Google Maps সংযুক্ত করুন':'Connect Google Maps API'}</div>
          <p style={{ color:'var(--text-muted)', textAlign:'center', maxWidth:400, fontSize:'0.9rem', lineHeight:1.6 }}>
            {isBn
              ? '.env ফাইলে VITE_GOOGLE_MAPS_KEY যোগ করুন, তারপর এখানে @react-google-maps/api দিয়ে ম্যাপ দেখাবে।'
              : 'Add VITE_GOOGLE_MAPS_KEY to your .env, then replace this placeholder with @react-google-maps/api to display nearby hospitals, blood donors, and services.'}
          </p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {['🏥 Hospitals','🩸 Blood Donors','👮 Police','🚒 Fire Service'].map(s=>(
              <span key={s} className="badge badge-cyan" style={{ fontSize:'0.82rem', padding:'5px 12px' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
