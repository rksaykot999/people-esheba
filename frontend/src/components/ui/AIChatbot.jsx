import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';

const ROUTES_MAP = [
  { keywords:['blood','রক্ত','donor','দাতা'],           route:'/blood',         reply:'I can help you find blood donors! Click here to search by blood group and location.' },
  { keywords:['emergency','জরুরি','hospital','হাসপাতাল'], route:'/emergency',    reply:'Emergency services are right here! Find hospitals, police, fire service and ambulance near you.' },
  { keywords:['job','চাকরি','work','কাজ','hire','নিয়োগ'], route:'/jobs',         reply:'Looking for jobs? Browse hundreds of opportunities across Bangladesh!' },
  { keywords:['donate','donation','সাহায্য','help','fund','দান'], route:'/donation', reply:'Want to help or need help? Check out the donation and financial assistance section.' },
  { keywords:['volunteer','স্বেচ্ছাসেবক'],              route:'/volunteers',    reply:'Find or become a volunteer! Our network covers all of Bangladesh.' },
  { keywords:['map','location','মানচিত্র','near','কাছে'],route:'/map',           reply:'Use the map to find services near your location!' },
  { keywords:['login','register','account','অ্যাকাউন্ট'],route:'/register',     reply:'Create your free account to access all features of People E-Sheba!' },
  { keywords:['sos','999','fire','police'],              action:'sos',           reply:'⚠️ For emergencies, please call 999 immediately! You can also use the SOS button in the navbar.' },
];

let msgId = 0;
const mkMsg = (role, text, route) => ({ id:++msgId, role, text, route, time: new Date() });

