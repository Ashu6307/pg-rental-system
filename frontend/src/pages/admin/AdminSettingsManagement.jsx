// AdminSettingsManagement.jsx
// Industry-level admin settings management (versioned, audit) page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminSettingsManagement() {
  const [settings, setSettings] = useState([]);
  const [filters, setFilters] = useState({ version: '', key: '', dateFrom: '', dateTo: '' });
  const [form, setForm] = useState({ key: '', value: '' });
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
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/adminSettings?${params}`);
      setSettings(res.data.settings);
    } catch (err) {
      setError('Failed to fetch settings');
    }
    setLoading(false);
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchSettings();
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/adminSettings/update', form);
      setSuccess('Setting updated');
      fetchSettings();
    } catch (err) {
      setError('Failed to update setting');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/adminSettings/${id}`);
      setSuccess('Setting deleted');
      fetchSettings();
    } catch (err) {
      setError('Failed to delete setting');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Settings Management (Versioned, Audit)</h2>
      <form onSubmit={handleFilterSubmit} className="mb-6 flex gap-4 flex-wrap items-end">
        <input type="text" name="version" value={filters.version} onChange={handleFilterChange} placeholder="Version" className="p-2 border rounded" />
        <input type="text" name="key" value={filters.key} onChange={handleFilterChange} placeholder="Key" className="p-2 border rounded" />
        <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="p-2 border rounded" />
        <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border mb-8">
          <thead>
            <tr>
              <th className="border px-2 py-1">Key</th>
              <th className="border px-2 py-1">Value</th>
              <th className="border px-2 py-1">Version</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.map(s => (
              <tr key={s._id}>
                <td className="border px-2 py-1">{s.key}</td>
                <td className="border px-2 py-1">{JSON.stringify(s.value)}</td>
                <td className="border px-2 py-1">{s.version}</td>
                <td className="border px-2 py-1">{new Date(s.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(s._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <form onSubmit={handleUpdate} className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Update Setting</h3>
        <input type="text" name="key" value={form.key} onChange={handleFormChange} placeholder="Key" className="p-2 border rounded mr-2" />
        <input type="text" name="value" value={form.value} onChange={handleFormChange} placeholder="Value" className="p-2 border rounded mr-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
}
