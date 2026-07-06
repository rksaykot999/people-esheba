import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import {
  FiSettings, FiSave, FiGlobe, FiShield, FiBell, FiHome,
  FiEdit3, FiRefreshCw, FiCheckCircle, FiAlertTriangle,
  FiShare2, FiPhone, FiMail, FiBarChart2, FiHardDrive, FiDownload,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const TABS = [
  { id: 'homepage', icon: <FiHome />, label: 'Homepage CMS' },
  { id: 'general', icon: <FiGlobe />, label: 'General & Contact' },
  { id: 'stats', icon: <FiBarChart2 />, label: 'Stats & Numbers' },
  { id: 'social', icon: <FiShare2 />, label: 'Social Links' },
  { id: 'security', icon: <FiShield />, label: 'Security' },
  { id: 'backup', icon: <FiHardDrive />, label: 'Backup & Restore' },
];

function Field({ label, hint, children }) {
  return (
    <div className="form-group">
      <label className="form-label" style={{ marginBottom: 4 }}>{label}</label>
      {hint && <p style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginBottom: 6 }}>{hint}</p>}
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, ...rest }) {
  return (
    <input
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-input"
      {...rest}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-input form-textarea"
      rows={rows}
      style={{ minHeight: rows * 24 + 16 }}
    />
  );
}

