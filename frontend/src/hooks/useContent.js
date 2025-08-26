import { useState, useEffect } from 'react';
import axios from 'axios';

export const useContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/home')
      .then(res => {
        setContent(res.data); // direct object, not res.data.data
        setError(null);
      })
      .catch(err => {
        setError(err.message || 'Error fetching content');
      })
      .finally(() => setLoading(false));
  }, []);

  return { content, loading, error };
};
