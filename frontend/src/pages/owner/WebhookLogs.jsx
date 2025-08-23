import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WebhookLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/webhook-logs');
      setLogs(res.data);
    } catch (err) {
      setError('Failed to fetch webhook logs');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Webhook Logs</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="min-w-full bg-white rounded shadow mb-4">
        <thead>
          <tr>
            <th>Event</th>
            <th>Status</th>
            <th>Created</th>
            <th>Response/Error</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}>
              <td>{log.event}</td>
              <td>{log.status}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.status === 'failed' ? log.error : JSON.stringify(log.response)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
