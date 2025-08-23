import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VersionedSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ key: '', value: '' });
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/versioned-settings');
      setSettings(res.data);
    } catch (err) {
      setError('Failed to fetch settings');
    }
    setLoading(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/owner/versioned-settings', form);
      setSuccess('Setting updated successfully');
      setForm({ key: '', value: '' });
      fetchSettings();
    } catch (err) {
      setError('Failed to update setting');
    }
    setLoading(false);
  };

  const fetchHistory = async key => {
    setLoading(true);
    setHistory([]);
    try {
      const res = await axios.get(`/api/owner/versioned-settings/${key}/history`);
      setHistory(res.data);
    } catch (err) {
      setError('Failed to fetch history');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Versioned Settings</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="font-medium">Setting Key</label>
          <input type="text" name="key" value={form.key} onChange={handleChange} className="ml-2 border rounded px-2 py-1 w-full" required />
        </div>
        <div>
          <label className="font-medium">Value</label>
          <input type="text" name="value" value={form.value} onChange={handleChange} className="ml-2 border rounded px-2 py-1 w-full" required />
        </div>
        <button type="submit" className="btn btn-primary mt-4">Update Setting</button>
      </form>
      <h3 className="text-lg font-semibold mb-2">Current Settings</h3>
      <table className="min-w-full bg-white rounded shadow mb-4">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Version</th>
            <th>History</th>
          </tr>
        </thead>
        <tbody>
          {settings.map(s => (
            <tr key={s._id}>
              <td>{s.key}</td>
              <td>{JSON.stringify(s.value)}</td>
              <td>{s.version}</td>
              <td>
                <button className="btn btn-sm btn-secondary" onClick={() => fetchHistory(s.key)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {history.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Setting History</h4>
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th>Version</th>
                <th>Value</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={idx}>
                  <td>{h.version}</td>
                  <td>{JSON.stringify(h.value)}</td>
                  <td>{h.updatedAt ? new Date(h.updatedAt).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