export default function AdminSettings() {
  const { isBn } = useLang();
  const [activeTab, setActiveTab] = useState('homepage');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [backupStatus, setBackupStatus] = useState(null);
  const [backupLoading, setBackupLoading] = useState(false);

  useEffect(() => {
    api.get('/settings').then(r => {
      setSettings(r.data.data || {});
      setLoading(false);
    }).catch(() => setLoading(false));
    // Also load backup status
    api.get('/admin/backup/status').then(r => setBackupStatus(r.data.data)).catch(() => {});
  }, []);

  const set = (key, value) => {
    setSettings(s => ({ ...s, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('✅ Settings saved successfully! Changes are now live on the website.');
      setDirty(false);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-strong)', marginBottom: 4 }}>
            <FiSettings style={{ color: 'var(--text-muted)' }} />
            {isBn ? 'সাইট কনফিগারেশন ও CMS' : 'Site Settings & CMS'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem' }}>
            {isBn ? 'ওয়েবসাইটের সমস্ত কন্টেন্ট এখান থেকে পরিবর্তন করুন — পরিবর্তন তাৎক্ষণিকভাবে সাইটে প্রতিফলিত হবে।'
              : 'Edit all website content from here — changes reflect live on the site immediately.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {dirty && (
            <span style={{ fontSize: '0.78rem', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
              <FiAlertTriangle size={12} /> Unsaved changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="btn btn-primary"
            style={{ padding: '0 24px', height: 44, borderRadius: 12, fontWeight: 700, opacity: dirty ? 1 : 0.5 }}
          >
            {saving ? <div className="spinner spinner-sm" /> : <><FiSave size={15} /> {isBn ? 'সংরক্ষণ করুন' : 'Save Changes'}</>}
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 4, padding: '4px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, marginBottom: '1.5rem', overflowX: 'auto', flexWrap: 'nowrap' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── HOMEPAGE CMS TAB ─────────────────────────────────── */}
      {activeTab === 'homepage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Hero Section */}
          <Section title="🦸 Hero Section" subtitle="The big headline area at the top of the homepage">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Hero Badge Text" hint="Small pill text above the headline">
                <TextInput value={settings.hero_badge} onChange={v => set('hero_badge', v)} placeholder="Bangladesh No.1 Citizen Platform" />
              </Field>
              <Field label="Hero Main Title" hint="Big headline (first line)">
                <TextInput value={settings.hero_title} onChange={v => set('hero_title', v)} placeholder="Empowering Citizens" />
              </Field>
              <Field label="Hero Highlight Word" hint="Red highlighted text on second line">
                <TextInput value={settings.hero_highlight} onChange={v => set('hero_highlight', v)} placeholder="Connecting Communities" />
              </Field>
            </div>
            <Field label="Hero Subtitle" hint="Paragraph text below the headline">
              <TextArea value={settings.hero_subtitle} onChange={v => set('hero_subtitle', v)} rows={3} placeholder="Join the largest digital service platform..." />
            </Field>
          </Section>

          {/* About Section */}
          <Section title="📖 About / Features Section" subtitle="Content in the middle info section">
            <Field label="Section Title">
              <TextInput value={settings.about_title} onChange={v => set('about_title', v)} placeholder="Essential support for citizens..." />
            </Field>
            <Field label="Section Body Text" hint="Main paragraph describing the platform">
              <TextArea value={settings.about_text} onChange={v => set('about_text', v)} rows={4} placeholder="People E-Sheba is a comprehensive platform..." />
            </Field>
          </Section>

          {/* CTA Section */}
          <Section title="📣 Call-to-Action Section" subtitle="Bottom CTA banner on the homepage">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="CTA Title">
                <TextInput value={settings.cta_title} onChange={v => set('cta_title', v)} placeholder="Join People E-Sheba Today" />
              </Field>
              <Field label="CTA Subtitle">
                <TextInput value={settings.cta_sub} onChange={v => set('cta_sub', v)} placeholder="Become part of a growing community..." />
              </Field>
            </div>
          </Section>

          <InfoBox>
            💡 After saving, the homepage will automatically display the new content. No rebuild needed.
          </InfoBox>
        </div>
      )}

      {/* ── GENERAL TAB ──────────────────────────────────────── */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Section title="🌐 Site Information" subtitle="Basic platform identity information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Site Name">
                <TextInput value={settings.site_name} onChange={v => set('site_name', v)} placeholder="People E-Sheba" />
              </Field>
              <Field label="Site Description" hint="Used in browser metadata / SEO">
                <TextInput value={settings.site_description} onChange={v => set('site_description', v)} placeholder="A community platform..." />
              </Field>
            </div>
          </Section>

          <Section title="📞 Contact Information" subtitle="Contact details shown on the website">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label={<><FiMail size={12} style={{ marginRight: 5 }} />Contact Email</>}>
                <TextInput type="email" value={settings.contact_email} onChange={v => set('contact_email', v)} placeholder="admin@peopleesheba.com" />
              </Field>
              <Field label={<><FiPhone size={12} style={{ marginRight: 5 }} />Contact Phone</>}>
                <TextInput value={settings.contact_phone} onChange={v => set('contact_phone', v)} placeholder="+880-1700-000000" />
              </Field>
              <Field label="Footer Text" hint="Short text shown at the bottom of every page">
                <TextInput value={settings.footer_text} onChange={v => set('footer_text', v)} placeholder="Empowering Bangladeshi citizens..." />
              </Field>
            </div>
          </Section>
        </div>
      )}

      {/* ── STATS TAB ────────────────────────────────────────── */}
      {activeTab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Section title="📊 Homepage Statistics" subtitle="The 3 big numbers shown in the hero panel">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <Field label="Stat 1 — Services" hint='e.g. "500+"'>
                <TextInput value={settings.stat_services} onChange={v => set('stat_services', v)} placeholder="500+" />
              </Field>
              <Field label="Stat 2 — Donors" hint='e.g. "10K+"'>
                <TextInput value={settings.stat_donors} onChange={v => set('stat_donors', v)} placeholder="10K+" />
              </Field>
              <Field label="Stat 3 — People Helped" hint='e.g. "50K+"'>
                <TextInput value={settings.stat_helped} onChange={v => set('stat_helped', v)} placeholder="50K+" />
              </Field>
            </div>

            {/* Preview */}
            <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Preview</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { label: 'Services', val: settings.stat_services || '500+' },
                  { label: 'Donors', val: settings.stat_donors || '10K+' },
                  { label: 'People Helped', val: settings.stat_helped || '50K+' },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, padding: '0.75rem', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-strong)' }}>{s.val}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ── SOCIAL TAB ───────────────────────────────────────── */}
      {activeTab === 'social' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Section title="🔗 Social Media Links" subtitle="Links to your official social media profiles">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {[
                { key: 'social_facebook', label: '📘 Facebook URL', placeholder: 'https://facebook.com/peopleesheba' },
                { key: 'social_twitter', label: '🐦 Twitter / X URL', placeholder: 'https://x.com/peopleesheba' },
                { key: 'social_youtube', label: '▶️ YouTube URL', placeholder: 'https://youtube.com/@peopleesheba' },
                { key: 'social_linkedin', label: '💼 LinkedIn URL', placeholder: 'https://linkedin.com/company/peopleesheba' },
              ].map(s => (
                <Field key={s.key} label={s.label}>
                  <TextInput value={settings[s.key]} onChange={v => set(s.key, v)} placeholder={s.placeholder} />
                </Field>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── SECURITY TAB ─────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Section title="🔒 Platform Security Settings" subtitle="Control access and platform availability">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ToggleSetting
                label="Maintenance Mode"
                desc="When ON, users see a maintenance page and cannot access the site."
                value={settings.maintenance_mode === '1'}
                onChange={v => set('maintenance_mode', v ? '1' : '0')}
                danger
              />
              <ToggleSetting
                label="New User Registration"
                desc="Allow new users to create accounts. Turn OFF to prevent new sign-ups."
                value={settings.registration_enabled !== '0'}
                onChange={v => set('registration_enabled', v ? '1' : '0')}
              />
            </div>
          </Section>

          <InfoBox type="warning">
            ⚠️ Turning on Maintenance Mode will immediately block all users (except admins) from accessing the website.
          </InfoBox>
        </div>
      )}

      {/* ── BACKUP TAB ──────────────────────────────────────── */}
      {activeTab === 'backup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Section title="💾 Backup & Restore" subtitle="Download a complete backup of the website source code and database">

            {/* Status box */}
            {backupStatus && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ padding: '1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4, fontWeight: 700 }}>DATABASE</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-strong)', fontSize: '0.9rem' }}>{backupStatus.db_name}</div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--surface-2)', border: `1px solid ${backupStatus.mysqldump_available ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: 12 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4, fontWeight: 700 }}>MYSQLDUMP</div>
                  <div style={{ fontWeight: 700, color: backupStatus.mysqldump_available ? 'var(--green)' : 'var(--amber)', fontSize: '0.9rem' }}>
                    {backupStatus.mysqldump_available ? '✓ Available' : '⚠ Not in PATH'}
                  </div>
                </div>
              </div>
            )}

            <div style={{ padding: '1.25rem', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, lineHeight: 1.7, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <p style={{ fontWeight: 700, color: 'var(--text-strong)', marginBottom: '0.5rem' }}>📦 What is included in the backup?</p>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                <li>All server source files (excluding <code>node_modules</code>)</li>
                <li>All client source files (excluding <code>node_modules</code> and <code>dist</code>)</li>
                <li>Full database SQL dump (if mysqldump is available)</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={`${api.defaults.baseURL || ''}/admin/backup/download`}
                onClick={(e) => {
                  // Attach auth token to the download link
                  const token = localStorage.getItem('pes_token');
                  if (!token) { e.preventDefault(); toast.error('Not authenticated'); return; }
                  // Use fetch to download with auth
                  e.preventDefault();
                  setBackupLoading(true);
                  const baseURL = (api.defaults.baseURL || '/api').startsWith('http')
                    ? (api.defaults.baseURL || '/api').replace(/\/api$/, '')
                    : window.location.origin;
                  fetch(`${baseURL}/api/admin/backup/download`, {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  .then(r => {
                    const cd = r.headers.get('content-disposition');
                    const match = cd && cd.match(/filename="?([^"]+)"?/);
                    const fn = match ? match[1] : 'backup.zip';
                    return r.blob().then(b => ({ b, fn }));
                  })
                  .then(({ b, fn }) => {
                    const url = URL.createObjectURL(b);
                    const a = document.createElement('a');
                    a.href = url; a.download = fn; a.click();
                    URL.revokeObjectURL(url);
                    toast.success('Backup downloaded!');
                  })
                  .catch(() => toast.error('Download failed'))
                  .finally(() => setBackupLoading(false));
                }}
                style={{ textDecoration: 'none' }}
              >
                <button
                  className="btn btn-primary"
                  style={{ height: 46, padding: '0 28px', fontSize: '0.9rem', fontWeight: 700, pointerEvents: backupLoading ? 'none' : 'auto' }}
                  disabled={backupLoading}
                >
                  {backupLoading ? <><div className="spinner spinner-sm" /> Generating...</> : <><FiDownload size={16} /> Download Full Backup (ZIP)</>}
                </button>
              </a>
            </div>
          </Section>

          <InfoBox type="warning">
            ⚠️ The backup may take 10–30 seconds to generate depending on project size. Do not close the browser tab during download.
          </InfoBox>
        </div>
      )}

      {/* Save footer */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        {dirty && <span style={{ fontSize: '0.82rem', color: 'var(--amber)', alignSelf: 'center' }}>You have unsaved changes</span>}
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="btn btn-primary"
          style={{ padding: '0 32px', height: 48, borderRadius: 14, fontWeight: 700, opacity: dirty ? 1 : 0.5 }}
        >
          {saving ? <div className="spinner spinner-sm" /> : <><FiSave size={16} /> Save All Changes</>}
        </button>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */
function Section({ title, subtitle, children }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem' }}>
      <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-strong)', marginBottom: 4 }}>{title}</h3>
      {subtitle && <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>{subtitle}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {children}
      </div>
    </div>
  );
}

function InfoBox({ children, type = 'info' }) {
  const styles = type === 'warning'
    ? { background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: 'var(--amber)' }
    : { background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: 'var(--cyan)' };
  return (
    <div style={{ ...styles, padding: '12px 16px', borderRadius: 10, fontSize: '0.82rem', lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

function ToggleSetting({ label, desc, value, onChange, danger }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'var(--surface-2)', border: `1px solid ${value && danger ? 'rgba(230,57,70,0.3)' : 'var(--border)'}`, borderRadius: 12, gap: '1rem' }}>
      <div>
        <div style={{ fontWeight: 700, color: value && danger ? 'var(--red)' : 'var(--text-strong)', fontSize: '0.9rem' }}>{label}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 2 }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 52, height: 28, borderRadius: 99, border: 'none', cursor: 'pointer', flexShrink: 0,
          background: value ? (danger ? 'var(--red)' : 'var(--green)') : 'var(--surface-3)',
          position: 'relative', transition: 'background 0.25s',
        }}
      >
        <div style={{
          position: 'absolute', top: 4, left: value ? 28 : 4, width: 20, height: 20,
          borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}
