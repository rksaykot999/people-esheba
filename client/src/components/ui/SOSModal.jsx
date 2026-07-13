import { useEffect, useState, useMemo } from 'react';
import { FiX, FiPhone, FiAlertTriangle, FiSearch, FiCopy, FiCheck } from 'react-icons/fi';
import { useLang } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

/* ── Bangladesh emergency & service helplines, grouped by category ── */
const GROUPS = [
  {
    key: 'critical',
    titleEn: 'Critical Emergency',
    titleBn: 'জরুরি জীবনরক্ষা',
    color: '#E63946',
    contacts: [
      { icon: '🆘', labelEn: 'National Emergency', labelBn: 'জাতীয় জরুরি সেবা', number: '999', descEn: 'Police · Fire · Ambulance', descBn: 'পুলিশ · ফায়ার · অ্যাম্বুলেন্স' },
      { icon: '🏛️', labelEn: 'Govt Info & Services', labelBn: 'সরকারি তথ্য ও সেবা', number: '333', descEn: 'National helpline', descBn: 'জাতীয় হেল্পলাইন' },
      { icon: '🚒', labelEn: 'Fire Service', labelBn: 'ফায়ার সার্ভিস', number: '199', descEn: 'Fire & rescue', descBn: 'আগুন ও উদ্ধার' },
      { icon: '🚑', labelEn: 'Ambulance', labelBn: 'অ্যাম্বুলেন্স', number: '199', descEn: 'Medical transport', descBn: 'চিকিৎসা পরিবহন' },
      { icon: '👮', labelEn: 'Police Control Room', labelBn: 'পুলিশ কন্ট্রোল রুম', number: '999', descEn: 'Nationwide', descBn: 'সারাদেশ' },
    ],
  },
  {
    key: 'health',
    titleEn: 'Health',
    titleBn: 'স্বাস্থ্য সেবা',
    color: '#10B981',
    contacts: [
      { icon: '🩺', labelEn: 'Shastho Batayon', labelBn: 'স্বাস্থ্য বাতায়ন', number: '16263', descEn: 'Govt health advice', descBn: 'সরকারি স্বাস্থ্য পরামর্শ' },
      { icon: '🧠', labelEn: 'Mental Health (Kaan Pete Roi)', labelBn: 'মানসিক স্বাস্থ্য (কান পেতে রই)', number: '09612119911', descEn: 'Emotional support', descBn: 'মানসিক সহায়তা' },
      { icon: '💊', labelEn: 'Poison Info Center', labelBn: 'বিষক্রিয়া তথ্য কেন্দ্র', number: '02223353000', descEn: 'DMCH poison unit', descBn: 'ঢামেক বিষ ইউনিট' },
      { icon: '🩸', labelEn: 'Quantum Blood', labelBn: 'কোয়ান্টাম ব্লাড', number: '01714010869', descEn: 'Blood donation', descBn: 'রক্তদান সহায়তা' },
    ],
  },
  {
    key: 'women',
    titleEn: 'Women & Child',
    titleBn: 'নারী ও শিশু',
    color: '#EC4899',
    contacts: [
      { icon: '👩', labelEn: 'Women & Child Repression', labelBn: 'নারী ও শিশু নির্যাতন প্রতিরোধ', number: '109', descEn: 'Govt helpline', descBn: 'সরকারি হেল্পলাইন' },
      { icon: '🙋‍♀️', labelEn: 'Women Support (BNWLA)', labelBn: 'নারী সহায়তা (বিএনডব্লিউএলএ)', number: '10921', descEn: 'Legal & shelter', descBn: 'আইন ও আশ্রয়' },
      { icon: '👶', labelEn: 'Child Helpline', labelBn: 'শিশু সহায়তা লাইন', number: '1098', descEn: 'Child protection', descBn: 'শিশু সুরক্ষা' },
      { icon: '🛡️', labelEn: 'Police Cyber Support (Women)', labelBn: 'সাইবার সহায়তা (নারী)', number: '01320000888', descEn: 'Online harassment', descBn: 'অনলাইন হয়রানি' },
    ],
  },
  {
    key: 'civic',
    titleEn: 'Utility & Civic',
    titleBn: 'নাগরিক ও ইউটিলিটি সেবা',
    color: '#3B82F6',
    contacts: [
      { icon: '⚡', labelEn: 'DPDC Electricity', labelBn: 'ডিপিডিসি বিদ্যুৎ', number: '16116', descEn: 'Power complaint', descBn: 'বিদ্যুৎ অভিযোগ' },
      { icon: '💡', labelEn: 'DESCO Electricity', labelBn: 'ডেসকো বিদ্যুৎ', number: '16120', descEn: 'Power complaint', descBn: 'বিদ্যুৎ অভিযোগ' },
      { icon: '🏡', labelEn: 'Palli Bidyut', labelBn: 'পল্লী বিদ্যুৎ', number: '16899', descEn: 'Rural power', descBn: 'গ্রামীণ বিদ্যুৎ' },
      { icon: '🔥', labelEn: 'Titas Gas', labelBn: 'তিতাস গ্যাস', number: '16496', descEn: 'Gas complaint', descBn: 'গ্যাস অভিযোগ' },
      { icon: '🚰', labelEn: 'Dhaka WASA', labelBn: 'ঢাকা ওয়াসা', number: '16162', descEn: 'Water & sewerage', descBn: 'পানি ও পয়ঃনিষ্কাশন' },
      { icon: '🚆', labelEn: 'Bangladesh Railway', labelBn: 'বাংলাদেশ রেলওয়ে', number: '163', descEn: 'Train info', descBn: 'ট্রেন তথ্য' },
    ],
  },
  {
    key: 'legal',
    titleEn: 'Legal & Complaints',
    titleBn: 'আইন ও অভিযোগ',
    color: '#8B5CF6',
    contacts: [
      { icon: '⚖️', labelEn: 'National Legal Aid', labelBn: 'জাতীয় আইনি সহায়তা', number: '16430', descEn: 'Free legal help', descBn: 'বিনামূল্যে আইনি সহায়তা' },
      { icon: '🕵️', labelEn: 'Anti-Corruption (ACC)', labelBn: 'দুর্নীতি দমন কমিশন', number: '106', descEn: 'Report corruption', descBn: 'দুর্নীতির অভিযোগ' },
      { icon: '🛒', labelEn: 'Consumer Rights (DNCRP)', labelBn: 'ভোক্তা অধিকার', number: '16121', descEn: 'Consumer complaint', descBn: 'ভোক্তা অভিযোগ' },
      { icon: '🌾', labelEn: 'Agriculture Call Center', labelBn: 'কৃষি কল সেন্টার', number: '16123', descEn: 'Farming advice', descBn: 'কৃষি পরামর্শ' },
      { icon: '🚦', labelEn: 'Highway Police', labelBn: 'হাইওয়ে পুলিশ', number: '01320182498', descEn: 'Road accidents', descBn: 'সড়ক দুর্ঘটনা' },
    ],
  },
];

