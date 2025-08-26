import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState({ email: true, sms: false, push: true, frequency: 'instant', channels: ['email', 'push'] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/notification-preferences');
      if (res.data) setPrefs(res.data);
    } catch (err) {
      setError('Failed to fetch preferences');
    }
    setLoading(false);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setPrefs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleChannelChange = channel => {
    setPrefs(prev => {
      const channels = prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel];
      return { ...prev, channels };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put('/api/owner/notification-preferences', prefs);
      setSuccess('Preferences updated successfully');
    } catch (err) {
      setError('Failed to update preferences');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium">Email Notifications</label>
          <input type="checkbox" name="email" checked={prefs.email} onChange={handleChange} className="ml-2" />
        </div>
        <div>
          <label className="font-medium">SMS Notifications</label>
          <input type="checkbox" name="sms" checked={prefs.sms} onChange={handleChange} className="ml-2" />
        </div>
        <div>
          <label className="font-medium">Push Notifications</label>
          <input type="checkbox" name="push" checked={prefs.push} onChange={handleChange} className="ml-2" />
        </div>
        <div>
          <label className="font-medium">Frequency</label>
          <select name="frequency" value={prefs.frequency} onChange={handleChange} className="ml-2 border rounded px-2 py-1">
            <option value="instant">Instant</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div>
          <label className="font-medium">Channels</label>
          <div className="flex gap-4 mt-2">
            {['email', 'sms', 'push'].map(channel => (
              <label key={channel} className="flex items-center">
                <input
                  type="checkbox"
                  checked={prefs.channels.includes(channel)}
                  onChange={() => handleChannelChange(channel)}
                  className="mr-2"
                />
                {channel.toUpperCase()}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-4">Save Preferences</button>
      </form>
    </div>
  );
}
