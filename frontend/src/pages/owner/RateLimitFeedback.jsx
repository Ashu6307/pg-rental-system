import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RateLimitFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ endpoint: '', feedback: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/rate-limit-feedbacks');
      setFeedbacks(res.data);
    } catch (err) {
      setError('Failed to fetch feedbacks');
    }
    setLoading(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/owner/rate-limit-feedbacks', form);
      setSuccess('Feedback submitted successfully');
      setForm({ endpoint: '', feedback: '' });
      fetchFeedbacks();
    } catch (err) {
      setError('Failed to submit feedback');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Rate Limiting Feedback</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="font-medium">API Endpoint</label>
          <input type="text" name="endpoint" value={form.endpoint} onChange={handleChange} className="ml-2 border rounded px-2 py-1 w-full" required />
        </div>
        <div>
          <label className="font-medium">Feedback</label>
          <textarea name="feedback" value={form.feedback} onChange={handleChange} className="ml-2 border rounded px-2 py-1 w-full" required />
        </div>
        <button type="submit" className="btn btn-primary mt-4">Submit Feedback</button>
      </form>
      <h3 className="text-lg font-semibold mb-2">Previous Feedbacks</h3>
      <table className="min-w-full bg-white rounded shadow mb-4">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Feedback</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(fb => (
            <tr key={fb._id}>
              <td>{fb.endpoint}</td>
              <td>{fb.feedback}</td>
              <td>{fb.status}</td>
              <td>{new Date(fb.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
