// AdminGDPRConsents.jsx
// Industry-level admin GDPR/data consent management page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminGDPRConsents() {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConsents();
  }, []);

  const fetchConsents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/gdprConsent/all');
      setConsents(res.data.consents);
    } catch (err) {
      setError('Failed to fetch consents');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin GDPR/Data Consent Management</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Consent Type</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Version</th>
              <th className="border px-2 py-1">IP</th>
              <th className="border px-2 py-1">User Agent</th>
              <th className="border px-2 py-1">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {consents.map(c => (
              <tr key={c._id}>
                <td className="border px-2 py-1">{c.user?.email || c.user?._id}</td>
                <td className="border px-2 py-1">{c.consentType}</td>
                <td className="border px-2 py-1">{c.status}</td>
                <td className="border px-2 py-1">{c.version}</td>
                <td className="border px-2 py-1">{c.ip}</td>
                <td className="border px-2 py-1">{c.userAgent}</td>
                <td className="border px-2 py-1">{new Date(c.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
