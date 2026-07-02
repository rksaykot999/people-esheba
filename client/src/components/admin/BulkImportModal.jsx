import { useState } from 'react';
import { FiUploadCloud, FiX, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export default function BulkImportModal({ isOpen, onClose, table, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImport = async () => {
    if (!file) return toast.error('Please select a file');
    setLoading(true);

    const processData = async (rows) => {
      if (!rows || rows.length === 0) {
        setLoading(false);
        return toast.error('File is empty or invalid format');
      }
      try {
        const { data } = await api.post('/admin/bulk-import', { table, rows });
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
      toast.error('Unsupported file type');
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)' }} />
      <div style={{ position:'relative', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, width:'100%', maxWidth:400, padding:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h2 style={{ fontWeight:700, fontSize:'1.1rem', color:'#fff', display:'flex', alignItems:'center', gap:8 }}>
            <FiUploadCloud /> Bulk Import Data
          </h2>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer' }}><FiX size={16}/></button>
        </div>

        <div style={{ background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.2)', padding:'10px', borderRadius:8, marginBottom:'1rem', fontSize:'0.8rem', color:'var(--text-muted)' }}>
          <FiInfo style={{ color:'var(--cyan)', marginRight:6 }} />
          Upload a <strong>CSV</strong> or <strong>Excel</strong> file. The first row must contain exact column names matching the database (e.g. name, specialty, district).
        </div>

        <input 
          type="file" 
          accept=".csv, .xlsx, .xls"
          onChange={e => setFile(e.target.files[0])}
          style={{ width:'100%', padding:'0.5rem', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, color:'#fff', marginBottom:'1.5rem' }}
        />

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={handleImport} disabled={loading || !file} className="btn btn-primary" style={{ flex:1, justifyContent:'center' }}>
            {loading ? <div className="spinner spinner-sm"/> : 'Import Data'}
          </button>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
