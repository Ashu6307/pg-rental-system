// AdminAdvancedNotificationChannels.jsx
// Industry-level admin advanced notification channels page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminAdvancedNotificationChannels() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ userId: '', title: '', message: '', channel: 'email', meta: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/advancedNotifications');
      setNotifications(res.data.notifications);
    } catch (err) {
      setError('Failed to fetch notifications');
    }
    setLoading(false);
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/advancedNotifications/send', form);
      setSuccess('Notification sent');
      fetchNotifications();
    } catch (err) {
      setError('Failed to send notification');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Advanced Notification Channels</h2>
      <form onSubmit={handleSend} className="mb-6 flex gap-4 flex-wrap items-end">
        <input type="text" name="userId" value={form.userId} onChange={handleFormChange} placeholder="User ID" className="p-2 border rounded" />
        <input type="text" name="title" value={form.title} onChange={handleFormChange} placeholder="Title" className="p-2 border rounded" />
        <input type="text" name="message" value={form.message} onChange={handleFormChange} placeholder="Message" className="p-2 border rounded" />
        <select name="channel" value={form.channel} onChange={handleFormChange} className="p-2 border rounded">
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Send</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Message</th>
              <th className="border px-2 py-1">Channel</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Created At</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(n => (
              <tr key={n._id}>
                <td className="border px-2 py-1">{n.user}</td>
                <td className="border px-2 py-1">{n.title}</td>
                <td className="border px-2 py-1">{n.message}</td>
                <td className="border px-2 py-1">{n.channel}</td>
                <td className="border px-2 py-1">{n.status}</td>
                <td className="border px-2 py-1">{new Date(n.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
