// AdminDocumentVerification.jsx
// Admin document verification page (industry-level)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

export default function AdminDocumentVerification() {
  const [documents, setDocuments] = useState([]);
  const [filters, setFilters] = useState({ status: '', user: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifyState, setVerifyState] = useState({ id: '', status: 'approved', remarks: '' });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/adminDocuments?${params}`);
      setDocuments(res.data.documents);
    } catch (err) {
      setError('Failed to fetch documents');
    }
    setLoading(false);
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleVerify = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`/api/adminDocuments/verify/${verifyState.id}`, { status: verifyState.status, remarks: verifyState.remarks });
      setSuccess('Document verified');
      setVerifyState({ id: '', status: 'approved', remarks: '' });
      fetchDocuments();
    } catch (err) {
      setError('Verification failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Document Verification</h2>
      <form onSubmit={handleFilterSubmit} className="mb-6 flex gap-4 flex-wrap items-end">
        <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded">
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input type="text" name="user" value={filters.user} onChange={handleFilterChange} placeholder="User ID" className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">File</th>
              <th className="border px-2 py-1">Remarks</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc._id}>
                <td className="border px-2 py-1">{doc.type}</td>
                <td className="border px-2 py-1">{doc.user ? doc.user.name : '-'}</td>
                <td className="border px-2 py-1">{doc.status}</td>
                <td className="border px-2 py-1"><a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></td>
                <td className="border px-2 py-1">{doc.remarks || '-'}</td>
                <td className="border px-2 py-1">
                  {doc.status === 'pending' && (
                    <form onSubmit={handleVerify} className="flex flex-col gap-2">
                      <select value={verifyState.status} onChange={e => setVerifyState({ ...verifyState, id: doc._id, status: e.target.value })} className="p-1 border rounded">
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                      <input type="text" placeholder="Remarks" value={verifyState.id === doc._id ? verifyState.remarks : ''} onChange={e => setVerifyState({ ...verifyState, id: doc._id, remarks: e.target.value })} className="p-1 border rounded" />
                      <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded">Submit</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
