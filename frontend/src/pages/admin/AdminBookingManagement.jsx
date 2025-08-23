// AdminBookingManagement.jsx
// Admin booking management page (view/filter/approve/cancel, industry-level)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function AdminBookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({ status: '', user: '', dateFrom: '', dateTo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/adminBookings?${params}`);
      setBookings(res.data.bookings);
    } catch (err) {
      setError('Failed to fetch bookings');
    }
    setLoading(false);
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchBookings();
  };

  const handleAction = async (type, id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`/api/adminBookings/${type}/${id}`);
      setSuccess(`Booking ${type}d`);
      fetchBookings();
    } catch (err) {
      setError('Action failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Booking Management</h2>
      <form onSubmit={handleFilterSubmit} className="mb-6 flex gap-4 flex-wrap items-end">
        <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded">
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
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
              <th className="border px-2 py-1">Booking ID</th>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Bike</th>
              <th className="border px-2 py-1">PG</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td className="border px-2 py-1">{booking._id}</td>
                <td className="border px-2 py-1">{booking.user ? booking.user.name : '-'}</td>
                <td className="border px-2 py-1">{booking.bike ? booking.bike.name : '-'}</td>
                <td className="border px-2 py-1">{booking.pg ? booking.pg.name : '-'}</td>
                <td className="border px-2 py-1">{booking.status}</td>
                <td className="border px-2 py-1">{new Date(booking.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1">
                  <button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={() => handleAction('approve', booking._id)} disabled={booking.status === 'approved'}>
                    Approve
                  </button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleAction('cancel', booking._id)} disabled={booking.status === 'cancelled'}>
                    Cancel
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
