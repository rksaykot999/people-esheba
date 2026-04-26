import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { FiSend, FiX, FiMinimize2, FiMessageCircle } from 'react-icons/fi';

// ── NLP keyword routing ───────────────────────────────────────
const ROUTES = [
  { keys:['blood','donor','রক্ত','donate blood'],  route:'/blood',        reply:'Finding blood donors near you... 🩸' },
  { keys:['emergency','hospital','হাসপাতাল','ambulance','999'], route:'/emergency', reply:'Opening emergency services... 🚨' },
  { keys:['job','jobs','career','চাকরি','hire','employment'], route:'/jobs', reply:'Browsing available jobs... 💼' },
  { keys:['donation','help','সাহায্য','fund','aid','relief'], route:'/donation', reply:'Opening donation requests... ❤️' },
  { keys:['volunteer','স্বেচ্ছাসেবক','community'],  route:'/volunteers',  reply:'Finding volunteers... 🙌' },
  { keys:['map','location','nearby','কাছে'],         route:'/map',          reply:'Opening map view... 📍' },
  { keys:['profile','account','প্রোফাইল'],           route:'/profile',      reply:'Going to your profile... 👤' },
  { keys:['register','signup','join','নিবন্ধন'],     route:'/register',     reply:'Taking you to registration... ✍️' },
  { keys:['login','signin','লগইন'],                 route:'/login',        reply:'Opening login page... 🔐' },
  { keys:['fire','আগুন','fire service'],             route:'/emergency?type=fire', reply:'Opening fire service contacts... 🚒' },
  { keys:['police','পুলিশ'],                         route:'/emergency?type=police', reply:'Opening police contacts... 👮' },
];

const matchRoute = (msg) => {
  const m = msg.toLowerCase();
  return ROUTES.find(r => r.keys.some(k => m.includes(k)));
};

const AIAssistant = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [open,     setOpen]     = useState(false);
  const [minimized, setMin]     = useState(false);
  const [input,    setInput]    = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: t('ai.greeting'), ts: new Date() },
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    setMessages(m => [...m, { from: 'user', text: msg, ts: new Date() }]);
    setTyping(true);

    await new Promise(r => setTimeout(r, 600));

    const match = matchRoute(msg);
    let reply;

    if (match) {
      reply = match.reply;
      setTimeout(() => navigate(match.route), 1200);
    } else {
      reply = generateReply(msg);
    }

    setTyping(false);
    setMessages(m => [...m, { from: 'bot', text: reply, ts: new Date() }]);
  };

  const generateReply = (msg) => {
    const m = msg.toLowerCase();
    if (m.includes('hello') || m.includes('hi') || m.includes('হ্যালো'))
      return `Hello! 👋 How can I help you today?\n\nYou can ask me about:\n• Blood donors\n• Emergency services\n• Jobs\n• Donation requests\n• Volunteers`;
    if (m.includes('thank') || m.includes('ধন্যবাদ'))
      return `You're welcome! 😊 Happy to help. Is there anything else you need?`;
    if (m.includes('help') && m.length < 10)
      return `Sure! Here's what I can help with:\n\n🩸 Find blood donors\n🚨 Emergency contacts\n💼 Browse jobs\n❤️ Request/give help\n🙌 Find volunteers\n📍 Map view\n\nJust type what you're looking for!`;
    if (m.includes('999') || m.includes('emergency number'))
      return `📞 Emergency Numbers in Bangladesh:\n• Police: 999\n• Fire: 199\n• Ambulance: 199\n• Child Help: 1098\n• Women Help: 10921\n\nStay safe! 🙏`;
    return `I'm not sure about that, but I can help you navigate to the right section.\n\nTry asking:\n• "Find blood donor"\n• "Emergency contacts"\n• "Browse jobs"\n• "Request help"`;
  };

  const suggestions = t('ai.suggestions');

  return (
    <>
      {/* ── Floating Toggle Button ──────────────────────────── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 24, left: 24, zIndex: 8000,
            width: 56, height: 56, borderRadius: '50%', border: 'none',
            background: 'linear-gradient(135deg, #06B6D4, #0284c7)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(6,182,212,0.5)',
            animation: 'pulse-bot 2s ease-in-out infinite',
          }}
          title="AI Assistant"
        >
          <FiMessageCircle size={24} />
        </button>
      )}

      {/* ── Chat Window ─────────────────────────────────────── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 24, left: 24, zIndex: 8001,
          width: 340, borderRadius: 20,
          border: '1px solid var(--border-2)',
          background: 'var(--surface)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          animation: 'fadeUp 0.25s ease',
          display: 'flex', flexDirection: 'column',
          height: minimized ? 'auto' : 480,
        }}>
          {/* Header */}
          <div style={{
            padding: '0.85rem 1rem',
            background: 'linear-gradient(135deg, #0284c7, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
              }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{t('ai.title')}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)' }}>{t('ai.sub')}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setMin(m => !m)} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiMinimize2 size={13} />
              </button>
              <button onClick={() => setOpen(false)} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiX size={13} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '82%',
                      padding: '0.6rem 0.9rem',
                      borderRadius: m.from === 'user'
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                      background: m.from === 'user'
                        ? 'linear-gradient(135deg, #E63946, #c1121f)'
                        : 'var(--surface-2)',
                      border: m.from === 'user' ? 'none' : '1px solid var(--border)',
                      color: '#fff', fontSize: '0.83rem', lineHeight: 1.55,
                      whiteSpace: 'pre-line',
                    }}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div style={{ display: 'flex', gap: 5, padding: '0.5rem 0.9rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', width: 'fit-content' }}>
                    {[0,1,2].map(n => (
                      <div key={n} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cyan)', animation: `typing-dot 1.2s ${n * 0.2}s infinite ease-in-out` }} />
                    ))}
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div style={{ padding: '0 1rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {Array.isArray(suggestions) && suggestions.map((s, i) => (
                    <button key={i} onClick={() => send(s)} style={{
                      padding: '4px 10px', borderRadius: 99, border: '1px solid var(--border-2)',
                      background: 'var(--surface-2)', color: 'var(--text-muted)',
                      fontSize: '0.75rem', cursor: 'pointer', transition: 'var(--t)',
                    }}
                      onMouseEnter={e => { e.target.style.borderColor = 'var(--cyan)'; e.target.style.color = 'var(--cyan)'; }}
                      onMouseLeave={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.color = 'var(--text-muted)'; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{
                padding: '0.75rem 1rem', borderTop: '1px solid var(--border)',
                display: 'flex', gap: 8,
              }}>
                <input
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder={t('ai.placeholder')}
                  style={{
                    flex: 1, padding: '0.6rem 0.9rem', borderRadius: 10,
                    border: '1px solid var(--border-2)', background: 'var(--surface-2)',
                    color: '#fff', fontSize: '0.83rem', outline: 'none',
                  }}
                />
                <button onClick={() => send()} disabled={!input.trim()} style={{
                  width: 38, height: 38, borderRadius: 10, border: 'none',
                  background: 'var(--grad-cyan)', color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: input.trim() ? 1 : 0.4,
                }}>
                  <FiSend size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse-bot {
          0%, 100% { box-shadow: 0 4px 24px rgba(6,182,212,0.5); }
          50% { box-shadow: 0 4px 40px rgba(6,182,212,0.8), 0 0 0 8px rgba(6,182,212,0.1); }
        }
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default AIAssistant;
