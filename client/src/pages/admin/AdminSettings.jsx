import { useState } from 'react';
import { useLang } from '../../context/LanguageContext';
import { FiSettings, FiSave, FiGlobe, FiShield, FiBell, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { t, isBn } = useLang();
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success('Settings saved successfully');
      setSaving(false);
    }, 800);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '1.6rem', color:'var(--text-strong)', marginBottom: 4 }}>
          <FiSettings style={{ color: 'var(--text-muted)' }} /> {isBn ? 'সিস্টেম সেটিংস' : 'System Settings'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{isBn ? 'প্ল্যাটফর্মের কনফিগারেশন পরিবর্তন করুন' : 'Configure platform-wide settings and preferences'}</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* General Settings */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color:'var(--text-strong)', marginBottom: '1.5rem', fontSize: '1rem' }}>
            <FiGlobe size={18} /> {isBn ? 'সাধারণ সেটিংস' : 'General Settings'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <input className="form-input" defaultValue="People E-Sheba" />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input className="form-input" defaultValue="admin@peopleesheba.com" />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Site Description</label>
              <textarea className="form-input" style={{ minHeight: 80 }} defaultValue="A community platform for service and donation." />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color:'var(--text-strong)', marginBottom: '1.5rem', fontSize: '1rem' }}>
            <FiShield size={18} /> {isBn ? 'নিরাপত্তা' : 'Security'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
              <div style={{ fontSize: '0.9rem', color:'var(--text-strong)' }}>Enable Maintenance Mode</div>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
              <div style={{ fontSize: '0.9rem', color:'var(--text-strong)' }}>New User Registration</div>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 30px', height: 48, borderRadius: 12, fontWeight: 700 }} disabled={saving}>
            {saving ? <div className="spinner spinner-sm" /> : <><FiSave size={16} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
