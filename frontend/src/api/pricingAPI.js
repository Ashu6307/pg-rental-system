import axios from 'axios';

export const getPricing = async (duration) => {
  const res = await axios.get(`/api/pricing?duration=${duration}`);
  return res.data.price;
};
