import { useEffect } from 'react';
import { FiX, FiPhone, FiAlertTriangle, FiActivity } from 'react-icons/fi';
import { useLang } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const CONTACTS = [
  { 
    icon: '🆘', 
    labelEn: 'National Emergency', 
    labelBn: 'জাতীয় জরুরি সেবা',
    number: '999',  
    type: 'emergency' 
  },
  { 
    icon: '🚒', 
    labelEn: 'Fire Service', 
    labelBn: 'ফায়ার সার্ভিস',
    number: '199',  
    type: 'fire' 
  },
  { 
    icon: '🚑', 
    labelEn: 'Ambulance', 
    labelBn: 'অ্যাম্বুলেন্স',
    number: '199',  
    type: 'ambulance' 
  },
  { 
    icon: '👮', 
    labelEn: 'Police Control Room', 
    labelBn: 'পুলিশ কন্ট্রোল রুম',
    number: '999',  
    type: 'police' 
  },
  { 
    icon: '👩', 
    labelEn: 'Women Helpline', 
    labelBn: 'নারী সহায়তা সেল',
    number: '10921',
    type: 'helpline' 
  },
  { 
    icon: '👶', 
    labelEn: 'Child Helpline', 
    labelBn: 'শিশু সহায়তা লাইন',
    number: '1098', 
    type: 'helpline' 
  },
  { 
    icon: '🧠', 
    labelEn: 'Mental Health support', 
    labelBn: 'মানসিক স্বাস্থ্য সেল',
    number: '16789',
    type: 'mental' 
  },
  { 
    icon: '🛡️', 
    labelEn: 'Anti Terrorism Cell', 
    labelBn: 'সন্ত্রাস বিরোধী সেল',
    number: '01769-691613',
    type: 'security' 
  },
];

const COLOR = { 
  emergency: '#E63946', 
  fire: '#F97316', 
  ambulance: '#EF4444', 
  police: '#3B82F6', 
  helpline: '#EC4899', 
  mental: '#8B5CF6', 
  security: '#6B7280' 
};

export default function SOSModal({ isOpen, onClose }) {
  const { isBn } = useLang();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: isDark ? 'rgba(8,14,26,0.85)' : 'rgba(15,23,42,0.6)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      />
      
      {/* Modal Card */}
      <div 
        style={{ 
          position: 'relative', 
          background: 'var(--surface)', 
          border: '1px solid var(--border-2)', 
          borderRadius: 24, 
          width: '100%', 
          maxWidth: 580, 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          boxShadow: isDark ? '0 25px 50px -12px rgba(230,57,70,0.25)' : '0 25px 50px -12px rgba(15,23,42,0.15)', 
          animation: 'sosFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div 
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 12, 
                background: 'var(--grad-red)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.25rem', 
                boxShadow: 'var(--shadow-red)' 
              }}
            >
              <FiAlertTriangle className="animate-pulse text-white" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--text)' }}>
                {isBn ? 'জরুরি হেল্পলাইন নম্বর' : 'Emergency Hotlines'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {isBn ? 'সহজে সরাসরি কল করুন' : 'Instant direct dial support'}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 10, 
              border: '1px solid var(--border-2)', 
              background: 'var(--surface-2)', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Contacts grid */}
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
          {CONTACTS.map((c) => (
            <a 
              key={c.number + c.labelEn} 
              href={`tel:${c.number}`} 
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                padding: '14px 16px',
                borderRadius: 16, 
                background: 'var(--surface-2)', 
                border: '1px solid var(--border)',
                textDecoration: 'none', 
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = `${COLOR[c.type]}08`;
                e.currentTarget.style.borderColor = COLOR[c.type];
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'var(--surface-2)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <span style={{ fontSize: '1.75rem', transform: 'scale(1)', transition: 'transform 0.2s' }}>{c.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isBn ? c.labelBn : c.labelEn}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 950, color: COLOR[c.type], marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiPhone size={13} /> {c.number}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer info banner */}
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <div 
            style={{ 
              padding: '12px 16px', 
              borderRadius: 16, 
              background: 'var(--surface-3)', 
              border: '1px solid var(--border)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 8,
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              fontWeight: 600
            }}
          >
            <FiActivity size={14} className="text-red-500" />
            {isBn ? 'যেকোনো জীবন-ঝুঁকিপূর্ণ মুহূর্তে ৯৯৯ ডায়াল করুন।' : 'Dial 999 for any life-threatening emergency.'}
          </div>
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
