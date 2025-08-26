// AdminNotificationPreferences.jsx
// Industry-level admin notification preferences page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminNotificationPreferences() {
  const [preferences, setPreferences] = useState([]);
  const [filters, setFilters] = useState({ user: '', channel: '', status: '', dateFrom: '', dateTo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/adminNotificationPreferences?${params}`);
      setPreferences(res.data.preferences);
    } catch (err) {
      setError('Failed to fetch preferences');
    }
    setLoading(false);
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchPreferences();
  };

  const handleStatusUpdate = async (id, channel, status) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.patch(`/api/adminNotificationPreferences/${id}`, { channel, status });
      setSuccess('Preference updated');
      fetchPreferences();
    } catch (err) {
      setError('Failed to update preference');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/adminNotificationPreferences/${id}`);
      setSuccess('Preference deleted');
      fetchPreferences();
    } catch (err) {
      setError('Failed to delete preference');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Notification Preferences</h2>
      <form onSubmit={handleFilterSubmit} className="mb-6 flex gap-4 flex-wrap items-end">
        <input type="text" name="user" value={filters.user} onChange={handleFilterChange} placeholder="User ID" className="p-2 border rounded" />
        <input type="text" name="channel" value={filters.channel} onChange={handleFilterChange} placeholder="Channel" className="p-2 border rounded" />
        <input type="text" name="status" value={filters.status} onChange={handleFilterChange} placeholder="Status" className="p-2 border rounded" />
        <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="p-2 border rounded" />
        <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Channel</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {preferences.map(p => (
              <tr key={p._id}>
                <td className="border px-2 py-1">{p.user ? p.user.name : '-'}</td>
                <td className="border px-2 py-1">{p.channel}</td>
                <td className="border px-2 py-1">{p.status}</td>
                <td className="border px-2 py-1">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={() => handleStatusUpdate(p._id, p.channel, 'enabled')}>
                    Enable
                  </button>
                  <button className="bg-yellow-600 text-white px-2 py-1 rounded" onClick={() => handleStatusUpdate(p._id, p.channel, 'disabled')}>
                    Disable
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(p._id)}>
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
