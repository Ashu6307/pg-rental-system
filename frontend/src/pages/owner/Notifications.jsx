import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OwnerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/notifications');
      setNotifications(res.data);
    } catch (err) {
      setError('Error fetching notifications');
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    setLoading(true);
    try {
      await axios.put(`/api/owner/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      setError('Error marking as read');
    }
    setLoading(false);
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/owner/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      setError('Error deleting notification');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="bg-white shadow rounded p-4">
        {notifications.length === 0 && <li>No notifications found.</li>}
        {notifications.map(n => (
          <li key={n._id} className={`mb-3 p-3 border rounded ${n.status === 'sent' ? 'bg-gray-100' : 'bg-yellow-50'}`}>
            <div className="font-semibold">{n.message}</div>
            <div className="text-xs text-gray-500 mb-2">{n.type} | {n.channel} | {new Date(n.created_at).toLocaleString()}</div>
            <button className="btn btn-sm btn-primary mr-2" disabled={n.status === 'sent'} onClick={() => markAsRead(n._id)}>Mark as Read</button>
            <button className="btn btn-sm btn-danger" onClick={() => deleteNotification(n._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
