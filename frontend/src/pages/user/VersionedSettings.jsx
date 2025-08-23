// VersionedSettings.jsx
// User versioned settings page (industry-level)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VersionedSettings() {
  const [settings, setSettings] = useState([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [version, setVersion] = useState('1.0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/versionedSettings/my');
      setSettings(res.data.settings);
    } catch (err) {
      setError('Failed to fetch settings');
    }
    setLoading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!key || !value || !version) return setError('All fields required');
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/versionedSettings/addOrUpdate', { key, value, version });
      setSuccess('Setting saved');
      setKey('');
      setValue('');
      setVersion('1.0');
      fetchSettings();
    } catch (err) {
      setError('Failed to save setting');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/versionedSettings/${id}`);
      setSuccess('Setting deleted');
      fetchSettings();
    } catch (err) {
      setError('Failed to delete setting');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Versioned Settings</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Setting Key"
          value={key}
          onChange={e => setKey(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Setting Value"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Version (e.g. 1.0)"
          value={version}
          onChange={e => setVersion(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Saving...' : 'Save Setting'}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </form>
      <h3 className="text-lg font-semibold mb-2">Your Settings</h3>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Key</th>
              <th className="border px-2 py-1">Value</th>
              <th className="border px-2 py-1">Version</th>
              <th className="border px-2 py-1">Updated At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.map(setting => (
              <tr key={setting._id}>
                <td className="border px-2 py-1">{setting.key}</td>
                <td className="border px-2 py-1">{setting.value}</td>
                <td className="border px-2 py-1">{setting.version}</td>
                <td className="border px-2 py-1">{new Date(setting.updatedAt).toLocaleString()}</td>
                <td className="border px-2 py-1">
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(setting._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
