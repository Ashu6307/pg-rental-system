
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Favorites component: Shows user's favorite PGs/Bikes
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch favorites from backend
  useEffect(() => {
    setLoading(true);
    setError('');
    axios.post('/api/favorites/search', {
      filters: {},
      sort: { _id: -1 },
      limit: 20
    })
      .then(res => setFavorites(res.data.favorites || []))
      .catch(() => setError('Failed to fetch favorites'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-700 text-center">My Favorites</h2>
        {loading && <div className="text-blue-600">Loading favorites...</div>}
        {error && <div className="bg-red-100 text-red-700 p-2 mb-2 rounded text-center">{error}</div>}
        <ul className="list-disc pl-6">
          {favorites.length === 0 && !loading ? (
            <li className="text-gray-500">No favorites found.</li>
          ) : favorites.map((f, idx) => (
            <li key={idx} className="mb-2">
              <span className="font-semibold">{f.item_type}:</span> {f.item_id} {f.type && `(${f.type})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Favorites;
