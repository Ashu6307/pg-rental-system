// AdminRateLimiting.jsx
// Industry-level admin rate limiting logs page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminRateLimiting() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ user: '', endpoint: '', status: '', dateFrom: '', dateTo: '' });
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
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/adminRateLimiting?${params}`);
      setLogs(res.data.logs);
    } catch (err) {
      setError('Failed to fetch logs');
    }
    setLoading(false);
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchLogs();
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/adminRateLimiting/${id}`);
      setSuccess('Log deleted');
      fetchLogs();
    } catch (err) {
      setError('Failed to delete log');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Rate Limiting Logs</h2>
      <form onSubmit={handleFilterSubmit} className="mb-6 flex gap-4 flex-wrap items-end">
        <input type="text" name="user" value={filters.user} onChange={handleFilterChange} placeholder="User ID" className="p-2 border rounded" />
        <input type="text" name="endpoint" value={filters.endpoint} onChange={handleFilterChange} placeholder="Endpoint" className="p-2 border rounded" />
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
              <th className="border px-2 py-1">Endpoint</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Details</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td className="border px-2 py-1">{log.user ? log.user.name : '-'}</td>
                <td className="border px-2 py-1">{log.endpoint}</td>
                <td className="border px-2 py-1">{log.status}</td>
                <td className="border px-2 py-1">{JSON.stringify(log.details)}</td>
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
    </div>
  );
}
