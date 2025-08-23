// AuditLogs.jsx
// User audit logs page (industry-level)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/auditLogs/my');
      setLogs(res.data.logs);
    } catch (err) {
      setError('Failed to fetch audit logs');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/auditLogs/${id}`);
      setSuccess('Log deleted');
      fetchLogs();
    } catch (err) {
      setError('Failed to delete log');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Action</th>
              <th className="border px-2 py-1">Details</th>
              <th className="border px-2 py-1">IP</th>
              <th className="border px-2 py-1">Device</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td className="border px-2 py-1">{log.action}</td>
                <td className="border px-2 py-1">{JSON.stringify(log.details)}</td>
                <td className="border px-2 py-1">{log.ip || '-'}</td>
                <td className="border px-2 py-1">{log.device || '-'}</td>
                <td className="border px-2 py-1">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1">
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(log._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
