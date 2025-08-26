// AdminMultiTenancy.jsx
// Industry-level admin multi-tenancy management page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminMultiTenancy() {
  const [tenants, setTenants] = useState([]);
  const [filters, setFilters] = useState({ name: '', status: '', dateFrom: '', dateTo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/adminMultiTenancy?${params}`);
      setTenants(res.data.tenants);
    } catch (err) {
      setError('Failed to fetch tenants');
    }
    setLoading(false);
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchTenants();
  };

  const handleStatusUpdate = async (id, status) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.patch(`/api/adminMultiTenancy/${id}/status`, { status });
      setSuccess(`Tenant ${status}`);
      fetchTenants();
    } catch (err) {
      setError('Failed to update tenant status');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/adminMultiTenancy/${id}`);
      setSuccess('Tenant deleted');
      fetchTenants();
    } catch (err) {
      setError('Failed to delete tenant');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Multi-Tenancy Management</h2>
      <form onSubmit={handleFilterSubmit} className="mb-6 flex gap-4 flex-wrap items-end">
        <input type="text" name="name" value={filters.name} onChange={handleFilterChange} placeholder="Tenant Name" className="p-2 border rounded" />
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
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t._id}>
                <td className="border px-2 py-1">{t.name}</td>
                <td className="border px-2 py-1">{t.status}</td>
                <td className="border px-2 py-1">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={() => handleStatusUpdate(t._id, 'active')}>
                    Activate
                  </button>
                  <button className="bg-yellow-600 text-white px-2 py-1 rounded" onClick={() => handleStatusUpdate(t._id, 'inactive')}>
                    Deactivate
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(t._id)}>
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
