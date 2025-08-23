// AdminReviews.jsx
// Industry-level admin reviews/feedback page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({ status: '', user: '', dateFrom: '', dateTo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/adminReviews?${params}`);
      setReviews(res.data.reviews);
    } catch (err) {
      setError('Failed to fetch reviews');
    }
    setLoading(false);
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchReviews();
  };

  const handleStatusUpdate = async (id, status) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.patch(`/api/adminReviews/${id}/status`, { status });
      setSuccess(`Review ${status}`);
      fetchReviews();
    } catch (err) {
      setError('Failed to update review status');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/adminReviews/${id}`);
      setSuccess('Review deleted');
      fetchReviews();
    } catch (err) {
      setError('Failed to delete review');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Reviews & Feedback</h2>
      <form onSubmit={handleFilterSubmit} className="mb-6 flex gap-4 flex-wrap items-end">
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
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Rating</th>
              <th className="border px-2 py-1">Comment</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r._id}>
                <td className="border px-2 py-1">{r.user ? r.user.name : '-'}</td>
                <td className="border px-2 py-1">{r.rating}</td>
                <td className="border px-2 py-1">{r.comment}</td>
                <td className="border px-2 py-1">{r.status}</td>
                <td className="border px-2 py-1">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={() => handleStatusUpdate(r._id, 'approved')}>
                    Approve
                  </button>
                  <button className="bg-yellow-600 text-white px-2 py-1 rounded" onClick={() => handleStatusUpdate(r._id, 'rejected')}>
                    Reject
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(r._id)}>
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
