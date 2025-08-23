import { useState, useEffect } from 'react';
import axios from 'axios';

const useOffices = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/offices')
      .then(res => {
        setOffices(res.data.data || []);
        setError(null);
      })
      .catch(err => {
        setError(err.message || 'Error fetching offices');
      })
      .finally(() => setLoading(false));
  }, []);

  return { offices, loading, error };
};

export default useOffices;
