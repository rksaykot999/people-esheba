import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { FiSend, FiX, FiMinimize2, FiMessageCircle } from 'react-icons/fi';

// ── NLP keyword routing ───────────────────────────────────────
const ROUTES = [
  { keys:['blood','donor','রক্ত','donate blood'], route:'/blood', reply:'Finding blood donors near you... 🩸' },
  { keys:['emergency','hospital','হাসপাতাল','ambulance','999'], route:'/emergency', reply:'Opening emergency services... 🚨' },
  { keys:['job','jobs','career','চাকরি','hire','employment'], route:'/jobs', reply:'Browsing available jobs... 💼' },
  { keys:['donation','help','সাহায্য','fund','aid','relief'], route:'/donation', reply:'Opening donation requests... ❤️' },
  { keys:['volunteer','স্বেচ্ছাসেবক','community'], route:'/volunteers', reply:'Finding volunteers... 🙌' },
  { keys:['map','location','nearby','কাছে'], route:'/map', reply:'Opening map view... 📍' },
  { keys:['profile','account','প্রোফাইল'], route:'/profile', reply:'Going to your profile... 👤' },
  { keys:['register','signup','join','নিবন্ধন'], route:'/register', reply:'Taking you to registration... ✍️' },
  { keys:['login','signin','লগইন'], route:'/login', reply:'Opening login page... 🔐' },
  { keys:['fire','আগুন','fire service'], route:'/emergency?type=fire', reply:'Opening fire service contacts... 🚒' },
  { keys:['police','পুলিশ'], route:'/emergency?type=police', reply:'Opening police contacts... 👮' },
];

const matchRoute = (msg) => {
  const m = msg.toLowerCase();
  return ROUTES.find(r => r.keys.some(k => m.includes(k)));
};

const AIAssistant = () => {
  const { t } = useLang();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [minimized, setMin] = useState(false);
  const [input, setInput] = useState('');
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
      return `You're welcome! 😊`;

    if (m.includes('999'))
      return `📞 Emergency Numbers:\n• Police: 999\n• Fire: 199\n• Ambulance: 199`;

    return `Try asking:\n• "Find blood donor"\n• "Emergency contacts"\n• "Jobs"`;
  };

  return (
    <>
      {/* Floating chat button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 8000,
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #06B6D4, #0284c7)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FiMessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 8001,
          width: 340,
          borderRadius: 20,
          background: '#111',
          height: minimized ? 'auto' : 480,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            padding: '10px 14px',
            background: '#0284c7',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 600 }}>AI Assistant</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setMin(v => !v)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <FiMinimize2 size={16} />
              </button>
              <button
                onClick={() => { setOpen(false); setMin(false); }}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                      background: m.from === 'user' ? '#0284c7' : '#222',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: 12,
                      maxWidth: '80%',
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.85rem',
                    }}
                  >
                    {m.text}
                  </div>
                ))}
                {typing && (
                  <div style={{
                    alignSelf: 'flex-start',
                    background: '#222',
                    color: '#aaa',
                    padding: '8px 12px',
                    borderRadius: 12,
                    fontSize: '0.8rem',
                  }}>
                    Typing...
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ display: 'flex', borderTop: '1px solid #333', padding: 8, gap: 6 }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    background: '#222',
                    border: '1px solid #444',
                    borderRadius: 10,
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => send()}
                  style={{
                    background: '#0284c7',
                    border: 'none',
                    borderRadius: 10,
                    padding: '0 12px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <FiSend size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;