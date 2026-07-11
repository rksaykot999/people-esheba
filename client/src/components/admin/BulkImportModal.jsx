import { useState } from 'react';
import { FiUploadCloud, FiX, FiInfo, FiDownload, FiBook, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

/* ── Template column definitions ─────────────────────────────── */
const TEMPLATES = {
  doctors: {
    label: '🩺 Doctors',
    columns: ['name', 'name_bn', 'specialty', 'specialty_bn', 'area', 'area_bn', 'district', 'division', 'phone', 'hours', 'rating', 'is_verified', 'is_active'],
    notes: [
      'name — Full name of the doctor (required)',
      'name_bn — বাংলা নাম (optional — shown when site is set to Bengali)',
      'specialty — e.g. Cardiologist, Pediatrician, Medicine, Dentist',
      'specialty_bn — বাংলায় বিশেষত্ব (optional)',
      'area — Locality (e.g. Mirpur, Uttara)',
      'area_bn — বাংলায় এলাকা (optional)',
      'district — e.g. Dhaka, Chittagong',
      'division — e.g. Dhaka, Chittagong, Rajshahi, Khulna, Sylhet, Barisal, Rangpur, Mymensingh',
      'phone — Contact number',
      'hours — Working hours e.g. Sat–Thu 9am–5pm',
      'rating — 0.0 to 5.0',
      'is_verified — 1 = verified, 0 = not verified',
      'is_active — 1 = active (shows on site), 0 = hidden',
    ],
    sample: [
      { name: 'Dr. Rahim Uddin', name_bn: 'ডা. রহিম উদ্দিন', specialty: 'Cardiologist', specialty_bn: 'কার্ডিওলজিস্ট', area: 'Mirpur', area_bn: 'মিরপুর', district: 'Dhaka', division: 'Dhaka', phone: '01711234567', hours: 'Sat–Thu 9am–2pm', rating: '4.5', is_verified: 1, is_active: 1 },
      { name: 'Dr. Salma Begum', name_bn: 'ডা. সালমা বেগম', specialty: 'Pediatrician', specialty_bn: 'পেডিয়াট্রিশিয়ান', area: 'Sylhet Sadar', area_bn: 'সিলেট সদর', district: 'Sylhet', division: 'Sylhet', phone: '01811234567', hours: 'Sun–Thu 10am–4pm', rating: '4.2', is_verified: 1, is_active: 1 },
    ],
  },
  pharmacies: {
    label: '💊 Pharmacies',
    columns: ['name', 'name_bn', 'area', 'area_bn', 'district', 'division', 'phone', 'hours', 'is_24h', 'is_verified', 'is_active'],
    notes: [
      'name — Pharmacy name (required)',
      'name_bn — বাংলা নাম (optional)',
      'area — Locality',
      'area_bn — বাংলায় এলাকা (optional)',
      'district — e.g. Dhaka',
      'division — e.g. Dhaka',
      'phone — Contact number',
      'hours — e.g. 8am–10pm',
      'is_24h — 1 = 24-hour open, 0 = not',
      'is_verified — 1 = verified, 0 = not',
      'is_active — 1 = active, 0 = hidden',
    ],
    sample: [
      { name: 'Dhaka Medical Pharmacy', name_bn: 'ঢাকা মেডিকেল ফার্মেসি', area: 'Shahbag', area_bn: 'শাহবাগ', district: 'Dhaka', division: 'Dhaka', phone: '01900000001', hours: '24 hours', is_24h: 1, is_verified: 1, is_active: 1 },
      { name: 'Al-Amin Pharmacy', name_bn: 'আল-আমিন ফার্মেসি', area: 'Mirpur-10', area_bn: 'মিরপুর-১০', district: 'Dhaka', division: 'Dhaka', phone: '01800000001', hours: '8am–11pm', is_24h: 0, is_verified: 0, is_active: 1 },
    ],
  },
  notices: {
    label: '📢 Notices',
    columns: ['title', 'title_bn', 'category', 'source', 'link', 'description', 'description_bn', 'is_active'],
    notes: [
      'title — Notice headline (required)',
      'title_bn — বাংলা শিরোনাম (optional)',
      "category — One of: govt, education, job, health, general",
      'source — Source name e.g. BRTC, BUET, Ministry of Health',
      'link — URL to original notice (optional)',
      'description — Short description (optional)',
      'description_bn — বাংলা বিবরণ (optional)',
      'is_active — 1 = published, 0 = hidden',
    ],
    sample: [
      { title: 'SSC Result 2024 Published', title_bn: 'এসএসসি ফলাফল ২০২৪ প্রকাশিত', category: 'education', source: 'Education Board', link: 'https://www.educationboard.gov.bd', description: 'SSC examination results are now available.', description_bn: 'এসএসসি পরীক্ষার ফলাফল এখন পাওয়া যাচ্ছে।', is_active: 1 },
      { title: 'New Health Policy Announced', title_bn: 'নতুন স্বাস্থ্যনীতি ঘোষণা', category: 'health', source: 'Ministry of Health', link: '', description: 'A new national health care policy has been announced.', description_bn: 'একটি নতুন জাতীয় স্বাস্থ্যসেবা নীতি ঘোষণা করা হয়েছে।', is_active: 1 },
    ],
  },
  education_institutions: {
    label: '🎓 Education Institutions',
    columns: ['name', 'name_bn', 'type', 'district', 'division', 'address', 'address_bn', 'phone', 'website', 'description', 'description_bn', 'is_verified', 'is_active'],
    notes: [
      'name — Institution name (required)',
      'name_bn — বাংলা নাম (optional)',
      "type — One of: school, college, university",
      'district — e.g. Dhaka',
      'division — e.g. Dhaka',
      'address — Full address',
      'address_bn — বাংলা ঠিকানা (optional)',
      'phone — Contact number',
      'website — Official website URL',
      'description — Short description',
      'description_bn — বাংলা বিবরণ (optional)',
      'is_verified — 1 = verified, 0 = not',
      'is_active — 1 = active, 0 = hidden',
    ],
    sample: [
      { name: 'Dhaka University', name_bn: 'ঢাকা বিশ্ববিদ্যালয়', type: 'university', district: 'Dhaka', division: 'Dhaka', address: 'University Road, Dhaka-1000', address_bn: 'বিশ্ববিদ্যালয় সড়ক, ঢাকা-১০০০', phone: '02-9661900', website: 'https://du.ac.bd', description: 'Premier public university of Bangladesh.', description_bn: 'বাংলাদেশের শীর্ষস্থানীয় সরকারি বিশ্ববিদ্যালয়।', is_verified: 1, is_active: 1 },
      { name: 'BUET', name_bn: 'বুয়েট', type: 'university', district: 'Dhaka', division: 'Dhaka', address: 'Palashi, Dhaka-1000', address_bn: 'পলাশী, ঢাকা-১০০০', phone: '02-9665600', website: 'https://buet.ac.bd', description: 'Bangladesh University of Engineering & Technology.', description_bn: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়।', is_verified: 1, is_active: 1 },
    ],
  },
  scholarships: {
    label: '🏆 Scholarships',
    columns: ['title', 'title_bn', 'provider', 'provider_bn', 'deadline', 'amount', 'link', 'description', 'description_bn', 'category', 'is_active'],
    notes: [
      'title — Scholarship title (required)',
      'title_bn — বাংলা শিরোনাম (optional)',
      'provider — Organization name e.g. Government of Bangladesh',
      'provider_bn — বাংলায় প্রদানকারী প্রতিষ্ঠান (optional)',
      'deadline — Date in YYYY-MM-DD format e.g. 2024-12-31',
      'amount — Amount or description e.g. Full tuition, BDT 50,000',
      'link — Application or info URL',
      'description — Details about the scholarship',
      'description_bn — বাংলা বিবরণ (optional)',
      "category — e.g. merit, need-based, technical, general",
      'is_active — 1 = active, 0 = hidden',
    ],
    sample: [
      { title: 'Prime Minister Education Assistance Trust', title_bn: 'প্রধানমন্ত্রী শিক্ষা সহায়তা ট্রাস্ট', provider: 'Government of Bangladesh', provider_bn: 'বাংলাদেশ সরকার', deadline: '2024-12-31', amount: 'Full Tuition + Stipend', link: 'https://pmeat.gov.bd', description: 'Scholarship for meritorious students from low-income families.', description_bn: 'নিম্ন আয়ের পরিবারের মেধাবী শিক্ষার্থীদের জন্য বৃত্তি।', category: 'need-based', is_active: 1 },
      { title: 'BUET Merit Scholarship', title_bn: 'বুয়েট মেধা বৃত্তি', provider: 'BUET', provider_bn: 'বুয়েট', deadline: '2025-03-15', amount: 'BDT 6,000/month', link: 'https://buet.ac.bd/scholarship', description: 'Merit-based scholarship for undergraduate students.', description_bn: 'স্নাতক শিক্ষার্থীদের জন্য মেধাভিত্তিক বৃত্তি।', category: 'merit', is_active: 1 },
    ],
  },
  jobs: {
    label: '💼 Jobs',
    columns: ['title', 'title_bn', 'company', 'company_bn', 'type', 'description', 'description_bn', 'district', 'division', 'salary_min', 'salary_max', 'deadline', 'is_remote', 'status'],
    notes: [
      'title — Job title (required)',
      'title_bn — বাংলা পদবি (optional)',
      'company — Company name (required)',
      'company_bn — বাংলায় কোম্পানির নাম (optional)',
      'type — e.g. full-time, part-time, freelance, internship, remote, govt',
      'description — Job description (required)',
      'description_bn — বাংলা বিবরণ (optional)',
      'district — e.g. Dhaka',
      'division — e.g. Dhaka',
      'salary_min — Minimum salary (number)',
      'salary_max — Maximum salary (number)',
      'deadline — Date in YYYY-MM-DD format e.g. 2024-12-31',
      'is_remote — 1 = remote, 0 = on-site',
      'status — active, draft, closed',
    ],
    sample: [
      { title: 'Software Engineer', title_bn: 'সফটওয়্যার ইঞ্জিনিয়ার', company: 'Tech Solutions', company_bn: 'টেক সলিউশনস', type: 'full-time', description: 'React/Node Developer', description_bn: 'রিয়্যাক্ট/নোড ডেভেলপার', district: 'Dhaka', division: 'Dhaka', salary_min: 40000, salary_max: 60000, deadline: '2024-12-31', is_remote: 1, status: 'active' },
      { title: 'Data Entry Operator', title_bn: 'ডাটা এন্ট্রি অপারেটর', company: 'ABC Corp', company_bn: 'এবিসি কর্প', type: 'part-time', description: 'Basic Excel required', description_bn: 'বেসিক এক্সেল জানা আবশ্যক', district: 'Chittagong', division: 'Chittagong', salary_min: 15000, salary_max: 20000, deadline: '2024-10-31', is_remote: 0, status: 'active' },
    ],
  },
  blood_donors: {
    label: '🩸 Blood Donors',
    columns: ['name', 'blood_group', 'phone', 'district', 'division', 'address', 'is_available', 'total_donations', 'status'],
    notes: [
      'name — Full name of donor (required)',
      'blood_group — One of: A+, A-, B+, B-, AB+, AB-, O+, O-',
      'phone — Contact phone number',
      'district — e.g. Dhaka, Chittagong',
      'division — e.g. Dhaka, Chittagong, Rajshahi',
      'address — Full address (optional)',
      'is_available — 1 = available to donate, 0 = not available',
      'total_donations — Number of previous donations (default 0)',
      'status — approved, pending, rejected (default: approved)',
    ],
    sample: [
      { name: 'Karim Uddin', blood_group: 'O+', phone: '01711000001', district: 'Dhaka', division: 'Dhaka', address: 'Mirpur-10, Dhaka', is_available: 1, total_donations: 3, status: 'approved' },
      { name: 'Rina Akter', blood_group: 'A+', phone: '01811000002', district: 'Chittagong', division: 'Chittagong', address: 'Agrabad, Chittagong', is_available: 1, total_donations: 1, status: 'approved' },
    ],
  },
  volunteers: {
    label: '🤝 Volunteers',
    columns: ['name', 'category', 'skills', 'availability', 'division', 'district', 'bio', 'is_verified', 'is_active'],
    notes: [
      'name — Full name (required)',
      'category — One of: general, medical, education, disaster, food, environment, tech, other',
      'skills — Comma-separated skills e.g. First Aid, Teaching, IT',
      'availability — e.g. Weekends, Evenings, Full-time',
      'division — e.g. Dhaka, Chittagong',
      'district — e.g. Mirpur, Sylhet Sadar',
      'bio — Short description about the volunteer (optional)',
      'is_verified — 1 = verified, 0 = not verified',
      'is_active — 1 = active/approved, 0 = pending',
    ],
    sample: [
      { name: 'Md. Hasan Ali', category: 'medical', skills: 'First Aid, CPR', availability: 'Weekends', division: 'Dhaka', district: 'Uttara', bio: 'Experienced first aid volunteer.', is_verified: 1, is_active: 1 },
      { name: 'Fatema Khanam', category: 'education', skills: 'Teaching, Tutoring', availability: 'Evenings', division: 'Chittagong', district: 'Agrabad', bio: 'Teaching underprivileged children.', is_verified: 0, is_active: 1 },
    ],
  },
  emergency_services: {
    label: '🚨 Emergency Services',
    columns: ['name', 'type', 'phone', 'address', 'district', 'division', 'latitude', 'longitude', 'is_24h'],
    notes: [
      'name — Service name e.g. Dhaka Medical College Hospital (required)',
      'type — One of: hospital, police, fire, ambulance, mental, other',
      'phone — Emergency contact number (required)',
      'address — Full address',
      'district — e.g. Dhaka',
      'division — e.g. Dhaka',
      'latitude — GPS latitude (optional)',
      'longitude — GPS longitude (optional)',
      'is_24h — 1 = 24-hour service, 0 = not',
    ],
    sample: [
      { name: 'Dhaka Medical College Hospital', type: 'hospital', phone: '02-55165088', address: 'Bakshibazar, Dhaka-1000', district: 'Dhaka', division: 'Dhaka', latitude: '23.7241', longitude: '90.3962', is_24h: 1 },
      { name: 'Ramna Police Station', type: 'police', phone: '02-9331787', address: 'Ramna, Dhaka', district: 'Dhaka', division: 'Dhaka', latitude: '', longitude: '', is_24h: 1 },
    ],
  },
  directory_listings: {
    label: '🏢 Directory Listings (Hospitals / Services / Govt)',
    columns: ['name', 'name_bn', 'category', 'subtype', 'description', 'description_bn', 'area', 'district', 'division', 'address', 'phone', 'website', 'rating', 'badge_key', 'price_info', 'features', 'is_verified'],
    notes: [
      'name — Listing name (required)',
      'name_bn — বাংলা নাম (optional)',
      'category — One of: hospital, service, government',
      'subtype — e.g. govt-hospital, private-hospital, home, transport, repairs, nid, passport',
      'description — Short description',
      'description_bn — বাংলা বিবরণ (optional)',
      'area — Locality e.g. Mirpur, Dhanmondi',
      'district — e.g. Dhaka',
      'division — e.g. Dhaka',
      'address — Full address',
      'phone — Contact number',
      'website — Website URL (optional)',
      'rating — 0.0 to 5.0',
      'badge_key — Badge label key (optional)',
      'price_info — Pricing info e.g. Free, BDT 500',
      'features — Comma-separated features (optional)',
      'is_verified — 1 = verified, 0 = not verified',
    ],
    sample: [
      { name: 'National Heart Foundation', name_bn: 'জাতীয় হৃদরোগ ফাউন্ডেশন', category: 'hospital', subtype: 'private-hospital', description: 'Specialized cardiac care.', description_bn: 'বিশেষায়িত হৃদরোগ সেবা।', area: 'Mirpur', district: 'Dhaka', division: 'Dhaka', address: 'Mirpur Road, Dhaka', phone: '02-8059898', website: 'https://nhf.org.bd', rating: 4.5, badge_key: '', price_info: '', features: 'ICU, OPD, Emergency', is_verified: 1 },
      { name: 'NID Service Center', name_bn: 'এনআইডি সেবা কেন্দ্র', category: 'government', subtype: 'nid', description: 'National ID card services.', description_bn: 'জাতীয় পরিচয়পত্র সেবা।', area: 'Agargaon', district: 'Dhaka', division: 'Dhaka', address: 'EC Tower, Agargaon, Dhaka', phone: '16100', website: 'https://services.nidw.gov.bd', rating: 3.5, badge_key: '', price_info: 'Free', features: '', is_verified: 1 },
    ],
  },
};

export default function BulkImportModal({ isOpen, onClose, table, onImportSuccess, defaultValues }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);

  if (!isOpen) return null;

  const tmpl = TEMPLATES[table];

  const handleImport = async () => {
    if (!file) return toast.error('Please select a file');
    setLoading(true);

    const processData = async (rows) => {
      if (!rows || rows.length === 0) {
        setLoading(false);
        return toast.error('File is empty or invalid format');
      }
      const processedRows = rows.map(r => ({
        ...defaultValues,
        ...r
      }));
      try {
        const { data } = await api.post('/admin/bulk-import', { table, rows: processedRows });
        toast.success(data.message || 'Import successful');
        if (onImportSuccess) onImportSuccess();
        onClose();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Import failed');
      } finally {
        setLoading(false);
      }
    };

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => processData(results.data),
        error: () => { setLoading(false); toast.error('Failed to parse CSV'); }
      });
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet);
          processData(rows);
        } catch {
          setLoading(false);
          toast.error('Failed to parse Excel file');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setLoading(false);
      toast.error('Only .csv, .xlsx, .xls files are supported');
    }
  };

  const downloadTemplate = (format) => {
    if (!tmpl) return;
    let data = [tmpl.columns.reduce((acc, c) => ({ ...acc, [c]: '' }), {}), ...tmpl.sample];
    if (defaultValues) {
      data = data.map((item, idx) => {
        if (idx === 0) return item;
        return { ...item, ...defaultValues };
      });
    }
    if (format === 'csv') {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${table}_template.csv`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `${table}_template.xlsx`);
    }
    toast.success('Template downloaded!');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />
      <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 560, padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiUploadCloud style={{ color: 'var(--cyan)' }} />
            Bulk Import {tmpl?.label || table}
          </h2>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiX size={14} /></button>
        </div>

        {/* Manual toggle */}
        {tmpl && (
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              onClick={() => setShowManual(m => !m)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 10, cursor: 'pointer', color: 'var(--cyan)', fontWeight: 700, fontSize: '0.85rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiBook size={14} /> File Format Manual & Templates</span>
              {showManual ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </button>

            {showManual && (
              <div style={{ marginTop: 8, padding: '1.25rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Required columns (first row must be the header):
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
                  {tmpl.columns.map(col => (
                    <code key={col} style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 6, color: '#a78bfa', fontWeight: 700 }}>{col}</code>
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
                  {tmpl.notes.map((n, i) => (
                    <div key={i} style={{ padding: '3px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>• </span>{n}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => downloadTemplate('csv')} className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--border)', fontSize: '0.78rem' }}>
                    <FiDownload size={12} /> Download CSV Template
                  </button>
                  <button onClick={() => downloadTemplate('xlsx')} className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--border)', fontSize: '0.78rem' }}>
                    <FiDownload size={12} /> Download Excel Template
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Select CSV or Excel file
          </label>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={e => setFile(e.target.files[0])}
            style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}
          />
          {file && (
            <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 6 }}>
              ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB) selected
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleImport} disabled={loading || !file} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? <div className="spinner spinner-sm" /> : <><FiUploadCloud size={14} /> Import Data</>}
          </button>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center' }}>
          The system will automatically organize the data on the website after import.
        </p>
      </div>
    </div>
  );
}
