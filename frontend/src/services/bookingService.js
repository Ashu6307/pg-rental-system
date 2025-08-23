import apiService from './api';

const API_BASE = '/api/bookings';

export const getBookings = async () => {
  const res = await apiService.get(API_BASE);
  return res.data || res;
};

export const getBookingById = async (id) => {
  const res = await apiService.get(`${API_BASE}/${id}`);
  return res.data || res;
};

export const createBooking = async (data) => {
  const res = await apiService.post(API_BASE, data);
  return res.data || res;
};

export const updateBooking = async (id, data) => {
  const res = await apiService.put(`${API_BASE}/${id}`, data);
  return res.data || res;
};

export const deleteBooking = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};

export const searchBookings = async (filters) => {
  const res = await axios.post(`${API_BASE}/search`, filters);
  return res.data;
};
