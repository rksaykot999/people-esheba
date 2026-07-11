import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiHeart, FiPhone, FiMail, FiMapPin,
  FiAlertCircle, FiActivity, FiTruck, FiUsers,
  FiBriefcase, FiZap, FiBook, FiList,
  FiBell, FiDroplet, FiShield, FiAward,
} from 'react-icons/fi';

export default function Footer() {
  const { t, isBn } = useLang();
  const { theme } = useTheme();
  const year = new Date().getFullYear();

  const cols = [
    {
      title: isBn ? 'প্রধান সেবা' : 'Main Services',
      links: [
        { label: isBn ? 'জরুরি সেবা'   : 'Emergency',      to: '/emergency',  icon: <FiZap size={13}/> },
        { label: isBn ? 'স্বাস্থ্যসেবা' : 'Health',         to: '/health',     icon: <FiHeart size={13}/> },
        { label: isBn ? 'চাকরি'         : 'Jobs',           to: '/jobs',       icon: <FiBriefcase size={13}/> },
        { label: isBn ? 'শিক্ষা'        : 'Education',      to: '/education',  icon: <FiBook size={13}/> },
        { label: isBn ? 'সেবা সমূহ'     : 'Services',       to: '/services',   icon: <FiList size={13}/> },
        { label: isBn ? 'দান ও সাহায্য' : 'Donation',       to: '/donation',   icon: <FiActivity size={13}/> },
      ],
    },
    {
      title: isBn ? 'আরও লিংক' : 'More Links',
      links: [
        { label: isBn ? 'নোটিশ বোর্ড'  : 'Notices',        to: '/notices',    icon: <FiBell size={13}/> },
        { label: isBn ? 'রক্তদান'       : 'Blood Donation', to: '/blood',      icon: <FiDroplet size={13}/> },
        { label: isBn ? 'স্বেচ্ছাসেবক'  : 'Volunteers',     to: '/volunteers', icon: <FiUsers size={13}/> },
        { label: isBn ? 'মানচিত্র'      : 'Map',            to: '/map',        icon: <FiMapPin size={13}/> },
      ],
    },
    {
      title: isBn ? 'জরুরি নম্বর' : 'Emergency Numbers',
      links: [
        { label: isBn ? 'জাতীয় জরুরি: ৯৯৯'      : 'National Emergency: 999',  to: 'tel:999',   icon: <FiAlertCircle size={13}/> },
        { label: isBn ? 'ফায়ার সার্ভিস: ১৯৯'     : 'Fire Service: 199',        to: 'tel:199',   icon: <FiActivity size={13}/> },
        { label: isBn ? 'অ্যাম্বুলেন্স: ১৯৯'      : 'Ambulance: 199',           to: 'tel:199',   icon: <FiTruck size={13}/> },
        { label: isBn ? 'শিশু হেল্পলাইন: ১০৯৮'    : 'Child Helpline: 1098',     to: 'tel:1098',  icon: <FiUsers size={13}/> },
        { label: isBn ? 'নারী সহায়তা: ৯৯৯'        : 'Women Helpline: 999',      to: 'tel:999',   icon: <FiShield size={13}/> },
        { label: isBn ? 'মানসিক স্বাস্থ্য: ১৬৭৮৯' : 'Mental Health: 16789',    to: 'tel:16789', icon: <FiAward size={13}/> },
      ],
    },
    {
      title: isBn ? 'যোগাযোগ' : 'Contact',
      links: [
        { label: 'info@esheba.bd',       to: 'mailto:info@esheba.bd',   icon: <FiMail size={13}/> },
        { label: '+880 1700-000000',      to: 'tel:+8801700000000',      icon: <FiPhone size={13}/> },
        { label: isBn ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh', to: '/map', icon: <FiMapPin size={13}/> },
      ],
    },
  ];

  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <div className="container" style={{ padding: '3.5rem 1.5rem 1.5rem' }}>
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', textDecoration: 'none' }}>
              <img src={theme === 'dark' ? '/logo-dark.png' : '/Logo.png'} alt="People E-Sheba" style={{ height: 44, width: 'auto' }} />
            </Link>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 240 }}>
              {isBn
                ? 'বাংলাদেশের সকল নাগরিকের জন্য একটি সমন্বিত ডিজিটাল সেবা প্ল্যাটফর্ম।'
                : 'A unified digital service platform for all citizens of Bangladesh — free, fast, and always available.'}
            </p>
          </div>

          {cols.map((col, i) => (
            <div key={i}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-dim)', marginBottom: '1rem' }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {col.links.map((l, j) => (
                  <Link key={j} to={l.to}
                    style={{ fontSize: '0.83rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {l.icon}{l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>
            © {year} People E-Sheba · {isBn ? 'সকল অধিকার সংরক্ষিত' : 'All rights reserved'} · Made with <FiHeart style={{ display: 'inline', color: 'var(--red)' }} /> for Bangladesh
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[
              { label: isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy', to: '/privacy' },
              { label: isBn ? 'শর্তাবলী' : 'Terms', to: '/terms' },
              { label: isBn ? 'সাহায্য' : 'Help', to: '/help' },
            ].map(l => (
              <Link key={l.to} to={l.to}
                style={{ fontSize: '0.8rem', color: 'var(--text-dim)', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
              >{l.label}</Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid { display: grid; grid-template-columns: 1.6fr repeat(4, 1fr); gap: 2.5rem; margin-bottom: 2.5rem; }
        @media(max-width:1100px) { .footer-grid { grid-template-columns: 1fr 1fr 1fr; } .footer-grid > div:first-child { grid-column: span 3; } }
        @media(max-width:640px)  { .footer-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; } .footer-grid > div:first-child { grid-column: span 2; } }
        @media(max-width:400px)  { .footer-grid { grid-template-columns: 1fr; } .footer-grid > div:first-child { grid-column: span 1; } }
      `}</style>
    </footer>
  );
}
