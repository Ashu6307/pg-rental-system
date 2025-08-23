import React, { useEffect, useState } from 'react';
import axios from 'axios';

// LoyaltyPoints component: Shows user's loyalty points and rewards
export default function LoyaltyPoints() {
  const [loyalty, setLoyalty] = useState({ points: 0, rewards: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addPoints, setAddPoints] = useState(0);

  // Fetch loyalty info on mount
  useEffect(() => {
    fetchLoyalty();
  }, []);

  // Fetch loyalty points and rewards from API
  const fetchLoyalty = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.get('/api/user/loyalty');
      setLoyalty(res.data);
    } catch (err) {
      setError('Failed to fetch loyalty info');
    }
    setLoading(false);
  };

  // Add points to user's loyalty account
  const handleAddPoints = async e => {
    e.preventDefault();
    if (addPoints < 1) {
      setError('Please add at least 1 point');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/user/loyalty/add', { points: addPoints });
      setSuccess('Points added successfully');
      setAddPoints(0);
      fetchLoyalty();
    } catch (err) {
      setError('Failed to add points');
    }
    setLoading(false);
  };

  // Redeem a reward
  const handleRedeem = async rewardId => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/user/loyalty/redeem', { rewardId });
      setSuccess('Reward redeemed successfully');
      fetchLoyalty();
    } catch (err) {
      setError('Failed to redeem reward');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold mb-4 text-blue-700 text-center">Loyalty Points & Rewards</h2>
        {loading && (
          <div className="flex justify-center items-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        )}
        {error && <div className="bg-red-100 text-red-700 p-2 mb-2 rounded text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 mb-2 rounded text-center">{success}</div>}
        <div className="mb-4 text-center">
          <span className="font-bold text-indigo-700 text-xl">Points:</span> <span className="text-2xl font-bold text-blue-700">{loyalty.points}</span>
        </div>
        <form onSubmit={handleAddPoints} className="mb-6 flex gap-2 items-center justify-center">
          <input type="number" value={addPoints} onChange={e => setAddPoints(Number(e.target.value))} className="border rounded px-3 py-2 w-24" min={1} placeholder="Add Points" disabled={loading} />
          <button type="submit" className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow disabled:opacity-50`} disabled={loading || addPoints < 1}>Add Points</button>
        </form>
        <h3 className="text-lg font-semibold mb-2 text-blue-700 text-center">Rewards</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow mb-4">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Value</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loyalty.rewards.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">No rewards available</td>
                </tr>
              ) : loyalty.rewards.map(r => (
                <tr key={r._id} className="border-b">
                  <td className="py-2 px-4">{r.type}</td>
                  <td className="py-2 px-4">{r.value}</td>
                  <td className="py-2 px-4">{r.redeemed ? <span className="text-green-600 font-semibold">Redeemed</span> : <span className="text-blue-600 font-semibold">Available</span>}</td>
                  <td className="py-2 px-4">
                    {!r.redeemed && (
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow disabled:opacity-50" onClick={() => handleRedeem(r._id)} disabled={loading}>Redeem</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
