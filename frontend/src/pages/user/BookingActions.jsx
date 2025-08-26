import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingActions = ({ bookingId }) => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('cancel');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (bookingId) fetchActions();
    // eslint-disable-next-line
  }, [bookingId]);

  const fetchActions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/bookingActions/booking/${bookingId}`);
      setActions(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load actions');
    }
    setLoading(false);
  };

  const handleAction = async (type) => {
    setFormType(type);
    setShowForm(true);
  };

  const submitAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/bookingActions', {
        booking_id: bookingId,
        action_type: formType,
        reason
      });
      setShowForm(false);
      setReason('');
      fetchActions();
    } catch (err) {
      setError('Action failed');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Booking Actions</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-2 mb-4">
        <button className="btn btn-red" onClick={() => handleAction('cancel')}>Cancel Booking</button>
        <button className="btn btn-blue" onClick={() => handleAction('reschedule')}>Reschedule Booking</button>
      </div>
      {showForm && (
        <form onSubmit={submitAction} className="mb-4">
          <label className="block mb-2">Reason:</label>
          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="input input-bordered w-full mb-2"
            required
          />
          <button type="submit" className="btn btn-green">Submit</button>
        </form>
      )}
      <h3 className="font-semibold mb-2">Action History</h3>
      <ul className="divide-y">
        {actions.map(action => (
          <li key={action._id} className="py-2">
            <span className="font-bold">{action.action_type}</span> - {action.status} <br />
            <span className="text-sm text-gray-500">{action.reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingActions;
