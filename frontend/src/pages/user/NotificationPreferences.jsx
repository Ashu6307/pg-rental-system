// NotificationPreferences.jsx
// User notification preferences page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState({ email: true, sms: false, push: false, marketing: false, system: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/notificationPreferences/my');
      if (res.data.preferences) setPrefs(res.data.preferences);
    } catch (err) {
      setError('Failed to fetch preferences');
    }
    setLoading(false);
  };

  const handleChange = e => {
    setPrefs({ ...prefs, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/notificationPreferences/update', prefs);
      setSuccess('Preferences updated');
    } catch (err) {
      setError('Failed to update preferences');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" name="email" checked={prefs.email} onChange={handleChange} />
          <label>Email Notifications</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="sms" checked={prefs.sms} onChange={handleChange} />
          <label>SMS Notifications</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="push" checked={prefs.push} onChange={handleChange} />
          <label>Push Notifications</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="marketing" checked={prefs.marketing} onChange={handleChange} />
          <label>Marketing Notifications</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="system" checked={prefs.system} onChange={handleChange} />
          <label>System Notifications</label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </form>
    </div>
  );
}
