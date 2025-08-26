import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({ bookings: 0, totalSpent: 0, loyaltyEarned: 0 });

  useEffect(() => {
    // Fetch user analytics
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/user/analytics');
        setAnalytics(res.data);
      } catch (err) {
        setAnalytics({ bookings: 0, totalSpent: 0, loyaltyEarned: 0 });
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">My Analytics</h2>
      <div className="mb-4 text-lg font-semibold">Total Bookings: <span className="text-blue-600">{analytics.bookings}</span></div>
      <div className="mb-4 text-lg font-semibold">Total Spent: <span className="text-green-600">₹{analytics.totalSpent}</span></div>
      <div className="mb-4 text-lg font-semibold">Loyalty Points Earned: <span className="text-purple-600">{analytics.loyaltyEarned}</span></div>
    </div>
  );
};

export default Analytics;
