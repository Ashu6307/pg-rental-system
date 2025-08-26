import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OwnerAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/auditlogs');
      setLogs(res.data);
    } catch (err) {
      setError('Error fetching audit logs');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="bg-white shadow rounded p-4">
        {logs.length === 0 && <li>No audit logs found.</li>}
        {logs.map(log => (
          <li key={log._id} className="mb-4 p-3 border rounded">
            <div className="font-semibold">{log.action}</div>
            <div className="text-xs text-gray-500 mb-2">{log.target_type} | {log.target_id} | {new Date(log.created_at).toLocaleString()}</div>
            <div className="text-sm">{JSON.stringify(log.details)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
