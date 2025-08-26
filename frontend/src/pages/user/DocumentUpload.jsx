// DocumentUpload.jsx
// User document upload & verification page
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const documentTypes = [
  { value: 'Aadhaar', label: 'Aadhaar Card' },
  { value: 'License', label: 'Driving License' },
  { value: 'Passport', label: 'Passport' }
];

export default function DocumentUpload() {
  const [documents, setDocuments] = useState([]);
  const [type, setType] = useState('Aadhaar');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/documents/my');
      setDocuments(res.data.documents);
    } catch (err) {
      setError('Failed to fetch documents');
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file');
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('file', file);
      await axios.post('/api/documents/upload', formData);
      setSuccess('Document uploaded successfully');
      fetchDocuments();
    } catch (err) {
      setError('Upload failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Document Upload & Verification</h2>
      <form onSubmit={handleUpload} className="mb-6">
        <label className="block mb-2 font-medium">Document Type</label>
        <select value={type} onChange={e => setType(e.target.value)} className="mb-4 p-2 border rounded w-full">
          {documentTypes.map(dt => (
            <option key={dt.value} value={dt.value}>{dt.label}</option>
          ))}
        </select>
        <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-4" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </form>
      <h3 className="text-lg font-semibold mb-2">Your Documents</h3>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">File</th>
              <th className="border px-2 py-1">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc._id}>
                <td className="border px-2 py-1">{doc.type}</td>
                <td className="border px-2 py-1">{doc.status}</td>
                <td className="border px-2 py-1"><a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></td>
                <td className="border px-2 py-1">{doc.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
