import axios from 'axios';

export const getBikes = async () => {
  const res = await axios.get('/api/bike');
  return res.data;
};
