import { initials, statusColor } from '../utils/helpers';
import { FiX, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

/* ── Spinner ─────────────────────────────────────────────────── */
export const Spinner = ({ size = 'md', center = false }) => {
  const s = size === 'sm' ? 'spinner spinner-sm' : 'spinner';
  return center
    ? <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className={s} /></div>
    : <div className={s} />;
};

/* ── Badge ───────────────────────────────────────────────────── */
export const Badge = ({ children, color = 'gray', icon }) => (
  <span className={`badge badge-${color}`}>
    {icon && <span style={{ fontSize:'0.75rem' }}>{icon}</span>}
    {children}
  </span>
);

export const StatusBadge = ({ status }) => (
  <Badge color={statusColor(status)}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </Badge>
);

/* ── Empty State ─────────────────────────────────────────────── */
export const Empty = ({ icon = '🔍', title = 'No results found', sub, action }) => (
  <div className="empty">
    <div className="empty-icon">{icon}</div>
    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>{title}</div>
    {sub && <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 360, textAlign: 'center' }}>{sub}</div>}
    {action}
  </div>
);

/* ── Avatar ──────────────────────────────────────────────────── */
export const Avatar = ({ src, name = '', size = 'md', verified = false }) => {
  const sizeClass = `avatar avatar-${size}`;
  const sz = { sm: 32, md: 44, lg: 64, xl: 90 }[size] || 44;
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {src ? (
        <img src={src} alt={name} className={sizeClass} style={{ width: sz, height: sz, objectFit: 'cover', borderRadius: '50%' }} />
      ) : (
        <div className={sizeClass} style={{ width: sz, height: sz, fontSize: sz * 0.35 }}>
          {initials(name)}
        </div>
      )}
      {verified && (
        <span style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 16, height: 16, background: 'var(--cyan)',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 8, color: '#fff',
          border: '2px solid var(--bg)',
        }}>✓</span>
      )}
    </div>
  );
};

/* ── Pagination ──────────────────────────────────────────────── */
export const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= Math.min(pages, 7); i++) nums.push(i);

  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onChange(page - 1)} disabled={page <= 1}>←</button>
      {nums.map(n => (
        <button key={n} className={`page-btn ${n === page ? 'active' : ''}`} onClick={() => onChange(n)}>{n}</button>
      ))}
      {pages > 7 && <span style={{ color: 'var(--text-dim)' }}>…</span>}
      {pages > 7 && (
        <button className={`page-btn ${page === pages ? 'active' : ''}`} onClick={() => onChange(pages)}>{pages}</button>
      )}
      <button className="page-btn" onClick={() => onChange(page + 1)} disabled={page >= pages}>→</button>
    </div>
  );
};

/* ── Modal ───────────────────────────────────────────────────── */
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 540 }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border-2)',
        borderRadius: 'var(--r-xl)', width: '100%', maxWidth,
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'fadeUp 0.2s ease',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)',
        }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{title}</h3>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><FiX size={15} /></button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
};

/* ── Confirm Dialog ──────────────────────────────────────────── */
export const Confirm = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, dangerous = false, loading = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={400}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: '2rem' }}>{dangerous ? '⚠️' : '❓'}</span>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{message}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        <button
          className={`btn btn-sm ${dangerous ? 'btn-primary' : 'btn-cyan'}`}
          onClick={onConfirm} disabled={loading}
        >
          {loading ? <span className="spinner spinner-sm" /> : 'Confirm'}
        </button>
      </div>
    </div>
  </Modal>
);

/* ── Progress Bar ────────────────────────────────────────────── */
export const ProgressBar = ({ value, max, color }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{
        width: `${pct}%`,
        background: color || 'var(--grad-red)',
      }} />
    </div>
  );
};

/* ── Section Header ──────────────────────────────────────────── */
export const SectionHeader = ({ title, sub, action }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', lineHeight: 1.2 }}>{title}</h2>
      {sub && <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>{sub}</p>}
    </div>
    {action}
  </div>
);

/* ── Search Filter Bar ───────────────────────────────────────── */
export const SearchBar = ({ value, onChange, placeholder = 'Search...', style }) => (
  <div style={{ position: 'relative', ...style }}>
    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none', fontSize: '1rem' }}>🔍</span>
    <input
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-input"
      style={{ paddingLeft: 38 }}
    />
  </div>
);

/* ── Toast-like inline alert ──────────────────────────────────── */
export const Alert = ({ type = 'info', message }) => {
  const styles = {
    success: { bg: 'var(--green-light)',  border: 'var(--green)',  icon: '✅' },
    error:   { bg: 'var(--red-light)',    border: 'var(--red)',    icon: '❌' },
    warning: { bg: 'var(--amber-light)',  border: 'var(--amber)',  icon: '⚠️' },
    info:    { bg: 'var(--cyan-light)',   border: 'var(--cyan)',   icon: 'ℹ️' },
  };
  const s = styles[type] || styles.info;
  return (
    <div style={{
      padding: '0.75rem 1rem', borderRadius: 'var(--r-md)',
      background: s.bg, border: `1px solid ${s.border}20`,
      display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem',
    }}>
      <span>{s.icon}</span>
      <span style={{ color: 'var(--text)' }}>{message}</span>
    </div>
  );
};
