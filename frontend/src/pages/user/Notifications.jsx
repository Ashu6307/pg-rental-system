import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.js';

const Notifications = () => {
  const { role } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('/api/notifications/list'),
      axios.get('/api/notifications/logs'),
    ])
      .then(([n, l]) => {
        setNotifications(n.data.notifications);
        setLogs(l.data.logs);
        setSuccess('Notifications loaded successfully!');
      })
      .catch(() => setError('Failed to load notifications.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/notifications/send', { message, channel });
      setMessage('');
      setSuccess('Notification sent!');
      const res = await axios.get('/api/notifications/list');
      setNotifications(res.data.notifications);
    } catch {
      setError('Failed to send notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{role === 'admin' ? 'Admin' : role === 'owner' ? 'Owner' : 'User'} Notifications</h1>
      {loading && <div className="text-center my-4"><span className="loader"></span> Loading...</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Notifications</h2>
        {notifications.length === 0 ? <div className="mb-4">No new notifications.</div> : notifications.map((n, i) => (
          <div key={i} className="mb-2">{n.message} ({n.channel})</div>
        ))}
      </section>
      {role !== 'user' && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Send Notification</h2>
          <form onSubmit={handleSend} className="max-w-lg">
            <input className="input mb-2 w-full" placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
            <select className="input mb-2 w-full" value={channel} onChange={e => setChannel(e.target.value)}>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push</option>
            </select>
            <button className="btn w-full" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
          </form>
        </section>
      )}
      <section>
        <h2 className="text-xl font-semibold mb-2">Notification Logs</h2>
        {logs.length === 0 ? <div className="mb-4">No logs available.</div> : logs.map((log, i) => (
          <div key={i} className="mb-2">{log}</div>
        ))}
      </section>
    </div>
  );
};

export default Notifications;
