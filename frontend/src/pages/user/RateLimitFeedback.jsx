// RateLimitFeedback.jsx
// User rate limiting feedback page (industry-level)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RateLimitFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [endpoint, setEndpoint] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/rateLimitFeedback/my');
      setFeedbacks(res.data.feedbacks);
    } catch (err) {
      setError('Failed to fetch feedbacks');
    }
    setLoading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!endpoint || !feedback) return setError('All fields required');
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/rateLimitFeedback/add', { endpoint, feedback });
      setSuccess('Feedback submitted');
      setEndpoint('');
      setFeedback('');
      fetchFeedbacks();
    } catch (err) {
      setError('Failed to submit feedback');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/rateLimitFeedback/${id}`);
      setSuccess('Feedback deleted');
      fetchFeedbacks();
    } catch (err) {
      setError('Failed to delete feedback');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Rate Limiting Feedback</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="API Endpoint (e.g. /api/bookings)"
          value={endpoint}
          onChange={e => setEndpoint(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <textarea
          placeholder="Your feedback..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </form>
      <h3 className="text-lg font-semibold mb-2">Your Feedbacks</h3>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Endpoint</th>
              <th className="border px-2 py-1">Feedback</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(fb => (
              <tr key={fb._id}>
                <td className="border px-2 py-1">{fb.endpoint}</td>
                <td className="border px-2 py-1">{fb.feedback}</td>
                <td className="border px-2 py-1">{new Date(fb.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1">
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(fb._id)}>
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
