import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OwnerFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/favorites');
      setFavorites(res.data);
    } catch (err) {
      setError('Error fetching favorites');
    }
    setLoading(false);
  };

  const toggleFavorite = async (item_type, item_id) => {
    setLoading(true);
    try {
      await axios.post('/api/owner/favorites/toggle', { item_type, item_id });
      fetchFavorites();
    } catch (err) {
      setError('Error toggling favorite');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Favorites</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="bg-white shadow rounded p-4">
        {favorites.length === 0 && <li>No favorites found.</li>}
        {favorites.map(f => (
          <li key={f._id} className="mb-4 p-3 border rounded flex justify-between items-center">
            <div>
              <span className="font-semibold">{f.item_type}</span> - <span>{f.item_id}</span>
            </div>
            <button className="btn btn-sm btn-danger" onClick={() => toggleFavorite(f.item_type, f.item_id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
