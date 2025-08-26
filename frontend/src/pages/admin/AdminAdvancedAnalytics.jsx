// AdminAdvancedAnalytics.jsx
// Industry-level admin advanced analytics dashboard
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminAdvancedAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/adminAnalytics');
      setAnalytics(res.data);
    } catch (err) {
      setError('Failed to fetch analytics');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Advanced Analytics Dashboard</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? <div>Loading...</div> : analytics && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Total Bookings</h3>
            <div className="text-2xl">{analytics.totalBookings}</div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Total Revenue</h3>
            <div className="text-2xl">₹{analytics.totalRevenue}</div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">User Growth (Monthly)</h3>
            <ul>
              {analytics.userGrowth.map((g, i) => (
                <li key={i}>Month {g._id}: {g.count}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Owner Stats</h3>
            <div className="text-2xl">{analytics.ownerStats}</div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">PG Stats</h3>
            <div className="text-2xl">{analytics.pgStats}</div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Bike Stats</h3>
            <div className="text-2xl">{analytics.bikeStats}</div>
          </div>
        </div>
      )}
    </div>
  );
}
