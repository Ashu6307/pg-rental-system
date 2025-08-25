import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

export const getBikes = async () => {
  const res = await axios.get(`${API_BASE}/api/bikes`);
  return res.data;
};

export const getPublicBikes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_BASE}/api/bikes/public?${queryString}`);
  return res.data;
};

export const getRandomBikes = async () => {
  const res = await axios.get(`${API_BASE}/api/bikes/random`);
  return res.data;
};

export const getBikeDetails = async (id) => {
  const res = await axios.get(`${API_BASE}/api/bikes/public/${id}`);
  return res.data;
};

export const searchBikes = async (searchParams) => {
  const res = await axios.post(`${API_BASE}/api/bikes/search`, searchParams);
  return res.data;
};
