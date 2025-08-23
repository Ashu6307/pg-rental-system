import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../../components/FileUpload.jsx';

const DOC_TYPES = ['Aadhaar', 'PAN', 'GST', 'RentalAgreement', 'Insurance', 'Other'];

export default function DocumentVerification() {
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState({ type: 'Aadhaar', fileUrl: '', expiryDate: '', consent: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/documents');
      setDocs(res.data);
    } catch (err) {
      setError('Error fetching documents');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/owner/documents', form);
      fetchDocs();
      setForm({ type: 'Aadhaar', fileUrl: '', expiryDate: '', consent: false });
    } catch (err) {
      setError('Error uploading document');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/owner/documents/${id}`);
      fetchDocs();
    } catch (err) {
      setError('Error deleting document');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Owner Document Verification</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <select name="type" value={form.type} onChange={handleChange} className="input">
            {DOC_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <FileUpload onUpload={url => setForm(f => ({ ...f, fileUrl: url }))} accept="image/*,application/pdf" />
          <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} className="input" />
          <label className="flex items-center">
            <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} /> GDPR/Data Consent
          </label>
        </div>
        <button type="submit" className="mt-4 btn btn-primary" disabled={loading}>Upload Document</button>
      </form>
      <h3 className="text-xl font-semibold mb-2">Your Documents</h3>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th>Type</th>
              <th>URL</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Consent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map(doc => [
              <tr key={doc._id}>
                <td>{doc.type}</td>
                <td><a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></td>
                <td>{doc.status}</td>
                <td>{doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : '-'}</td>
                <td>{doc.consent ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(doc._id)}>Delete</button>
                </td>
              </tr>,
              doc.auditLogs && doc.auditLogs.length > 0 && (
                <tr key={doc._id + '-audit'}>
                  <td colSpan="6" className="bg-gray-50 text-xs p-2">
                    <div className="font-semibold mb-1">Audit History:</div>
                    <ul className="list-disc ml-4">
                      {doc.auditLogs.map((log, idx) => (
                        <li key={idx}>
                          {log.date ? new Date(log.date).toLocaleString() : ''} - {log.action} {log.remarks ? `(${log.remarks})` : ''}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )
            ])}
          </tbody>
        </table>
      )}
    </div>
  );
}
