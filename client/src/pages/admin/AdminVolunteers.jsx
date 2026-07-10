import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiShield, FiCheckCircle, FiCheck, FiX, FiClock, FiUsers } from 'react-icons/fi';

const STATUS_TABS = [
  { key: '', label: 'All', labelBn: 'সব' },
  { key: 'pending', label: 'Pending', labelBn: 'অপেক্ষমান' },
  { key: 'active', label: 'Active', labelBn: 'সক্রিয়' },
];

export default function AdminVolunteers() {
  const { t, isBn } = useLang();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 20, ...(statusFilter && { status: statusFilter }) });
      const r = await api.get(`/admin/volunteers?${q}`);
      setItems(r.data.data.rows); setTotal(r.data.data.total); setPages(r.data.data.pages);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  const fetchPendingCount = async () => {
    try {
      const r = await api.get('/admin/volunteers?status=pending&limit=1');
      setPendingCount(r.data.data.total || 0);
    } catch {}
  };

  useEffect(() => { fetchVolunteers(); }, [page, statusFilter]); // eslint-disable-line
  useEffect(() => { fetchPendingCount(); }, []); // eslint-disable-line

  const approveVolunteer = async (id, status, name) => {
    try {
      await api.put(`/admin/volunteers/${id}/status`, { status });
      toast.success(isBn
        ? `${name} ${status === 'approved' ? 'অনুমোদিত' : 'বাতিল'} হয়েছে`
        : `${name} ${status}`);
      setItems(i => i.map(x => x.id === id ? { ...x, is_active: status === 'approved' ? 1 : 0 } : x));
      if (statusFilter === 'pending') setItems(i => i.filter(x => x.id !== id));
      fetchPendingCount();
    } catch { toast.error('Failed'); }
  };

  const verifyVol = async (id, name) => {
    try {
      await api.put(`/admin/volunteers/${id}/verify`);
      toast.success(`${name} verified`);
      setItems(i => i.map(x => x.id === id ? { ...x, is_verified: 1 } : x));
    } catch { toast.error('Failed'); }
  };

  const deleteItem = async (id, name) => {
    if (!window.confirm(`Remove ${name} as volunteer?`)) return;
    try {
      await api.delete(`/admin/volunteers/${id}`);
      toast.success('Removed');
      setItems(i => i.filter(x => x.id !== id));
      setTotal(t => t - 1);
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-strong)', marginBottom: 3 }}>
            <FiUsers style={{ color: 'var(--cyan)' }} /> {t('admin.volunteers')}
            {pendingCount > 0 && (
              <span style={{ background: '#F59E0B', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 800 }}>
                {pendingCount} {isBn ? 'অপেক্ষমান' : 'pending'}
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{total} {isBn ? 'নিবন্ধিত স্বেচ্ছাসেবক' : 'registered volunteers'}</p>
        </div>

        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--surface)', padding: 4, borderRadius: 12, border: '1px solid var(--border)' }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.key} onClick={() => { setStatusFilter(tab.key); setPage(1); }}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5,
                background: statusFilter === tab.key ? (tab.key === 'pending' ? '#F59E0B' : 'var(--primary)') : 'transparent',
                color: statusFilter === tab.key ? '#fff' : 'var(--text-muted)'
              }}>
              {tab.key === 'pending' && <FiClock size={11} />}
              {isBn ? tab.labelBn : tab.label}
              {tab.key === 'pending' && pendingCount > 0 && (
                <span style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '1px 6px', fontSize: '0.7rem' }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>{isBn ? 'স্বেচ্ছাসেবক' : 'Volunteer'}</th>
                <th>{isBn ? 'বিভাগ' : 'Category'}</th>
                <th>{isBn ? 'দক্ষতা' : 'Skills'}</th>
                <th>{isBn ? 'এলাকা' : 'Location'}</th>
                <th>{isBn ? 'উপলব্ধতা' : 'Availability'}</th>
                <th>{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                <th>{isBn ? 'কার্যক্রম' : 'Actions'}</th>
              </tr></thead>
              <tbody>
                {items.map(v => {
                  const isPending = !v.is_active;
                  return (
                    <tr key={v.id} style={{ background: isPending ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--grad-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-strong)' }}>
                            {v.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: '0.85rem' }}>{v.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{v.email}</div>
                            {v.is_verified ? <span style={{ fontSize: '0.65rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 2 }}><FiCheckCircle size={10} /> verified</span> : null}
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-green">{v.category}</span></td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.skills || '—'}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.district || '—'}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{v.availability || '—'}</td>
                      <td>
                        {isPending
                          ? <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiClock size={10} /> {isBn ? 'অপেক্ষমান' : 'Pending'}</span>
                          : <span className="badge badge-green">{t('common.active')}</span>
                        }
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 5 }}>
                          {/* Approve / Reject for pending */}
                          {isPending && (<>
                            <button onClick={() => approveVolunteer(v.id, 'approved', v.name)} title={isBn ? 'অনুমোদন করুন' : 'Approve'}
                              style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)', background: 'transparent', color: '#10B981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiCheck size={13} />
                            </button>
                            <button onClick={() => approveVolunteer(v.id, 'rejected', v.name)} title={isBn ? 'বাতিল করুন' : 'Reject'}
                              style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiX size={13} />
                            </button>
                          </>)}
                          {!v.is_verified && v.is_active ? (
                            <button onClick={() => verifyVol(v.id, v.name)} title="Verify"
                              style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(16,185,129,0.3)', background: 'transparent', color: 'var(--green)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiShield size={12} />
                            </button>
                          ) : null}
                          <button onClick={() => deleteItem(v.id, v.name)} title="Remove"
                            style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(230,57,70,0.2)', background: 'transparent', color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {items.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-dim)' }}>{t('common.noResults')}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {pages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
          {Array.from({ length: Math.min(5, pages) }, (_, i) => i + Math.max(1, page - 2)).filter(p => p <= pages).map(p => (
            <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === pages}>›</button>
        </div>
      )}
    </div>
  );
}
