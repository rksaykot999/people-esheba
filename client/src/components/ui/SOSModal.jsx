import { useEffect } from 'react';
import { FiX, FiPhone } from 'react-icons/fi';
import { useLang } from '../../context/LanguageContext';

const CONTACTS = [
  { icon:'🆘', label:'National Emergency', number:'999',  type:'emergency' },
  { icon:'🚒', label:'Fire Service',       number:'199',  type:'fire' },
  { icon:'🚑', label:'Ambulance',          number:'199',  type:'ambulance' },
  { icon:'👮', label:'Police',             number:'999',  type:'police' },
  { icon:'👩', label:'Women Helpline',     number:'10921',type:'helpline' },
  { icon:'👶', label:'Child Helpline',     number:'1098', type:'helpline' },
  { icon:'🧠', label:'Mental Health',      number:'16789',type:'mental' },
  { icon:'🛡️', label:'Anti Terrorism',    number:'01769-691613',type:'security' },
];

const COLOR = { emergency:'#E63946', fire:'#F97316', ambulance:'#E63946', police:'#3B82F6', helpline:'#EC4899', mental:'#8B5CF6', security:'#6B7280' };

export default function SOSModal({ isOpen, onClose }) {
  const { isBn } = useLang();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else        document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)' }}/>
      <div style={{ position:'relative', background:'var(--surface)', border:'1px solid rgba(230,57,70,0.3)', borderRadius:20, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 0 60px rgba(230,57,70,0.3)', animation:'fadeUp 0.25s ease' }}>
        {/* Header */}
        <div style={{ padding:'1.5rem 1.5rem 1rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:'var(--grad-red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', boxShadow:'var(--shadow-red)' }}>🆘</div>
            <div>
              <div style={{ fontWeight:800, fontSize:'1.15rem', color:'#fff' }}>{isBn?'জরুরি নম্বর':'Emergency Numbers'}</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:1 }}>{isBn?'এখনই কল করুন':'Call immediately'}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:'1px solid var(--border)', background:'transparent', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <FiX size={16}/>
          </button>
        </div>

        {/* Contacts grid */}
        <div style={{ padding:'1.25rem 1.5rem 1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {CONTACTS.map((c) => (
            <a key={c.number+c.label} href={`tel:${c.number}`} style={{
              display:'flex', alignItems:'center', gap:10, padding:'12px 14px',
              borderRadius:12, background:'var(--surface-2)', border:`1px solid ${COLOR[c.type]}22`,
              textDecoration:'none', transition:'all 0.2s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background=`${COLOR[c.type]}15`;e.currentTarget.style.borderColor=`${COLOR[c.type]}44`;}}
              onMouseLeave={e=>{e.currentTarget.style.background='var(--surface-2)';e.currentTarget.style.borderColor=`${COLOR[c.type]}22`;}}>
              <span style={{ fontSize:'1.4rem' }}>{c.icon}</span>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:600, lineHeight:1 }}>{c.label}</div>
                <div style={{ fontSize:'1rem', fontWeight:800, color:COLOR[c.type], marginTop:2, display:'flex', alignItems:'center', gap:4 }}>
                  <FiPhone size={13}/>{c.number}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ padding:'0 1.5rem 1.5rem', textAlign:'center', color:'var(--text-dim)', fontSize:'0.77rem' }}>
          {isBn?'যেকোনো জরুরি অবস্থায় ৯৯৯ ডায়াল করুন':'Dial 999 in any emergency situation'}
        </div>
      </div>
    </div>
  );
}
