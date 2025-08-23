// AdminNotifications.jsx
// Industry-level admin notifications page
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [filters, setFilters] = useState({ type: '', channel: '', status: '', user: '', dateFrom: '', dateTo: '' });
  const [form, setForm] = useState({ userIds: [], title: '', message: '', channel: 'email', templateId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchNotifications();
    fetchTemplates();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/adminNotifications?${params}`);
      setNotifications(res.data.notifications);
    } catch (err) {
      setError('Failed to fetch notifications');
    }
    setLoading(false);
  };

  const fetchTemplates = async () => {
    try {
      const res = await axios.get('/api/adminNotifications/templates');
      setTemplates(res.data.templates);
    } catch (err) {
      setError('Failed to fetch templates');
    }
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    fetchNotifications();
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
      await axios.post('/api/adminNotifications/send', form);
      setSuccess('Notification sent');
      fetchNotifications();
    } catch (err) {
      setError('Failed to send notification');
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/adminNotifications/${id}`);
      setSuccess('Notification deleted');
      fetchNotifications();
    } catch (err) {
      setError('Failed to delete notification');
    }
    setLoading(false);
  };

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/adminNotifications/test', { channel: form.channel, templateId: form.templateId });
      setSuccess('Test notification sent');
    } catch (err) {
      setError('Failed to send test notification');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Notifications</h2>
      <form onSubmit={handleFilterSubmit} className="mb-6 flex gap-4 flex-wrap items-end">
        <input type="text" name="type" value={filters.type} onChange={handleFilterChange} placeholder="Type" className="p-2 border rounded" />
        <input type="text" name="channel" value={filters.channel} onChange={handleFilterChange} placeholder="Channel" className="p-2 border rounded" />
        <input type="text" name="status" value={filters.status} onChange={handleFilterChange} placeholder="Status" className="p-2 border rounded" />
        <input type="text" name="user" value={filters.user} onChange={handleFilterChange} placeholder="User ID" className="p-2 border rounded" />
        <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="p-2 border rounded" />
        <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full border mb-8">
          <thead>
            <tr>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Message</th>
              <th className="border px-2 py-1">Channel</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(n => (
              <tr key={n._id}>
                <td className="border px-2 py-1">{n.user ? n.user.name : '-'}</td>
                <td className="border px-2 py-1">{n.title}</td>
                <td className="border px-2 py-1">{n.message}</td>
                <td className="border px-2 py-1">{n.channel}</td>
                <td className="border px-2 py-1">{n.status}</td>
                <td className="border px-2 py-1">{new Date(n.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-1">
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(n._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <form onSubmit={handleSend} className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Send Notification</h3>
        <input type="text" name="userIds" value={form.userIds} onChange={handleFormChange} placeholder="User IDs (comma separated)" className="p-2 border rounded mr-2" />
        <input type="text" name="title" value={form.title} onChange={handleFormChange} placeholder="Title" className="p-2 border rounded mr-2" />
        <input type="text" name="message" value={form.message} onChange={handleFormChange} placeholder="Message" className="p-2 border rounded mr-2" />
        <select name="channel" value={form.channel} onChange={handleFormChange} className="p-2 border rounded mr-2">
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
        </select>
        <select name="templateId" value={form.templateId} onChange={handleFormChange} className="p-2 border rounded mr-2">
          <option value="">Select Template</option>
          {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Send</button>
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded ml-2" onClick={handleTest}>Test Notification</button>
      </form>
    </div>
  );
}
