// AdminPayments.jsx
// Industry-level admin payment management page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ user: '', owner: '', pg: '', status: '', dateFrom: '', dateTo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/payments?${params}`);
      setPayments(res.data.payments);
    } catch (err) {
      setError('Failed to fetch payments');
    }
    setLoading(false);
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchPayments();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Payments</h2>
      <form onSubmit={handleFilterSubmit} className="mb-6 flex gap-4 flex-wrap items-end">
        <input type="text" name="user" value={filters.user} onChange={handleFilterChange} placeholder="User ID" className="p-2 border rounded" />
        <input type="text" name="owner" value={filters.owner} onChange={handleFilterChange} placeholder="Owner ID" className="p-2 border rounded" />
        <input type="text" name="pg" value={filters.pg} onChange={handleFilterChange} placeholder="PG ID" className="p-2 border rounded" />
        <input type="text" name="status" value={filters.status} onChange={handleFilterChange} placeholder="Status" className="p-2 border rounded" />
        <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="p-2 border rounded" />
        <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Owner</th>
              <th className="border px-2 py-1">PG</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Method</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Created At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td className="border px-2 py-1">{p.user ? p.user.name : '-'}</td>
                <td className="border px-2 py-1">{p.owner ? p.owner.name : '-'}</td>
                <td className="border px-2 py-1">{p.pg ? p.pg.name : '-'}</td>
                <td className="border px-2 py-1">₹{p.amount}</td>
                <td className="border px-2 py-1">{p.method}</td>
                <td className="border px-2 py-1">{p.status}</td>
                <td className="border px-2 py-1">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
