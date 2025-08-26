import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const NotificationPrefs = () => {
  const token = useSelector(state => state.auth.token);
  const [prefs, setPrefs] = useState({ email: true, sms: false, push: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/notification-prefs/notification-prefs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrefs(res.data);
    } catch (err) {
      setError('Failed to load preferences');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setPrefs({ ...prefs, [e.target.name]: e.target.checked });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post('/api/notification-prefs/notification-prefs', prefs, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Preferences updated!');
    } catch (err) {
      setError('Failed to update preferences');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <form className="space-y-4">
        <label className="flex items-center">
          <input type="checkbox" name="email" checked={prefs.email} onChange={handleChange} className="mr-2" />
          Email Notifications
        </label>
        <label className="flex items-center">
          <input type="checkbox" name="sms" checked={prefs.sms} onChange={handleChange} className="mr-2" />
          SMS Notifications
        </label>
        <label className="flex items-center">
          <input type="checkbox" name="push" checked={prefs.push} onChange={handleChange} className="mr-2" />
          Push Notifications
        </label>
        <button type="button" className="bg-blue-900 text-white px-4 py-2 rounded" onClick={handleSave}>Save Preferences</button>
      </form>
    </div>
  );
};

export default NotificationPrefs;
