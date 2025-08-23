
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// ReviewsList component: Shows all reviews for PG/Bike
const ReviewsList = ({ itemType, itemId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch reviews from backend
  useEffect(() => {
    setLoading(true);
    setError('');
    axios.post('/api/reviews/search', {
      filters: { item_type: itemType, item_id: itemId },
      sort: { created_at: -1 },
      limit: 20
    })
      .then(res => setReviews(res.data.reviews || []))
      .catch(() => setError('Failed to fetch reviews'))
      .finally(() => setLoading(false));
  }, [itemType, itemId]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Reviews</h3>
      {loading && <div className="text-blue-600">Loading reviews...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {reviews.length === 0 && !loading ? (
        <div className="text-gray-500">No reviews yet.</div>
      ) : (
        <ul className="space-y-4">
          {reviews.map(r => (
            <li key={r._id} className="border rounded p-4">
              <div className="font-semibold">{r.user?.name || 'User'} - {r.rating}⭐</div>
              <div className="text-gray-700 mt-2">{r.comment}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsList;
