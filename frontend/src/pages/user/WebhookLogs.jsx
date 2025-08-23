// WebhookLogs.jsx
// User webhook logs page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WebhookLogs() {
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
      const res = await axios.get('/api/webhookLogs/my');
      setLogs(res.data.logs);
    } catch (err) {
      setError('Failed to fetch webhook logs');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/webhookLogs/${id}`);
      setSuccess('Log deleted');
      fetchLogs();
    } catch (err) {
      setError('Failed to delete log');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Webhook Logs</h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Event</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td className="border px-2 py-1">{log.event}</td>
                <td className={`border px-2 py-1 ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{log.status}</td>
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
