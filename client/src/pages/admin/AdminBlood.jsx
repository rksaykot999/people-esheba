import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiShield, FiCheckCircle, FiX, FiCheck, FiClock, FiDroplet, FiUploadCloud } from 'react-icons/fi';
import BulkImportModal from '../../components/admin/BulkImportModal';

const STATUS_TABS = [
  { key: '', label: 'All', labelBn: 'সব' },
  { key: 'pending', label: 'Pending', labelBn: 'অপেক্ষমান' },
  { key: 'approved', label: 'Approved', labelBn: 'অনুমোদিত' },
  { key: 'rejected', label: 'Rejected', labelBn: 'বাতিল' },
];

export default function AdminBlood() {
  const { t, isBn } = useLang();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [showImport, setShowImport] = useState(false);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 20, ...(statusFilter && { status: statusFilter }) });
      const r = await api.get(`/admin/blood-donors?${q}`);
      setItems(r.data.data.rows); setTotal(r.data.data.total); setPages(r.data.data.pages);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  const fetchPendingCount = async () => {
    try {
      const r = await api.get('/admin/blood-donors?status=pending&limit=1');
      setPendingCount(r.data.data.total || 0);
    } catch (e) {
      console.error('Failed to fetch pending blood donor count:', e);
    }
  };

  useEffect(() => { fetchDonors(); }, [page, statusFilter]); // eslint-disable-line
  useEffect(() => { fetchPendingCount(); }, []); // eslint-disable-line

  const approveItem = async (id, status, name) => {
    try {
      await api.put(`/admin/blood-donors/${id}/status`, { status });
      toast.success(isBn
        ? `${name} ${status === 'approved' ? 'অনুমোদিত' : 'বাতিল'} হয়েছে`
        : `${name} ${status}`);
      setItems(i => i.map(x => x.id === id ? { ...x, status } : x));
      if (statusFilter === 'pending') setItems(i => i.filter(x => x.id !== id));
      fetchPendingCount();
    } catch { toast.error('Failed'); }
  };

  const verifyDonor = async (id, name) => {
    try {
      await api.put(`/admin/blood-donors/${id}/verify`);
      toast.success(`${name} verified`);
      setItems(i => i.map(x => x.id === id ? { ...x, is_verified: 1 } : x));
    } catch { toast.error('Failed'); }
  };

  const deleteItem = async (id, name) => {
    if (!window.confirm(`Remove ${name} as blood donor?`)) return;
    try {
      await api.delete(`/admin/blood-donors/${id}`);
      toast.success('Removed');
      setItems(i => i.filter(x => x.id !== id));
      setTotal(t => t - 1);
    } catch { toast.error('Failed'); }
  };

  const BLOOD_COLORS = { 'A+': '#EF4444', 'A-': '#DC2626', 'B+': '#3B82F6', 'B-': '#2563EB', 'AB+': '#8B5CF6', 'AB-': '#7C3AED', 'O+': '#10B981', 'O-': '#059669' };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-strong)', marginBottom: 3 }}>
            <FiDroplet style={{ color: '#EF4444' }} /> {t('admin.blood')}
            {pendingCount > 0 && (
              <span style={{ background: '#F59E0B', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 800 }}>
                {pendingCount} {isBn ? 'অপেক্ষমান' : 'pending'}
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{total} {isBn ? 'নিবন্ধিত রক্তদাতা' : 'registered blood donors'}</p>
        </div>
        <button onClick={() => setShowImport(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 10, color: 'var(--cyan)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
          <FiUploadCloud size={15} /> {isBn ? 'ডেটা আমদানি' : 'Import CSV/Excel'}
        </button>

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
              {tab.key === 'pending' && pendingCount > 0 && <span style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '1px 6px', fontSize: '0.7rem' }}>{pendingCount}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>{isBn ? 'দাতা' : 'Donor'}</th>
                <th>{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</th>
                <th>{isBn ? 'এলাকা' : 'Location'}</th>
                <th>{isBn ? 'যোগাযোগ' : 'Contact'}</th>
                <th>{isBn ? 'প্রাপ্যতা' : 'Availability'}</th>
                <th>{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                <th>{isBn ? 'কার্যক্রম' : 'Actions'}</th>
              </tr></thead>
              <tbody>
                {items.map(b => {
                  const statusVal = b.status || 'approved';
                  return (
                    <tr key={b.id} style={{ background: statusVal === 'pending' ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#EF4444' }}>
                            {b.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: '0.85rem' }}>{b.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{b.email}</div>
                            {b.is_verified ? <span style={{ fontSize: '0.65rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 2 }}><FiCheckCircle size={10} /> verified</span> : null}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 900, fontSize: '1rem', color: BLOOD_COLORS[b.blood_group] || '#EF4444', background: `${BLOOD_COLORS[b.blood_group] || '#EF4444'}18`, padding: '3px 10px', borderRadius: 8 }}>
                          {b.blood_group}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{[b.district, b.division].filter(Boolean).join(', ') || '—'}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.phone || '—'}</td>
                      <td>
                        <span className={`badge ${b.is_available ? 'badge-green' : 'badge-gray'}`}>
                          {b.is_available ? (isBn ? 'উপলব্ধ' : 'Available') : (isBn ? 'অনুপলব্ধ' : 'Unavailable')}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusVal === 'approved' ? 'badge-green' : statusVal === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                          {isBn ? (statusVal === 'approved' ? 'অনুমোদিত' : statusVal === 'rejected' ? 'বাতিল' : 'অপেক্ষমান') : statusVal}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 5 }}>
                          {/* Approve / Reject for pending */}
                          {statusVal === 'pending' && (<>
                            <button onClick={() => approveItem(b.id, 'approved', b.name)} title={isBn ? 'অনুমোদন' : 'Approve'}
                              style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)', background: 'transparent', color: '#10B981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiCheck size={13} />
                            </button>
                            <button onClick={() => approveItem(b.id, 'rejected', b.name)} title={isBn ? 'বাতিল' : 'Reject'}
                              style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiX size={13} />
                            </button>
                          </>)}
                          {!b.is_verified && statusVal === 'approved' && (
                            <button onClick={() => verifyDonor(b.id, b.name)} title="Verify"
                              style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)', background: 'transparent', color: 'var(--green)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiShield size={12} />
                            </button>
                          )}
                          <button onClick={() => deleteItem(b.id, b.name)} title="Remove"
                            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(230,57,70,0.2)', background: 'transparent', color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      <BulkImportModal isOpen={showImport} onClose={() => setShowImport(false)} table="blood_donors" onImportSuccess={() => { setPage(1); fetchDonors(); }} />
    </div>
  );
}
