import axios from 'axios';

export const getContent = async (type) => {
  const res = await axios.get(`/api/content/${type}`);
  return res.data;
};

export const updateContent = async (type, data) => {
  const res = await axios.put(`/api/content/${type}`, data);
  return res.data;
};
