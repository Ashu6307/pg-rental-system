import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STATUS_OPTIONS = ['confirmed', 'cancelled', 'completed'];

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/bookings');
      setBookings(res.data);
    } catch (err) {
      setError('Error fetching bookings');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(`/api/owner/bookings/${id}`, { status });
      fetchBookings();
    } catch (err) {
      setError('Error updating booking status');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Owner Booking Management</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Item ID</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.user_id?.name || b.user_id?.email}</td>
              <td>{b.item_type}</td>
              <td>{b.item_id}</td>
              <td>{new Date(b.from_date).toLocaleDateString()}</td>
              <td>{new Date(b.to_date).toLocaleDateString()}</td>
              <td>{b.amount}</td>
              <td>{b.status}</td>
              <td>
                <select value={b.status} onChange={e => handleStatusChange(b._id, e.target.value)} className="input">
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
