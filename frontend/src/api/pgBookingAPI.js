import axios from 'axios';

export const bookPG = async (formData, token) => {
  try {
    const res = await axios.post('/api/pg-booking/book', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: 'Booking failed' };
  }
};

// Admin: Get all pending PG bookings
export const getPendingPGBookings = async (token) => {
  try {
    const res = await axios.get('/api/pg-booking/pending', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: 'Fetch failed' };
  }
};

// Admin: Approve PG booking
export const approvePGBooking = async (id, token) => {
  try {
    const res = await axios.post(`/api/pg-booking/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: 'Approval failed' };
  }
};

// Admin: Reject PG booking
export const rejectPGBooking = async (id, reason, token) => {
  try {
    const res = await axios.post(`/api/pg-booking/reject/${id}`, { reason }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: 'Rejection failed' };
  }
};