export default function AIChatbot() {
  const { t, isBn } = useLang();
  const navigate    = useNavigate();
  const [open,  setOpen]  = useState(false);
  const [min,   setMin]   = useState(false);
  const [input, setInput] = useState('');
  const [msgs,  setMsgs]  = useState([]);
  const [typing,setTyping]= useState(false);
  const endRef  = useRef(null);
  const inputRef= useRef(null);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([mkMsg('bot', t('ai.greeting'))]);
    }
  }, [open]); // eslint-disable-line

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [msgs, typing]);

  useEffect(() => {
    if (open && !min) inputRef.current?.focus();
  }, [open, min]);

  const findResponse = (text) => {
    const lower = text.toLowerCase();
    for (const r of ROUTES_MAP) {
      if (r.keywords.some(k => lower.includes(k.toLowerCase()))) return r;
    }
    return null;
  };

  const handleSend = async (text = input.trim()) => {
    if (!text) return;
    setMsgs(m => [...m, mkMsg('user', text)]);
    setInput('');
    setTyping(true);

    await new Promise(r => setTimeout(r, 800 + Math.random()*600));
    setTyping(false);

    const match = findResponse(text);
    if (match) {
      setMsgs(m => [...m, mkMsg('bot', match.reply, match.route)]);
    } else {
      const fallback = isBn
        ? `আমি আপনার প্রশ্নটি বুঝতে পারিনি। আপনি কি খুঁজছেন:\n• রক্তদাতা\n• জরুরি সেবা\n• চাকরি\n• আর্থিক সহায়তা\n• স্বেচ্ছাসেবক?`
        : `I'm not sure I understand. Are you looking for:\n• Blood donors\n• Emergency services\n• Jobs\n• Financial help\n• Volunteers?`;
      setMsgs(m => [...m, mkMsg('bot', fallback)]);
    }
  };

  const suggestions = t('ai.suggestions');

  return (
    <>
      {/* ── Floating button ─────────────────────────────── */}
      {!open && (
        <button onClick={()=>setOpen(true)} style={{
          position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:900,
          width:54, height:54, borderRadius:'50%', background:'var(--grad-red)',
          border:'none', color:'#fff', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 20px rgba(230,57,70,0.5)',
          animation:'pulse-glow 2.5s ease-in-out infinite',
        }}>
          <FiMessageSquare size={22}/>
        </button>
      )}

      {/* ── Chat window ──────────────────────────────────── */}
      {open && (
        <div style={{
          position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:900,
          width:340, borderRadius:18, overflow:'hidden',
          background:'var(--surface)', border:'1px solid var(--border)',
          boxShadow:'0 20px 60px rgba(0,0,0,0.6)',
          animation:'fadeUp 0.25s ease',
          display:'flex', flexDirection:'column',
          maxHeight: min ? 56 : 480,
          transition:'max-height 0.3s ease',
        }}>
          {/* Header */}
          <div style={{ padding:'12px 14px', background:'var(--grad-red)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>🤖</div>
              <div style={{ lineHeight:1.2 }}>
                <div style={{ fontWeight:700, fontSize:'0.87rem', color:'#fff' }}>{t('ai.title')}</div>
                <div style={{ fontSize:'0.67rem', color:'rgba(255,255,255,0.7)' }}>{t('ai.sub')}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={()=>setMin(s=>!s)} style={{ width:26, height:26, borderRadius:6, border:'1px solid rgba(255,255,255,0.25)', background:'transparent', color:'rgba(255,255,255,0.8)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <FiMinimize2 size={12}/>
              </button>
              <button onClick={()=>{setOpen(false);setMin(false);}} style={{ width:26, height:26, borderRadius:6, border:'1px solid rgba(255,255,255,0.25)', background:'transparent', color:'rgba(255,255,255,0.8)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <FiX size={12}/>
              </button>
            </div>
          </div>

          {!min && (
            <>
              {/* Messages */}
              <div style={{ flex:1, overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:10 }}>
                {msgs.map(msg => (
                  <div key={msg.id} style={{ display:'flex', justifyContent: msg.role==='user'?'flex-end':'flex-start' }}>
                    {msg.role === 'bot' && (
                      <div style={{ width:24, height:24, borderRadius:'50%', background:'var(--red-light)', border:'1px solid rgba(230,57,70,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', marginRight:7, flexShrink:0, marginTop:2 }}>🤖</div>
                    )}
                    <div style={{ maxWidth:'75%' }}>
                      <div style={{
                        padding:'9px 12px', borderRadius: msg.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px',
                        background: msg.role==='user'?'var(--grad-red)':'var(--surface-2)',
                        color:'#fff', fontSize:'0.83rem', lineHeight:1.5, whiteSpace:'pre-line',
                        border: msg.role==='bot'?'1px solid var(--border)':'none',
                      }}>{msg.text}</div>
                      {msg.route && (
                        <button onClick={()=>{navigate(msg.route);setOpen(false);}}
                          style={{ marginTop:5, fontSize:'0.75rem', fontWeight:700, color:'var(--cyan)', background:'var(--cyan-light)', border:'1px solid rgba(6,182,212,0.2)', borderRadius:8, padding:'4px 10px', cursor:'pointer', display:'block' }}>
                          → {isBn?'এখানে যান':'Go there'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <div style={{ width:24, height:24, borderRadius:'50%', background:'var(--red-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem' }}>🤖</div>
                    <div style={{ padding:'9px 13px', borderRadius:14, background:'var(--surface-2)', border:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                        {[0,1,2].map(i => (
                          <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'var(--text-dim)', animation:`bounce 0.9s ${i*0.15}s ease-in-out infinite` }}/>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef}/>
              </div>

              {/* Suggestion chips */}
              {msgs.length <= 1 && Array.isArray(suggestions) && (
                <div style={{ padding:'0 12px 8px', display:'flex', flexWrap:'wrap', gap:5 }}>
                  {suggestions.map(s => (
                    <button key={s} onClick={()=>handleSend(s)} style={{
                      padding:'5px 10px', borderRadius:999, border:'1px solid var(--border)',
                      background:'var(--surface-2)', color:'var(--text-muted)', fontSize:'0.75rem', fontWeight:500, cursor:'pointer',
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{ padding:'10px 12px', borderTop:'1px solid var(--border)', display:'flex', gap:7, flexShrink:0 }}>
                <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handleSend()}
                  placeholder={t('ai.placeholder')}
                  style={{ flex:1, padding:'8px 12px', background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:10, color:'#fff', fontSize:'0.83rem', outline:'none', fontFamily:'inherit' }}/>
                <button onClick={()=>handleSend()} disabled={!input.trim()} style={{
                  width:36, height:36, borderRadius:10, background:'var(--grad-red)', border:'none',
                  color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  opacity: input.trim()?1:0.5,
                }}>
                  <FiSend size={14}/>
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
    </>
  );
}
