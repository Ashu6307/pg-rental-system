// AdminRevenueAnalytics.jsx
// Admin revenue analytics page (industry-level)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminRevenueAnalytics() {
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
      const res = await axios.get('/api/adminRevenue/analytics');
      setAnalytics(res.data.analytics);
    } catch (err) {
      setError('Failed to fetch analytics');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Revenue Analytics</h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : analytics && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Total Revenue:</span>
            <span>₹{analytics.totalRevenue}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Monthly Breakdown</h3>
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Month</th>
                  <th className="border px-2 py-1">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.monthly).map(([month, revenue]) => (
                  <tr key={month}>
                    <td className="border px-2 py-1">{month}</td>
                    <td className="border px-2 py-1">₹{revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
