// UserAnalytics.jsx
// User advanced analytics dashboard
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserAnalytics() {
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
      const res = await axios.get('/api/analytics/user');
      setAnalytics(res.data.analytics);
    } catch (err) {
      setError('Failed to fetch analytics');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your Analytics</h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : analytics && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Total Bookings:</span>
            <span>{analytics.totalBookings}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Amount Spent:</span>
            <span>₹{analytics.totalSpent}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Average Rating Given:</span>
            <span>{analytics.avgRating}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Most Booked Bike:</span>
            <span>{analytics.mostBookedBike || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Most Booked PG:</span>
            <span>{analytics.mostBookedPG || '-'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
