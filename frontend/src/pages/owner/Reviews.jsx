import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OwnerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/owner/reviews');
      setReviews(res.data);
    } catch (err) {
      setError('Error fetching reviews');
    }
    setLoading(false);
  };

  const handleResponseChange = (id, value) => {
    setResponse(r => ({ ...r, [id]: value }));
  };

  const submitResponse = async (id) => {
    setLoading(true);
    try {
      await axios.put(`/api/owner/reviews/${id}/respond`, { response: response[id] });
      fetchReviews();
    } catch (err) {
      setError('Error submitting response');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reviews & Feedback</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="bg-white shadow rounded p-4">
        {reviews.length === 0 && <li>No reviews found.</li>}
        {reviews.map(r => (
          <li key={r._id} className="mb-4 p-3 border rounded">
            <div className="font-semibold">{r.item_type}: {r.rating}★</div>
            <div className="mb-2">{r.comment}</div>
            <div className="text-xs text-gray-500 mb-2">{new Date(r.created_at).toLocaleString()}</div>
            {r.owner_response ? (
              <div className="bg-green-50 p-2 rounded text-sm">Owner Response: {r.owner_response}</div>
            ) : (
              <div className="flex gap-2 items-center">
                <input type="text" className="input" placeholder="Respond..." value={response[r._id] || ''} onChange={e => handleResponseChange(r._id, e.target.value)} />
                <button className="btn btn-sm btn-primary" onClick={() => submitResponse(r._id)}>Submit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
