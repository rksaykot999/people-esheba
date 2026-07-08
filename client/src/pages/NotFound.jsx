import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useLang } from '../context/LanguageContext';
export default function NotFound() {
  const { isBn } = useLang();
  return (
    <div style={{ minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'5rem', marginBottom:'1.5rem', color: 'var(--text-muted)' }}><FiSearch /></div>
        <h1 style={{ fontSize:'3rem', fontWeight:900, color:'var(--red)', marginBottom:'0.5rem' }}>404</h1>
        <h2 style={{ fontWeight:700, color:'#fff', marginBottom:'0.75rem' }}>{isBn?'পেজটি পাওয়া যায়নি':'Page Not Found'}</h2>
        <p style={{ color:'var(--text-muted)', marginBottom:'2rem' }}>{isBn?'আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই।':'The page you are looking for does not exist.'}</p>
        <Link to="/" className="btn btn-primary btn-lg">{isBn?'হোমে ফিরুন':'Go Home'}</Link>
      </div>
    </div>
  );
}
