// AdminApprovalWorkflows.jsx
// Industry-level admin approval workflows page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminApprovalWorkflows() {
  const [workflows, setWorkflows] = useState([]);
  const [filters, setFilters] = useState({ type: '', status: '', user: '', dateFrom: '', dateTo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/adminApprovalWorkflows?${params}`);
      setWorkflows(res.data.workflows);
    } catch (err) {
      setError('Failed to fetch workflows');
    }
    setLoading(false);
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchWorkflows();
  };

  const handleStatusUpdate = async (id, status) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.patch(`/api/adminApprovalWorkflows/${id}/status`, { status });
      setSuccess(`Workflow ${status}`);
      fetchWorkflows();
    } catch (err) {
      setError('Failed to update workflow status');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/adminApprovalWorkflows/${id}`);
      setSuccess('Workflow deleted');
      fetchWorkflows();
    } catch (err) {
      setError('Failed to delete workflow');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Approval Workflows</h2>
      <form onSubmit={handleFilterSubmit} className="mb-6 flex gap-4 flex-wrap items-end">
        <input type="text" name="type" value={filters.type} onChange={handleFilterChange} placeholder="Type" className="p-2 border rounded" />
        <input type="text" name="status" value={filters.status} onChange={handleFilterChange} placeholder="Status" className="p-2 border rounded" />
        <input type="text" name="user" value={filters.user} onChange={handleFilterChange} placeholder="User ID" className="p-2 border rounded" />
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
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Details</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map(w => (
              <tr key={w._id}>
                <td className="border px-2 py-1">{w.type}</td>
                <td className="border px-2 py-1">{w.status}</td>
                <td className="border px-2 py-1">{w.user ? w.user.name : '-'}</td>
                <td className="border px-2 py-1">{JSON.stringify(w.details)}</td>
                <td className="border px-2 py-1">{new Date(w.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={() => handleStatusUpdate(w._id, 'approved')}>
                    Approve
                  </button>
                  <button className="bg-yellow-600 text-white px-2 py-1 rounded" onClick={() => handleStatusUpdate(w._id, 'rejected')}>
                    Reject
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(w._id)}>
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
