
import React, { useState } from 'react';
import axios from 'axios';

// ReviewForm component: Submit a review for PG/Bike
const ReviewForm = ({ itemType, itemId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Submit review to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!comment.trim()) {
      setError('Please enter a comment');
      setLoading(false);
      return;
    }
    try {
      await axios.post('/api/reviews', { item_type: itemType, item_id: itemId, rating, comment });
      setSuccess('Review submitted successfully!');
      setRating(5);
      setComment('');
    } catch (err) {
      setError('Error submitting review.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block font-semibold mb-1">Rating</label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full border rounded px-3 py-2">
          {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Comment</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full border rounded px-3 py-2" rows={4} />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50" disabled={loading}>Submit Review</button>
      {loading && <div className="mt-2 text-blue-600">Submitting...</div>}
      {error && <div className="mt-2 text-red-600 font-semibold">{error}</div>}
      {success && <div className="mt-2 text-green-600 font-semibold">{success}</div>}
    </form>
  );
};

export default ReviewForm;