const ALL = GROUPS.flatMap(g => g.contacts.map(c => ({ ...c, color: g.color, group: g.key })));

function telHref(n) { return `tel:${n.replace(/[^\d+]/g, '')}`; }
function pretty(n) { return n.length > 6 ? n.replace(/(\d{5})(\d+)/, '$1-$2') : n; }

export default function SOSModal({ isOpen, onClose }) {
  const { isBn } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => { if (!isOpen) { setQuery(''); setCopied(''); } }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS
      .map(g => ({
        ...g,
        contacts: g.contacts.filter(c =>
          c.labelEn.toLowerCase().includes(q) ||
          c.labelBn.includes(query.trim()) ||
          c.number.includes(q)
        ),
      }))
      .filter(g => g.contacts.length > 0);
  }, [query]);

  const copyNumber = async (num) => {
    try { await navigator.clipboard.writeText(num); setCopied(num); setTimeout(() => setCopied(''), 1500); } catch { /* ignore */ }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: isDark ? 'rgba(8,14,26,0.85)' : 'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          background: 'var(--surface)', border: '1px solid var(--border-2)',
          borderRadius: 24, width: '100%', maxWidth: 720, maxHeight: '90vh', overflow: 'hidden',
          boxShadow: isDark ? '0 30px 60px -15px rgba(230,57,70,0.30)' : '0 30px 60px -15px rgba(15,23,42,0.20)',
          animation: 'sosFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Accent top bar */}
        <div style={{ height: 4, background: 'linear-gradient(90deg,#E63946,#F97316,#EC4899,#8B5CF6,#3B82F6)' }} />

        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: 13, background: 'var(--grad-red, linear-gradient(135deg,#E63946,#F97316))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px -6px rgba(230,57,70,0.6)' }}>
              <FiAlertTriangle className="animate-pulse" color="#fff" size={22} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--text)', lineHeight: 1.1 }}>
                {isBn ? 'জরুরি হেল্পলাইন নম্বর' : 'Emergency Hotlines'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: 99, background: '#10B981', boxShadow: '0 0 0 3px rgba(16,185,129,0.18)' }} />
                {isBn ? `${ALL.length}টি যাচাইকৃত নম্বর · সরাসরি কল করুন` : `${ALL.length} verified numbers · tap to dial`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 11, border: '1px solid var(--border-2)', background: 'var(--surface-2)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-2)'; }}
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '1rem 1.5rem 0.5rem' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={isBn ? 'সেবা বা নম্বর খুঁজুন...' : 'Search a service or number...'}
              style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: 12, border: '1px solid var(--border-2)', background: 'var(--surface-2)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        </div>

        {/* Scrollable groups */}
        <div style={{ padding: '0.75rem 1.5rem 1rem', overflowY: 'auto', flex: 1 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {isBn ? 'কোনো নম্বর পাওয়া যায়নি।' : 'No matching numbers found.'}
            </div>
          )}
          {filtered.map(group => (
            <div key={group.key} style={{ marginTop: '1.1rem' }}>
              {/* Group heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: group.color }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {isBn ? group.titleBn : group.titleEn}
                </span>
                <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              {/* Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                {group.contacts.map(c => (
                  <div
                    key={c.number + c.labelEn}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 15, background: 'var(--surface-2)', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 24px -12px ${c.color}88`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: `${c.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                      {c.icon}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {isBn ? c.labelBn : c.labelEn}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                        {isBn ? c.descBn : c.descEn}
                      </div>
                      <div style={{ fontSize: '1.02rem', fontWeight: 900, color: c.color, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>
                        {pretty(c.number)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      <a
                        href={telHref(c.number)}
                        aria-label={`Call ${c.number}`}
                        style={{ width: 34, height: 34, borderRadius: 10, background: c.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', boxShadow: `0 6px 14px -6px ${c.color}` }}
                      >
                        <FiPhone size={15} />
                      </a>
                      <button
                        onClick={() => copyNumber(c.number)}
                        aria-label={`Copy ${c.number}`}
                        style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--surface-3)', border: '1px solid var(--border)', color: copied === c.number ? '#10B981' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {copied === c.number ? <FiCheck size={14} /> : <FiCopy size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky footer banner */}
        <div style={{ padding: '0.9rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          <a
            href="tel:999"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px 16px', borderRadius: 14, background: 'var(--grad-red, linear-gradient(135deg,#E63946,#F97316))', color: '#fff', fontWeight: 800, fontSize: '0.92rem', textDecoration: 'none', boxShadow: '0 10px 24px -10px rgba(230,57,70,0.7)' }}
          >
            <FiPhone size={16} />
            {isBn ? 'জীবন-ঝুঁকিপূর্ণ জরুরি অবস্থায় ৯৯৯ ডায়াল করুন' : 'Dial 999 for any life-threatening emergency'}
          </a>
        </div>
      </div>

      <style>{`
        @keyframes sosFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
