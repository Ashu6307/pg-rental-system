// NotificationTest.jsx
// User notification test/send page (industry-level)
import React, { useState } from 'react';
import axios from 'axios';

const types = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push Notification' }
];

export default function NotificationTest() {
  const [type, setType] = useState('email');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!message) return setError('Message required');
    setLoading(true);
    setError('');
    setSuccess('');
    setResult(null);
    try {
      const res = await axios.post('/api/notificationTest/send', { type, message });
      setSuccess('Notification sent');
      setResult(res.data.result);
    } catch (err) {
      setError('Failed to send notification');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Test Notification (Push/Email/SMS)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="p-2 border rounded w-full">
            {types.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="p-2 border rounded w-full"
            rows={3}
            placeholder="Enter your test message..."
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Sending...' : 'Send Test Notification'}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        {result && <div className="text-gray-700 mt-2">Result: {JSON.stringify(result)}</div>}
      </form>
    </div>
  );
}
